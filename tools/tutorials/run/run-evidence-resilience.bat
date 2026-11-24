@echo off
cd /d "%~dp0.."
py evidence_resilience.py > evidence-resilience.log 2>&1
