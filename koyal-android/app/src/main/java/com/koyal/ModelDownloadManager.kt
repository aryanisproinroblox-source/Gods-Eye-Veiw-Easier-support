package com.koyal

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.io.FileOutputStream

class ModelDownloadManager(private val context: Context) {
    private val client = OkHttpClient()

    fun downloadModel(url: String, fileName: String): Flow<Int> = flow {
        val request = Request.Builder().url(url).build()
        val response = client.newCall(request).execute()
        
        if (!response.isSuccessful) throw Exception("Failed to download file: ${response.code}")

        val body = response.body ?: throw Exception("Empty body")
        val contentLength = body.contentLength()
        val inputStream = body.byteStream()
        
        val file = File(context.filesDir, fileName)
        val outputStream = FileOutputStream(file)

        var totalBytesRead = 0L
        var lastProgress = 0
        val buffer = ByteArray(8 * 1024)
        var bytesRead: Int

        outputStream.use { output ->
            while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                output.write(buffer, 0, bytesRead)
                totalBytesRead += bytesRead
                val progress = ((totalBytesRead * 100) / contentLength).toInt()
                if (progress != lastProgress) {
                    emit(progress)
                    lastProgress = progress
                }
            }
        }
        emit(100)
    }.flowOn(Dispatchers.IO)
}
