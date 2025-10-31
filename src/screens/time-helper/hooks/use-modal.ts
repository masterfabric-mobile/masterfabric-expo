import { useState } from 'react';

interface UseModalReturn {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
}

/**
 * Custom hook for modal visibility state management
 * Provides simple modal open/close functionality
 */
export function useModal(initialVisible: boolean = false): UseModalReturn {
  const [modalVisible, setModalVisible] = useState(initialVisible);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return {
    modalVisible,
    setModalVisible,
    openModal,
    closeModal,
  };
}

