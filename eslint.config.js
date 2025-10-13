import { sxzz } from '@sxzz/eslint-config'

export default sxzz(
  {
    pnpm: true,
  },
  {
    ignores: ['templates/**', '.github/**'],
  },
  {
    rules: {
      'pnpm/json-enforce-catalog': 'off',
    },
  },
)
