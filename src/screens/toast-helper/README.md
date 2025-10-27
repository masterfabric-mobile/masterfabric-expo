# Toast Helper

A comprehensive toast notification system for MasterFabric Expo applications, providing consistent user feedback across the entire application.

## Features

- 🎨 **Multiple Variants**: Success, Error, Warning, Info, Custom
- ⏱️ **Auto-dismiss**: Configurable timeout with manual dismiss option
- 📱 **Queue Management**: Multiple toasts with proper stacking (max 3)
- 📍 **Positioning**: Top, Bottom, Center positioning options
- 🎭 **Animations**: None, Light, Medium, Strong animation levels
- ♿ **Accessibility**: Screen reader support and keyboard navigation
- 🎨 **Theming**: Full integration with MasterFabric theme system
- 🧪 **Testing Interface**: Interactive testing screen similar to String Helper
- 🌍 **Internationalization**: Multi-language support (Turkish/English)

## Quick Start

### Basic Usage

```typescript
import { useToast } from '@/src/shared/hooks/use-toast';

function MyComponent() {
  const { show, success, error, warning, info } = useToast();

  const handleSuccess = () => {
    success('Operation completed successfully!');
  };

  const handleError = () => {
    error('Something went wrong!');
  };

  const handleCustom = () => {
    show({
      message: 'Custom toast message',
      type: 'info',
      duration: 5000,
      position: 'top',
      animation: 'medium'
    });
  };

  return (
    <View>
      <Button title="Success" onPress={handleSuccess} />
      <Button title="Error" onPress={handleError} />
      <Button title="Custom" onPress={handleCustom} />
    </View>
  );
}
```

### Advanced Usage

```typescript
import { useToast } from '@/src/shared/hooks/use-toast';

function AdvancedComponent() {
  const { show } = useToast();

  const showAdvancedToast = () => {
    show({
      message: 'Settings saved successfully!',
      type: 'success',
      duration: 4000,
      position: 'top',
      animation: 'strong',
      onPress: () => {
        console.log('Toast pressed!');
      },
      action: {
        text: 'Undo',
        onPress: () => {
          console.log('Undo action pressed!');
        },
        style: {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
        }
      },
      style: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 16,
      }
    });
  };

  return (
    <Button title="Show Advanced Toast" onPress={showAdvancedToast} />
  );
}
```

## API Reference

### useToast Hook

```typescript
interface ToastReturn {
  show: (options: ToastOptions) => void;
  hide: (id?: string) => void;
  success: (message: string, options?: Partial<ToastOptions>) => void;
  error: (message: string, options?: Partial<ToastOptions>) => void;
  warning: (message: string, options?: Partial<ToastOptions>) => void;
  info: (message: string, options?: Partial<ToastOptions>) => void;
}
```

### ToastOptions Interface

```typescript
interface ToastOptions {
  message: string;                    // Required: Toast message text
  type?: ToastType;                   // Optional: 'success' | 'error' | 'warning' | 'info'
  duration?: number;                  // Optional: Duration in milliseconds (1-10 seconds)
  position?: ToastPosition;           // Optional: 'top' | 'bottom' | 'center'
  animation?: AnimationStrength;      // Optional: 'none' | 'light' | 'medium' | 'strong'
  onPress?: () => void;               // Optional: Callback when toast is pressed
  action?: ToastAction;               // Optional: Action button configuration
  style?: StyleProp<ViewStyle>;       // Optional: Custom styles
}

interface ToastAction {
  text: string;                       // Action button text
  onPress: () => void;                // Action callback
  style?: StyleProp<ViewStyle>;       // Optional: Action button styles
}
```

## Usage Examples

### 1. Form Validation

```typescript
function LoginForm() {
  const { error, success } = useToast();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      success('Login successful!');
    } catch (err) {
      error('Invalid credentials. Please try again.');
    }
  };

  const validateEmail = (email: string) => {
    if (!email.includes('@')) {
      error('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  // ... rest of component
}
```

### 2. API Responses

```typescript
function DataSync() {
  const { show } = useToast();

  const syncData = async () => {
    show({
      message: 'Syncing data...',
      type: 'info',
      duration: 0, // Don't auto-dismiss
      position: 'top'
    });

    try {
      await api.sync();
      show({
        message: 'Data synced successfully!',
        type: 'success',
        duration: 3000
      });
    } catch (error) {
      show({
        message: 'Sync failed. Please try again.',
        type: 'error',
        duration: 5000,
        action: {
          text: 'Retry',
          onPress: () => syncData()
        }
      });
    }
  };

  // ... rest of component
}
```

