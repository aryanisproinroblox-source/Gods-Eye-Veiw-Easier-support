@rem Gradle startup script for Windows

@if "%DEBUG%"=="" @echo off
@rem Set local scope
setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
:findJavaFromJavaHome
set JAVA_EXE=%JAVA_HOME%/bin/java.exe
if exist "%JAVA_EXE%" goto execute
echo JAVA_HOME is set to an invalid directory: %JAVA_HOME% >&2
goto fail

:execute
"%JAVA_EXE%" -classpath "%APP_HOME%\gradle\wrapper\gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain %*

:fail
exit /b 1
