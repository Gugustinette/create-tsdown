import { cancel, isCancel, select, text } from '@clack/prompts'
import Debug from 'debug'
import type { Options, ResolvedOptions } from './types'

export * from './types'

const debug = Debug('create-tsdown:options')

/**
 * Resolve the user options and configs
 * @param options The user options
 * @returns The resolved options
 */
export async function resolveOptions(
  options: Options,
): Promise<ResolvedOptions> {
  debug('options %O', options)

  // Resolve the name of the package
  let resolvedName: string | symbol
  if (options.name !== undefined) {
    resolvedName = options.name
  } else {
    resolvedName = (await text({
      message: 'What is the name of your package?',
      placeholder: './my-package',
      initialValue: './my-package',
    })) as string
  }
  // Handle cancel
  if (isCancel(resolvedName)) {
    cancel('Operation cancelled.')
    // eslint-disable-next-line node/prefer-global/process
    process.exit(0)
  }

  // Resolve the template
  let resolvedTemplate: ResolvedOptions['template']
  if (options.template !== undefined) {
    resolvedTemplate = options.template
    if (!['default', 'minimal', 'vue', 'react'].includes(resolvedTemplate)) {
      throw new Error(
        `Invalid template "${resolvedTemplate}". Available templates: default, vue, react`,
      )
    }
  } else {
    resolvedTemplate = (await select({
      message: 'Which template do you want to use?',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'minimal', label: 'Minimal' },
        { value: 'vue', label: 'Vue' },
        { value: 'react', label: 'React' },
      ],
      initialValue: 'default',
    })) as ResolvedOptions['template']
  }
  // Handle cancel
  if (isCancel(resolvedTemplate)) {
    cancel('Operation cancelled.')
    // eslint-disable-next-line node/prefer-global/process
    process.exit(0)
  }

  const resolvedOptions: ResolvedOptions = {
    name: resolvedName,
    template: resolvedTemplate,
    silent: !!options.silent,
    debug: !!options.debug,
  }
  debug('resolved configs %O', resolvedOptions)
  return resolvedOptions
}
