
@echo off

%~d0
cd %~dp0

cd ../
tree >./@bak/tree_bak.txt /F

pause

cmd
