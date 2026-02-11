# 1. Onboarding View

The onboarding screen is the intro flow shown when the user opens the app for the first time. **3 slides** only. Uses the **unified dark theme** (black background, white text, orange accents).

## 🎨 Design

### Theme (All Screens)

**Dark theme:** `#000000` background, `#FFFFFF` text, orange accents: `#FF5722` (primary), `#FF9800`, `#FFB74D`. Same as Home, Recipe Detail, Splash.

### 3 Slides (Reference Image)

| Slide | Title | Description | Button |
|-------|-------|-------------|--------|
| 1 | Enter Your Ingredients | Don't know what to cook? Just type in the ingredients you have, and discover delicious recipes instantly. | Next |
| 2 | Get Perfect Recipe Matches | Tell us what you love, and our AI will find recipes tailored specifically to your taste buds and dietary needs. | Next → |
| 3 | Cook with Confidence | Never miss a step. Our interactive cooking mode keeps your screen on and guides you from prep to plate. | Get Started |

### Layout

```
+-----------------------------------------------------+
|                                    [Skip]           |
|                                                     |
|              [Central Illustration]                 |
|                                                     |
|              "Slide Title"                          |
|                                                     |
|    Description text paragraph.                      |
|                                                     |
|              [●] [○] [○]  (3 dots, orange filled)   |
|                                                     |
|              [    Next / Get Started    ]           |
|                     (orange button)                 |
+-----------------------------------------------------+
```

### Styling (Dark Theme)

```typescript
const colors = {
  background: '#000000',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  primary: '#FF5722',
};

export const onboardingScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
```

## 🏗️ Architecture & Components

This view lives under `src/screens/onboarding/`.

### File structure

```
src/screens/onboarding/
├── components/
│   ├── onboarding-screen.tsx      # Main onboarding screen component
│   ├── step-content.tsx            # Content for each step
│   ├── step-controls.tsx           # Next/Back buttons
│   └── step-indicator.tsx          # Step indicator
├── hooks/
│   └── use-onboarding-view-model.ts # Onboarding view model hook
├── models/
│   └── onboarding-models.ts        # Type definitions
├── store/
│   └── onboarding-store.ts         # Zustand store (AsyncStorage persistence)
├── styles/
│   └── onboarding-screen.styles.ts  # Styles (MasterFabric Colors)
└── index.ts
```

### Core Components

#### OnboardingScreen
Main container. Manages the multi-step flow.

```typescript
export function OnboardingScreen() {
  const { currentStep, steps, handleNext, handleBack, handleSkip, handleComplete } = 
    useOnboardingViewModel();

  return (
    <SafeAreaView style={onboardingScreenStyles.container}>
      <ThemedView style={onboardingScreenStyles.content}>
        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
        <StepContent step={steps[currentStep]} />
        <StepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
          onComplete={handleComplete}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
```

#### StepIndicator
Step indicator component.

```typescript
export function StepIndicator({ currentStep, totalSteps }: Props) {
  return (
    <View style={stepIndicatorStyles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            stepIndicatorStyles.dot,
            index === currentStep && stepIndicatorStyles.dotActive,
            index < currentStep && stepIndicatorStyles.dotCompleted,
          ]}
        />
      ))}
    </View>
  );
}
```

#### StepContent
Shows the content for each step.

```typescript
export function StepContent({ step }: { step: OnboardingStep }) {
  return (
    <View style={stepContentStyles.container}>
      {step.image && (
        <Image source={step.image} style={stepContentStyles.image} />
      )}
      <Text style={stepContentStyles.title}>{step.title}</Text>
      {step.description.map((line, index) => (
        <Text key={index} style={stepContentStyles.description}>
          {line}
        </Text>
      ))}
    </View>
  );
}
```

#### StepControls
Next/Back/Skip buttons.

