/**
 * Web View Preview Component
 * 
 * Displays a WebView preview of the generated source
 */

import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
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
  } = useWebViewPreview(source);

  return (
    <View
      style={[
        webViewPreviewStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      {loading && (
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
            {/* Error message would go here if needed */}
          </View>
        </View>
      )}
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
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
      />
    </View>
  );
}
