import process from 'node:process'
import { dim } from 'ansis'
import { cac } from 'cac'
import debug from 'debug'
import { VERSION as rolldownVersion } from 'rolldown'
import { version } from '../package.json'
import { resolveComma, toArray } from './utils/general'
import { logger } from './utils/logger'
import type { Options } from './options'

const cli = cac('tsdown')
cli.help().version(version)

cli
  .command('[...files]', 'Create a tsdown project', {
    ignoreOptionDefaultValue: true,
    allowUnknownOptions: true,
  })
  .option(
    '-t, --template <template>',
    'Available templates: default, vue, react',
    {
      default: 'default',
    },
  )
  .option('--debug [feat]', 'Show debug logs')
  .option('--silent', 'Suppress non-error logs')
  .action(async (input: string[], flags: Options) => {
    logger.setSilent(!!flags.silent)
    logger.info(
      `create-tsdown ${dim`v${version}`} powered by rolldown ${dim`v${rolldownVersion}`}`,
    )
    const { create } = await import('./index')
    await create(flags)
  })

cli
  .command('migrate', 'Migrate from tsup to tsdown')
  .option('-c, --cwd <dir>', 'Working directory')
  .option('-d, --dry-run', 'Dry run')
  .action(async (args) => {
    const { migrate } = await import('./migrate')
    await migrate(args)
  })

export async function runCLI(): Promise<void> {
  cli.parse(process.argv, { run: false })

  if (cli.options.debug) {
    let namespace: string
    if (cli.options.debug === true) {
      namespace = 'tsdown:*'
    } else {
      // support debugging multiple flags with comma-separated list
      namespace = resolveComma(toArray(cli.options.debug))
        .map((v) => `tsdown:${v}`)
        .join(',')
    }

    const enabled = debug.disable()
    if (enabled) namespace += `,${enabled}`

    debug.enable(namespace)
    debug('tsdown:debug')('Debugging enabled', namespace)
  }

  try {
    await cli.runMatchedCommand()
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}
