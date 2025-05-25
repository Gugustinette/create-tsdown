import process from 'node:process'
import { intro, outro } from '@clack/prompts'
import { dim } from 'ansis'
import { cac } from 'cac'
import debug from 'debug'
import { VERSION as rolldownVersion } from 'rolldown'
import { version } from '../package.json'
import { resolveOptions, type Options } from './options'
import { resolveComma, toArray } from './utils/general'
import { logger } from './utils/logger'

const cli = cac('create-tsdown')
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
  .option('--debug', 'Show debug logs')
  .option('--silent', 'Suppress non-error logs')
  .action(async (input: string[], options: Options) => {
    // Start clack prompts
    intro(`tsdown - The Elegant Library Bundler`)

    logger.setSilent(!!options.silent)

    // Resolve the user options
    const resolvedOptions = await resolveOptions(options)

    // Create the project
    const { create } = await import('./index')
    if (input.length > 0) options.name = input[0]
    await create(resolvedOptions)

    // End clack prompts
    outro(`Done! Now run:
      cd ${resolvedOptions.name}
      pnpm install
      pnpm run dev
    `)
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
