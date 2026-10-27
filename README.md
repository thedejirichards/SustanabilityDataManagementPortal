# Access Holdings Sustainability Data Management Portal

A React, TypeScript and Vite demonstration of a Group sustainability data portal. The interface follows the existing Access brand styling, Effra typography and Tailwind CSS conventions.

## Run locally

```sh
npm install
npm run dev
```

Production checks:

```sh
npm run lint
npm run build
```

## Modules

- Sustainability overview and reporting filters
- Sustainable operations consumption records
- Sustainable development finance
- Corporate social investment
- Employee volunteering
- Advocacy and governance
- Submissions and review queue
- Reports, CSV export and configuration readiness

## Demonstration scope

All seeded records are illustrative, not Access Holdings performance data. New records and review status changes are held in browser memory for the current session; file selection does not upload evidence.

The approved emission-factor schedule, units, conversion methodology and monthly/YTD targets were not available in the supplied workspace. Emissions and target comparisons are therefore not calculated or displayed as real values. Production use also requires the Access identity provider, server-side authorization, data APIs, evidence storage, audit history, approved validation and duplicate rules, and workflow routing.

The Business Requirements Specification (BRS) referenced in the project brief was not present in the repository. The implementation follows the requirements provided in the brief and surfaces missing configuration rather than supplying assumed business values.
# SustanabilityDataManagementPortal
# SustanabilityDataManagementPortal
