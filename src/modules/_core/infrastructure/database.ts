export interface CoreQueryResultRow {
  [column: string]: any
}

export type CoreQueryParams = string | number | boolean | null

export interface CoreDatabaseInterface {
  connect(): Promise<void>
  disconnect(): Promise<void>
  query<T extends CoreQueryResultRow>(
    text: string,
    params?: CoreQueryParams[],
  ): Promise<T[]>
}
