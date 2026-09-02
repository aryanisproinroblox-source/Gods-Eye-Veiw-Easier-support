package com.koyal.ui

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun OnboardingScreen(onFinish: () -> Unit) {
    val pagerState = rememberPagerState(pageCount = { 3 })

    Column(modifier = Modifier.fillMaxSize()) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.weight(1f)
        ) { page ->
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(
                    text = when (page) {
                        0 -> "Welcome to Koyal.\nVoice typing everywhere."
                        1 -> "Completely on-device.\nFast & private."
                        2 -> "Just tap the bubble to speak."
                        else -> ""
                    },
                    fontSize = 24.sp,
                    textAlign = TextAlign.Center,
                    color = TextLight,
                    modifier = Modifier.padding(32.dp)
                )
            }
        }
        
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row {
                repeat(3) { index ->
                    Box(
                        modifier = Modifier
                            .padding(2.dp)
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(if (pagerState.currentPage == index) Accent else Color.Gray)
                    )
                }
            }
            
            if (pagerState.currentPage == 2) {
                Button(onClick = onFinish) {
                    Text("Get Started")
                }
            }
        }
    }
}
