import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

interface ChatMessage {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

export interface ChatResponse {
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
    let conversation = conversationId
      ? await this.prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { messages: { orderBy: { createdAt: 'asc' } } },
        })
      : null;

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          userId,
          title: null,
        },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
    }

    // 2. Retrieve RAG context based on user's protocols and the question
    const ragContext = await this.retrieveContext(userId, message);

    // 3. Build conversation history with RAG context
    const history: ChatMessage[] = conversation.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // 4. Get AI response
    const aiResponse = await this.aiService.chat(userId, message, [
      {
        role: 'system',
        content: this.buildSystemPrompt(ragContext),
      },
      ...history,
    ]);

    // 5. Persist messages in database
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

  private async retrieveContext(
    userId: string,
    _message: string,
  ): Promise<string> {
    // Retrieve user's active protocols for context
    const activeProtocols = await this.prisma.userProtocol.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        peptides: {
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
      const compounds = p.peptides
        .map((c) => `${c.peptide.name} (${c.dose}${c.unit}, ${c.frequency})`)
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
