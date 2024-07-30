export class ErrorHandle extends Error {
  public readonly code: number

  public constructor(message: string, code: number = 500) {
    super(message)
    this.code = code
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
