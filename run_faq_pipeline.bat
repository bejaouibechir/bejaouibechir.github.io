@echo off
REM Chaine complete : assainir, reconstruire, regenerer le corpus NotebookLM.
REM Double-clic, ou depuis un terminal pour passer des options :
REM     run_faq_pipeline.bat --push
REM     run_faq_pipeline.bat --skip-releases
REM     run_faq_pipeline.bat --skip-build --skip-releases

setlocal
cd /d "%~dp0"
py "%~dp0tools\tutorials\faq_pipeline.py" --repo "%~dp0." %*
set CODE=%ERRORLEVEL%
echo.
if %CODE% NEQ 0 (
  echo La chaine s'est arretee. Rien n'a ete pousse.
)
echo Appuie sur une touche pour fermer.
pause >nul
exit /b %CODE%
