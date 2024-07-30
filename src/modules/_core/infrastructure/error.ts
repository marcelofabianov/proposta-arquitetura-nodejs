import { ErrorHandle } from '@/modules/_core/error-handle'

export class DatabaseQueryError extends ErrorHandle {
  public constructor(message: string) {
    super(message, 500)
  }
}

export class DatabaseConnectionError extends ErrorHandle {
  public constructor(message: string) {
    super(message, 500)
  }
}

export class DatabaseError extends ErrorHandle {
  public constructor(message: string) {
    super(message, 500)
  }
}
