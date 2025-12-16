import { NativeModules, Platform } from 'react-native';

interface AppIconChangerModule {
  supportsAlternateIcons(): Promise<boolean>;
  getAlternateIconName(): Promise<string | null>;
  setAlternateIconName(iconName: string | null): Promise<void>;
}

const { AppIconChanger } = NativeModules;

class AppIconHelper {
  private static instance: AppIconHelper;
  private module: AppIconChangerModule | null = null;

  private constructor() {
    if (Platform.OS === 'ios' && AppIconChanger) {
      this.module = AppIconChanger as AppIconChangerModule;
    }
  }

  static getInstance(): AppIconHelper {
    if (!AppIconHelper.instance) {
      AppIconHelper.instance = new AppIconHelper();
    }
    return AppIconHelper.instance;
  }

  /**
   * Check if the device supports alternate app icons
   * @returns Promise that resolves to true if supported, false otherwise
   */
  async supportsAlternateIcons(): Promise<boolean> {
    if (Platform.OS !== 'ios' || !this.module) {
      return false;
    }

    try {
      return await this.module.supportsAlternateIcons();
    } catch (error) {
      console.warn('Error checking alternate icon support:', error);
      return false;
    }
  }

  /**
   * Get the currently active alternate icon name
   * @returns Promise that resolves to the icon name, or null if using primary icon
   */
  async getAlternateIconName(): Promise<string | null> {
    if (Platform.OS !== 'ios' || !this.module) {
      return null;
    }

    try {
      return await this.module.getAlternateIconName();
    } catch (error) {
      console.warn('Error getting alternate icon name:', error);
      return null;
    }
  }

  /**
   * Change the app icon to an alternate icon
   * @param iconName - The name of the alternate icon to set, or null to use primary icon
   * @returns Promise that resolves when the icon change is complete
   * @throws Error if the icon change fails
   */
  async setAlternateIconName(iconName: string | null): Promise<void> {
    if (Platform.OS !== 'ios') {
      throw new Error('Alternate app icons are only supported on iOS');
    }

    if (!this.module) {
      throw new Error('AppIconChanger module is not available');
    }

    const supported = await this.supportsAlternateIcons();
    if (!supported) {
      throw new Error('Alternate icons are not supported on this device');
    }

    try {
      await this.module.setAlternateIconName(iconName);
    } catch (error: any) {
      throw new Error(
        error?.message || `Failed to change app icon: ${iconName || 'primary'}`
      );
    }
  }

  /**
   * Change to a specific alternate icon by name
   * @param iconName - The name of the alternate icon (e.g., 'AppIcon1', 'AppIcon2')
   * @returns Promise that resolves when the icon change is complete
   */
  async changeToIcon(iconName: string): Promise<void> {
    return this.setAlternateIconName(iconName);
  }

  /**
   * Reset to the primary app icon
   * @returns Promise that resolves when the icon change is complete
   */
  async resetToPrimaryIcon(): Promise<void> {
    return this.setAlternateIconName(null);
  }

  /**
   * Check if currently using an alternate icon
   * @returns Promise that resolves to true if using alternate icon, false if using primary
   */
  async isUsingAlternateIcon(): Promise<boolean> {
    const iconName = await this.getAlternateIconName();
    return iconName !== null;
  }
}

export const appIconHelper = AppIconHelper.getInstance();