### 3. Network Status

```typescript
function NetworkStatus() {
  const { show, hide } = useToast();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== isOnline) {
        setIsOnline(state.isConnected);
        
        if (state.isConnected) {
          show({
            message: 'You are back online!',
            type: 'success',
            duration: 3000
          });
        } else {
          show({
            message: 'You are offline. Some features may not work.',
            type: 'warning',
            duration: 0 // Don't auto-dismiss
          });
        }
      }
    });

    return unsubscribe;
  }, [isOnline]);

  // ... rest of component
}
```

### 4. Feature Announcements

```typescript
function FeatureAnnouncement() {
  const { show } = useToast();

  useEffect(() => {
    const hasSeenAnnouncement = AsyncStorage.getItem('hasSeenNewFeature');
    
    if (!hasSeenAnnouncement) {
      show({
        message: '🎉 New feature available! Check out the updated dashboard.',
        type: 'info',
        duration: 8000,
        position: 'top',
        animation: 'medium',
        action: {
          text: 'Learn More',
          onPress: () => {
            // Navigate to feature explanation
            navigation.navigate('FeatureGuide');
          }
        }
      });
      
      AsyncStorage.setItem('hasSeenNewFeature', 'true');
    }
  }, []);

  // ... rest of component
}
```

## Testing

### Using the Testing Interface

1. Navigate to `/toast-helper` in your app
2. Use the interactive controls to test different configurations
3. Try different positions, animations, and durations
4. Test the custom message input and type selection

### Programmatic Testing

```typescript
import { toastService } from '@/src/shared/services/toast-service';

describe('Toast Integration', () => {
  beforeEach(() => {
    toastService.clear();
  });

  it('should show success toast', () => {
    const toastId = toastService.show({
      message: 'Test success',
      type: 'success',
      duration: 3000
    });

    expect(toastId).toBeTruthy();
    expect(toastService.getToasts()).toHaveLength(1);
  });

  it('should limit maximum toasts', () => {
    // Add more than max toasts
    for (let i = 0; i < 5; i++) {
      toastService.show({
        message: `Toast ${i}`,
        type: 'info',
        duration: 1000
      });
    }

    expect(toastService.getToasts()).toHaveLength(3);
  });
});
```

## Best Practices

### 1. Message Guidelines
- Keep messages concise and clear
- Use action verbs for success messages: "Saved", "Updated", "Deleted"
- Be specific with error messages: "Invalid email format" vs "Error"
- Use appropriate tone for different types

### 2. Duration Guidelines
- **Success**: 2-3 seconds (quick confirmation)
- **Error**: 4-5 seconds (user needs time to read)
- **Warning**: 3-4 seconds (important but not critical)
- **Info**: 3-5 seconds (depends on message length)
- **Custom**: 0 for persistent, 3-8 seconds for temporary

### 3. Positioning Guidelines
- **Top**: Success messages, confirmations
- **Bottom**: Errors, warnings (less intrusive)
- **Center**: Critical messages, important announcements

### 4. Animation Guidelines
- **None**: Quick, subtle feedback
- **Light**: Standard notifications
- **Medium**: Important messages
- **Strong**: Critical alerts, celebrations

## Integration with MasterFabric

The Toast Helper is fully integrated with MasterFabric's ecosystem:

- **Theme System**: Automatically adapts to light/dark themes
- **Internationalization**: Supports Turkish and English
- **Helper Architecture**: Follows the same patterns as String Helper
- **Testing Interface**: Interactive testing similar to other helpers
- **Type Safety**: Full TypeScript support
- **Accessibility**: Screen reader and keyboard navigation support

## Troubleshooting

### Common Issues

1. **Toast not showing**: Check if ToastProvider is wrapped around your app
2. **Animation not working**: Ensure react-native-reanimated is properly configured
3. **Theme colors not applied**: Verify MasterFabric theme system is initialized
4. **Translations missing**: Check if i18n keys are properly defined

### Debug Mode

Enable debug mode to see toast service logs:

```typescript
// In your app initialization
if (__DEV__) {
  toastService.subscribe((toasts) => {
    console.log('Toast Service:', toasts);
  });
}
```

## Contributing

When contributing to Toast Helper:

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Ensure accessibility compliance
5. Test with both light and dark themes
6. Verify internationalization support

## License

Part of MasterFabric Expo - MIT License
