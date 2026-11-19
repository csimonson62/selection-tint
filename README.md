# selection-tint

A Claude Code mod for the Claude desktop app. It replaces the gray selected-session row in the sidebar with a color, so you can see which session is open. Choose from eight colors. It works in light mode and dark mode, and looks best in light mode.

**This is a whole-app theme, not only a row highlight.** The app has no separate color for the selected row, so the mod changes the colors the row is made from. Read "What it changes" before you install.

## What it changes

### Light mode

The app paints the selected row as a 10% black wash over the sidebar. The mod tints the surfaces behind it.

- The page, cards, and panels turn a pale version of your color, across the whole app.
- The selected sidebar row becomes a deeper shade of the same color.
- Text and solid buttons stay black.

### Dark mode

The app paints the selected row as a 15% wash of one light gray. The mod changes that gray to your color.

- The selected sidebar row gets a dark, muted tint of your color.
- Hover fills and borders get a fainter tint.
- Solid neutral buttons take the full color.
- Backgrounds and body text keep the app's own colors.

The row tint in dark mode is subtle. The app fixes its strength at 15%, and a mod cannot raise it.

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

| Name | Dark mode tint | Light mode page | Dark mode borders |
| --- | --- | --- | --- |
| `cyan` (default) | `#7df9ff` | `#d4f1f5` | Same strength as the app's |
| `teal` | `#5ef2d6` | `#d4f5ee` | Same strength as the app's |
| `mint` | `#8dffb0` | `#d4f5df` | Same strength as the app's |
| `lime` | `#c8ff5e` | `#eaf5d4` | Same strength as the app's |
| `yellow` | `#ffd866` | `#f5eed4` | Same strength as the app's |
| `pink` | `#ff4da6` | `#f6d3e2` | Fainter |
| `lavender` | `#d9c2ff` | `#e1d4f5` | Slightly fainter |
| `sky` | `#9ad4ff` | `#d4e7f5` | Slightly fainter |

`pink` uses a saturated tint in dark mode, so its row shows the most color there. The cost is fainter borders and a toggle knob that is harder to see.

## Known limits

- In light mode, the warning fill and the git status colors have lower contrast on the tinted page than on the app's stock page. They still paint.
- In dark mode, the selected row cannot be made brighter than the app's stock gray row. Any color is darker than white at the same 15% strength.

## Change the color

Open the config menu (`/config` in a terminal session) and set **Tint color**. The mod reloads with the new color.

To add a color of your own, add it to `TINTS` in `hooks/register.ts` and to the `options` list in `.claude-plugin/plugin.json`. Use six-digit hex values. For light mode, give three pale shades, darkest first. For dark mode, bright colors keep borders visible.

`hooks/make-colors.js` and `hooks/make-colors.d.ts` are generated from the app's design system. Do not edit them.

## License

MIT
