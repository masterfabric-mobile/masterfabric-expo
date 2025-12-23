import { Button, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../ScreenHeader';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/Colors';
import { useVideoPlayerHelper } from '../../hooks/useVideoPlayerHelper';
import { VideoDisplayCard } from '../video-player-haptic-helper/VideoDisplayCard';
import { VideoPlayerCard } from '../video-player-haptic-helper/VideoPlayerCard';
import { VideoPlayerStatusCard } from '../video-player-haptic-helper/VideoPlayerStatusCard';

export function VideoPlayerHelperView() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const {
    videoState,
    isLoading,
    error,
    handleRefresh,
    playVideo,
    pauseVideo,
    stopVideo,
    seekVideo,
    setVolume,
    setPlaybackRate,
    handlePlaybackStatusUpdate,
  } = useVideoPlayerHelper();

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title="Video Player Helper"
        subtitle="Test video playback controls and functionality"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={colors.tint}
          />
        }
      >
        {error && (
          <ThemedView
            style={[
              {
                padding: 16,
                marginBottom: 16,
                borderRadius: 12,
                backgroundColor: colors.errorColor + '20',
                borderWidth: 1,
                borderColor: colors.errorColor + '40',
              },
            ]}
          >
            <ThemedText
              style={[
                {
                  color: colors.errorColor,
                  marginBottom: 12,
                  fontSize: 14,
                  lineHeight: 20,
                },
              ]}
            >
              {error}
            </ThemedText>
            <Button
              title="Retry"
              onPress={handleRefresh}
              color={colors.tint}
            />
          </ThemedView>
        )}

        {/* Video Player Display */}
        <View style={{ marginBottom: 16 }}>
          <VideoDisplayCard
            isPlaying={videoState.isPlaying}
            volume={videoState.volume}
            playbackRate={videoState.playbackRate}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            onPlay={playVideo}
            onPause={pauseVideo}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <VideoPlayerStatusCard
            isPlaying={videoState.isPlaying}
            position={videoState.position}
            duration={videoState.duration}
            volume={videoState.volume}
            playbackRate={videoState.playbackRate}
            isLoading={videoState.isLoading}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <VideoPlayerCard
            isPlaying={videoState.isPlaying}
            isLoading={videoState.isLoading}
            onPlay={playVideo}
            onPause={pauseVideo}
            onStop={stopVideo}
            onSeek={seekVideo}
            onVolumeChange={setVolume}
            onPlaybackRateChange={setPlaybackRate}
            currentVolume={videoState.volume}
            currentPlaybackRate={videoState.playbackRate}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

