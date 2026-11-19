import type { Register, ThemeSetArgs } from 'claude-code'

// Dark mode only. `gray-0` is the gray behind every translucent neutral fill:
// the selected sidebar row (15%), hover (7.5%), borders (10%). Body text reads
// `gray-50`, so it keeps the app's own color. Light mode stays the app's.
//
// Each tint was checked against the design system's contrast rules. The first
// five keep borders at the app's own strength; pink, lavender and sky draw
// borders slightly fainter. To add a color, add it here and to `userConfig`
// in plugin.json (six-digit hex; bright colors keep borders visible).
const TINTS: Record<string, `#${string}`> = {
  cyan: '#7df9ff',
  teal: '#5ef2d6',
  mint: '#8dffb0',
  lime: '#c8ff5e',
  yellow: '#ffd866',
  pink: '#ffb3d9',
  lavender: '#d9c2ff',
  sky: '#9ad4ff',
}

const DEFAULT_TINT: `#${string}` = '#7df9ff'

export const register: Register = (on, options) => {
  const chosen = typeof options.color === 'string' ? options.color : 'cyan'
  const tint = TINTS[chosen] ?? DEFAULT_TINT

  const look: ThemeSetArgs = {
    colors: {
      v: 1,
      id: 'selection-tint',
      label: 'Selection tint',
      inputs: { dark: { 'gray-0': tint } },
    },
  }

  on('session.start', async ($, e, next) => {
    const set = await $.theme.set(look)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })
}
