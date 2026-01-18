# 1. Onboarding View

Onboarding ekranı, kullanıcının uygulamayı ilk kez açtığında karşılaştığı tanıtım ekranlarıdır. Kullanıcıya uygulamanın temel özelliklerini ve nasıl kullanılacağını gösterir.

## 🎨 Design

### Layout

```
+-----------------------------------------------------+
|                                                     |
|              [Illustration/Image]                   |
|                                                     |
|              "Hoş Geldiniz!"                        |
|                                                     |
|    Recipio ile elinizdeki malzemelere göre         |
|    akıllı tarif önerileri alın                     |
|                                                     |
|                                                     |
|    [●] [○] [○]  (Step indicators)                  |
|                                                     |
|    [Geri]              [İleri] / [Başla]           |
|                                                     |
+-----------------------------------------------------+
```

### Styling

**MasterFabric Colors Kullanımı:**
```typescript
import { Colors } from '@masterfabric-expo/core/dist/constants/Colors';

export const onboardingScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  description: {
    fontSize: 16,
    color: Colors.light.actionDescription,
  },
});
```

## 🏗️ Architecture & Components

Bu görünüm `src/screens/onboarding/` klasörü altında yer alır.

### Dosya Yapısı

```
src/screens/onboarding/
├── components/
│   ├── onboarding-screen.tsx      # Ana onboarding ekranı bileşeni
│   ├── step-content.tsx            # Her adımın içeriğini gösteren bileşen
│   ├── step-controls.tsx           # İleri/Geri butonları
│   └── step-indicator.tsx          # Adım göstergesi
├── hooks/
│   └── use-onboarding-view-model.ts # Onboarding view model hook'u
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
Ana container component. Multi-step flow'u yönetir.

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
Adım göstergesi component'i.

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
Her adımın içeriğini gösterir.

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
İleri/Geri/Skip butonları.

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
          <Text style={stepControlsStyles.backButtonText}>Geri</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={[stepControlsStyles.nextButton, isLastStep && stepControlsStyles.completeButton]}
        onPress={isLastStep ? onComplete : onNext}
      >
        <Text style={stepControlsStyles.nextButtonText}>
          {isLastStep ? 'Başla' : 'İleri'}
        </Text>
      </TouchableOpacity>
      
      {!isLastStep && (
        <TouchableOpacity style={stepControlsStyles.skipButton} onPress={onSkip}>
          <Text style={stepControlsStyles.skipButtonText}>Atla</Text>
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
      title: 'Hoş Geldiniz!',
      description: ['Recipio ile elinizdeki malzemelere göre', 'akıllı tarif önerileri alın'],
    },
    {
      title: 'Malzeme Girişi',
      description: ['Elinizdeki malzemeleri ve ölçülerini girin'],
    },
    {
      title: 'Akıllı Öneriler',
      description: ['Uyumluluk skoruna göre size en uygun', 'tarifleri bulun'],
    },
    {
      title: 'Adım Adım Rehber',
      description: ['Yemek yapma sürecini kolayca takip edin'],
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
      "title": "Hoş Geldiniz!",
      "description": [
        "Recipio ile elinizdeki malzemelere göre",
        "akıllı tarif önerileri alın"
      ]
    },
    "step1": {
      "title": "Malzeme Girişi",
      "description": ["Elinizdeki malzemeleri ve ölçülerini girin"]
    },
    "step2": {
      "title": "Akıllı Öneriler",
      "description": [
        "Uyumluluk skoruna göre size en uygun",
        "tarifleri bulun"
      ]
    },
    "step3": {
      "title": "Adım Adım Rehber",
      "description": ["Yemek yapma sürecini kolayca takip edin"]
    },
    "controls": {
      "back": "Geri",
      "next": "İleri",
      "skip": "Atla",
      "getStarted": "Başla"
    }
  }
}
```

## 🎯 Implementation Details

### Onboarding Steps

1. **Hoş Geldiniz**: Uygulamanın tanıtımı
2. **Malzeme Girişi**: Nasıl malzeme girileceği
3. **Akıllı Öneriler**: Akıllı öneri sistemi
4. **Adım Adım Rehber**: Yemek yapma rehberi özelliği

### State Management

- ✅ **Zustand Store**: Onboarding durumu için
- ✅ **AsyncStorage**: Kalıcı veri depolama
- ✅ **Local State**: Current step için

### MasterFabric Core

- ✅ **ThemedView**: Container component
- ✅ **ThemedText**: Text component
- ✅ **Colors**: Color palette

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0  
**Durum:** ✅ Tamamlandı
