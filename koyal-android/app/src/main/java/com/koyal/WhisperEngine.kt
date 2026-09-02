package com.koyal

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class WhisperEngine {
    
    init {
        System.loadLibrary("koyal-jni")
    }

    external fun init(path: String): Boolean
    external fun transcribe(audioData: FloatArray, sampleRate: Int): String
    external fun free()
    
    suspend fun transcribeAudio(audioData: FloatArray, sampleRate: Int = 16000): String {
        return withContext(Dispatchers.Default) {
            transcribe(audioData, sampleRate)
        }
    }
}
