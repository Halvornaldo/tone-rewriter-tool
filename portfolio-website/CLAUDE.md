# Claude Assistant Context - Portfolio Website

This document provides essential context for AI assistants working on this portfolio website project.

## Project Overview

This is a modern portfolio website built with Next.js 14, TypeScript, and Tailwind CSS. The site includes:
- Personal portfolio features (about, blog, projects)
- AI Cost Calculator tool
- Contact forms and newsletter signup
- Responsive design with animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Markdown**: react-markdown
- **Notifications**: react-hot-toast

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── about/                    # About page
│   ├── ai-cost-calculator/       # AI Cost Calculator feature
│   │   ├── calculator/           # Calculator wizard interface
│   │   ├── layout.tsx           # SEO metadata
│   │   └── page.tsx             # Landing page
│   ├── blog/                    # Blog pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── common/                  # Shared components
│   ├── features/                # Feature-specific components
│   │   └── ai-calculator/       # Calculator components
│   │       ├── steps/           # Wizard step components
│   │       ├── StepIndicator.tsx
│   │       └── WizardStep.tsx
│   ├── layout/                  # Layout components
│   └── ui/                      # UI component library
├── data/                        # Static data
├── hooks/                       # Custom React hooks
│   └── useAICostCalculator.ts  # Calculator state management
├── lib/                         # Utility functions
│   ├── ai-cost-calculator.ts   # Calculator engine
│   └── ...                      # Other utilities
└── types/                       # TypeScript types
```

## AI Cost Calculator

The AI Cost Calculator is a comprehensive tool for estimating costs across different AI models.

### Features
- **Multi-step wizard interface**: Model selection → Usage input → Cost results
- **10+ AI models supported**: OpenAI (GPT-4, GPT-3.5), Anthropic (Claude 3), Google (Gemini), and more
- **Cost calculations**: Per request, daily, monthly, and yearly projections
- **Cost comparison**: Compare costs across different models
- **Optimization recommendations**: Get tips to reduce costs
- **Export functionality**: Download or share results

### Key Files
- `src/lib/ai-cost-calculator.ts` - Core calculation engine
- `src/hooks/useAICostCalculator.ts` - React state management
- `src/app/ai-cost-calculator/calculator/page.tsx` - Main calculator interface
- `src/components/features/ai-calculator/` - Calculator UI components

### Model Pricing Data
The calculator includes up-to-date pricing for:
- OpenAI: GPT-4 Turbo ($0.01/$0.03), GPT-4 ($0.03/$0.06), GPT-3.5 ($0.001/$0.002)
- Anthropic: Claude 3 Opus ($0.015/$0.075), Sonnet ($0.003/$0.015), Haiku ($0.00025/$0.00125)
- Google: Gemini Pro ($0.0005/$0.0015)
- And more...

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Common Development Tasks

### Adding New Pages
1. Create a new folder in `src/app/`
2. Add `page.tsx` for the page component
3. Add `layout.tsx` for metadata (optional)

### Adding New Components
1. UI components go in `src/components/ui/`
2. Feature-specific components go in `src/components/features/`
3. Export from index files for clean imports

### Working with the Calculator
1. Model data is in `src/lib/ai-cost-calculator.ts`
2. To add new models, update the `AI_MODELS` array
3. Pricing is in dollars per 1K tokens (input/output)

## Performance Considerations

- **Development vs Production**: Dev server is slower due to HMR and compilation
- **Artificial Delays**: Some components have setTimeout delays for UX (can be removed)
- **Bundle Size**: Consider lazy loading for large components
- **Images**: Use Next.js Image component for optimization

## Environment Variables

Create `.env.local` file with:
```
NEXT_PUBLIC_SITE_NAME=Your Name
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_DESCRIPTION=Your site description
NEXT_PUBLIC_GA_ID=GA-XXXXXXXXX (optional)
```

## Known Issues

1. **TypeScript errors in performance.ts**: JSX in .ts file causes compilation errors
2. **Slow initial load in dev**: Normal for Next.js development mode
3. **Port conflicts**: Dev server tries ports 3000-3005 sequentially

## Future Enhancements

- Remove artificial delays in calculator
- Optimize bundle size
- Add more AI models
- Implement user authentication for saving calculations
- Add API endpoints for real-time pricing updates
- Create mobile app version

## Git Workflow

The repository is at the parent `projects/` level. When committing:
```bash
cd projects
git add portfolio-website/[files]
git commit -m "Your message"
```

## Contact

For questions about the AI Cost Calculator implementation, check:
- Calculator engine: `src/lib/ai-cost-calculator.ts`
- React integration: `src/hooks/useAICostCalculator.ts`
- UI components: `src/components/features/ai-calculator/`

Last updated: July 2025