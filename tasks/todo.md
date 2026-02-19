# Phase 1: MUI Ecosystem + Zid Brand Theme

## Steps

- [x] Install packages (@mui/material, @mui/lab, @mui/icons-material, @emotion/react, @emotion/cache, @emotion/styled, @zidsa/zidmui, stylis, stylis-plugin-rtl, notistack)
- [x] Read hermes theme files for reference
- [x] Create Emotion cache files (create-cache.ts, style-context.tsx, client-cache.tsx)
- [x] Create MUI theme files (palette.ts, palette-dark.ts, shadows.ts, index.ts, types.d.ts)
- [x] Font setup (copy font files, create fonts.css)
- [x] Update \_\_root.tsx with MUI providers (ClientCacheProvider, ThemeProvider, CssBaseline)
- [x] Update index.tsx with MUI components for verification
- [x] Verify dev server starts and page renders with Zid brand theme

## Review

All steps completed successfully. Dev server starts, SSR renders correctly with:

- IBM Plex Sans Arabic font family applied
- Zid primary purple (#AE72FF) on contained button
- CssBaseline global styles (background #F8F8F8, text #0E0217)
- RTL direction set on html element
- Emotion cache with RTL support via stylis-plugin-rtl
- @zidsa/zidmui typography and component overrides applied (pill-shaped buttons, custom sizing)
