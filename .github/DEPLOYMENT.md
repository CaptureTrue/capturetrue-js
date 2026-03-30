# Automated npm Deployment Setup Guide

This project uses GitHub Actions and semantic-release to automatically publish the web-component to npm.

## How It Works

### Workflow 1: Automatic Versioning & Release (`release.yml`)
- **Trigger**: Pushes to `main` branch
- **Process**:
  1. Analyzes commit messages (conventional commits like `feat:`, `fix:`, `perf:`)
  2. Determines version bump (major, minor, patch)
  3. Updates `package.json` and creates `CHANGELOG.md`
  4. Creates a GitHub release with auto-generated release notes
  5. Commits changes back to git

### Workflow 2: npm Publishing (`publish.yml`)
- **Trigger**: When a GitHub release is published
- **Process**:
  1. Builds the web-component package
  2. Publishes to npm with the version from the release

## Setup Instructions

### 1. Create an npm Access Token

1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Navigate to **Account Settings** → **Access Tokens**
3. Click **Generate New Token**
4. Choose **Automation** as the token type (allows read and publish)
5. Copy the token

### 2. Add GitHub Secret

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Paste your npm token value
6. Click **Add secret**

### 3. Verify Repository Settings

Ensure your GitHub repository has write permissions for the token:
- Go to **Settings** → **Actions** → **General**
- Under "Workflow permissions", select **Read and write permissions**
- Click **Save**

## Publishing a New Version

### Process:
1. Make changes to the web-component code
2. Commit with conventional commit messages:
   - `feat: add new feature` → triggers minor version bump
   - `fix: resolve bug` → triggers patch version bump
   - `perf: improve performance` → triggers patch version bump
   - `BREAKING CHANGE:` in body → triggers major version bump
3. Push to `main` branch
4. The `release.yml` workflow automatically:
   - Analyzes commits
   - Bumps the version
   - Creates a GitHub release
5. The `publish.yml` workflow automatically:
   - Publishes to npm when release is published

### Example:
```bash
# Make a fix
git commit -m "fix: resolve issue with web component initialization"
git push origin main

# GitHub Actions will:
# 1. Detect the commit message
# 2. Bump patch version (e.g., 0.0.1 → 0.0.2)
# 3. Create a release
# 4. Publish to npm
```

## Manual Publishing (if needed)

If you need to manually publish without waiting for the workflow:

```bash
cd packages/web-component
npm publish
```

## Semantic Versioning Convention

The project follows [Semantic Versioning](https://semver.org/) with Angular-style commit messages:

- **feat**: New feature → MINOR version bump
- **fix**: Bug fix → PATCH version bump
- **perf**: Performance improvement → PATCH version bump
- **refactor**: Code refactoring → PATCH version bump
- **BREAKING CHANGE**: In commit footer → MAJOR version bump

## Troubleshooting

### Workflow Not Triggering?
- Check that `NPM_TOKEN` secret is set in GitHub
- Verify the branch is `main` (for release workflow)
- Check workflow file syntax in `.github/workflows/`

### Publish Failed?
- Verify npm token has publish permissions
- Check that version in package.json isn't already published
- Review workflow logs in GitHub Actions tab

### Need to Patch a Release?

If you need to patch an already-published version:

1. Create commits on main with conventional messages
2. Push to main
3. Release workflow will create a patch release automatically

## Files Added

- `.github/workflows/release.yml` - Semantic release workflow
- `.github/workflows/publish.yml` - npm publish workflow
- `packages/web-component/.releaserc.json` - semantic-release configuration
- `packages/web-component/package.json` - updated with dependencies

## Documentation Links

- [Semantic Release Docs](https://semantic-release.gitbook.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Access Tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens)
