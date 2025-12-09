# Git Setup Guide

## Initial Git Configuration

### Set Global Git User (if not already set)
```bash
git config --global user.name "Awais Akram"
git config --global user.email "your-email@example.com"
```

### Set Local Repository User (for this project only)
```bash
git config user.name "Awais Akram"
git config user.email "your-email@example.com"
```

## Commit Message Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

#### Feature Commit
```bash
git add .
git commit -m "feat(frontend): add user authentication screen

- Implement login form with validation
- Add navigation to home screen after login
- Include error handling for invalid credentials"
```

#### Bug Fix Commit
```bash
git add .
git commit -m "fix(backend): resolve location update issue

- Fix GPS coordinate parsing error
- Add proper error handling for invalid locations
- Update location validation middleware"
```

#### Documentation Commit
```bash
git add .
git commit -m "docs: update README with setup instructions

- Add detailed installation steps
- Include environment variable examples
- Add troubleshooting section"
```

#### Refactoring Commit
```bash
git add .
git commit -m "refactor(backend): improve API response structure

- Standardize response format across all endpoints
- Add consistent error handling
- Update response status codes"
```

## Common Git Commands

### Initial Setup
```bash
# Initialize repository (if not already done)
git init

# Add remote origin
git remote add origin https://github.com/Awaisverse/InDriveClone.git

# Check remote
git remote -v
```

### Daily Workflow
```bash
# Check status
git status

# Add all changes
git add .

# Add specific files
git add frontend/src/components/Button.tsx

# Commit with message
git commit -m "feat(frontend): add custom button component"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main
```

### Branch Management
```bash
# Create new branch
git checkout -b feature/user-authentication

# Switch branch
git checkout main

# List branches
git branch

# Merge branch
git checkout main
git merge feature/user-authentication

# Delete branch
git branch -d feature/user-authentication
```

### View History
```bash
# View commit history
git log

# View commit history (one line)
git log --oneline

# View changes
git diff

# View specific commit
git show <commit-hash>
```

## Best Practices

1. **Commit Often**: Make small, logical commits
2. **Write Clear Messages**: Describe what and why, not how
3. **Use Branches**: Create feature branches for new work
4. **Review Before Commit**: Use `git status` and `git diff`
5. **Pull Before Push**: Always pull latest changes before pushing

## Example Workflow

```bash
# 1. Start new feature
git checkout -b feature/ride-booking

# 2. Make changes and commit
git add .
git commit -m "feat(frontend): add ride booking screen"

# 3. Continue working
git add .
git commit -m "feat(frontend): integrate map component in booking screen"

# 4. Push branch
git push origin feature/ride-booking

# 5. Merge to main (after review)
git checkout main
git pull origin main
git merge feature/ride-booking
git push origin main
```




