# DEPLOYMENT PROTOCOL

## Pipeline

GitHub

↓

Build

↓

Lint

↓

TypeScript

↓

Vercel Preview

↓

Production Deployment

Deployment is considered successful only when:

- Build passes
- Lint passes
- TypeScript passes
- Vercel deployment is GREEN
