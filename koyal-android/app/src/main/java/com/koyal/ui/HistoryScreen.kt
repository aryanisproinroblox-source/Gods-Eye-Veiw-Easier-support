package com.koyal.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.koyal.AppDatabase
import com.koyal.Transcription

@Composable
fun HistoryScreen() {
    val context = LocalContext.current
    val db = remember { AppDatabase.getDatabase(context) }
    val transcriptions by db.transcriptionDao().getAll().collectAsState(initial = emptyList())

    Column(modifier = Modifier.fillMaxSize()) {
        Text("History", style = MaterialTheme.typography.headlineMedium, modifier = Modifier.padding(16.dp))
        
        LazyColumn(modifier = Modifier.fillMaxSize()) {
            items(transcriptions) { t ->
                TranscriptionItem(t)
            }
        }
    }
}

@Composable
fun TranscriptionItem(t: Transcription) {
    Card(modifier = Modifier.fillMaxWidth().padding(8.dp)) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(t.text, style = MaterialTheme.typography.bodyLarge)
            Spacer(modifier = Modifier.height(4.dp))
            Text("Model: ${t.model} | Time: ${t.durationMs}ms", style = MaterialTheme.typography.labelSmall)
        }
    }
}
