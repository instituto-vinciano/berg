# BERG Interactive Map — Guia rápido

Para manutenção detalhada, leia `DOCUMENTACAO-TECNICA.md`.

## Regra de ouro

- Preserve `reference-v4/` intacta.
- SVG inline.
- Zoom por `viewBox`.
- Dados por latitude/longitude.
- Clusters calculados automaticamente.
- Não converter o mapa para PNG/JPEG.
- Não usar `transform: scale()` como mecanismo principal de zoom.

## Onde mexer

- Dados demonstrativos: `map/data.js`
- Motor: `reference-v4/assets/atlas-map.js`
- Aparência: `reference-v4/assets/style.css`
- Estrutura/cartografia inline: `reference-v4/index.html`

## Teste de regressão

Depois de qualquer mudança: zoom forte em Flórida/Cuba, pan, clusters, marcador,
painel, Home, celular e funcionamento offline.
