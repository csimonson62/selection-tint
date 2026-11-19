# selection-tint

A Claude Code mod for the Claude desktop app. In dark mode, it tints the selected session row in the sidebar, so you can see which session is open. Choose from eight colors.

## What it changes

The app has no separate color for the selected row. The row uses a translucent wash of one base gray. This mod changes that gray to the color you choose, in dark mode. As a result:

- The selected sidebar row gets the tint.
- Hover fills and borders get a fainter tint.
- Solid neutral buttons take the color.
- Body text keeps its color.
- Light mode is not changed.

The terminal and editor extensions do not draw themes, so the mod has no effect there.

## Install

At the prompt of a terminal session:

```
/plugin install selection-tint --marketplace csimonson62/selection-tint
```

Answer `y` to add the marketplace, choose a scope, then choose a tint color.

From a shell:

```
claude plugin install selection-tint --marketplace csimonson62/selection-tint
```

In the desktop app: click **+** next to the prompt box, then **Plugins**. Add the marketplace `csimonson62/selection-tint`, then add the plugin.

## Colors

| Name | Hex | Borders |
| --- | --- | --- |
| `cyan` (default) | `#7df9ff` | Same strength as the app's |
| `teal` | `#5ef2d6` | Same strength as the app's |
| `mint` | `#8dffb0` | Same strength as the app's |
| `lime` | `#c8ff5e` | Same strength as the app's |
| `yellow` | `#ffd866` | Same strength as the app's |
| `pink` | `#ffb3d9` | Slightly fainter |
| `lavender` | `#d9c2ff` | Slightly fainter |
| `sky` | `#9ad4ff` | Slightly fainter |

## Change the color

Open the config menu (`/config` in a terminal session) and set **Tint color**. The mod reloads with the new color.

To add a color of your own, add it to `TINTS` in `hooks/register.ts` and to the `options` list in `.claude-plugin/plugin.json`. Use a six-digit hex value. Bright colors keep borders visible. Dark or heavily saturated colors make borders and toggle knobs hard to see.

## License

MIT
