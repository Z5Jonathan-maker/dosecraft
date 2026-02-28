import { registerAs } from '@nestjs/config';

export interface EnvConfig {
  readonly port: number;
  readonly databaseUrl: string;
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;
  readonly stripeSecretKey: string;
  readonly stripeWebhookSecret: string;
  readonly groqApiKey: string;
  readonly anthropicApiKey: string;
  readonly corsOrigin: string;
  readonly nodeEnv: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const envConfig = registerAs(
  'env',
  (): EnvConfig => ({
    port: parseInt(optionalEnv('PORT', '4000'), 10),
    databaseUrl: requireEnv('DATABASE_URL'),
    jwtSecret: requireEnv('JWT_SECRET'),
    jwtExpiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
    stripeSecretKey: optionalEnv('STRIPE_SECRET_KEY', ''),
    stripeWebhookSecret: optionalEnv('STRIPE_WEBHOOK_SECRET', ''),
    groqApiKey: optionalEnv('GROQ_API_KEY', ''),
    anthropicApiKey: optionalEnv('ANTHROPIC_API_KEY', ''),
    corsOrigin: optionalEnv('CORS_ORIGIN', 'http://localhost:3000'),
    nodeEnv: optionalEnv('NODE_ENV', 'development'),
  }),
);
