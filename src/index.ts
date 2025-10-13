import { downloadTemplate } from 'giget'
import { logger } from './utils/logger'
import { updatePackageName } from './utils/update-package-name'
import type { ResolvedOptions } from './options'

/**
 * Create a tsdown project.
 */
export async function create(options: ResolvedOptions): Promise<void> {
  if (typeof options.silent === 'boolean') {
    logger.setSilent(options.silent)
  }

  // Clone the template from the repository
  await downloadTemplate(
    `gh:gugustinette/create-tsdown/templates/${options.template}`,
    {
      dir: options.name,
    },
  )

  // Update the package name in package.json
  await updatePackageName(options.name)
}
