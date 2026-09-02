cmake_minimum_required(VERSION 3.10.2)

project("koyal")

# We would need whisper.cpp and ggml.c sources here.
# Assuming they will be downloaded/cloned into src/main/cpp/whisper.cpp
# For the sake of this prompt, we just mock compiling them if they exist or create dummies.

add_library(
        koyal-jni
        SHARED
        koyal-jni.cpp
        # whisper.cpp/ggml.c
        # whisper.cpp/whisper.cpp
)

find_library(
        log-lib
        log)

target_link_libraries(
        koyal-jni
        ${log-lib})
