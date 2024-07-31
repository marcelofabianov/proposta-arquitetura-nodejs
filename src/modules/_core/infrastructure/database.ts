import { QueryResultRow } from 'pg'

export type QueryParams = string | number | boolean | null

export interface DatabaseInterface {
  query<T extends QueryResultRow>(
    text: string,
    params?: QueryParams[],
  ): Promise<T[]>
}
