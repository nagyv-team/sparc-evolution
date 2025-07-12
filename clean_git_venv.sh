#!/bin/bash

# Script to remove virtual environment files from git tracking
# This will NOT delete the files from disk, only from git tracking

echo "This script will remove virtual environment files from git tracking."
echo "The files will remain on disk but won't be tracked by git anymore."
echo ""
read -p "Do you want to continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Removing virtual environment files from git..."
    
    # Remove research_env directory from git
    git rm -r --cached analysis/research_env/ 2>/dev/null || echo "research_env not found in git"
    
    # Remove testing_env directory from git
    git rm -r --cached analysis/testing_env/ 2>/dev/null || echo "testing_env not found in git"
    
    # Remove any other *_env directories
    git rm -r --cached */*_env/ 2>/dev/null || echo "No other _env directories found"
    
    # Remove any __pycache__ directories
    git rm -r --cached */__pycache__/ 2>/dev/null || echo "No __pycache__ directories found"
    git rm -r --cached */*/__pycache__/ 2>/dev/null || echo "No nested __pycache__ directories found"
    
    # Remove any .pyc files
    git rm --cached **/*.pyc 2>/dev/null || echo "No .pyc files found"
    
    echo ""
    echo "Done! Virtual environment files have been removed from git tracking."
    echo ""
    echo "Next steps:"
    echo "1. Review the changes with: git status"
    echo "2. Commit the changes with: git commit -m 'Remove virtual environments from git tracking'"
    echo "3. The .gitignore file has been updated to prevent these files from being added again"
    echo ""
    echo "Note: The virtual environments are still on your disk and will continue to work."
else
    echo "Operation cancelled."
fi