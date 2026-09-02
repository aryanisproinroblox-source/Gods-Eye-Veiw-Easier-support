#include <jni.h>
#include <string>
#include <android/log.h>
#include <vector>

#define TAG "KoyalJNI"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__)

// Dummy declarations for whisper.cpp. 
// In a real scenario, we would include "whisper.h"
struct whisper_context;
struct whisper_full_params;

extern "C" {
    struct whisper_context * whisper_init_from_file(const char * path_model);
    void whisper_free(struct whisper_context * ctx);
    int whisper_full(struct whisper_context * ctx, struct whisper_full_params params, const float * samples, int n_samples);
    int whisper_full_n_segments(struct whisper_context * ctx);
    const char * whisper_full_get_segment_text(struct whisper_context * ctx, int i_segment);
}

// Dummy structures to satisfy compilation if actual whisper.cpp isn't present
struct whisper_context {
    int dummy;
};

struct whisper_full_params {
    int dummy;
};

whisper_context * whisper_init_from_file(const char * path_model) {
    LOGI("Mock init whisper with model: %s", path_model);
    return new whisper_context{1};
}

void whisper_free(whisper_context * ctx) {
    LOGI("Mock free whisper");
    delete ctx;
}

int whisper_full(whisper_context * ctx, whisper_full_params params, const float * samples, int n_samples) {
    LOGI("Mock whisper_full with %d samples", n_samples);
    return 0; // Success
}

int whisper_full_n_segments(whisper_context * ctx) {
    return 1;
}

const char * whisper_full_get_segment_text(whisper_context * ctx, int i_segment) {
    return "Mock transcribed text.";
}

static whisper_context * g_ctx = nullptr;

extern "C"
JNIEXPORT jboolean JNICALL
Java_com_koyal_WhisperEngine_init(JNIEnv *env, jobject thiz, jstring path) {
    const char *model_path = env->GetStringUTFChars(path, nullptr);
    if (g_ctx != nullptr) {
        whisper_free(g_ctx);
    }
    g_ctx = whisper_init_from_file(model_path);
    env->ReleaseStringUTFChars(path, model_path);
    return g_ctx != nullptr;
}

extern "C"
JNIEXPORT jstring JNICALL
Java_com_koyal_WhisperEngine_transcribe(JNIEnv *env, jobject thiz, jfloatArray audioData, jint sampleRate) {
    if (g_ctx == nullptr) {
        LOGE("Whisper context is null");
        return env->NewStringUTF("");
    }

    jsize len = env->GetArrayLength(audioData);
    jfloat *samples = env->GetFloatArrayElements(audioData, nullptr);

    whisper_full_params params = {}; // Default params

    int res = whisper_full(g_ctx, params, samples, len);
    env->ReleaseFloatArrayElements(audioData, samples, JNI_ABORT);

    if (res != 0) {
        LOGE("Failed to process audio");
        return env->NewStringUTF("");
    }

    int n_segments = whisper_full_n_segments(g_ctx);
    std::string result = "";
    for (int i = 0; i < n_segments; ++i) {
        const char * text = whisper_full_get_segment_text(g_ctx, i);
        result += text;
    }

    return env->NewStringUTF(result.c_str());
}

extern "C"
JNIEXPORT void JNICALL
Java_com_koyal_WhisperEngine_free(JNIEnv *env, jobject thiz) {
    if (g_ctx != nullptr) {
        whisper_free(g_ctx);
        g_ctx = nullptr;
    }
}
