import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View } from 'react-native';
import { defaultMasterViewConfig } from '../constants/MasterViewConfig';
import { ThemeColors } from '../types';
import {
  IMasterView,
  MasterViewConfig,
  MasterViewError,
  MasterViewEvent,
  MasterViewEventHandler,
  MasterViewProps,
  MasterViewState
} from '../types/MasterView';

// MasterView Abstract Base Class
export abstract class MasterView extends Component<MasterViewProps, MasterViewState> implements IMasterView {
  public readonly id: string;
  public readonly name: string;
  public readonly version: string;
  
  protected config: MasterViewConfig;
  protected eventHandlers: Set<MasterViewEventHandler> = new Set();
  protected isInitialized: boolean = false;
  protected isDestroyed: boolean = false;

  constructor(props: MasterViewProps, config?: Partial<MasterViewConfig>) {
    super(props);
    
    this.id = props.id;
    this.name = props.name;
    this.version = '1.0.0'; // Default version, can be overridden
    
    this.config = { ...defaultMasterViewConfig, ...config };
    
    this.state = {
      isInitialized: false,
      isDestroyed: false,
      isLoading: false,
      error: null,
      errorCount: 0,
      retryCount: 0,
    };
  }

  // Abstract methods that must be implemented by subclasses
  abstract renderContent(): React.ReactNode;
  abstract getDefaultState(): any;
  
  // Core Implementation
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.setState({ isLoading: true, error: null });
      
      // Validate props before initialization
      if (!this.validateProps()) {
        throw this.createError('VALIDATION_ERROR', 'Invalid props provided to MasterView');
      }

      // Initialize the view
      await this.onInitialize();
      
      this.isInitialized = true;
      this.setState({ 
        isInitialized: true, 
        isLoading: false,
        error: null 
      });
      
      this.emitEvent('INITIALIZED');
      
      // Call onMount if provided
      if (this.props.onMount) {
        this.props.onMount();
      }
      
    } catch (error) {
      this.handleError(error);
    }
  }

  destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    try {
      this.onDestroy();
      
      this.isDestroyed = true;
      this.setState({ isDestroyed: true });
      
      this.emitEvent('DESTROYED');
      
      // Call onUnmount if provided
      if (this.props.onUnmount) {
        this.props.onUnmount();
      }
      
    } catch (error) {
      console.error(`Error destroying MasterView ${this.name}:`, error);
    }
  }

  // State Management
  getState(): MasterViewState {
    return this.state;
  }

  setLoading(loading: boolean): void {
    this.setState({ isLoading: loading });
  }

  setError(error: string | null): void {
    this.setState({ 
      error, 
      errorCount: error ? this.state.errorCount + 1 : this.state.errorCount 
    });
  }

  // Theme Management (to be implemented by theme provider)
  getThemeColors(): ThemeColors {
    // This will be implemented by the theme context
    return {} as ThemeColors;
  }

  isDarkMode(): boolean {
    // This will be implemented by the theme context
    return false;
  }

  // Activity Tracking
  trackActivity(action: string, details?: any): void {
    if (!this.config.enableActivityTracking) {
      return;
    }

    try {
      const activity = {
        id: Date.now().toString(),
        action,
        details,
        timestamp: new Date().toISOString(),
        viewId: this.id,
        viewName: this.name,
      };

      this.onActivityTracked(activity);
      this.setState({ lastActivity: action });
      
      this.emitEvent('ACTIVITY_TRACKED', activity);
      
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }

  // Validation
  validateProps(): boolean {
    return !!(this.props.id && this.props.name);
  }

  // Event Management
  addEventListener(handler: MasterViewEventHandler): void {
    this.eventHandlers.add(handler);
  }

  removeEventListener(handler: MasterViewEventHandler): void {
    this.eventHandlers.delete(handler);
  }

  protected emitEvent(type: MasterViewEvent['type'], data?: any): void {
    const event: MasterViewEvent = {
      type,
      viewId: this.id,
      viewName: this.name,
      timestamp: new Date().toISOString(),
      data,
    };

    this.eventHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in event handler:', error);
      }
    });
  }

  // Error Handling
  protected handleError(error: any): void {
    const masterViewError = this.createError('RUNTIME_ERROR', error.message || 'Unknown error', error);
    
    this.setError(masterViewError.message);
    this.emitEvent('ERROR', masterViewError);
    
    if (this.props.onError) {
      this.props.onError(masterViewError);
    }
  }

  protected createError(
    code: MasterViewError['code'], 
    message: string, 
    originalError?: any
  ): MasterViewError {
    const error = new Error(message) as MasterViewError;
    error.code = code;
    error.viewId = this.id;
    error.viewName = this.name;
    error.timestamp = new Date().toISOString();
    error.context = originalError;
    return error;
  }

  // Lifecycle Hooks (to be overridden by subclasses)
  protected async onInitialize(): Promise<void> {
    // Override in subclasses
  }

  protected onDestroy(): void {
    // Override in subclasses
  }

  protected onActivityTracked(activity: any): void {
    // Override in subclasses
  }

  // React Lifecycle
  async componentDidMount(): Promise<void> {
    await this.initialize();
  }

  componentWillUnmount(): void {
    this.destroy();
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (!this.config.enableErrorBoundary) {
      return;
    }

    const masterViewError = this.createError('RUNTIME_ERROR', error.message, { error, errorInfo });
    this.handleError(masterViewError);
  }

  // Render
  render(): ReactNode {
    if (!this.isInitialized && !this.state.isLoading) {
      return null;
    }

    const { style, children } = this.props;
    const { isLoading, error } = this.state;

    return (
      <View style={style}>
        {isLoading && this.renderLoading()}
        {error && this.renderError()}
        {!isLoading && !error && (
          <>
            {this.renderContent()}
            {children}
          </>
        )}
      </View>
    );
  }

  protected renderLoading(): ReactNode {
    // Override in subclasses for custom loading UI
    return null;
  }

  protected renderError(): ReactNode {
    // Override in subclasses for custom error UI
    return null;
  }
}
