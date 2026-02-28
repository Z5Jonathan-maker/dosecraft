import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

interface ChatMessage {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

interface ChatResponse {
  readonly reply: string;
  readonly citations: readonly string[];
  readonly conversationId: string;
}

@Injectable()
export class CoachChatService {
  private readonly logger = new Logger(CoachChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async processMessage(
    userId: string,
    message: string,
    conversationId?: string,
  ): Promise<ChatResponse> {
    // 1. Load or create conversation
    const conversation = conversationId
      ? await this.loadConversation(userId, conversationId)
      : await this.createConversation(userId);

    // 2. Retrieve RAG context based on user's protocols and the question
    const ragContext = await this.retrieveContext(userId, message);

    // 3. Build conversation history with RAG context
    const history: ChatMessage[] = [
      ...conversation.messages,
      { role: 'user', content: message },
    ];

    // 4. Get AI response
    const aiResponse = await this.aiService.chat(userId, message, [
      {
        role: 'system',
        content: this.buildSystemPrompt(ragContext),
      },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ]);

    // 5. Persist messages
    await this.prisma.chatMessage.createMany({
      data: [
        {
          conversationId: conversation.id,
          role: 'user',
          content: message,
        },
        {
          conversationId: conversation.id,
          role: 'assistant',
          content: aiResponse.message,
        },
      ],
    });

    this.logger.debug(
      `Chat processed for user ${userId}, conversation ${conversation.id}`,
    );

    return {
      reply: aiResponse.message,
      citations: aiResponse.citations,
      conversationId: conversation.id,
    };
  }

  private async loadConversation(
    userId: string,
    conversationId: string,
  ): Promise<{ id: string; messages: ChatMessage[] }> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20, // sliding window: last 20 messages
        },
      },
    });

    if (!conversation) {
      return this.createConversation(userId);
    }

    return {
      id: conversation.id,
      messages: conversation.messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    };
  }

  private async createConversation(
    userId: string,
  ): Promise<{ id: string; messages: ChatMessage[] }> {
    const conversation = await this.prisma.conversation.create({
      data: { userId },
    });

    return { id: conversation.id, messages: [] };
  }

  private async retrieveContext(
    userId: string,
    message: string,
  ): Promise<string> {
    // Retrieve user's active protocols for context
    const activeProtocols = await this.prisma.userProtocol.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        compounds: {
          include: {
            peptide: { select: { name: true, description: true } },
          },
        },
      },
      take: 5,
    });

    if (activeProtocols.length === 0) {
      return 'User has no active protocols.';
    }

    const protocolSummaries = activeProtocols.map((p) => {
      const compounds = p.compounds
        .map((c) => `${c.peptide.name} (${c.doseMcg}mcg, ${c.frequency})`)
        .join(', ');
      return `Protocol "${p.name}": ${compounds}`;
    });

    return `User's active protocols:\n${protocolSummaries.join('\n')}`;
  }

  private buildSystemPrompt(ragContext: string): string {
    return [
      'You are DoseCraft Coach, an AI assistant specializing in peptide protocol optimization.',
      'You provide evidence-based guidance while always disclaiming that your responses are informational and not medical advice.',
      'Users should consult with their healthcare provider before starting any peptide protocol.',
      '',
      'Context about this user:',
      ragContext,
      '',
      'Guidelines:',
      '- Be precise about dosing, timing, and frequency',
      '- Cite research when available',
      '- Flag potential interactions or contraindications',
      '- Encourage bloodwork monitoring',
      '- Never diagnose or prescribe — inform and educate',
    ].join('\n');
  }
}
