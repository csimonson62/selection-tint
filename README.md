# selection-tint

A Claude Code mod for the Claude desktop app. It tints the app in one of eight colors, in light mode and dark mode, so the selected session row in the sidebar takes that color instead of plain gray.

**This is a whole-app theme, not only a row highlight.** The app has no separate color for the selected row, so the mod tints the backgrounds the row sits on. Read "What it changes" before you install.

## What it changes

The app paints the selected row as a translucent wash over the sidebar: 10% black in light mode, 15% near-white in dark mode. That wash color is also the body text color, so tinting it would color the text. Instead, the mod tints the backgrounds behind the wash. The row keeps the app's own wash and takes its hue from the background.

### Light mode

- The page, cards, and panels turn a pale version of your color.
- The selected sidebar row is a deeper shade of the same color.
- Text and solid buttons stay black.

### Dark mode

- The page, cards, panels, and menus turn a deep version of your color.
- The selected sidebar row is a lighter shade of the same color.
- Text is near-white with a slight cast of the color. Solid buttons stay near-white.
- Borders and toggle switches keep the app's own strength.

Greenish colors (`cyan`, `teal`, `mint`, `lime`, `yellow`) run less saturated in dark mode, so green "success" text stays readable on them.

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

See all eight in light and dark mode: [Selection Tint Swatches](https://claude.ai/artifact/PSfHxuYbyrJr1vQVC75jUn).

| Name | Light mode page | Dark mode page |
| --- | --- | --- |
| `cyan` (default) | `#d4f1f5` | `#142b2e` |
| `teal` | `#d4f5ee` | `#152824` |
| `mint` | `#d4f5df` | `#142e1d` |
| `lime` | `#eaf5d4` | `#222815` |
| `yellow` | `#f5eed4` | `#2e2714` |
| `pink` | `#f6d3e2` | `#330f27` |
| `lavender` | `#e1d4f5` | `#1e0f33` |
| `sky` | `#d4e7f5` | `#0f2433` |

Each color passes the desktop app's own contrast check, so the app paints it.

## Known limits

- Some small status colors (the warning fill, git status labels, green "success" text) have lower contrast on tinted backgrounds than on the app's stock ones. They still paint.
- The selected row's strength is fixed by the app: 10% in light mode, 15% in dark mode. A mod can change the color behind it, not the strength.

## Change the color

Open the config menu (`/config` in a terminal session) and set **Tint color**. The mod reloads with the new color.

To add a color of your own, add an entry to `TINTS` in `hooks/register.ts` and its name to the `options` list in `.claude-plugin/plugin.json`. Each entry needs three pale light-mode shades, four deep dark-mode shades, and three dark-mode text colors, all six-digit hex, darkest shade first. Check it with `checkColors` from `hooks/make-colors.js`: a line that starts `Desktop won't paint this theme` means the app ignores the whole theme.

`hooks/make-colors.js` and `hooks/make-colors.d.ts` are generated from the app's design system. Do not edit them.

## License

MIT
