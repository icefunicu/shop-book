@echo off
setlocal enabledelayedexpansion

:: 定义项目路径和对应的 npm 命令
set projects[0]=shop-store-client-master
set commands[0]=npm run dev

set projects[1]=shop-store-management-client-master
set commands[1]=npm run dev

set projects[2]=shop-store-management-server-master
set commands[2]=npm run start

set projects[3]=shop-store-server-master
set commands[3]=npm run start

:: 遍历所有项目并启动
for /L %%i in (0,1,3) do (
    set "project=!projects[%%i]!"
    set "command=!commands[%%i]!"
    
    echo 正在进入目录: !project!
    start cmd /k "cd /d !project! && !command!"
)

echo 所有项目已启动！
exit