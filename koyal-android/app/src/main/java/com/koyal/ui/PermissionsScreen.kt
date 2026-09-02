package com.koyal.ui

import android.content.Intent
import android.net.Uri
import android.provider.Settings
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp

@Composable
fun PermissionsScreen(onNext: () -> Unit) {
    val context = LocalContext.current
    
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Permissions Needed", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(32.dp))
        
        Text("1. Display over other apps (for the bubble)")
        Button(onClick = {
            if (!Settings.canDrawOverlays(context)) {
                val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${context.packageName}"))
                context.startActivity(intent)
            }
        }, modifier = Modifier.padding(vertical = 8.dp)) {
            Text("Grant Overlay Permission")
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text("2. Accessibility Service (to inject text)")
        Button(onClick = {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            context.startActivity(intent)
        }, modifier = Modifier.padding(vertical = 8.dp)) {
            Text("Enable Accessibility")
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        Button(onClick = onNext) {
            Text("Continue")
        }
    }
}
