import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

type Hex = `#${string}`

type Tint = {
  // Dark mode: the color washed over the selected row at 15%.
  dark: Hex
  // Light mode: the page, card and panel colors, darkest first.
  light: readonly [Hex, Hex, Hex]
}

// How the app paints the selected sidebar row:
// - Dark mode: a 15% wash of `gray-0` over the sidebar. Body text reads
//   `gray-50`, so tinting `gray-0` colors the row and leaves text alone.
// - Light mode: a 10% wash of `gray-900`, which is also the body text color.
//   Tinting it would color the text. So light mode tints the surfaces
//   instead: the row is a black wash over a tinted page and takes the page's
//   hue, and text stays black.
//
// Every pair was checked with `checkColors` and has no line that stops the
// desktop app from painting it. To add a color, add it here and to
// `userConfig` in plugin.json (six-digit hex).
const TINTS: Record<string, Tint> = {
  cyan: { dark: '#7df9ff', light: ['#d4f1f5', '#e0f5f8', '#f0fafb'] },
  teal: { dark: '#5ef2d6', light: ['#d4f5ee', '#e0f8f3', '#f0fbf9'] },
  mint: { dark: '#8dffb0', light: ['#d4f5df', '#e0f8e8', '#f0fbf4'] },
  lime: { dark: '#c8ff5e', light: ['#eaf5d4', '#f0f8e0', '#f8fbf0'] },
  yellow: { dark: '#ffd866', light: ['#f5eed4', '#f8f3e0', '#fbf9f0'] },
  pink: { dark: '#ff4da6', light: ['#f6d3e2', '#f9e0eb', '#fdf0f5'] },
  lavender: { dark: '#d9c2ff', light: ['#e1d4f5', '#eae0f8', '#f5f0fb'] },
  sky: { dark: '#9ad4ff', light: ['#d4e7f5', '#e0eef8', '#f0f7fb'] },
}

const DEFAULT_COLOR = 'cyan'
const DEFAULT_TINT: Tint = { dark: '#7df9ff', light: ['#d4f1f5', '#e0f5f8', '#f0fafb'] }

// The app's own light-mode value, used only if the generator returns no light
// half. A theme that names one mode locks the app to that mode, so the light
// half is always given.
const STOCK_LIGHT = { 'gray-900': '#0b0b0b' } as const

const lookFor = (tint: Tint): ThemeSetArgs => {
  const [page, card, panel] = tint.light
  const { theme } = makeColors({
    label: 'Selection tint',
    id: 'selection-tint',
    light: {
      gray: {
        anchors: {
          'surface-0': page,
          'surface-1': card,
          'surface-2': panel,
          'text-primary': '#0b0b0b',
          'text-secondary': '#2f2f2f',
          'text-muted': '#474747',
        },
      },
    },
  })

  return {
    colors: {
      ...theme,
      inputs: { dark: { 'gray-0': tint.dark }, light: theme.inputs.light ?? STOCK_LIGHT },
    },
  }
}

export const register: Register = (on, options) => {
  const chosen = typeof options.color === 'string' ? options.color : DEFAULT_COLOR
  const look = lookFor(TINTS[chosen] ?? DEFAULT_TINT)

  on('session.start', async ($, e, next) => {
    const set = await $.theme.set(look)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })
}
