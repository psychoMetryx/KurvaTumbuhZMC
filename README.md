<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# GrowthCompass

GrowthCompass is a pediatric growth calculator that compares a child's measurements against WHO (0–24 months) and CDC (2–20 years) reference data. It provides quick percentile estimates for weight, height/length, and BMI so clinicians and parents can monitor trends without needing external services.

## Core features
- 📊 **Age-aware calculations:** Automatically switches between WHO and CDC datasets depending on age in months.
- 📝 **Guided data entry:** Patient form collects date of birth, measurement date, sex, weight, and height with sensible defaults.
- 🧮 **Percentile insights:** Calculates Z-scores and percentiles for weight, height/length, and BMI using LMS interpolation.
- 📈 **Visual feedback:** Percentile chart highlights where the child falls on standard growth curves.
- 🚫 **Offline friendly:** Calculations run locally; external API usage has been removed.

## Tech stack
- [Vite](https://vitejs.dev/) with React 19 and TypeScript
- [Tailwind CSS](https://tailwindcss.com/) via CDN for utility-first styling
- [Recharts](https://recharts.org/en-US/) for charting
- [lucide-react](https://lucide.dev/) for icons

## Setup and configuration
1. **Prerequisites:** Node.js 18+ and npm.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment variables:**
   - Create a `.env.local` file and set `GEMINI_API_KEY=<your_api_key>` if you plan to re-enable Gemini-powered interpretations. The current UI works without this key because the remote service is deprecated.
4. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The app runs on [http://localhost:3000](http://localhost:3000) by default.

## Build and run commands
- **Development server:** `npm run dev`
- **Production build:** `npm run build`
- **Preview built assets:** `npm run preview`

## Testing
- Automated tests are not yet defined. Run `npm run build` to catch TypeScript and bundling issues.
- For UI changes, manually verify calculations and chart rendering in the browser using the dev server or `npm run preview`.

## Deployment
- Generate a production bundle with `npm run build`; assets output to `dist/`.
- Serve the `dist/` folder on any static host (Netlify, Vercel, GitHub Pages, etc.).
- Use `npm run preview` locally to validate the production build before deploying.

## Troubleshooting
- **Port already in use:** Change the Vite dev server port in `vite.config.ts` or stop the conflicting process.
- **Missing environment variables:** If you enable the Gemini service in the future, ensure `GEMINI_API_KEY` is set in `.env.local` and restart Vite after changes.
- **Dependency issues:** Remove `node_modules` and reinstall (`rm -rf node_modules && npm install`) if builds fail after dependency updates.

## Contribution guidelines
- Follow the coding conventions in [AGENTS.md](AGENTS.md) (TypeScript + React functional components, Tailwind utilities, and organized imports).
- Keep utility logic reusable in `utils/` and add/update types in `types.ts`.
- Run `npm run build` before opening a PR and include the results in the PR description.
- Use clear commit messages and include a concise Summary/Testing section in PRs.
