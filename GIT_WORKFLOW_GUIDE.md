# Git Workflow Guide - RideShare Project

## 👤 Author Configuration
- **Name**: M Awais Akram
- **Email**: awaisverse@gmail.com

## ✅ Current Git Status

All commits are properly configured with the correct author information.

## 🌿 Branch Strategy

### Main Branches
- `main` - Production-ready code (default branch)

### Feature Branch Naming Convention
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-updates` - Documentation changes
- `refactor/code-improvements` - Code refactoring
- `test/test-coverage` - Testing related

## 📝 Commit Message Format

### Standard Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `merge`: Branch merges

### Examples

#### Feature Commit
```bash
git commit -m "feat(frontend): add ride booking screen

- Implement booking form with validation
- Add map integration for location selection
- Connect to booking API endpoint"
```

#### Bug Fix Commit
```bash
git commit -m "fix(backend): resolve location update issue

- Fix GPS coordinate parsing error
- Add proper error handling for invalid locations
- Update location validation middleware"
```

#### Documentation Commit
```bash
git commit -m "docs: update API documentation

- Add endpoint descriptions
- Include request/response examples
- Add authentication requirements"
```

## 🔄 Complete Workflow

### 1. Starting a New Feature

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/ride-booking

# Make changes...
# Stage and commit
git add .
git commit -m "feat(frontend): add ride booking screen"
```

### 2. Working on Multiple Commits

```bash
# Continue making changes
git add src/components/BookingForm.tsx
git commit -m "feat(frontend): implement booking form component"

git add src/services/bookingService.ts
git commit -m "feat(frontend): add booking API service"
```

### 3. Merging Feature Branch

```bash
# Switch to main
git checkout main

# Merge feature branch
git merge feature/ride-booking --no-ff -m "merge: integrate ride booking feature

- Add booking screen and form
- Implement booking API integration
- Add form validation"

# Push to remote
git push origin main
```

### 4. Cleaning Up

```bash
# Delete merged branch locally
git branch -d feature/ride-booking

# Delete remote branch (if pushed)
git push origin --delete feature/ride-booking
```

## 📊 Branch Management Commands

```bash
# List all branches
git branch -a

# Create and switch to new branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Delete branch
git branch -d feature/old-feature

# View branch history
git log --oneline --graph --all
```

## 🔍 Viewing Commit History

```bash
# View commits with author info
git log --format="%h | %an <%ae> | %ar | %s"

# View commits on current branch
git log --oneline

# View commits on all branches
git log --oneline --all --graph

# View commits by author
git log --author="M Awais Akram"
```

## ✅ Best Practices

1. **Always start from updated main**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Use descriptive branch names**
   - ✅ `feature/user-authentication`
   - ❌ `feature/auth` or `new-feature`

3. **Write clear commit messages**
   - Use imperative mood: "add" not "added"
   - Include scope: `feat(frontend):`
   - Add body for complex changes

4. **Commit often, push logically**
   - Make small, logical commits
   - Push when feature is complete

5. **Use merge commits for features**
   ```bash
   git merge feature/name --no-ff -m "merge: description"
   ```

6. **Keep branches up to date**
   ```bash
   git checkout feature/your-feature
   git merge main
   ```

## 🚨 Common Issues & Solutions

### Issue: Wrong author in commit
```bash
# Fix last commit author
git commit --amend --author="M Awais Akram <awaisverse@gmail.com>"
```

### Issue: Need to change commit message
```bash
# Edit last commit message
git commit --amend -m "new message"
```

### Issue: Accidentally committed to main
```bash
# Create branch from current state
git branch feature/fix-name
git reset --hard origin/main
git checkout feature/fix-name
```

## 📋 Quick Reference

| Action | Command |
|--------|---------|
| Create branch | `git checkout -b feature/name` |
| Switch branch | `git checkout branch-name` |
| Stage changes | `git add .` or `git add file.ts` |
| Commit | `git commit -m "type(scope): message"` |
| Merge | `git merge branch-name --no-ff` |
| View history | `git log --oneline --graph` |
| Check status | `git status` |
| View branches | `git branch -a` |

## 🎯 Current Project Branches

- ✅ `main` - Main production branch
- ✅ `feature/backend-setup` - Backend utilities (merged)
- ✅ `feature/frontend-setup` - Frontend constants (merged)
- ✅ `feature/authentication` - Auth state management (merged)
- ✅ `docs/readme-updates` - Documentation (merged)

All feature branches have been merged into `main` with proper merge commits.

---

**Remember**: Always verify your author information before committing:
```bash
git config user.name
git config user.email
```

