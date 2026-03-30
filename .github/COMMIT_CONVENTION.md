# Commit Message Convention

This project uses **Conventional Commits** to enable automated versioning and changelog generation.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Examples

### Feature (minor version bump)
```
feat(web-component): add support for capturing multiple frames
```

### Bug Fix (patch version bump)
```
fix(web-component): resolve initialization timing issue
```

### Performance (patch version bump)
```
perf(web-component): optimize re-render performance
```

### Breaking Change (major version bump)
```
feat(web-component): restructure public API

BREAKING CHANGE: The `initialize()` method signature has changed from
`initialize(config)` to `initialize(options)`. See migration guide in docs.
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **docs**: Documentation only changes
- **style**: Changes that don't affect the meaning of the code (whitespace, formatting, missing semicolons, etc)
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process, dependencies, or other non-code changes
- **ci**: Changes to CI/CD configuration

## Scope (optional)

The scope specifies what part of the codebase is affected:
- `web-component`
- `types`
- `build`
- etc.

## Subject

- Use the imperative, present tense: "add" not "added" nor "adds"
- Don't capitalize first letter
- No period (.) at the end

## Body (optional)

- Explain **what** and **why**, not how
- Wrap at 100 characters
- Separate from subject with a blank line

## Footer (optional)

Use this to reference issues or breaking changes:

```
Fixes #123
Closes #456

BREAKING CHANGE: description of breaking change
```

## Git Tips

### Interactive rebase to clean up commits
```bash
git rebase -i HEAD~3
```

### Check your commit message before pushing
```bash
git log -1 --pretty=%B
```

## Why This Matters

Proper commit messages enable:
- ✅ Automated semantic versioning
- ✅ Automatic changelog generation
- ✅ Better project history and debugging
- ✅ Clear communication with team members

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
