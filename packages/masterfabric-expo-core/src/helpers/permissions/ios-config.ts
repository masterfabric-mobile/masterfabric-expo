/**
 * iOS Info.plist permission configuration.
 * Covers all permissions shown in the permissions helper screen where applicable on iOS.
 * Helper screen: camera, microphone, photoLibrary, location, locationBackground, notifications,
 * calendar, contacts, phone, storage, biometrics, sms, bluetooth.
 * (phone, sms, storage runtime are Android-only; notifications use system prompt – no key.)
 */

import type { IOSInfoPlistEntry, PermissionType } from './types';

export function getIOSInfoPlistEntries(permissions: PermissionType[]): IOSInfoPlistEntry[] {
  const entries: IOSInfoPlistEntry[] = [];
  const add = (key: string, value: string, description: string) => {
    if (!entries.some((e) => e.key === key)) entries.push({ key, value, description });
  };

  // Camera (helper)
  if (permissions.includes('camera')) {
    add('NSCameraUsageDescription', 'We need camera access to take photos and videos', 'Camera');
  }
  // Microphone (helper)
  if (permissions.includes('microphone')) {
    add('NSMicrophoneUsageDescription', 'We need microphone access to record audio', 'Microphone');
  }
  // Photo Library / Gallery (helper)
  if (permissions.includes('photoLibrary') || permissions.includes('mediaLibrary')) {
    add('NSPhotoLibraryUsageDescription', 'We need photo library access to save and select images', 'Photo Library');
    add('NSPhotoLibraryAddUsageDescription', 'We need permission to save photos to your library', 'Photo Library Add');
  }
  // Music Library (iOS)
  if (permissions.includes('musicLibrary')) {
    add('NSAppleMusicUsageDescription', 'We need music library access to play your music', 'Music Library');
  }
  // Location (helper) + Location background (helper)
  if (
    permissions.includes('location') ||
    permissions.includes('locationWhenInUse') ||
    permissions.includes('locationAlways') ||
    permissions.includes('locationBackground')
  ) {
    add('NSLocationWhenInUseUsageDescription', 'We need your location to show nearby places', 'Location When In Use');
    add('NSLocationAlwaysAndWhenInUseUsageDescription', 'We need your location to track your route', 'Location Always');
    add('NSLocationAlwaysUsageDescription', 'We need background location to track your route', 'Location Background');
  }
  // Notifications (helper): no Info.plist key; system prompt used at runtime.
  // Contacts (helper)
  if (permissions.includes('contacts')) {
    add('NSContactsUsageDescription', 'We need contacts access to help you share content', 'Contacts');
  }
  // Calendar (helper)
  if (permissions.includes('calendar')) {
    add('NSCalendarsUsageDescription', 'We need calendar access to schedule events', 'Calendar');
  }
  // Reminders
  if (permissions.includes('reminders')) {
    add('NSRemindersUsageDescription', 'We need reminders access to create reminders', 'Reminders');
  }
  // Motion & Fitness
  if (permissions.includes('motionFitness')) {
    add('NSMotionUsageDescription', 'We need motion access to track your activity', 'Motion & Fitness');
  }
  // Health
  if (permissions.includes('health')) {
    add('NSHealthShareUsageDescription', 'We need health data access to track your fitness', 'Health Share');
    add('NSHealthUpdateUsageDescription', 'We need health data access to update your fitness data', 'Health Update');
  }
  // Speech Recognition
  if (permissions.includes('speechRecognition')) {
    add('NSSpeechRecognitionUsageDescription', 'We need speech recognition to convert speech to text', 'Speech Recognition');
  }
  // Siri
  if (permissions.includes('siri')) {
    add('NSSiriUsageDescription', 'We need Siri access to provide voice commands', 'Siri');
  }
  // Face ID / Biometrics (helper)
  if (permissions.includes('faceId') || permissions.includes('touchId') || permissions.includes('biometrics')) {
    add('NSFaceIDUsageDescription', 'We need Face ID to authenticate securely', 'Face ID');
  }
  // Tracking (iOS 14.5+)
  if (permissions.includes('tracking')) {
    add('NSUserTrackingUsageDescription', 'We use tracking to provide personalized content', 'Tracking');
  }
  // Nearby Interactions (iOS 16+)
  if (permissions.includes('nearbyInteractions')) {
    add('NSNearbyInteractionUsageDescription', 'We need nearby interaction access for proximity features', 'Nearby Interactions');
  }
  // Bluetooth (helper): required when using Core Bluetooth (iOS 13+).
  if (
    permissions.includes('bluetooth') ||
    permissions.includes('bluetoothScan') ||
    permissions.includes('bluetoothConnect') ||
    permissions.includes('bluetoothAdvertise')
  ) {
    add('NSBluetoothAlwaysUsageDescription', 'We need Bluetooth to connect to nearby devices', 'Bluetooth');
  }

  return entries;
}
