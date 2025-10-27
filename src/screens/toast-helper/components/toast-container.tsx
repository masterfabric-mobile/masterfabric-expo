import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { toastService } from '../../../shared/services/toast-service';
import { ToastMessage } from '../models/toast-helper.models';
import { toastContainerStyles } from '../styles/toast-container.styles';
import { Toast } from './toast';

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    console.log('ToastContainer mounted, subscribing to toast service');
    const unsubscribe = toastService.subscribe((newToasts) => {
      console.log('ToastContainer received toasts:', newToasts);
      setToasts(newToasts);
    });
    return unsubscribe;
  }, []);

  const handleHideToast = (id: string) => {
    console.log('ToastContainer hiding toast:', id);
    toastService.dismiss(id);
  };

  if (toasts.length === 0) {
    return null;
  }

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  // iPhone için safe area hesaplaması
  const getSafeAreaTop = () => {
    if (Platform.OS === 'ios') {
      // iPhone X ve sonrası için notch alanı
      return screenHeight > 800 ? 50 : 20;
    }
    return 20;
  };

  const getSafeAreaBottom = () => {
    if (Platform.OS === 'ios') {
      // iPhone X ve sonrası için home indicator alanı
      return screenHeight > 800 ? 40 : 20;
    }
    return 20;
  };

  // Toast'ları pozisyonlarına göre grupla
  const groupedToasts = toasts.reduce<Record<string, ToastMessage[]>>(
    (acc, toast) => {
      const position = toast.position || 'top';
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(toast);
      return acc;
    },
    {}
  );

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => {
        let containerStyle;
        
        switch (position) {
          case 'top':
            containerStyle = {
              ...toastContainerStyles.container,
              top: getSafeAreaTop(),
            };
            break;
          case 'bottom':
            containerStyle = {
              ...toastContainerStyles.container,
              bottom: getSafeAreaBottom(),
            };
            break;
          case 'center':
            containerStyle = {
              ...toastContainerStyles.container,
              top: screenHeight / 2 - 100,
            };
            break;
          default:
            containerStyle = {
              ...toastContainerStyles.container,
              top: getSafeAreaTop(),
            };
        }

        return (
          <View key={position} style={containerStyle}>
            {positionToasts.map((toast) => (
              <Toast key={toast.id} toast={toast} onHide={() => handleHideToast(toast.id)} />
            ))}
          </View>
        );
      })}
    </>
  );
}
