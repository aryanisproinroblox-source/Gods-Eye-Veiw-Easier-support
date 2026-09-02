package com.koyal

import android.annotation.SuppressLint
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AudioRecorder {

    private var audioRecord: AudioRecord? = null
    private val sampleRate = 16000
    private var isRecording = false

    @SuppressLint("MissingPermission")
    fun startRecording() {
        val bufferSize = AudioRecord.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        )
        
        audioRecord = AudioRecord(
            MediaRecorder.AudioSource.MIC,
            sampleRate,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT,
            bufferSize
        )
        audioRecord?.startRecording()
        isRecording = true
    }

    suspend fun stopRecordingAndGetFloatArray(): FloatArray = withContext(Dispatchers.IO) {
        if (audioRecord == null) return@withContext FloatArray(0)
        
        val allShorts = mutableListOf<Short>()
        val buffer = ShortArray(1024)
        
        isRecording = false
        // Read remaining
        var readCount = 0
        while (audioRecord!!.read(buffer, 0, buffer.size).also { readCount = it } > 0) {
            allShorts.addAll(buffer.take(readCount))
            // Only drain a little since we just stopped
            if(readCount < buffer.size) break;
        }

        audioRecord?.stop()
        audioRecord?.release()
        audioRecord = null

        val floats = FloatArray(allShorts.size)
        for (i in allShorts.indices) {
            floats[i] = allShorts[i] / 32768.0f
        }
        return@withContext floats
    }
}
