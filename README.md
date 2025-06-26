# wDingocoin Frontend

A React-based frontend for the wDingocoin project. Production builds are served via Docker and nginx. Development is streamlined with Yarn and Taskfile.

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 recommended)
- [Yarn](https://yarnpkg.com/) (v1.x)
- [Docker](https://www.docker.com/)
- [Taskfile](https://taskfile.dev/) (optional, for workflow automation)

### 1. Local Development

```sh
# Install dependencies
yarn install

# Start the development server
yarn start
# or, using Taskfile (hot reload, port 3000)
task dev-build
task dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build (Docker)

```sh
# Build the Docker image
# (uses multi-stage build, serves with nginx on port 80)
task build

# Run the production container
task run
# Visit http://localhost (nginx serves the built app)
```

### 3. Using Published Images

GitHub Actions automatically builds and publishes Docker images to GitHub Container Registry:

```sh
# Pull and run the latest image
docker pull ghcr.io/dingocoin/wdingocoin-frontend:latest
docker run -p 80:80 ghcr.io/dingocoin/wdingocoin-frontend:latest

# Or use a specific build number
docker pull ghcr.io/dingocoin/wdingocoin-frontend:123
docker run -p 80:80 ghcr.io/dingocoin/wdingocoin-frontend:123
```

### 4. Taskfile Commands

The project includes a comprehensive Taskfile for automation. All tasks support custom variables:

#### Development Tasks
```sh
# Build development Docker image (hot reload enabled)
task dev-build

# Run development container with hot reload
task dev
# Container runs on http://localhost:3000
# Source code is mounted for live updates
```

#### Production Tasks
```sh
# Build production Docker image (multi-stage, nginx)
task build

# Run production container
task run
# Default: http://localhost:80
# Custom port: PORT=8080 task run
```

#### Registry Tasks
```sh
# Push image to registry (default: ghcr.io/dingocoin/wdingocoin-frontend)
task push
# Push with custom tag: PUSH_TAG=v1.0.0 task push
# Push to custom registry: OWNER=myorg task push
```

#### Maintenance Tasks
```sh
# Clean up Docker images and containers
task clean
# Removes all project-related images and stopped containers
```

#### Custom Variables
All tasks support these variables:
```sh
# Custom registry owner (default: dingocoin)
OWNER=myorg task build

# Custom port for production (default: 80)
PORT=8080 task run

# Custom image tag (default: latest)
TAG=v1.0.0 task build

# Custom registry (default: ghcr.io)
REGISTRY=docker.io task build

# Custom push tag (for task push)
PUSH_TAG=v1.0.0 task push
```

### 5. Git Workflow
- Your fork: `origin` (push here)
- Upstream: `upstream` (main repo)

```sh
# Fetch latest changes from upstream
git fetch upstream
# Merge or rebase as needed
git merge upstream/master
# Push to your fork
git push origin master
```

### 6. Troubleshooting
- **OpenSSL/webpack error**: If you see `ERR_OSSL_EVP_UNSUPPORTED`, it's handled in Docker by setting `NODE_OPTIONS=--openssl-legacy-provider`.
- **node-sass issues**: This project uses `sass` (Dart Sass). If you see errors about `node-sass`, ensure your dependencies are up to date and `node-sass` is not installed.
- **Port conflicts**: Use `PORT=8080 task run` to run on a different port.
- **Registry conflicts**: Use `OWNER=myorg task build` to build for a different registry owner.

---

## 📦 Project Structure
- `src/` — React source code
- `Dockerfile` — Production build (multi-stage, nginx)
- `Dockerfile.dev` — Development build (hot reload)
- `Taskfile.yaml` — Task automation (build, run, clean, CI/CD)
- `.github/workflows/` — GitHub Actions CI/CD

---

## 📝 Reference: Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

**Common scripts:**
- `yarn start` — Start dev server
- `yarn build` — Production build
- `yarn test` — Run tests
- `yarn eject` — Eject config (irreversible)

For more, see the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
