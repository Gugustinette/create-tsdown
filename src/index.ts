import { downloadTemplate } from 'giget'
import { logger } from './utils/logger'
import type { ResolvedOptions } from './options'

/**
 * Create a tsdown project.
 */
export function create(options: ResolvedOptions): void {
  if (typeof options.silent === 'boolean') {
    logger.setSilent(options.silent)
  }

  // Clone the template from the repository
  downloadTemplate(
    `gh:gugustinette/create-tsdown/templates/${options.template}`,
    {
      dir: options.name,
    },
  )

  logger.success('Project created successfully!')
}
