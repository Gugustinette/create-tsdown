import Debug from 'debug'
import type { Options, ResolvedOptions } from './types'

export * from './types'

const debug = Debug('create-tsdown:options')

/**
 * Resolve the user options and configs
 * @param options The user options
 * @returns The resolved options
 */
export function resolveOptions(options: Options): ResolvedOptions {
  debug('options %O', options)
  const resolvedOptions: ResolvedOptions = {
    silent: !!options.silent,
  }
  debug('resolved configs %O', resolvedOptions)
  return resolvedOptions
}
