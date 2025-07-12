# Python Setup Guide

## Important Notice

⚠️ **Virtual environment files were accidentally committed to git. Please run the cleanup script to fix this:**

```bash
./clean_git_venv.sh
```

This will remove the virtual environment files from git tracking while keeping them on your disk.

## Setting Up Python Environment

### 1. Create a Virtual Environment

```bash
# For the main project
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# For the analysis subdirectory
cd analysis
python -m venv analysis_env
source analysis_env/bin/activate  # On Windows: analysis_env\Scripts\activate
```

### 2. Install Dependencies

```bash
# For the main project (from root directory)
pip install -r requirements.txt

# For analysis-specific work (from analysis directory)
pip install -r analysis/requirements.txt
```

### 3. Development Workflow

1. Always activate your virtual environment before working:
   ```bash
   source venv/bin/activate
   ```

2. Install new packages with pip and update requirements.txt:
   ```bash
   pip install package_name
   pip freeze > requirements.txt
   ```

3. Never commit virtual environment directories to git

## Project Structure

- `/requirements.txt` - Main project dependencies
- `/analysis/requirements.txt` - Analysis-specific minimal dependencies
- `/.gitignore` - Configured to exclude all Python artifacts
- `/analysis/.gitignore` - Additional protection for the analysis directory

## Common Issues

### Large Files in Git

If you've accidentally committed virtual environments or large files:

1. Run the cleanup script: `./clean_git_venv.sh`
2. Commit the changes: `git commit -m "Remove virtual environments from tracking"`
3. The files remain on disk but are no longer tracked by git

### Package Conflicts

If you encounter package conflicts, create separate virtual environments for different parts of the project:

```bash
# Main environment
python -m venv venv

# Analysis environment
python -m venv analysis_env

# Testing environment
python -m venv test_env
```

## Best Practices

1. **Always use virtual environments** - Never install packages globally
2. **Keep requirements.txt updated** - Document all dependencies
3. **Use .gitignore** - Prevent committing large/temporary files
4. **Separate environments** - Use different environments for different purposes
5. **Clean commits** - Review `git status` before committing