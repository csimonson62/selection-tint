import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

type Hex = `#${string}`

type Tint = {
  // Light mode: page, card and panel colors, darkest first.
  light: readonly [Hex, Hex, Hex]
  // Dark mode: page, card, panel and menu colors, darkest first.
  dark: readonly [Hex, Hex, Hex, Hex]
  // Dark mode text: primary, secondary, muted. A slight cast of the hue.
  darkText: readonly [Hex, Hex, Hex]
}

// How the app paints the selected sidebar row: a translucent wash of one
// gray over the sidebar (10% black in light mode, 15% near-white in dark
// mode). That gray is also the body text color, so tinting it colors the
// text. This mod tints the surfaces behind the wash instead. The row keeps
// the app's own wash, takes its hue from the page, and text stays neutral.
//
// Every set was checked with `checkColors` and has no line that stops the
// desktop app from painting it. Greenish colors run less saturated in dark
// mode, because green "success" text must stay readable on them. To add a
// color, add it here and to `userConfig` in plugin.json (six-digit hex).
const TINTS: Record<string, Tint> = {
  cyan: {
    light: ['#d4f1f5', '#e0f5f8', '#f0fafb'],
    dark: ['#142b2e', '#183438', '#1c3d42', '#1f4449'],
    darkText: ['#edf6f7', '#cedcde', '#b0c2c4'],
  },
  teal: {
    light: ['#d4f5ee', '#e0f8f3', '#f0fbf9'],
    dark: ['#152824', '#19312c', '#1e3a34', '#21403a'],
    darkText: ['#edf7f5', '#cededb', '#b0c4c0'],
  },
  mint: {
    light: ['#d4f5df', '#e0f8e8', '#f0fbf4'],
    dark: ['#142e1d', '#183823', '#1c4229', '#1f492d'],
    darkText: ['#edf7f1', '#ceded3', '#b0c4b7'],
  },
  lime: {
    light: ['#eaf5d4', '#f0f8e0', '#f8fbf0'],
    dark: ['#222815', '#293119', '#313a1e', '#364021'],
    darkText: ['#f4f7ed', '#d9dece', '#bec4b0'],
  },
  yellow: {
    light: ['#f5eed4', '#f8f3e0', '#fbf9f0'],
    dark: ['#2e2714', '#383018', '#42381c', '#493e1f'],
    darkText: ['#f7f5ed', '#dedace', '#c4bfb0'],
  },
  pink: {
    light: ['#f6d3e2', '#f9e0eb', '#fdf0f5'],
    dark: ['#330f27', '#3c142e', '#451936', '#4b1d3b'],
    darkText: ['#f7eef2', '#dfd0d8', '#c4b0ba'],
  },
  lavender: {
    light: ['#e1d4f5', '#eae0f8', '#f5f0fb'],
    dark: ['#1e0f33', '#24123e', '#2b1549', '#2f1751'],
    darkText: ['#f1edf7', '#d5cede', '#b8b0c4'],
  },
  sky: {
    light: ['#d4e7f5', '#e0eef8', '#f0f7fb'],
    dark: ['#0f2433', '#122c3e', '#153349', '#173951'],
    darkText: ['#edf3f7', '#ced8de', '#b0bcc4'],
  },
}

const DEFAULT_COLOR = 'cyan'

const lookFor = (tint: Tint): ThemeSetArgs => {
  const { theme } = makeColors({
    label: 'Selection tint',
    id: 'selection-tint',
    light: {
      gray: {
        anchors: {
          'surface-0': tint.light[0],
          'surface-1': tint.light[1],
          'surface-2': tint.light[2],
          'text-primary': '#0b0b0b',
          'text-secondary': '#2f2f2f',
          'text-muted': '#474747',
        },
      },
    },
    dark: {
      gray: {
        anchors: {
          'surface-0': tint.dark[0],
          'surface-1': tint.dark[1],
          'surface-2': tint.dark[2],
          'surface-3': tint.dark[3],
          'text-primary': tint.darkText[0],
          'text-secondary': tint.darkText[1],
          'text-muted': tint.darkText[2],
        },
      },
    },
  })

  // Both halves are given, so the app's light/dark switch keeps working.
  return { colors: theme }
}

export const register: Register = (on, options) => {
  const chosen = typeof options.color === 'string' ? options.color : DEFAULT_COLOR
  const tint = TINTS[chosen] ?? TINTS[DEFAULT_COLOR]

  if (tint === undefined) {
    return
  }

  const look = lookFor(tint)

  on('session.start', async ($, e, next) => {
    const set = await $.theme.set(look)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })
}
