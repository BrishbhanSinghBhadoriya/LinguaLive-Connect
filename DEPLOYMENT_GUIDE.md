# LinguaLive-Connect: Complete Fix & Deployment Guide

## 📋 Complete Issue Diagnosis

### Problem 1: `ERR_PNPM_OUTDATED_LOCKFILE`
**Cause**: pnpm-lock.yaml not synchronized with package.json files across workspace

### Problem 2: `ERR_PNPM_IGNORED_BUILDS` (sharp)
**Cause**: Missing `allowBuilds` configuration for sharp in pnpm-workspace.yaml

### Problem 3: Turbopack Workspace Detection
**Cause**: Turbopack couldn't find workspace root; missing configuration in next.config.ts

### Problem 4: Vercel Deployment
**Cause**: Incorrect vercel.json configuration for monorepo

---

## ✅ Option 1: Fix & Use pnpm (Recommended)

### 1. Files Modified
- `pnpm-workspace.yaml`: Complete fix with proper catalog, allowBuilds, etc.
- `vercel.json`: Correct monorepo deployment config
- `artifacts/lingua-live-next/next.config.ts`: Turbopack workspace root config
- `package.json`: Updated scripts to use pnpm filter syntax

### 2. Final pnpm-workspace.yaml
```yaml
packages:
  - artifacts/*
  - lib/*
  - lib/integrations/*
  - scripts

catalog:
  clsx: ^2.1.1
  framer-motion: ^11.12.4
  lucide-react: ^0.456.0
  next: ^16.2.7
  react: ^19.0.0
  react-dom: ^19.0.0
  tailwind-merge: ^2.5.4
  typescript: ~5.9.3
  "@types/node": ^22.10.2
  "@types/react": ^19.0.2
  "@types/react-dom": ^19.0.2
  autoprefixer: ^10.4.20
  postcss: ^8.4.49
  tailwindcss: ^3.4.17
  "@tailwindcss/typography": ^0.5.15
  zod: ^3.25.76
  drizzle-orm: ^0.39.3
  "@tanstack/react-query": ^5.66.9
  tsx: ^4.19.2

autoInstallPeers: false

onlyBuiltDependencies:
  - "@swc/core"
  - esbuild
  - msw
  - unrs-resolver
  - sharp

allowBuilds:
  esbuild: true
  sharp: true
  "@swc/core": true
  msw: true
  unrs-resolver: true

overrides:
  "esbuild>@esbuild/darwin-arm64": "-"
  "esbuild>@esbuild/darwin-x64": "-"
  "esbuild>@esbuild/linux-arm64": "-"
  "esbuild>@esbuild/linux-arm": "-"
  "esbuild>@esbuild/linux-ia32": "-"
  "esbuild>@esbuild/linux-loong64": "-"
  "esbuild>@esbuild/linux-mips64el": "-"
  "esbuild>@esbuild/linux-ppc64": "-"
  "esbuild>@esbuild/linux-riscv64": "-"
  "esbuild>@esbuild/linux-s390x": "-"
  "esbuild>@esbuild/freebsd-arm64": "-"
  "esbuild>@esbuild/freebsd-x64": "-"
  "esbuild>@esbuild/netbsd-x64": "-"
  "esbuild>@esbuild/openbsd-x64": "-"
  "esbuild>@esbuild/sunos-x64": "-"
  "esbuild>@esbuild/win32-arm64": "-"
  "esbuild>@esbuild/win32-ia32": "-"
  "@next/swc-darwin-arm64": "-"
  "@next/swc-darwin-x64": "-"
  "@next/swc-linux-arm64-gnu": "-"
  "@next/swc-linux-arm64-musl": "-"
  "@next/swc-linux-x64-musl": "-"
  "@next/swc-win32-arm64-msvc": "-"
  "@next/swc-win32-ia32-msvc": "-"
  "@img/sharp-libvips-darwin-arm64": "-"
  "@img/sharp-libvips-darwin-x64": "-"
  "@img/sharp-libvips-linux-arm": "-"
  "@img/sharp-libvips-linux-arm64": "-"
  "@img/sharp-libvips-linuxmusl-arm64": "-"
  "@img/sharp-libvips-linuxmusl-x64": "-"
  "@img/sharp-libvips-win32-ia32": "-"
  "@img/sharp-libvips-win32-x64": "-"

minimumReleaseAge: 1440
```

### 3. Final vercel.json
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "rootDirectory": "artifacts/lingua-live-next",
  "buildCommand": "cd ../.. && pnpm build",
  "outputDirectory": ".next",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "regions": ["sfo1"]
}
```

### 4. Final next.config.ts (artifacts/lingua-live-next)
```typescript
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    turbotrace: {
      rootDir: path.join(__dirname, "..", ".."),
    },
  },
  images: {
    remotePatterns: [],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "LinguaLive AI",
  },
};

export default nextConfig;
```

### 5. Commands to Regenerate Lockfile & Fix Sharp
```bash
# Clean existing lockfile
rm pnpm-lock.yaml

# Regenerate lockfile (this also approves sharp builds)
pnpm install

# Verify everything works
pnpm dev
```

### 6. Vercel Deployment Steps
1. Commit all changes to git
2. Push to GitHub/GitLab
3. In Vercel:
   - Import your project
   - Vercel will automatically detect vercel.json
   - Deploy!

---

## 🔄 Option 2: Convert to npm (No Workspace)

### Step 1: Remove pnpm configuration files
```bash
rm pnpm-workspace.yaml
rm pnpm-lock.yaml
```

### Step 2: Update all package.json files to NOT use workspace: or catalog:

#### Root package.json
```json
{
  "name": "lingualive-connect",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "cd artifacts/lingua-live-next && npm run dev",
    "dev:api": "cd artifacts/api-server && npm run dev",
    "dev:full": "concurrently \"npm run dev:api\" \"npm run dev\"",
    "build": "cd artifacts/lingua-live-next && npm run build",
    "typecheck": "cd artifacts/lingua-live-next && npm run typecheck"
  },
  "devDependencies": {
    "concurrently": "^9.1.2",
    "prettier": "^3.8.3",
    "typescript": "~5.9.3"
  }
}
```

#### artifacts/api-server/package.json
Replace `"workspace:*"` with direct package paths or publish packages.

**Option**: Move Next.js app to root! (Simplest for Vercel)

### Step 3: Simplest npm fix: Move Next.js app to root
```bash
# Move app to root
mv artifacts/lingua-live-next/* ./
# Remove artifacts folder if no longer needed
# rm -rf artifacts

# Then install
npm install
```

---

## 📁 Final Expected Folder Structure

### Option 1: pnpm Monorepo
```
LinguaLive-Connect/
├── pnpm-workspace.yaml
├── package.json
├── pnpm-lock.yaml
├── vercel.json
├── artifacts/
│   ├── lingua-live-next/
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   └── ...
│   └── api-server/
│       └── ...
├── lib/
│   ├── db/
│   ├── api-zod/
│   ├── api-client-react/
│   └── api-spec/
└── scripts/
    └── ...
```

### Option 2: npm (Simplified)
```
LinguaLive-Connect/
├── package.json
├── package-lock.json
├── vercel.json
├── next.config.ts
├── src/
│   └── ...
└── (api-server can be separate repo or subfolder)
```

---

## 🚀 Quick Start (Using pnpm)
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Deploy to Vercel (after git push)
# No extra steps - vercel.json handles it!
```
