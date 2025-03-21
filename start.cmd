@echo off
cd /d "%~dp0"

echo Starting shop-store-client-master...
cd shop-store-client-master
start cmd /k "npm run dev"
cd ..

echo Starting shop-store-management-client-master...
cd shop-store-management-client-master
start cmd /k "npm run dev"
cd ..

echo Starting shop-store-management-server-master...
cd shop-store-management-server-master
start cmd /k "npm run start"
cd ..

echo Starting shop-store-server-master...
cd shop-store-server-master
start cmd /k "npm run start"
cd ..

echo All projects started.
pause