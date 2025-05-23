import { resolveOptions, type Options } from './options'
import { logger } from './utils/logger'

/**
 * Create a tsdown project.
 */
export async function create(userOptions: Options = {}): Promise<void> {
  if (typeof userOptions.silent === 'boolean') {
    logger.setSilent(userOptions.silent)
  }

  const options = await resolveOptions(userOptions)
  logger.info(options)
}
