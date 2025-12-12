import { ConfirmationDialog, ThemedText } from '@/src/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { useStorageCaseViewModel } from '../hooks/use-storage-case-view-model';
import { storageCaseStyles } from '../styles/storage-case.styles';
import { supabaseCasesScreenStyles } from '../styles/supabase-cases-screen.styles';

const supabaseGreen = '#3ECF8E';
const storageColor = '#3B82F6';

interface StorageCaseViewProps {
  user: any | null;
  isConnected: boolean;
  onBack: () => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('pdf')) return 'document-text';
  if (mimeType.includes('text')) return 'document';
  return 'document-outline';
};

const getPublicUrl = (fileName: string): string => {
  // This would typically come from Supabase Storage public URL
  // For now, we'll construct it (you may need to adjust based on your Supabase setup)
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  return `${supabaseUrl}/storage/v1/object/public/case-files/${fileName}`;
};

export function StorageCaseView({
  user,
  isConnected,
  onBack,
}: StorageCaseViewProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { state, actions } = useStorageCaseViewModel(isConnected);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (isConnected && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      actions.listFiles();
    } else if (!isConnected) {
      hasLoadedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const handlePickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your photos to upload files.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileName = `image_${Date.now()}.${asset.uri.split('.').pop()}`;
        await actions.uploadFile(asset.uri, fileName, asset.type || 'image/jpeg');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to pick image');
    }
  };

  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = (fileName: string) => {
    setFileToDelete(fileName);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      actions.deleteFile(fileToDelete);
      setFileToDelete(null);
    }
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setFileToDelete(null);
    setShowDeleteDialog(false);
  };

  if (!isConnected) {
    return (
      <ScrollView
        style={supabaseCasesScreenStyles.scrollView}
        contentContainerStyle={supabaseCasesScreenStyles.scrollContent}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={onBack} style={{ marginRight: 12, padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.bodyText} />
          </TouchableOpacity>
          <ThemedText
            type="subtitle"
            style={{ fontSize: 20, fontWeight: '700', color: colors.sectionTitle }}
          >
            Storage
          </ThemedText>
        </View>
        <View
          style={[
            supabaseCasesScreenStyles.card,
            {
              borderColor: colors.surfaceBorder,
              backgroundColor: colors.surfaceBackground,
            },
          ]}
        >
          <ThemedText style={{ color: colors.bodyText }}>
            Supabase is not connected. Please connect to Supabase to use storage.
          </ThemedText>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
        }}
      >
        <TouchableOpacity onPress={onBack} style={{ marginRight: 12, padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={colors.bodyText} />
        </TouchableOpacity>
        <ThemedText
          type="subtitle"
          style={{ fontSize: 20, fontWeight: '700', color: colors.sectionTitle }}
        >
          Storage
        </ThemedText>
      </View>

      <ScrollView
        style={supabaseCasesScreenStyles.scrollView}
        contentContainerStyle={storageCaseStyles.scrollContent}
      >
        {/* Upload Button */}
        <TouchableOpacity
          onPress={handlePickImage}
          disabled={state.isUploading}
          style={[
            storageCaseStyles.uploadButton,
            {
              backgroundColor: state.isUploading ? colors.surfaceBorder : storageColor,
            },
          ]}
        >
          {state.isUploading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <ThemedText style={[storageCaseStyles.uploadButtonText, { color: '#FFFFFF' }]}>
                Uploading...
              </ThemedText>
            </>
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
              <ThemedText style={[storageCaseStyles.uploadButtonText, { color: '#FFFFFF' }]}>
                Upload Image
              </ThemedText>
            </>
          )}
        </TouchableOpacity>

        {/* Upload Progress */}
        {state.isUploading && state.uploadProgress > 0 && (
          <View
            style={[
              storageCaseStyles.progressBar,
              {
                backgroundColor: colors.surfaceBorder,
              },
            ]}
          >
            <View
              style={[
                storageCaseStyles.progressBar,
                {
                  backgroundColor: storageColor,
                  width: `${state.uploadProgress}%`,
                },
              ]}
            />
          </View>
        )}

        {/* Files List */}
        {state.isLoading && state.files.length === 0 ? (
          <View style={storageCaseStyles.emptyState}>
            <ActivityIndicator size="large" color={storageColor} />
            <ThemedText
              style={{
                color: colors.actionDescription,
                marginTop: 16,
              }}
            >
              Loading files...
            </ThemedText>
          </View>
        ) : state.files.length === 0 ? (
          <View style={storageCaseStyles.emptyState}>
            <Ionicons name="cloud-outline" size={64} color={colors.actionDescription} />
            <ThemedText
              style={{
                color: colors.actionDescription,
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              No files uploaded yet. Upload your first file!
            </ThemedText>
          </View>
        ) : (
          state.files.map((file) => {
            const isImage = file.metadata.mimetype.startsWith('image/');
            const publicUrl = getPublicUrl(file.name);
            const iconName = getFileIcon(file.metadata.mimetype);

            return (
              <View
                key={file.id}
                style={[
                  storageCaseStyles.fileCard,
                  {
                    backgroundColor: colors.surfaceBackground,
                    borderColor: storageColor + '30',
                  },
                ]}
              >
                {isImage ? (
                  <Image
                    source={{ uri: publicUrl }}
                    style={[
                      storageCaseStyles.fileIcon,
                      {
                        backgroundColor: colors.inputBackground || colors.surfaceBackground,
                      },
                    ]}
                    contentFit="cover"
                  />
                ) : (
                  <View
                    style={[
                      storageCaseStyles.fileIcon,
                      {
                        backgroundColor: storageColor + '15',
                      },
                    ]}
                  >
                    <Ionicons name={iconName as any} size={24} color={storageColor} />
                  </View>
                )}
                <View style={storageCaseStyles.fileInfo}>
                  <ThemedText
                    style={[storageCaseStyles.fileName, { color: colors.bodyText }]}
                    numberOfLines={1}
                  >
                    {file.name}
                  </ThemedText>
                  <ThemedText
                    style={[storageCaseStyles.fileMeta, { color: colors.actionDescription }]}
                  >
                    {formatFileSize(file.metadata.size)} • {file.metadata.mimetype}
                  </ThemedText>
                </View>
                <View style={storageCaseStyles.fileActions}>
                  <TouchableOpacity
                    onPress={() => handleDelete(file.name)}
                    style={[
                      storageCaseStyles.actionButton,
                      {
                        backgroundColor: '#ef444415',
                      },
                    ]}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        {/* Error Display */}
        {state.error && (
          <View
            style={[
              supabaseCasesScreenStyles.card,
              {
                borderColor: '#ef4444',
                backgroundColor: '#ef444410',
              },
            ]}
          >
            <Ionicons name="alert-circle" size={24} color="#ef4444" />
            <ThemedText
              style={{
                color: '#ef4444',
                fontWeight: '600',
                marginTop: 8,
              }}
            >
              Error
            </ThemedText>
            <ThemedText
              style={{
                color: '#ef4444',
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {state.error}
            </ThemedText>
          </View>
        )}
      </ScrollView>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        visible={showDeleteDialog}
        title="Delete File"
        message={fileToDelete ? `Are you sure you want to delete ${fileToDelete}?` : ''}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </View>
  );
}

