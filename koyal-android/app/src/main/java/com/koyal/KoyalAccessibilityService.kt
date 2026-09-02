package com.koyal

import android.accessibilityservice.AccessibilityService
import android.os.Bundle
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class KoyalAccessibilityService : AccessibilityService() {

    companion object {
        var instance: KoyalAccessibilityService? = null
    }

    private var currentFocusedNode: AccessibilityNodeInfo? = null

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        if (event.eventType == AccessibilityEvent.TYPE_VIEW_FOCUSED) {
            val node = event.source
            if (node != null && node.isEditable) {
                currentFocusedNode = node
            }
        }
    }

    override fun onInterrupt() {}

    override fun onUnbind(intent: android.content.Intent?): Boolean {
        instance = null
        return super.onUnbind(intent)
    }

    fun injectText(text: String) {
        val node = currentFocusedNode ?: return
        if (node.isEditable) {
            val arguments = Bundle()
            val currentText = node.text?.toString() ?: ""
            val newText = if (currentText.isEmpty()) text else "$currentText $text"
            arguments.putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, newText)
            node.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, arguments)
        }
    }
}
