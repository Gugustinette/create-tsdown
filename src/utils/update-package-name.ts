import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import process from 'node:process'
import { logger } from './logger'

/**
 * Update the package name in the package.json file to match the target directory name.
 * @param targetDir The target directory where the package.json file is located.
 * @returns {Promise<void>}
 */
export async function updatePackageName(targetDir: string): Promise<void> {
  // Resolve path to the target directory
  const resolvedDir = resolve(process.cwd(), targetDir)
  // Resolve path to package.json
  const packageJsonPath = resolve(resolvedDir, 'package.json')
  // Verify if package.json exists
  if (!existsSync(packageJsonPath)) {
    return
  }

  // Read and parse package.json
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

  // Update the name field
  pkg.name = packageName
  // Write back to package.json
  const output = `${JSON.stringify(pkg, null, 2)}\n`
  await writeFile(packageJsonPath, output, 'utf8')
}
