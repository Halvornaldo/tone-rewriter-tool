# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is Claude's working directory located at `C:\Users\halvo\.claude\projects`. This serves as the main workspace for various coding projects and experiments.

## Directory Structure

The directory is organized as follows:
- `active-session/` - Current Claude Code session logs
- `agents/` - AI agent projects and experiments
- `docs/` - Documentation files including this CLAUDE.md
- `session-logs/` - Historical session logs
- `todo-apps/` - Todo application projects

## Development Guidelines

### Code Style
- Use consistent indentation (2 spaces for JS/TS, 4 spaces for Python)
- Follow language-specific conventions (camelCase for JS, snake_case for Python)
- Add meaningful comments for complex logic
- Keep functions small and focused

### Git Workflow
- Make frequent, small commits with descriptive messages
- Use meaningful branch names (feature/add-login, fix/button-styling)
- Always review changes before committing

### Testing
- Write tests for new features when applicable
- Run existing tests before making changes
- Document how to run tests in project README files

### Project Organization
- Each project should have its own folder
- Include a README.md with setup instructions
- Use .gitignore to exclude unnecessary files
- Keep dependencies documented (package.json, requirements.txt)

## Common Commands

```bash
# Check git status
git status

# Run npm projects
npm install
npm start
npm test

# Python projects
pip install -r requirements.txt
python main.py
```

## Notes

- This is a Windows environment using Git Bash
- When creating new projects, add them to the appropriate category folder
- Update this file when adding new project categories or changing conventions