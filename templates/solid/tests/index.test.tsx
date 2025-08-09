import { render, screen } from '@solidjs/testing-library'
import { expect, test } from 'vitest'
import { MyButton } from '../src'

test('button', () => {
  render(() => <MyButton type="primary" />)

  // biome-ignore lint/performance/useTopLevelRegex: <explanation>
  const buttonElement = screen.getByText(/my button: type primary/i)

  expect(buttonElement.outerHTML).toMatchInlineSnapshot(
    `"<button class="my-button">my button: type primary</button>"`,
  )
})
