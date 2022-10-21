@ECHO OFF
:start
python nml_patcher.py -f "JPmetro.pnml" -o "JPmetro.nml" -b 0 -v 1
nmlc JPmetro.nml -o D:\DocumentsWin\OpenTTD\newgrf\JPmetro.grf
PAUSE
goto start