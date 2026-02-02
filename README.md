# Market Guardian

A modern trading platform that translates complex market conditions into clear, human language. No predictions. No advice. Just clarity.

## Tech Stack

- **Waku**: Minimal React framework
- **React 19**: Latest React version
- **Tailwind CSS**: Utility-first styling
- **Syncfusion Charts**: Professional candlestick trading charts
- **TypeScript**: Type-safe development

## Key Features

### Landing Page
- Clean, professional marketing page
- Light/dark theme toggle with localStorage persistence
- Responsive design for all screen sizes
- Brand-consistent green (#22c55e) accent colors

### Authentication
- Sign-in/Sign-up pages with split layout design
- Background image with overlay effect
- Form validation and error handling

### Trading Dashboard
- Real-time candlestick chart (EUR/USD)
- Live price updates with percentage change
- Buy/Sell/Cancel quick actions
- Market status indicators (Volatility, Trend, AI Protection)
- Responsive sidebar with user profile

### AI Risk Detection
- Automatic volatility detection
- Risk alert modal with contextual warnings
- "Explain more" feature for detailed market context
- Non-intrusive design that informs without pressure

### UI/UX
- Floating support contact button
- Smooth theme transitions
- Mobile-responsive layouts
- Professional typography (Nunito font)

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Run development server:

```bash
pnpm dev
```

3. Build for production:

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── components/
│   ├── ai-risk-modal.tsx      # AI-powered risk alert modal
│   ├── floating-contact-button.tsx
│   ├── header.tsx
│   ├── sign-in-form.tsx
│   ├── sign-up-form.tsx
│   └── trading-chart.tsx      # Syncfusion candlestick chart
├── lib/
│   └── syncfusion-license.ts  # Chart library license
├── pages/
│   ├── _layout.tsx            # Root layout
│   ├── index.tsx              # Landing page
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   └── dashboard.tsx          # Trading dashboard
├── services/
│   └── api.ts                 # API service layer
└── utils/
    └── auth.ts                # Authentication utilities
```

## Configuration

- Edit `tailwind.config.ts` for styling
- Modify routes in `/src/pages`
- Update Syncfusion license in `/src/lib/syncfusion-license.ts`

## Changelog

### v0.4.0 - Rebrand & AI Risk Detection
- Rebrand project from "Kangaroo Portal" to "Market Guardian"
- Add Syncfusion charts library for candlestick trading visualization
- Implement AI risk modal with volatility warnings and contextual explanations
- Create interactive trading chart with real-time price updates and zoom controls
- Add landing page with light/dark theme toggle

### v0.3.0 - Floating Support Button
- Add floating contact/support message button

### v0.2.0 - Authentication Redesign
- Add background image to sign-in/sign-up pages
- Redesign authentication pages with split layout

### v0.1.0 - Initial Release
- Initialize project with Waku, React 19, and Tailwind CSS
- Basic project structure and routing
