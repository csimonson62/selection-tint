import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

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

const COLORS = Object.keys(TINTS)
const MODES = ['system', 'light', 'dark'] as const
type Mode = (typeof MODES)[number]

const DEFAULT_COLOR = 'cyan'
const DEFAULT_MODE: Mode = 'system'

const PLUGIN = 'selection-tint'
const PANE = 'selection-tint'
const COMMAND = 'tint'

const isMode = (value: unknown): value is Mode =>
  typeof value === 'string' && (MODES as readonly string[]).includes(value)

const isColor = (value: unknown): value is string =>
  typeof value === 'string' && COLORS.includes(value)

const lookFor = (color: string, mode: Mode): ThemeSetArgs => {
  const tint = TINTS[color] ?? TINTS[DEFAULT_COLOR]

  if (tint === undefined) {
    return {}
  }

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

  // Both halves are always given, so "system" keeps following the app's own
  // light/dark switch. "light" or "dark" pins the app to that mode.
  return mode === 'system' ? { colors: theme } : { colors: theme, overrideColorScheme: mode }
}

const label = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)

async function applyTheme($: EngineInterface, color: string, mode: Mode): Promise<void> {
  const set = await $.theme.set(lookFor(color, mode))

  if (!set.isDrawn) {
    $.ui.status(set.reason)
  }
}

// A pick is saved to the plugin's settings (the values /config shows). Where
// the app refuses that write, it is kept in the plugin's own store instead,
// and the store then wins over the settings at the next session start.
async function savePick($: EngineInterface, field: 'color' | 'mode', value: string): Promise<void> {
  const written = await $.config.set({ key: `${PLUGIN}.${field}`, value })

  if ('deny' in written && written.deny !== undefined) {
    await $.store.set(field, value)
  } else {
    await $.store.delete(field)
  }
}

export const register: Register = (on, options) => {
  let color = isColor(options.color) ? options.color : DEFAULT_COLOR
  let mode: Mode = isMode(options.mode) ? options.mode : DEFAULT_MODE

  on('session.start', async ($, e, next) => {
    const storedColor = await $.store.get('color')
    const storedMode = await $.store.get('mode')

    if (isColor(storedColor)) {
      color = storedColor
    }

    if (isMode(storedMode)) {
      mode = storedMode
    }

    await $.command.register({
      name: COMMAND,
      description: 'Pick the selection-tint color and light or dark mode',
      immediate: true,
    })
    await applyTheme($, color, mode)

    return next(e)
  })

  on('command.run', { command: COMMAND }, async $ => {
    const opened = await $.ui.open({ id: PANE, title: 'Selection tint', focus: true, closeOnEscape: true, rows: 8 })

    return { text: opened.isPlaced ? 'Selection tint panel opened.' : `The panel could not open: ${opened.reason}` }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, ($, e) => {
    const { Box, Select, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="column" gap={1}>
        <Select
          key="color"
          label="Color"
          autoFocus
          value={color}
          options={COLORS.map(value => ({ value, label: label(value) }))}
          onSelect={value => {
            if (!isColor(value)) {
              return
            }
            color = value
            void applyTheme($, color, mode).then(() => savePick($, 'color', value))
          }}
        />
        <Select
          key="mode"
          label="Mode"
          value={mode}
          options={MODES.map(value => ({ value, label: value === 'system' ? 'System (follow the app)' : label(value) }))}
          onSelect={value => {
            if (!isMode(value)) {
              return
            }
            mode = value
            void applyTheme($, color, mode).then(() => savePick($, 'mode', value))
          }}
        />
        <Text dimColor>Changes apply at once and are kept for new sessions. Esc closes this panel.</Text>
      </Box>
    )
  })
}
