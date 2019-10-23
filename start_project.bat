@ECHO OFF

ECHO AMAZING SCRIPT
ECHO v 01 
ECHO By Alisa enteprises 2019 (All rights reserved) 

rem this will start the client 
rem starting emulator
ECHO STARTING ANDROID EMULATOR
pushd C:\Users\alisa\AppData\Local\Android\Sdk\Emulator
start "android emulator" emulator -avd "Nexus_5_API_27"
popd

ECHO STARTING NODE MONITOR (SERVER)
rem this wil start the server 
start "starting nodemon" nodemon


cd client

ECHO STARTING REACT REACT DEV TOOLS
start "react devtools" npm run react-devtools

ECHO STARTING REACT NATIVE RUN-ANDROID
start "react-native" react-native run-android

ECHO All should be ready.

Timeout /t 3




