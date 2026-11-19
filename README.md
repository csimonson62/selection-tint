# selection-tint

A Claude Code mod for the Claude desktop app. In dark mode, it tints the selected session row in the sidebar cyan, so you can see which session is open.

## What it changes

The app has no separate color for the selected row. The row uses a translucent wash of one base gray. This mod changes that gray to cyan (`#7df9ff`) in dark mode. As a result:

- The selected sidebar row gets a cyan tint.
- Hover fills and borders get a fainter cyan tint.
- Solid neutral buttons turn cyan.
- Body text keeps its color.
- Light mode is not changed.

The terminal and editor extensions do not draw themes, so the mod has no effect there.

## Install

At the prompt of a terminal session:

```
/plugin install selection-tint --marketplace csimonson62/selection-tint
```

Answer `y` to add the marketplace, then choose a scope.

From a shell:

```
claude plugin install selection-tint --marketplace csimonson62/selection-tint
```

In the desktop app: click **+** next to the prompt box, then **Plugins**. Add the marketplace `csimonson62/selection-tint`, then add the plugin.

## Change the color

Edit `TINT` in `hooks/register.ts`. Use a six-digit hex value. Bright colors keep borders visible. Dark or heavily saturated colors make borders and toggle knobs hard to see.
