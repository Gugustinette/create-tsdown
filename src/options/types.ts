import type { Overwrite } from '../utils/types'

/**
 * Options for tsdown.
 */
export interface Options {
  /**
   * The name of the package.
   * @default 'my-package'
   */
  name?: string
  /**
   * The template to use.
   * @default 'default'
   */
  template?: 'default' | 'minimal' | 'vue' | 'react'
  /** @default false */
  silent?: boolean
  /** @default false */
  debug?: boolean
}

export type ResolvedOptions = Overwrite<
  Options,
  {
    /**
     * The name of the package.
     * @default 'my-package'
     */
    name: string
    /**
     * The template to use.
     * @default 'default'
     */
    template: 'default' | 'minimal' | 'vue' | 'react'
    /** @default false */
    silent: boolean
    /** @default false */
    debug: boolean
  }
>
