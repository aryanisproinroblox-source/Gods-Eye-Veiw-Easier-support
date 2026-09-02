package com.koyal

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.FrameLayout
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File

class FloatingBubbleService : Service() {

    private lateinit var windowManager: WindowManager
    private lateinit var composeView: ComposeView
    private lateinit var params: WindowManager.LayoutParams
    
    private val whisperEngine = WhisperEngine()
    private val audioRecorder = AudioRecorder()
    private var isRecording = false

    override fun onCreate() {
        super.onCreate()
        startForegroundService()
        
        val prefs = KoyalPrefs(this)
        val modelFile = File(filesDir, prefs.selectedModel)
        if (modelFile.exists()) {
            whisperEngine.init(modelFile.absolutePath)
        }

        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        
        composeView = ComposeView(this).apply {
            setContent {
                Box(
                    modifier = Modifier
                        .size(60.dp)
                        .background(Color(0xFFC8FF00), CircleShape)
                        .clickable { onBubbleTap() },
                    contentAlignment = Alignment.Center
                ) {
                    Text("K", color = Color(0xFF09090B))
                }
            }
        }

        params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.TOP or Gravity.START
        params.x = 100
        params.y = 100

        setTouchListener()
        windowManager.addView(composeView, params)
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun setTouchListener() {
        var initialX = 0
        var initialY = 0
        var initialTouchX = 0f
        var initialTouchY = 0f

        composeView.setOnTouchListener { view, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = params.x
                    initialY = params.y
                    initialTouchX = event.rawX
                    initialTouchY = event.rawY
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    params.x = initialX + (event.rawX - initialTouchX).toInt()
                    params.y = initialY + (event.rawY - initialTouchY).toInt()
                    windowManager.updateViewLayout(composeView, params)
                    true
                }
                MotionEvent.ACTION_UP -> {
                    val diffX = Math.abs(event.rawX - initialTouchX)
                    val diffY = Math.abs(event.rawY - initialTouchY)
                    if (diffX < 10 && diffY < 10) {
                        view.performClick()
                    }
                    true
                }
                else -> false
            }
        }
    }

    private fun onBubbleTap() {
        if (!isRecording) {
            isRecording = true
            audioRecorder.startRecording()
        } else {
            isRecording = false
            CoroutineScope(Dispatchers.IO).launch {
                val audioData = audioRecorder.stopRecordingAndGetFloatArray()
                val start = System.currentTimeMillis()
                val text = whisperEngine.transcribeAudio(audioData)
                val duration = System.currentTimeMillis() - start
                
                if (text.isNotBlank()) {
                    withContext(Dispatchers.Main) {
                        KoyalAccessibilityService.instance?.injectText(text.trim())
                    }
                    val db = AppDatabase.getDatabase(this@FloatingBubbleService)
                    val prefs = KoyalPrefs(this@FloatingBubbleService)
                    db.transcriptionDao().insert(
                        Transcription(
                            text = text.trim(),
                            model = prefs.selectedModel,
                            durationMs = duration
                        )
                    )
                }
            }
        }
    }

    private fun startForegroundService() {
        val channelId = "KoyalServiceChannel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Koyal Bubble Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }

        val notification: Notification = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, channelId)
                .setContentTitle("Koyal Listening")
                .setContentText("Tap the bubble to speak")
                .setSmallIcon(android.R.drawable.ic_btn_speak_now)
                .build()
        } else {
            Notification.Builder(this)
                .setContentTitle("Koyal Listening")
                .setContentText("Tap the bubble to speak")
                .setSmallIcon(android.R.drawable.ic_btn_speak_now)
                .build()
        }

        startForeground(1, notification)
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::composeView.isInitialized) {
            windowManager.removeView(composeView)
        }
        whisperEngine.free()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
