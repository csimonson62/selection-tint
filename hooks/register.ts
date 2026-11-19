import type { Register, ThemeSetArgs } from 'claude-code'

// Dark mode only. `gray-0` is the gray behind every translucent neutral fill:
// the selected sidebar row (15%), hover (7.5%), borders (10%). Body text reads
// `gray-50`, so it keeps the app's own color. Light mode stays the app's.
// To change the tint, change TINT (six-digit hex; bright colors keep borders visible).
const TINT = '#7df9ff'

const LOOK: ThemeSetArgs = {
  colors: {
    v: 1,
    id: 'selection-tint',
    label: 'Selection tint',
    inputs: { dark: { 'gray-0': TINT } },
  },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })
}
