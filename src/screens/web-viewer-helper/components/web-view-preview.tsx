/**
 * Web View Preview Component
 * 
 * Displays a WebView preview of the generated source
 */

import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from 'masterfabric-expo-core';
import { useWebViewPreview } from '../hooks/use-web-view-preview';
import { WebViewPreviewProps } from '../models/models';
import { webViewPreviewStyles } from '../styles/web-view-preview.styles';

export function WebViewPreview({ source }: WebViewPreviewProps) {
  const {
    webViewRef,
    loading,
    error,
    webViewHeight,
    colors,
    injectedJavaScript,
    handleMessage,
    handleLoadStart,
    handleLoadEnd,
    handleError,
    handleHttpError,
  } = useWebViewPreview(source);

  return (
    <View
      style={[
        webViewPreviewStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
          minHeight: 200, // Minimum height for error messages
        },
      ]}
    >
      {loading && !error && (
        <View style={[webViewPreviewStyles.loadingContainer, { backgroundColor: colors.surfaceBackground }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      {error && (
        <View style={[webViewPreviewStyles.errorContainer, { backgroundColor: colors.surfaceBackground }]}>
          <View
            style={[
              webViewPreviewStyles.errorBox,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.errorColor || colors.surfaceBorder,
              },
            ]}
          >
            <ThemedText style={{ color: colors.errorColor || colors.bodyText, fontSize: 16, textAlign: 'center' }}>
              {error}
            </ThemedText>
          </View>
        </View>
      )}
      {!error && (
        <WebView
          ref={webViewRef}
          source={source as any}
          style={[
            webViewPreviewStyles.webView,
            { 
              backgroundColor: colors.surfaceBackground,
              height: webViewHeight,
            },
          ]}
          injectedJavaScript={injectedJavaScript}
          onMessage={handleMessage}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onHttpError={handleHttpError}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          bounces={false}
          overScrollMode="never"
          setSupportMultipleWindows={false}
          allowsBackForwardNavigationGestures={false}
          allowsLinkPreview={false}
          cacheEnabled={true}
          cacheMode="LOAD_DEFAULT"
        />
      )}
    </View>
  );
}
