import process from 'node:process'

const PACKAGE_MANAGERS = ['pnpm', 'yarn', 'npm'] as const

export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

let cachedPackageManager: PackageManager | null = null
let cachedCommands: { install: string; build: string } | null = null

export function detectPackageManager(): PackageManager {
  if (cachedPackageManager) {
    return cachedPackageManager
  }

  const userAgent = process.env.npm_config_user_agent?.toLowerCase()
  if (!userAgent) {
    cachedPackageManager = 'npm'
    return cachedPackageManager
  }

  const [name] = userAgent.split(' ')
  const manager = name?.split('/')[0]

  if (PACKAGE_MANAGERS.includes(manager as PackageManager)) {
    cachedPackageManager = manager as PackageManager
  } else {
    cachedPackageManager = 'npm'
  }

  return cachedPackageManager
}

export function getPackageManagerCommands(): {
  install: string
  build: string
} {
  if (cachedCommands) {
    return cachedCommands
  }

  const packageManager = detectPackageManager()

  switch (packageManager) {
    case 'pnpm':
      cachedCommands = {
        install: 'pnpm i',
        build: 'pnpm build',
      }
      break
    case 'yarn':
      cachedCommands = {
        install: 'yarn',
        build: 'yarn build',
      }
      break
    case 'npm':
    default:
      cachedCommands = {
        install: 'npm i',
        build: 'npm run build',
      }
      break
  }

  return cachedCommands
}

export function getInstallCommand(): string {
  return getPackageManagerCommands().install
}

export function getBuildCommand(): string {
  return getPackageManagerCommands().build
}
