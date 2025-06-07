import { BlurView } from 'expo-blur';
import React from 'react';
import {
  Dimensions,
  Modal,
  ModalProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { t } from '../i18n';

interface AccessibleModalProps extends Omit<ModalProps, 'children'> {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeButtonLabel?: string;
  showCloseButton?: boolean;
  backdropOpacity?: number;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isVisible,
  onClose,
  title,
  children,
  closeButtonLabel = t('common.close'),
  showCloseButton = true,
  backdropOpacity = 0.5,
  ...modalProps
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      {...modalProps}
    >
      <View style={styles.overlay}>
        <BlurView 
          style={styles.blurView}
          intensity={50}
          tint="dark"
        >
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={onClose}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.closeModal')}
          />
        </BlurView>
        
        <View 
          style={styles.modalContainer}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLabel={title || t('accessibility.modalDialog')}
        >
          {title && (
            <View style={styles.header}>
              <Text 
                style={styles.title}
                accessible={true}
                accessibilityRole="header"
              >
                {title}
              </Text>
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={closeButtonLabel}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          <View style={styles.content}>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxWidth: width * 0.9,
    maxHeight: height * 0.8,
    minWidth: width * 0.7,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 16,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  content: {
    padding: 20,
  },
});
