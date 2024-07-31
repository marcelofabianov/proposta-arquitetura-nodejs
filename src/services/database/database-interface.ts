import {
  CoreDatabaseInterface,
  CoreQueryParams,
} from '@/modules/_core/infrastructure/database'

export interface DatabaseInterface extends CoreDatabaseInterface {}

export type QueryParams = CoreQueryParams
