import type { Overwrite } from '../utils/types'

/**
 * Options for tsdown.
 */
export interface Options {
  /** @default false */
  silent?: boolean
}

export type ResolvedOptions = Overwrite<
  Options,
  {
    /** @default false */
    silent: boolean
  }
>
