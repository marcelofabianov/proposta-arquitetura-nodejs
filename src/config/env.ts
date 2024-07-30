import { z } from 'zod'
import { ErrorHandle } from '@/modules/_core/error-handle'

const envSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.string().transform(Number),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_MODE: z.string(),
  DB_TIMEOUT: z.string().transform(Number),
  DB_IDLE_TIMEOUT: z.string().transform(Number),
  DB_MAX_CONNECTIONS: z.string().transform(Number),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  throw new ErrorHandle(
    'Environment variables are not set correctly: ' + _env.error.format(),
  )
}

export const env = _env.data
