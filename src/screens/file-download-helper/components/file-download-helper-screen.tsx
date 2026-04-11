import { Button } from '@/src/shared/components/button';
import { t } from '@/src/shared/i18n';
import {
    ScreenHeader,
    ThemedText,
    ThemedView,
    fileDownloadHelper,
} from 'masterfabric-expo-core';
import React from 'react';
import {
    ScrollView,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    BORDER_OPACITY_SUFFIX,
    DEFAULT_LABEL_FONT_SIZE,
} from '../constants/file-download-helper.constants';
import { useFileDownloadHelperViewModel } from '../hooks/use-file-download-helper-view-model';
import { fileDownloadHelperScreenStyles } from '../styles/file-download-helper-screen.styles';
import { formatSpeed, isCertificateError } from '../utils';

export function FileDownloadHelperScreen() {
  const {
    url,
    fileName,
    directory,
    storageType,
    customHeadersJson,
    authToken,
    enableResume,
    batchUrls,
    batchResults,
    setForm,
    downloadProgress,
    progressDetail,
    downloadState,
    downloadId,
    isDownloading,
    lastResultPath,
    lastResultExists,
    lastResultSize,
    lastError,
    colors,
    startDownload,
    startBatchDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    retryDownload,
    resetResult,
    deleteDownloadedFile,
    clearDownloadCache,
  } = useFileDownloadHelperViewModel();

  const statusLabelKey =
    downloadState === 'idle'
      ? 'helpers.fileDownloadHelper.statusIdle'
      : downloadState === 'pending'
        ? 'helpers.fileDownloadHelper.statusPending'
        : downloadState === 'downloading'
          ? 'helpers.fileDownloadHelper.statusDownloading'
          : downloadState === 'paused'
            ? 'helpers.fileDownloadHelper.statusPaused'
            : downloadState === 'completed'
              ? 'helpers.fileDownloadHelper.statusCompleted'
              : downloadState === 'failed'
                ? 'helpers.fileDownloadHelper.statusFailed'
                : 'helpers.fileDownloadHelper.statusCancelled';

  const controlLabel =
    downloadState === 'downloading'
      ? t('helpers.fileDownloadHelper.controlButtonPause')
      : downloadState === 'paused'
        ? t('helpers.fileDownloadHelper.controlButtonResume')
        : downloadState === 'failed' || downloadState === 'cancelled'
          ? t('helpers.fileDownloadHelper.controlButtonRetry')
          : t('helpers.fileDownloadHelper.controlButtonDownload');

  const onControlPress = () => {
    if (downloadState === 'downloading') pauseDownload();
    else if (downloadState === 'paused') resumeDownload();
    else if (downloadState === 'failed' || downloadState === 'cancelled')
      retryDownload();
    else startDownload();
  };

  return (
    <SafeAreaView
      style={[
        fileDownloadHelperScreenStyles.container,
        { backgroundColor: colors.background },
      ]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('helpers.fileDownloadHelper.title')}
        subtitle={t('helpers.fileDownloadHelper.description')}
      />
      <ScrollView
        style={fileDownloadHelperScreenStyles.scrollView}
        contentContainerStyle={fileDownloadHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText
          type="subtitle"
          style={
            [
              fileDownloadHelperScreenStyles.resultsTitle,
              { color: colors.sectionTitle },
            ] as any
          }
        >
          {t('helpers.fileDownloadHelper.download')}
        </ThemedText>
        <ThemedView
          style={
            [
              fileDownloadHelperScreenStyles.card,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.surfaceBorder,
              },
            ] as any
          }
        >
          <View
            style={
              [
                fileDownloadHelperScreenStyles.section,
                fileDownloadHelperScreenStyles.sectionGap,
              ] as any
            }
          >
            <ThemedText
              style={
                [
                  fileDownloadHelperScreenStyles.label,
                  { color: colors.labelText },
                ] as any
              }
            >
              {t('helpers.fileDownloadHelper.urlInput')}
            </ThemedText>
            <TextInput
              style={[
                fileDownloadHelperScreenStyles.input,
                {
                  color: colors.bodyText,
                  borderColor: colors.surfaceBorder,
                  backgroundColor: colors.inputBackground,
                },
              ]}
              placeholder={t('helpers.fileDownloadHelper.urlPlaceholder')}
              placeholderTextColor={
                colors.placeholderText ?? colors.tabIconDefault
              }
              value={url}
              onChangeText={text => setForm({ url: text })}
              editable={!isDownloading}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View
            style={
              [
                fileDownloadHelperScreenStyles.section,
                fileDownloadHelperScreenStyles.sectionGap,
              ] as any
            }
          >
            <ThemedText
              style={
                [
                  fileDownloadHelperScreenStyles.label,
                  { color: colors.labelText },
                ] as any
              }
            >
              {t('helpers.fileDownloadHelper.fileNameInput')}
            </ThemedText>
            <TextInput
              style={[
                fileDownloadHelperScreenStyles.input,
                {
                  color: colors.bodyText,
                  borderColor: colors.surfaceBorder,
                  backgroundColor: colors.inputBackground,
                },
              ]}
              placeholder={t('helpers.fileDownloadHelper.fileNamePlaceholder')}
              placeholderTextColor={
                colors.placeholderText ?? colors.tabIconDefault
              }
              value={fileName}
              onChangeText={text => setForm({ fileName: text })}
              editable={!isDownloading}
            />
          </View>
          <View
            style={
              [
                fileDownloadHelperScreenStyles.section,
                fileDownloadHelperScreenStyles.sectionGap,
              ] as any
            }
          >
            <ThemedText
              style={
                [
                  fileDownloadHelperScreenStyles.label,
                  { color: colors.labelText },
                ] as any
              }
            >
              {t('helpers.fileDownloadHelper.directoryInput')}
            </ThemedText>
            <TextInput
              style={[
                fileDownloadHelperScreenStyles.input,
                {
                  color: colors.bodyText,
                  borderColor: colors.surfaceBorder,
                  backgroundColor: colors.inputBackground,
                },
              ]}
              placeholder={t('helpers.fileDownloadHelper.directoryPlaceholder')}
              placeholderTextColor={
                colors.placeholderText ?? colors.tabIconDefault
              }
              value={directory}
              onChangeText={text => setForm({ directory: text })}
              editable={!isDownloading}
            />
            <ThemedText
              style={
                [
                  fileDownloadHelperScreenStyles.pathPreview,
                  { color: colors.bodyText },
                ] as any
              }
              numberOfLines={2}
            >
              {t('helpers.fileDownloadHelper.directoryHint')}
            </ThemedText>
          </View>
          <View
            style={
              [
                fileDownloadHelperScreenStyles.section,
                fileDownloadHelperScreenStyles.sectionGap,
              ] as any
            }
          >
            <ThemedText
              style={
                [
                  fileDownloadHelperScreenStyles.label,
                  { color: colors.labelText },
                ] as any
              }
            >
              {t('helpers.fileDownloadHelper.storageLocation')}
            </ThemedText>
            <View style={fileDownloadHelperScreenStyles.dropdownRow}>
              <TouchableOpacity
                style={[
                  fileDownloadHelperScreenStyles.buttonSecondary,
                  {
                    backgroundColor:
                      storageType === 'document'
                        ? colors.surfaceBorder
                        : colors.surfaceBackground,
                  },
                ]}
                onPress={() => setForm({ storageType: 'document' })}
                disabled={isDownloading}
              >
                <ThemedText
                  style={{
                    color: colors.bodyText,
                    fontSize: DEFAULT_LABEL_FONT_SIZE,
                  }}
                >
                  {t('helpers.fileDownloadHelper.storageTypeDocument')}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  fileDownloadHelperScreenStyles.buttonSecondary,
                  {
                    backgroundColor:
                      storageType === 'cache'
                        ? colors.surfaceBorder
                        : colors.surfaceBackground,
                  },
                ]}
                onPress={() => setForm({ storageType: 'cache' })}
                disabled={isDownloading}
              >
                <ThemedText
                  style={{
                    color: colors.bodyText,
                    fontSize: DEFAULT_LABEL_FONT_SIZE,
                  }}
                >
                  {t('helpers.fileDownloadHelper.storageTypeCache')}
                </ThemedText>
              </TouchableOpacity>
            </View>
            <ThemedText
              style={
                [
                  fileDownloadHelperScreenStyles.pathPreview,
                  { color: colors.bodyText },
                ] as any
              }
              numberOfLines={1}
            >
              {t('helpers.fileDownloadHelper.storageTypeHint')}
            </ThemedText>
          </View>
          <View
            style={
              [
                fileDownloadHelperScreenStyles.section,
                fileDownloadHelperScreenStyles.sectionGap,
              ] as any
            }
          >
            <ThemedText
              style={
                [
                  fileDownloadHelperScreenStyles.label,
                  { color: colors.labelText },
                ] as any
              }
            >
              {t('helpers.fileDownloadHelper.customHeaders')}
            </ThemedText>
            <TextInput
              style={[
                fileDownloadHelperScreenStyles.input,
                {
                  color: colors.bodyText,
                  borderColor: colors.surfaceBorder,
                  backgroundColor: colors.inputBackground,
                },
              ]}
              placeholder={t(
                'helpers.fileDownloadHelper.customHeadersPlaceholder'
              )}
              placeholderTextColor={
                colors.placeholderText ?? colors.tabIconDefault
              }
              value={customHeadersJson}
              onChangeText={text => setForm({ customHeadersJson: text })}
              editable={!isDownloading}
              autoCapitalize="none"
            />
          </View>
          <View
            style={
              [
                fileDownloadHelperScreenStyles.section,
                fileDownloadHelperScreenStyles.sectionGap,
              ] as any
            }
          >
            <ThemedText
              style={
                [
                  fileDownloadHelperScreenStyles.label,
                  { color: colors.labelText },
                ] as any
              }
            >
              {t('helpers.fileDownloadHelper.authToken')}
            </ThemedText>
            <TextInput
              style={[
                fileDownloadHelperScreenStyles.input,
                {
                  color: colors.bodyText,
                  borderColor: colors.surfaceBorder,
                  backgroundColor: colors.inputBackground,
                },
              ]}
              placeholder={t('helpers.fileDownloadHelper.authTokenPlaceholder')}
              placeholderTextColor={
                colors.placeholderText ?? colors.tabIconDefault
              }
              value={authToken}
              onChangeText={text => setForm({ authToken: text })}
              editable={!isDownloading}
              autoCapitalize="none"
              secureTextEntry
            />
          </View>
          <View
            style={[
              fileDownloadHelperScreenStyles.section,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            ]}
          >
            <ThemedText
              style={
                [
                  fileDownloadHelperScreenStyles.label,
                  { color: colors.labelText, flex: 1 },
                ] as any
              }
            >
              {t('helpers.fileDownloadHelper.enableResume')}
            </ThemedText>
            <Switch
              value={enableResume}
              onValueChange={value => setForm({ enableResume: value })}
              disabled={isDownloading}
              trackColor={{
                false: colors.background,
                true: colors.activeButton,
              }}
              thumbColor={
                enableResume ? colors.activeButton : colors.surfaceBorder
              }
            />
          </View>
          <View
            style={
              [
                fileDownloadHelperScreenStyles.runButtonWrap,
                {
                  backgroundColor: colors.activeButton,
                },
              ] as any
            }
          >
            <Button
              title={controlLabel}
              onPress={onControlPress}
              disabled={downloadState === 'pending'}
              variant="primary"
              size="large"
              style={
                {
                  width: '100%',
                  backgroundColor: colors.activeButton,
                } as any
              }
            />
          </View>
        </ThemedView>

        <ThemedText
          type="subtitle"
          style={
            [
              fileDownloadHelperScreenStyles.resultsTitle,
              { color: colors.sectionTitle },
            ] as any
          }
        >
          {t('helpers.fileDownloadHelper.batchSection')}
        </ThemedText>
        <ThemedView
          style={
            [
              fileDownloadHelperScreenStyles.card,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.surfaceBorder,
              },
            ] as any
          }
        >
          <ThemedText
            style={
              [
                fileDownloadHelperScreenStyles.label,
                { color: colors.labelText },
              ] as any
            }
          >
            {t('helpers.fileDownloadHelper.batchUrlsLabel')}
          </ThemedText>
          <TextInput
            style={[
              fileDownloadHelperScreenStyles.inputMultiline,
              {
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
                backgroundColor: colors.inputBackground,
              },
            ]}
            placeholder={t('helpers.fileDownloadHelper.batchUrlsPlaceholder')}
            placeholderTextColor={
              colors.placeholderText ?? colors.tabIconDefault
            }
            value={batchUrls}
            onChangeText={text => setForm({ batchUrls: text })}
            editable={!isDownloading}
            multiline
            numberOfLines={4}
            autoCapitalize="none"
          />
          <View
            style={
              [
                fileDownloadHelperScreenStyles.runButtonWrap,
                {
                  backgroundColor: colors.activeButton,
                },
              ] as any
            }
          >
            <Button
              title={t('helpers.fileDownloadHelper.batchDownload')}
              onPress={startBatchDownload}
              disabled={isDownloading}
              variant="primary"
              size="large"
              style={
                {
                  width: '100%',
                  backgroundColor: colors.activeButton,
                } as any
              }
            />
          </View>
        </ThemedView>
        {batchResults.length > 0 && (
          <ThemedView
            style={
              [
                fileDownloadHelperScreenStyles.resultSection,
                {
                  backgroundColor: colors.surfaceBackground,
                  borderColor: colors.surfaceBorder,
                },
              ] as any
            }
          >
            <ThemedText
              type="defaultSemiBold"
              style={
                [
                  fileDownloadHelperScreenStyles.resultLabel,
                  { color: colors.titleText },
                ] as any
              }
            >
              {t('helpers.fileDownloadHelper.result')} ({batchResults.length})
            </ThemedText>
            {batchResults.map((item, idx) => (
              <View key={idx} style={{ marginTop: 4 }}>
                <ThemedText
                  style={
                    [
                      fileDownloadHelperScreenStyles.progressStatLine,
                      { color: colors.bodyText },
                    ] as any
                  }
                  numberOfLines={1}
                >
                  {item.url}
                </ThemedText>
                {item.filePath ? (
                  <ThemedText
                    style={
                      [
                        fileDownloadHelperScreenStyles.resultText,
                        { color: colors.bodyText },
                      ] as any
                    }
                    numberOfLines={1}
                    selectable
                  >
                    → {item.filePath}
                  </ThemedText>
                ) : (
                  <ThemedText
                    style={
                      [
                        fileDownloadHelperScreenStyles.errorText,
                        { color: colors.errorColor },
                      ] as any
                    }
                  >
                    {item.error ?? '—'}
                  </ThemedText>
                )}
              </View>
            ))}
          </ThemedView>
        )}

        <ThemedText
          type="subtitle"
          style={
            [
              fileDownloadHelperScreenStyles.resultsTitle,
              { color: colors.sectionTitle },
            ] as any
          }
        >
          {t('helpers.fileDownloadHelper.statusLabel')}
        </ThemedText>
        <ThemedView
          style={
            [
              fileDownloadHelperScreenStyles.card,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.surfaceBorder,
              },
            ] as any
          }
        >
          <ThemedText
            style={
              [
                fileDownloadHelperScreenStyles.label,
                { color: colors.labelText },
              ] as any
            }
          >
            {t('helpers.fileDownloadHelper.statusLabel')}
          </ThemedText>
          <View
            style={
              [
                fileDownloadHelperScreenStyles.input,
                {
                  borderColor: colors.surfaceBorder,
                  backgroundColor: colors.inputBackground,
                  justifyContent: 'center',
                },
              ] as any
            }
          >
            <ThemedText
              style={
                [
                  fileDownloadHelperScreenStyles.statusText,
                  { color: colors.bodyText },
                ] as any
              }
            >
              {t(statusLabelKey)}
            </ThemedText>
          </View>
          {(isDownloading ||
            progressDetail ||
            downloadState === 'paused' ||
            downloadState === 'cancelled') && (
            <>
              <ThemedText
                style={
                  [
                    fileDownloadHelperScreenStyles.sectionOverline,
                    {
                      color: colors.sectionTitle,
                      marginTop: 8,
                      marginBottom: 4,
                    },
                  ] as any
                }
              >
                {t('helpers.fileDownloadHelper.progressSectionTitle')}
              </ThemedText>
              <View style={fileDownloadHelperScreenStyles.progressWrap as any}>
                <ThemedText
                  style={
                    [
                      fileDownloadHelperScreenStyles.statusText,
                      { color: colors.bodyText },
                    ] as any
                  }
                >
                  {t('helpers.fileDownloadHelper.progressPercent')}:{' '}
                  {Math.round(downloadProgress)}%
                </ThemedText>
                <View
                  style={
                    [
                      fileDownloadHelperScreenStyles.progressBar,
                      { backgroundColor: colors.surfaceBorder },
                    ] as any
                  }
                >
                  <View
                    style={[
                      fileDownloadHelperScreenStyles.progressFill,
                      {
                        width: `${downloadProgress}%`,
                        backgroundColor: colors.successColor,
                      },
                    ]}
                  />
                </View>
              </View>
              <View style={fileDownloadHelperScreenStyles.progressStats as any}>
                <ThemedText
                  style={
                    [
                      fileDownloadHelperScreenStyles.progressStatLine,
                      { color: colors.bodyText },
                    ] as any
                  }
                >
                  {t('helpers.fileDownloadHelper.progressBytes')}:{' '}
                  {progressDetail
                    ? `${fileDownloadHelper.formatFileSize(progressDetail.bytesWritten)} / ${
                        progressDetail.totalBytes > 0
                          ? fileDownloadHelper.formatFileSize(
                              progressDetail.totalBytes
                            )
                          : t('helpers.fileDownloadHelper.progressUnknown')
                      }`
                    : t('helpers.fileDownloadHelper.progressUnknown')}
                </ThemedText>
                <ThemedText
                  style={
                    [
                      fileDownloadHelperScreenStyles.progressStatLine,
                      { color: colors.bodyText },
                    ] as any
                  }
                >
                  {t('helpers.fileDownloadHelper.progressSpeed')}:{' '}
                  {progressDetail
                    ? formatSpeed(progressDetail.speed)
                    : t('helpers.fileDownloadHelper.progressUnknown')}
                </ThemedText>
                <ThemedText
                  style={
                    [
                      fileDownloadHelperScreenStyles.progressStatLine,
                      { color: colors.bodyText },
                    ] as any
                  }
                >
                  {t('helpers.fileDownloadHelper.progressEta')}:{' '}
                  {progressDetail &&
                  Number.isFinite(progressDetail.etaSeconds) &&
                  progressDetail.etaSeconds > 0
                    ? progressDetail.etaSeconds < 60
                      ? t('helpers.fileDownloadHelper.progressSeconds', {
                          count: Math.round(progressDetail.etaSeconds),
                        })
                      : t('helpers.fileDownloadHelper.progressMinutes', {
                          count: Math.round(progressDetail.etaSeconds / 60),
                        })
                    : t('helpers.fileDownloadHelper.progressUnknown')}
                </ThemedText>
                {downloadId && (
                  <ThemedText
                    style={
                      [
                        fileDownloadHelperScreenStyles.progressStatLine,
                        { color: colors.tabIconDefault },
                      ] as any
                    }
                    numberOfLines={1}
                    selectable
                  >
                    {t('helpers.fileDownloadHelper.resumableId')}: {downloadId}
                  </ThemedText>
                )}
              </View>
            </>
          )}
        </ThemedView>

        {(lastResultPath || lastError) && (
          <ThemedView
            style={
              [
                fileDownloadHelperScreenStyles.resultSection,
                {
                  backgroundColor: colors.surfaceBackground,
                  borderColor: colors.surfaceBorder,
                },
              ] as any
            }
          >
            <View style={fileDownloadHelperScreenStyles.resultRow}>
              <ThemedText
                type="defaultSemiBold"
                style={
                  [
                    fileDownloadHelperScreenStyles.resultLabel,
                    { color: colors.titleText },
                  ] as any
                }
              >
                {t('helpers.fileDownloadHelper.result')}
              </ThemedText>
              <TouchableOpacity
                onPress={resetResult}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <ThemedText
                  style={
                    [
                      fileDownloadHelperScreenStyles.clearLink,
                      { color: colors.tabIconDefault },
                    ] as any
                  }
                >
                  {t('helpers.fileDownloadHelper.clearResult')}
                </ThemedText>
              </TouchableOpacity>
            </View>
            {lastError && (
              <ThemedText
                style={
                  [
                    fileDownloadHelperScreenStyles.errorText,
                    { color: colors.errorColor },
                  ] as any
                }
                numberOfLines={5}
                selectable
              >
                {isCertificateError(lastError)
                  ? t('helpers.fileDownloadHelper.errorCertificate')
                  : lastError}
              </ThemedText>
            )}
            {lastResultPath && !lastError && (
              <>
                <ThemedText
                  style={
                    [
                      fileDownloadHelperScreenStyles.resultText,
                      { color: colors.bodyText },
                    ] as any
                  }
                  selectable
                  numberOfLines={2}
                >
                  {lastResultPath}
                </ThemedText>
                <View style={{ marginTop: 4 }}>
                  <ThemedText
                    style={
                      [
                        fileDownloadHelperScreenStyles.progressStatLine,
                        { color: colors.bodyText },
                      ] as any
                    }
                  >
                    {t('helpers.fileDownloadHelper.fileExists')}:{' '}
                    {lastResultExists === true
                      ? '✅'
                      : lastResultExists === false
                        ? '❌'
                        : '—'}
                  </ThemedText>
                  <ThemedText
                    style={
                      [
                        fileDownloadHelperScreenStyles.progressStatLine,
                        { color: colors.bodyText },
                      ] as any
                    }
                  >
                    {t('helpers.fileDownloadHelper.fileSize')}:{' '}
                    {lastResultSize != null
                      ? fileDownloadHelper.formatFileSize(lastResultSize)
                      : '—'}
                  </ThemedText>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
                  <TouchableOpacity
                    style={[
                      fileDownloadHelperScreenStyles.buttonSecondary,
                      { borderColor: colors.errorColor },
                    ]}
                    onPress={deleteDownloadedFile}
                  >
                    <ThemedText
                      style={{
                        color: colors.errorColor,
                        fontSize: DEFAULT_LABEL_FONT_SIZE,
                      }}
                    >
                      {t('helpers.fileDownloadHelper.deleteFile')}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ThemedView>
        )}

        <View style={fileDownloadHelperScreenStyles.clearCacheSection as any}>
          <Button
            title={t('helpers.fileDownloadHelper.clearCache')}
            onPress={clearDownloadCache}
            variant="primary"
            size="large"
            style={{ width: '100%' } as any}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
