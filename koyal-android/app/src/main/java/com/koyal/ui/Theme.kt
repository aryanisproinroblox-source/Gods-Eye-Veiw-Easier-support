package com.koyal.ui

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val BgDark = Color(0xFF09090B)
val SurfaceDark = Color(0xFF111113)
val Accent = Color(0xFFC8FF00)
val TextLight = Color(0xFFF4F4F5)

private val DarkColorScheme = darkColorScheme(
    primary = Accent,
    background = BgDark,
    surface = SurfaceDark,
    onPrimary = BgDark,
    onBackground = TextLight,
    onSurface = TextLight
)

@Composable
fun Theme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
