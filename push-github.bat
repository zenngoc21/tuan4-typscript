@echo off
setlocal

echo === BookStore Online - GitHub ===
git init
if errorlevel 1 exit /b 1

git add .
git commit -m "Complete BookStore Day3 Day4"
if errorlevel 1 echo Commit da ton tai hoac co loi, kiem tra git status.

git branch -M main

git remote get-url origin >nul 2>&1
if errorlevel 1 (
  git remote add origin https://github.com/zenngoc21/tuan4-typscript.git
)

git push -u origin main
pause
