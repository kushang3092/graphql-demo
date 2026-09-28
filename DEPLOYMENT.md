# Deployment — CI/CD with GitHub Actions

Backend → **Render** (free web service, native Node/Express support)
Frontend → **Vercel** (built for Vite/React, fast global CDN)
CI/CD → **GitHub Actions** — on every push to `main`, the relevant workflow
builds/checks the code, then triggers a deploy.

Push this whole `graphql-demo/` folder to a GitHub repo first — everything
below assumes it's there.

## 1. Backend on Render

1. Go to [render.com](https://render.com) → **New → Web Service** → connect
   your GitHub repo. Render will detect `render.yaml` in the repo root
   automatically (it's already included).
2. If asked, confirm: **Root Directory** = `backend`, **Build Command** =
   `npm install`, **Start Command** = `npm start`.
3. Under **Environment**, add:
   - `MONGO_URI` — your Atlas connection string
   - `DB_NAME` — `test`
   - `FRONTEND_URL` — leave blank for now; you'll fill it in after step 2
     (Vercel) gives you a URL
4. Deploy once manually from the Render dashboard to confirm it boots and
   connects to MongoDB — check the logs for `✅ Connected to MongoDB Atlas`.
5. Copy your **Render service URL**, e.g. `https://graphql-demo-backend.onrender.com`.
   Your GraphQL endpoint is `https://graphql-demo-backend.onrender.com/graphql`.
6. Get a **Deploy Hook**: Render dashboard → your service → **Settings →
   Deploy Hook** → copy the URL. This is what GitHub Actions will call to
   trigger redeploys.
7. In your GitHub repo → **Settings → Secrets and variables → Actions**,
   add a secret:
   - `RENDER_DEPLOY_HOOK_URL` = the URL from step 6

From now on, `.github/workflows/backend-deploy.yml` runs on every push to
`main` that touches `backend/**`: it installs deps, sanity-checks the
server file, then calls the deploy hook.

## 2. Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import
   the same repo.
2. Set **Root Directory** to `frontend`. Framework preset should
   auto-detect as **Vite**.
3. Add an environment variable in the Vercel project settings:
   - `VITE_GRAPHQL_URL` = `https://graphql-demo-backend.onrender.com/graphql`
     (your Render URL from step 1.5, with `/graphql` appended)
4. Deploy once from the Vercel dashboard to confirm it builds. Copy the
   resulting URL, e.g. `https://graphql-demo.vercel.app`.
5. Go back to **Render** and set `FRONTEND_URL` = that Vercel URL, then
   redeploy the backend once so CORS allows it.

### Getting the values GitHub Actions needs

The Actions workflow deploys via the Vercel CLI, which needs a token plus
your org/project IDs:

1. Locally, install the CLI and link the project (one-time):
   ```bash
   npm install -g vercel
   cd frontend
   vercel login
   vercel link
   ```
   This creates `frontend/.vercel/project.json` containing `orgId` and
   `projectId` — open it and copy both values.
2. Create a token: Vercel dashboard → **Settings → Tokens → Create**.
3. In GitHub repo → **Settings → Secrets and variables → Actions**, add:
   - `VERCEL_TOKEN` — the token from step 2
   - `VERCEL_ORG_ID` — `orgId` from `.vercel/project.json`
   - `VERCEL_PROJECT_ID` — `projectId` from `.vercel/project.json`
   - `VITE_GRAPHQL_URL` — same value as step 2.3 above (needed at build
     time inside the Actions runner, not just in Vercel's own dashboard)

`frontend/.vercel/` is a local CLI cache — don't commit it; it's already
covered by `.gitignore`.

## 3. Required GitHub Secrets — summary

| Secret | Where it comes from |
|---|---|
| `RENDER_DEPLOY_HOOK_URL` | Render → service → Settings → Deploy Hook |
| `VERCEL_TOKEN` | Vercel → Settings → Tokens |
| `VERCEL_ORG_ID` | `frontend/.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | `frontend/.vercel/project.json` after `vercel link` |
| `VITE_GRAPHQL_URL` | Your Render backend URL + `/graphql` |

## 4. How the pipeline behaves

- Push touching `backend/**` → `backend-deploy.yml` runs → installs deps,
  checks the server file parses → on `main`, calls the Render deploy hook.
- Push touching `frontend/**` → `frontend-deploy.yml` runs → installs deps,
  builds with Vite → on `main`, deploys the build to Vercel via CLI.
- Pull requests trigger the build/check job only (no deploy), so you get a
  CI signal before merging.
- Each workflow only runs when files under its own folder change, so a
  backend-only commit won't trigger a frontend deploy and vice versa.

## 5. Testing it

1. Make a small change in `backend/server.js` (e.g. tweak a log message),
   commit, push to `main`.
2. Watch the **Actions** tab in GitHub — `Backend CI/CD` should run and,
   on success, your Render service should redeploy (check Render's own
   logs/dashboard for the new deploy).
3. Repeat with a change in `frontend/src/App.jsx` and confirm `Frontend
   CI/CD` deploys a new Vercel build.
