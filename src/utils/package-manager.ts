import process from 'node:process'

const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun', 'deno'] as const

export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

export function detectPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent?.toLowerCase()
  if (!userAgent) return 'npm'

  const [name] = userAgent.split(' ')
  const manager = name?.split('/')[0]

  return PACKAGE_MANAGERS.includes(manager as PackageManager)
    ? (manager as PackageManager)
    : 'npm'
}

export function getPackageManagerCommands(): {
  install: string
  build: string
} {
  const packageManager = detectPackageManager()

  switch (packageManager) {
    case 'pnpm':
      return {
        install: 'pnpm i',
        build: 'pnpm build',
      }
    case 'yarn':
      return {
        install: 'yarn',
        build: 'yarn build',
      }
    case 'bun':
      return {
        install: 'bun install',
        build: 'bun run build',
      }
    case 'deno':
      return {
        install: 'deno install',
        build: 'deno task build',
      }
    default: // npm
      return {
        install: 'npm i',
        build: 'npm run build',
      }
  }
}
