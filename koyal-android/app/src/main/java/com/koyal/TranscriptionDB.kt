package com.koyal

import android.content.Context
import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "transcriptions")
data class Transcription(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val text: String,
    val model: String,
    val durationMs: Long,
    val createdAt: Long = System.currentTimeMillis()
)

@Dao
interface TranscriptionDao {
    @Query("SELECT * FROM transcriptions ORDER BY createdAt DESC")
    fun getAll(): Flow<List<Transcription>>

    @Insert
    suspend fun insert(transcription: Transcription)

    @Delete
    suspend fun delete(transcription: Transcription)
}

@Database(entities = [Transcription::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun transcriptionDao(): TranscriptionDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "koyal_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
