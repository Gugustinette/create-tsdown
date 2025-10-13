import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import process from 'node:process'
import { downloadTemplate } from 'giget'
import { logger } from './utils/logger'
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

  await updatePackageName(options.name)
}

async function updatePackageName(targetDir: string): Promise<void> {
  const resolvedDir = resolve(process.cwd(), targetDir)
  const packageJsonPath = resolve(resolvedDir, 'package.json')
  if (!existsSync(packageJsonPath)) {
    return
  }

  const pkgRaw = await readFile(packageJsonPath, 'utf8')
  let pkg: Record<string, any>
  try {
    pkg = JSON.parse(pkgRaw)
  } catch (error) {
    logger.warn('Failed to parse package.json to update name.', error)
    return
  }

  const packageName = basename(resolvedDir)
  if (pkg.name === packageName) return

  pkg.name = packageName
  const output = `${JSON.stringify(pkg, null, 2)}\n`
  await writeFile(packageJsonPath, output, 'utf8')
}
