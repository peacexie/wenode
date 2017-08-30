
@echo off

%~d0
cd %~dp0

cd ../
tree >./cache/tree_bak.txt /F

pause

cmd
