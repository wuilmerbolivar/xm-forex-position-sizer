# XM Forex Position Sizer

Calculadora web pública para traders que operan con XM y necesitan convertir un escenario de mercado en un ticket de riesgo ejecutable. La app estima lote sugerido, stop loss, take profit, coste de spread, drawdown probable, expectativa y ritmo necesario para llegar a una meta de capital.

Sitio publicado: [xmsizer.vercel.app](https://xmsizer.vercel.app/)

## Vista actual

![Vista principal desktop](./public/preview-desktop.png)

![Vista principal móvil](./public/preview-mobile.png)

## Qué es esta herramienta

- Es una herramienta de acceso libre, sin backend y sin registro obligatorio.
- Usa `XM Forex Position Sizer` como marca unificada en interfaz, metadatos, Open Graph y despliegue.
- Está orientada a cuentas XM `micro` y `standard`.
- Trabaja con tres perfiles base de mercado:
  - `Metales`: referencia `XAUUSD`.
  - `Forex`: referencia `EURUSD`.
  - `Índices`: referencia `US30`.
- Separa la experiencia en tres capas:
  - `Dashboard` para cálculo operativo.
  - `Plan de trading` para fijar capital, riesgo y objetivo mensual.
  - `Manual operativo` para explicar el uso y los errores comunes.
- Incluye un `Directorio XM` con presentación de XM, accesos oficiales y rutas de apoyo.

## Qué calcula

- Riesgo por trade en USD a partir de capital y porcentaje de riesgo.
- Lote sugerido considerando spread estimado dentro del riesgo.
- Stop loss y take profit desde `ATR adaptativo` o modo `Manual`.
- Ratio técnico y ratio neto.
- Coste del spread y reward neto.
- Drawdown probable ante rachas de pérdidas.
- Kelly sugerido, expectativa por trade y trades estimados para llegar a la meta.
- Presupuesto diario de pérdida según el plan guardado.

## Flujo de uso

1. Define el plan base en `Plan de trading`.
2. Aplica ese perfil al dashboard para arrancar cada sesión desde una base consistente.
3. Ajusta mercado, tipo de cuenta, `ATR`, spread, win rate y modo de cálculo.
4. Revisa ticket, guardrails, analítica de supervivencia y bitácora.
5. Si necesitas contexto comercial u operativo de XM, abre el `Directorio XM`.

## Enlaces XM con código de socio

La aplicación expone estas rutas afiliadas desde [`src/lib/xmAffiliate.ts`](./src/lib/xmAffiliate.ts) bajo el código de socio `M32JB`.

### Inicio y cuentas

- [Página de inicio](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=0): entrada general a XM en español.
- [Abrir cuenta real](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=1): ruta principal usada por la app.
- [Abrir cuenta demo](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=5): práctica antes de fondear.
- [Tipos de cuenta](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=2): comparativo para alinear micro o standard.

### Plataformas y acceso

- [Acceso usuarios](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=22): ingreso al área de usuario.
- [MetaTrader 5 (MT5)](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=20): descarga y acceso directo a plataforma.
- [App de XM](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=17): aplicación oficial de XM.
- [Calculadoras forex de XM](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=14): complemento para contrastar lotaje y margen.

### Aprendizaje y soporte

- [Formación de trading](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=7): recursos educativos oficiales.
- [Promociones y bonos](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=6): campañas y beneficios activos.
- [Atención al cliente](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=18): soporte oficial de XM.
- [Copy trading](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=3901): acceso a la oferta de copy trading.
- [Acerca de XM](https://clicks.pipaffiliates.com/c?c=1218607&l=es&p=8): información general del broker.

## Stack real del repositorio

- `React 19`
- `TypeScript`
- `Vite 6`
- `Tailwind CSS 4`
- `lucide-react`

No hay backend ni variables de entorno obligatorias para correr el proyecto en local.

## Estructura principal

```text
.
├── index.html
├── metadata.json
├── vercel.json
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   ├── preview-desktop.png
│   ├── preview-mobile.png
│   ├── robots.txt
│   ├── site.webmanifest
│   └── sitemap.xml
├── scripts/
│   └── logic-smoke.ts
└── src/
    ├── App.tsx
    ├── components/
    │   ├── Header.tsx
    │   ├── ConfigPanel.tsx
    │   ├── ResultsDisplay.tsx
    │   ├── AnalyticsPanel.tsx
    │   ├── HistoryPanel.tsx
    │   ├── XMInfoSection.tsx
    │   ├── AffiliateSection.tsx
    │   ├── XMDirectoryModal.tsx
    │   ├── TradingPlanWorkspace.tsx
    │   └── TechnicalManual.tsx
    ├── hooks/
    │   └── useRiskCalculator.ts
    ├── lib/
    │   ├── marketProfiles.ts
    │   ├── persistence.ts
    │   ├── tradingPlan.ts
    │   └── xmAffiliate.ts
    └── types.ts
```

## Lógica principal

- `src/hooks/useRiskCalculator.ts`: transforma la configuración actual en ticket, expectativa, drawdown y métricas de supervivencia.
- `src/lib/tradingPlan.ts`: genera y valida el plan base según cuenta, mercado y meta mensual.
- `src/lib/persistence.ts`: sanea `config`, `plan` y `history` antes de leer o escribir en `localStorage`.
- `src/lib/xmAffiliate.ts`: centraliza los enlaces XM usados por la interfaz y el directorio.
- `src/App.tsx`: coordina persistencia, navegación de vistas y apertura del `Directorio XM`.

## Persistencia local

La app guarda tres bloques en `localStorage`:

- `xm_forex_sizer_config`
- `xm_forex_sizer_plan`
- `xm_forex_sizer_history`

Cada bloque se sanea antes de rehidratarse para evitar estados rotos o valores fuera de rango.

## Uso local

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:3000` o en el siguiente puerto libre que Vite detecte.

## Scripts útiles

- `npm run dev`: servidor local.
- `npm run lint`: chequeo TypeScript sin emitir archivos.
- `npm run build`: build de producción.
- `npm run preview`: vista previa del build.
- `npm run test:logic`: prueba rápida de la lógica principal.
- `npm run check`: ejecuta `lint` y `build`.

## Supuestos importantes

- Los cálculos son un modelo operativo, no una promesa de resultados.
- `Forex` está orientado a pares principales cotizados en USD.
- `Metales` usa como referencia `XAUUSD`.
- `Índices` usan un modelo conservador y requieren validar el valor por punto del símbolo real en XM.
- Si cambian spread, volatilidad o estructura del instrumento, vuelve a calcular antes de entrar.

## Licencia y atribución

Este proyecto se comparte bajo la licencia **Creative Commons Atribución (CC BY)**.

Puedes reutilizarlo, adaptarlo y publicarlo, incluso con fines comerciales, siempre que mantengas una atribución visible a [Wuilmer Bolívar](https://www.linkedin.com/in/wuilmerbolivar/) en el código, la documentación o el producto derivado.
