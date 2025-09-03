import process from 'node:process'
import {
  cancel,
  confirm,
  intro,
  isCancel,
  outro,
  spinner,
} from '@clack/prompts'
import { green, underline } from 'ansis'
import { cac } from 'cac'
import debug from 'debug'
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
  .option('-n, --name <name>', 'Name of the package to create', {
    default: './my-package',
  })
  .option(
    '-t, --template <template>',
    'Available templates: default, vue, react, solid',
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

    const s = spinner()
    s.start('Cloning the template...')
    // Create the project
    const { create } = await import('./index')
    if (input.length > 0) options.name = input[0]
    await create(resolvedOptions)
    s.stop('Template cloned')

    // End clack prompts
    outro(
      `Done! Now run:\n` +
        `  ${green`cd ${resolvedOptions.name}`}\n` +
        `  ${green`npm install`}\n` +
        `  ${green`npm run build`}\n\n` +
        `For more information, visit: ${underline`https://tsdown.dev/`}`,
    )
  })

cli
  .command('migrate', 'Migrate from tsup to tsdown')
  .option('-c, --cwd <dir>', 'Working directory')
  .option('-d, --dry-run', 'Dry run')
  .action(async (args) => {
    // Start clack prompts
    intro(`Starting migration from tsup to tsdown`)

    // Prompt for comfirmation
    const shouldContinue = await confirm({
      message:
        `Before proceeding, review the migration guide at ${underline`https://tsdown.dev/guide/migrate-from-tsup`}, as this process will modify your files.\n` +
        `Uncommitted changes will be lost. Use the ${green`--dry-run`} flag to preview changes without applying them.`,
    })
    if (isCancel(shouldContinue)) {
      cancel('Migration cancelled.')
      process.exit(0)
    }
    if (!shouldContinue) {
      outro('Migration cancelled.')
      process.exit(0)
    }

    const s = spinner()
    s.start('Migrating from tsup to tsdown...')
    // Migrate the project
    const { migrate } = await import('./migrate')
    await migrate({
      cwd: args.cwd,
      dryRun: !!args.dryRun,
    })
    s.stop()

    // End clack prompts
    outro(`Migration completed!`)
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
