@ECHO OFF
:start
python nml_patcher.py -f "JPprivate.pnml" -o "JPmetro.nml" -b 0 -v 1
nmlc JPmetro.nml -o JPmetro.grf
PAUSE
goto start