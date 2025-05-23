import { logger } from './utils/logger'
import type { ResolvedOptions } from './options'

/**
 * Create a tsdown project.
 */
export function create(options: ResolvedOptions): void {
  if (typeof options.silent === 'boolean') {
    logger.setSilent(options.silent)
  }

  logger.info(options)
}
