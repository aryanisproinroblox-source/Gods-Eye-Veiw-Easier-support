package com.koyal

import android.content.Context

class KoyalPrefs(context: Context) {
    private val prefs = context.getSharedPreferences("koyal_prefs", Context.MODE_PRIVATE)

    var onboardingDone: Boolean
        get() = prefs.getBoolean("onboarding_done", false)
        set(value) = prefs.edit().putBoolean("onboarding_done", value).apply()

    var selectedModel: String
        get() = prefs.getString("selected_model", "ggml-tiny.en.bin") ?: "ggml-tiny.en.bin"
        set(value) = prefs.edit().putString("selected_model", value).apply()

    var listeningEnabled: Boolean
        get() = prefs.getBoolean("listening_enabled", false)
        set(value) = prefs.edit().putBoolean("listening_enabled", value).apply()
}
