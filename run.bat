@echo off
cd C:\ProgramData\Jenkins\.jenkins\workspace\discord-bot-pipeline
start "" cmd /c "node index.js > bot.log 2>&1"
exit