```typescript
export function StepControls({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  onComplete,
}: Props) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <View style={stepControlsStyles.container}>
      {currentStep > 0 && (
        <TouchableOpacity style={stepControlsStyles.backButton} onPress={onBack}>
          <Text style={stepControlsStyles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={[stepControlsStyles.nextButton, isLastStep && stepControlsStyles.completeButton]}
        onPress={isLastStep ? onComplete : onNext}
      >
        <Text style={stepControlsStyles.nextButtonText}>
          {isLastStep ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
      
      {!isLastStep && (
        <TouchableOpacity style={stepControlsStyles.skipButton} onPress={onSkip}>
          <Text style={stepControlsStyles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

## 📊 State Management

### Onboarding Store

```typescript
// src/screens/onboarding/store/onboarding-store.ts
import { create } from 'zustand';
import { storage } from '../../../shared/utils/storage';

interface OnboardingStore {
  currentStep: number;
  isCompleted: boolean;
  setCurrentStep: (step: number) => void;
  setCompleted: (value: boolean) => Promise<void>;
  loadOnboardingStatus: () => Promise<void>;
  reset: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentStep: 0,
  isCompleted: false,

  setCurrentStep: (step: number) => {
    set({ currentStep: step });
  },

  setCompleted: async (value: boolean) => {
    set({ isCompleted: value });
    await storage.setOnboardingCompleted(value);
  },

  loadOnboardingStatus: async () => {
    const isCompleted = await storage.getOnboardingCompleted();
    set({ isCompleted });
  },

  reset: async () => {
    set({ currentStep: 0, isCompleted: false });
    await storage.clearOnboardingStatus();
  },
}));
```

### View Model Hook

```typescript
// src/screens/onboarding/hooks/use-onboarding-view-model.ts
export function useOnboardingViewModel() {
  const { currentStep, isCompleted, setCurrentStep, setCompleted } = useOnboardingStore();
  const router = useRouter();

  const steps: OnboardingStep[] = [
    {
      title: 'Welcome!',
      description: ['Get smart recipe suggestions', 'based on the ingredients you have'],
    },
    {
      title: 'Ingredient Input',
      description: ['Enter your ingredients and quantities'],
    },
    {
      title: 'Smart Suggestions',
      description: ['Find the best matching', 'recipes by match score'],
    },
    {
      title: 'Step-by-Step Guide',
      description: ['Follow the cooking process easily'],
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await setCompleted(true);
    router.replace('/');
  };

  const handleComplete = async () => {
    await setCompleted(true);
    router.replace('/');
  };

  return {
    currentStep,
    steps,
    handleNext,
    handleBack,
    handleSkip,
    handleComplete,
  };
}
```

## 🗄️ Data Persistence

### AsyncStorage Integration

```typescript
// src/shared/utils/storage.ts
export const storage = {
  async setOnboardingCompleted(value: boolean): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.ONBOARDING_COMPLETED,
      JSON.stringify(value)
    );
  },

  async getOnboardingCompleted(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value ? JSON.parse(value) : false;
  },
};
```

## 🧭 Navigation Flow

```
Onboarding Screen
    ↓
    [Step 1] → [Step 2] → [Step 3] → [Step 4]
    ↓
    [Complete] → Home Screen
    ↓
    [Skip] → Home Screen (onboarding completed)
```

## 📝 Translation Keys

```json
{
  "onboarding": {
    "welcome": {
      "title": "Welcome!",
      "description": [
        "Get smart recipe suggestions",
        "based on the ingredients you have"
      ]
    },
    "step1": {
      "title": "Ingredient Input",
      "description": ["Enter your ingredients and quantities"]
    },
    "step2": {
      "title": "Smart Suggestions",
      "description": [
        "Find the best matching",
        "recipes by match score"
      ]
    },
    "step3": {
      "title": "Step-by-Step Guide",
      "description": ["Follow the cooking process easily"]
    },
    "controls": {
      "back": "Back",
      "next": "Next",
      "skip": "Skip",
      "getStarted": "Get Started"
    }
  }
}
```

## 🎯 Implementation Details

### Onboarding steps

1. **Welcome**: App introduction
2. **Ingredient Input**: How to enter ingredients
3. **Smart Suggestions**: Suggestion system
4. **Step-by-Step Guide**: Cooking guide feature

### State management

- **Zustand store**: For onboarding status
- **AsyncStorage**: Persistent storage
- **Local state**: For current step

### MasterFabric Core

- **ThemedView**: Container component
- **ThemedText**: Text component
- **Colors**: Color palette

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0  
**Status:** Complete
