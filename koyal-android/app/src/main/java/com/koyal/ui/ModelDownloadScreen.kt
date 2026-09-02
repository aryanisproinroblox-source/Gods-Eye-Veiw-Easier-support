package com.koyal.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.koyal.ModelDownloadManager
import kotlinx.coroutines.launch
import androidx.compose.ui.platform.LocalContext

@Composable
fun ModelDownloadScreen(onComplete: () -> Unit) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var progress by remember { mutableStateOf(0) }
    var downloading by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Select a Model", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(32.dp))

        Card(
            onClick = {
                if(!downloading) {
                    downloading = true
                    scope.launch {
                        val manager = ModelDownloadManager(context)
                        // Mock URL for example
                        manager.downloadModel("https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.en.bin", "ggml-tiny.en.bin").collect { p ->
                            progress = p
                            if (p == 100) onComplete()
                        }
                    }
                }
            },
            modifier = Modifier.fillMaxWidth().padding(8.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Tiny (English)", style = MaterialTheme.typography.titleLarge)
                Text("~75MB. Fast, good for basic dictation.")
            }
        }

        if (downloading) {
            Spacer(modifier = Modifier.height(32.dp))
            LinearProgressIndicator(progress = progress / 100f, modifier = Modifier.fillMaxWidth())
            Text("Downloading... $progress%")
        }
    }
}
