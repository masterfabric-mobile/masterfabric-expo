# Yemek Tarifi Uygulaması - 3 Günlük Geliştirme Planı
## MasterFabric Expo Sistemlerini Kullanarak

## 📊 Proje Değerlendirmesi

### ✅ MasterFabric Expo'da Hazır Olan Sistemler

Bu projede **MasterFabric Expo**'nun hazır sistemlerini kullanacağız, bu yüzden geliştirme süresi çok daha kısa olacak:

#### 🎯 Hazır Sistemler (Zaman Kazandıran)
1. ✅ **Navigation Sistemi** - Expo Router + navigation-config.ts hazır
2. ✅ **State Management** - Zustand store pattern hazır (örnek: validator-helper-store.ts)
3. ✅ **UI Components** - ScreenHeader, ThemedText, ThemedView hazır
4. ✅ **i18n Sistemi** - Tam çeviri sistemi hazır (en.json, tr.json)
5. ✅ **Theme Sistemi** - ThemeProvider, useTheme, getThemeColors hazır
6. ✅ **View Model Pattern** - use-*-view-model.ts pattern hazır
7. ✅ **Screen Pattern** - Mevcut helper screen'lerden pattern kopyalanabilir
8. ✅ **Helpers** - permissions, logger, string, time helpers hazır
9. ✅ **Store Pattern** - Zustand store yapısı hazır
10. ✅ **Type Definitions** - TypeScript modelleri pattern'i hazır

#### ⚠️ Gerçekçi Değerlendirme

**MasterFabric Expo sistemlerini kullanarak 3 günde çalışan bir MVP prototip geliştirilebilir.** Hazır sistemler sayesinde:
- **%60-70 zaman tasarrufu** sağlanacak
- UI/UX geliştirme çok daha hızlı olacak
- State management ve navigation hazır
- i18n ve theme sistemi hazır

### ✅ Yapılabilecekler (3 Gün)
- Temel fotoğraf çekme/yükleme
- AI entegrasyonu (hazır API kullanarak)
- Basit malzeme tanıma
- Temel tarif önerisi algoritması
- Basit tarif detay ekranı
- Temel yapılış adımları gösterimi

### ❌ Yapılamayacaklar (3 Gün İçinde)
- Kapsamlı veritabanı (1000+ tarif)
- Gelişmiş AI model eğitimi
- Kullanıcı kayıt/giriş sistemi
- Offline çalışma
- Push notifications
- Ödeme entegrasyonu
- Kapsamlı testler
- Production deployment

---

## 🎯 3 Günlük Hedef: MVP Prototip

**Amaç:** Çalışan bir prototip - fotoğraf çek, malzemeleri tanı, basit tarif öner, yapılışı göster.

---

## 📅 GÜN 1: Temel Altyapı ve Fotoğraf İşleme

### ⏰ Zaman Dağılımı: 5 saat (Hazır sistemler sayesinde 3 saat kazandık!)

#### 1. Proje Kurulumu (15 dakika) ⚡ ÇOK HIZLI
- [ ] ✅ MasterFabric Expo zaten hazır - sadece yeni feature ekleyeceğiz
- [ ] Gerekli paketleri yükle:
  ```bash
  expo install expo-image-picker
  expo install expo-camera
  expo install expo-file-system
  ```
- [ ] Mevcut pattern'i kopyalayarak klasör yapısını oluştur:
  ```
  src/screens/fridge-scanner/  (validator-helper pattern'ini kopyala)
  ├── components/
  ├── hooks/
  ├── models/
  ├── services/
  ├── store/
  └── styles/
  ```
  
**💡 İpucu:** `src/screens/validator-helper/` veya `src/screens/url-launcher-helper/` klasörünü referans al!

#### 2. Kamera ve Fotoğraf İşleme (1 saat) ⚡ ÇOK HIZLI
- [ ] Kamera ekranı komponenti (`FridgeCameraScreen.tsx`)
  - ✅ **ScreenHeader** kullan (hazır component)
  - ✅ **ThemedView**, **ThemedText** kullan (hazır components)
- [ ] Galeri erişimi
- [ ] Fotoğraf önizleme
- [ ] İzin yönetimi - ✅ **permissions helper** kullan (hazır!)
  ```typescript
  import { requestPermission, checkPermission } from 'masterfabric-expo-core';
  ```
- [ ] Fotoğraf sıkıştırma/optimizasyon

**Kod Örneği (MasterFabric Pattern ile):**
```typescript
// hooks/use-fridge-scanner.ts
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { requestPermission } from 'masterfabric-expo-core';

export function useFridgeScanner() {
  const pickImage = async () => {
    // ✅ Hazır permission helper kullan
    const permission = await requestPermission('photo_library');
    if (permission.status !== 'granted') return null;
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled) {
      const compressed = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );
      return compressed.uri;
    }
  };
  
  return { pickImage };
}
```

#### 3. Backend API Hazırlığı (1.5 saat) ⚡ HIZLI
- [ ] Backend projesi kurulumu (Node.js/Express veya Python/FastAPI)
- [ ] AI API entegrasyonu seçimi:
  - **Seçenek 1:** GPT-4 Vision API (kolay, ücretli) - **Önerilen**
  - **Seçenek 2:** Google Cloud Vision API (hızlı, ücretli)
  - **Seçenek 3:** Hugging Face API (ücretsiz, yavaş)
- [ ] Fotoğraf yükleme endpoint'i
- [ ] Base64 veya multipart form data işleme

**Backend Endpoint:**
```javascript
// POST /api/fridge/analyze
app.post('/api/fridge/analyze', async (req, res) => {
  const { image } = req.body; // base64 image
  
  // AI servisine gönder
  const detectedItems = await analyzeImage(image);
  
  res.json({ detectedItems });
});
```

**💡 İpucu:** İlk başta mock data ile çalış, AI entegrasyonunu sonra ekle!

#### 4. AI Entegrasyonu - Malzeme Tanıma (2.5 saat) ⚡ HIZLI
- [ ] Seçilen AI servisinin entegrasyonu
- [ ] Görüntü analizi fonksiyonu
- [ ] Malzeme çıkarımı ve normalizasyonu
- [ ] Basit veritabanı (JSON dosyası veya SQLite):
  ```json
  {
    "ingredients": [
      { "id": 1, "name": "domates", "aliases": ["tomato", "pomidor"] },
      { "id": 2, "name": "soğan", "aliases": ["onion", "sogan"] }
    ]
  }
  ```

**AI Servis Örneği (GPT-4 Vision):**
```javascript
async function analyzeImage(imageBase64) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Bu buzdolabı fotoğrafındaki tüm yiyecekleri listele. Sadece JSON formatında döndür: {items: [{name: string, quantity: string}]}" },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      ]
    }]
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

**💡 İpucu:** İlk gün mock data ile çalış, AI'ı 2. güne bırak!

---

## 📅 GÜN 2: Tarif Eşleştirme ve Öneri Sistemi

### ⏰ Zaman Dağılımı: 6 saat (Hazır sistemler sayesinde 2 saat kazandık!)

#### 1. Tarif Veritabanı Oluşturma (1.5 saat) ⚡ HIZLI
- [ ] Basit tarif veritabanı (JSON veya SQLite)
- [ ] En az 20-30 temel tarif ekle
- [ ] Her tarif için:
  - Malzeme listesi
  - Yapılış adımları
  - Süre, zorluk, porsiyon
  - Kategori

**Örnek Tarif Yapısı:**
```json
{
  "id": 1,
  "name": "Menemen",
  "ingredients": [
    { "name": "domates", "quantity": "3 adet", "required": true },
    { "name": "soğan", "quantity": "1 adet", "required": true },
    { "name": "yumurta", "quantity": "4 adet", "required": true },
    { "name": "biber", "quantity": "2 adet", "required": false },
    { "name": "tuz", "quantity": "1 çay kaşığı", "required": true }
  ],
  "steps": [
    { "order": 1, "text": "Soğanları doğrayın", "duration": 2 },
    { "order": 2, "text": "Domatesleri küp küp doğrayın", "duration": 3 }
  ],
  "duration": 15,
  "difficulty": "easy",
  "servings": 2
}
```

#### 2. Tarif Eşleştirme Algoritması (2 saat) ⚡ HIZLI
- [ ] Malzeme bazlı eşleştirme fonksiyonu
- [ ] Uyumluluk skoru hesaplama
- [ ] Sıralama algoritması
- [ ] Eksik malzeme tespiti
- [ ] ✅ **String helper** kullan (normalizasyon için hazır!)

**Algoritma:**
```typescript
function calculateMatchScore(
  recipeIngredients: Ingredient[],
  availableIngredients: string[]
): number {
  let score = 0;
  let requiredCount = 0;
  let availableCount = 0;
  
  recipeIngredients.forEach(ing => {
    if (ing.required) requiredCount++;
    
    const isAvailable = availableIngredients.some(avail => 
      normalizeIngredient(avail) === normalizeIngredient(ing.name)
    );
    
    if (isAvailable) {
      score += ing.required ? 10 : 5;
      availableCount++;
    } else if (ing.required) {
      score -= 5; // Eksik zorunlu malzeme
    }
  });
  
  // Yüzde hesapla
  const percentage = (availableCount / recipeIngredients.length) * 100;
  return Math.max(0, score + percentage);
}

function findMatchingRecipes(
  availableIngredients: string[],
  allRecipes: Recipe[]
): RecipeMatch[] {
  return allRecipes
    .map(recipe => ({
      recipe,
      score: calculateMatchScore(recipe.ingredients, availableIngredients),
      available: getAvailableIngredients(recipe, availableIngredients),
      missing: getMissingIngredients(recipe, availableIngredients)
    }))
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // En iyi 10 tarif
}
```

#### 3. Tarif Öneri Ekranı (1.5 saat) ⚡ HIZLI
- [ ] Tarif listesi komponenti
  - ✅ **ScreenHeader** kullan (hazır)
  - ✅ **ThemedView**, **ThemedText** kullan (hazır)
  - ✅ Mevcut helper screen pattern'ini kopyala
- [ ] Uyumluluk skoru gösterimi
- [ ] Malzeme durumu (mevcut/eksik) gösterimi
- [ ] Tarif kartları tasarımı
- [ ] ✅ **i18n** kullan (hazır - en.json, tr.json'a ekle)

**Komponent (MasterFabric Pattern ile):**
```typescript
// components/RecipeSuggestions.tsx
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText, getThemeColors, useTheme } from 'masterfabric-expo-core';
import { t } from '@/src/shared/i18n'; // ✅ Hazır i18n

export function RecipeSuggestions({ matches }: Props) {
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme === 'dark');
  
  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      <ScreenHeader 
        title={t('fridgeScanner.suggestions.title')} // ✅ i18n
        variant="minimal"
      />
      <FlatList
        data={matches}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item.recipe}
            matchScore={item.score}
            availableIngredients={item.available}
            missingIngredients={item.missing}
          />
        )}
      />
    </SafeAreaView>
  );
}
```

#### 4. Store ve View Model (1 saat) ⚡ HIZLI
- [ ] ✅ **Zustand store** oluştur (validator-helper-store.ts pattern'ini kopyala)
- [ ] ✅ **View Model hook** oluştur (use-validator-helper-view-model.ts pattern'ini kopyala)
- [ ] Tarif önerisi endpoint'i (backend)
- [ ] Malzeme listesini al, tarifleri eşleştir, döndür

**Store Örneği (Mevcut Pattern):**
```typescript
// store/fridge-scanner-store.ts
import { create } from 'zustand';
import { DetectedItem, RecipeMatch } from '../models/fridge-scanner-models';

interface FridgeScannerStore {
  detectedItems: DetectedItem[];
  suggestedRecipes: RecipeMatch[];
  isLoading: boolean;
  setDetectedItems: (items: DetectedItem[]) => void;
  setSuggestedRecipes: (recipes: RecipeMatch[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useFridgeScannerStore = create<FridgeScannerStore>((set) => ({
  detectedItems: [],
  suggestedRecipes: [],
  isLoading: false,
  setDetectedItems: (items) => set({ detectedItems: items }),
  setSuggestedRecipes: (recipes) => set({ suggestedRecipes: recipes }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
```

**Backend Endpoint:**
```javascript
// POST /api/recipes/suggest
app.post('/api/recipes/suggest', async (req, res) => {
  const { ingredients } = req.body;
  const matches = findMatchingRecipes(ingredients, recipes);
  res.json({ suggestions: matches });
});
```

---

## 📅 GÜN 3: Tarif Detay ve Yapılış Gösterimi

### ⏰ Zaman Dağılımı: 6 saat (Hazır sistemler sayesinde 2 saat kazandık!)

#### 1. Tarif Detay Ekranı (1.5 saat) ⚡ HIZLI
- [ ] Tarif başlığı, görsel, bilgiler
  - ✅ **ScreenHeader** kullan (hazır)
  - ✅ **ThemedView**, **ThemedText** kullan (hazır)
- [ ] Malzeme listesi (mevcut/eksik ayrımı)
- [ ] Beslenme bilgileri (basit)
- [ ] "Yapmaya Başla" butonu
- [ ] ✅ **i18n** kullan (hazır)

**Ekran Yapısı (MasterFabric Pattern ile):**
```typescript
// components/RecipeDetailView.tsx
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText, getThemeColors, useTheme } from 'masterfabric-expo-core';
import { t } from '@/src/shared/i18n'; // ✅ Hazır i18n

export function RecipeDetailView({ recipe, availableIngredients }) {
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme === 'dark');
  
  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      <ScreenHeader 
        title={recipe.name}
        variant="minimal"
      />
      <ScrollView>
        <RecipeHeader recipe={recipe} />
        <IngredientList 
          ingredients={recipe.ingredients}
          available={availableIngredients}
        />
        <NutritionInfo recipe={recipe} />
        <Button onPress={startCooking}>
          {t('recipe.startCooking')} {/* ✅ i18n */}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
```

#### 2. Adım Adım Yapılış Ekranı (2.5 saat) ⚡ HIZLI
- [ ] Yapılış modu ekranı
  - ✅ **ScreenHeader** kullan (hazır)
  - ✅ **ThemedView**, **ThemedText** kullan (hazır)
- [ ] Adım adım gösterim
- [ ] Her adım için:
  - Adım numarası
  - Açıklama
  - Süre gösterimi - ✅ **TimeHelper** kullan (hazır!)
  - "Tamamlandı" işaretleme
- [ ] İleri/geri navigasyon
- [ ] Timer (isteğe bağlı) - ✅ **TimeHelper** kullan (hazır!)
- [ ] ✅ **i18n** kullan (hazır)

**Yapılış Modu:**
```typescript
// components/CookingMode.tsx
export function CookingMode({ recipe }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const step = recipe.steps[currentStep];
  
  return (
    <View>
      <StepIndicator 
        current={currentStep} 
        total={recipe.steps.length}
      />
      <StepCard 
        step={step}
        isCompleted={completedSteps.has(currentStep)}
        onComplete={() => markStepComplete(currentStep)}
      />
      <NavigationButtons
        onPrevious={() => setCurrentStep(p => Math.max(0, p - 1))}
        onNext={() => setCurrentStep(p => Math.min(recipe.steps.length - 1, p + 1))}
        canGoBack={currentStep > 0}
        canGoForward={currentStep < recipe.steps.length - 1}
      />
    </View>
  );
}
```

#### 3. AI İpuçları Entegrasyonu (1.5 saat) ⚡ HIZLI
- [ ] Her adım için AI ipucu isteği
- [ ] GPT API ile ipucu üretimi
- [ ] İpucu gösterimi UI'da
  - ✅ **ThemedText** kullan (hazır)
  - ✅ **i18n** kullan (hazır)

**AI İpucu:**
```javascript
async function getCookingTip(step, recipe) {
  const prompt = `
    Bu yemek tarifi adımı için kısa, pratik bir ipucu ver:
    Tarif: ${recipe.name}
    Adım: ${step.text}
    Sadece 1-2 cümle, Türkçe.
  `;
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  });
  
  return response.choices[0].message.content;
}
```

#### 4. Navigation ve i18n Entegrasyonu (30 dakika) ⚡ HIZLI
- [ ] ✅ **Navigation config**'e ekle (navigation-config.ts pattern'ini kopyala)
- [ ] ✅ **i18n çevirileri** ekle (en.json, tr.json'a ekle)
- [ ] Route oluştur (app/fridge-scanner.tsx)

#### 5. Test ve Düzeltmeler (30 dakika)
- [ ] Temel testler
- [ ] Hata düzeltmeleri
- [ ] UI iyileştirmeleri
- [ ] Son kontroller

---

## 📋 Gerekli Teknolojiler ve Araçlar

### Frontend (MasterFabric Expo'da Hazır!)
- ✅ React Native + Expo (mevcut)
- ✅ TypeScript (mevcut)
- ✅ Zustand (state management) - **HAZIR**
- ✅ Navigation (Expo Router) - **HAZIR**
- ✅ UI Components (ScreenHeader, ThemedText, etc.) - **HAZIR**
- ✅ i18n Sistemi - **HAZIR**
- ✅ Theme Sistemi - **HAZIR**
- ✅ Helpers (permissions, time, string, etc.) - **HAZIR**
- ✅ expo-image-picker (yüklenecek)
- ✅ expo-camera (yüklenecek)
- ✅ expo-file-system (yüklenecek)

### Backend
- **Seçenek 1:** Node.js + Express
- **Seçenek 2:** Python + FastAPI
- **Seçenek 3:** Serverless (Vercel, Netlify Functions)

### AI Servisleri
- **Görüntü Analizi:**
  - GPT-4 Vision API (OpenAI) - **Önerilen**
  - Google Cloud Vision API
  - Hugging Face API
- **Metin Üretimi:**
  - GPT-3.5-turbo (OpenAI) - ipuçları için

### Veritabanı
- **MVP için:** JSON dosyası veya SQLite
- **Production için:** PostgreSQL, MongoDB

### API Keys Gerekli
- OpenAI API key (GPT-4 Vision + GPT-3.5)
- Veya Google Cloud API key

---

## ⚠️ Riskler ve Zorluklar

### Yüksek Risk
1. **AI API Limitleri:** Ücretsiz tier'lar sınırlı olabilir
2. **Görüntü Analiz Doğruluğu:** İlk denemelerde düşük doğruluk olabilir
3. **Backend Kurulumu:** İlk kez yapılıyorsa zaman alabilir

### Orta Risk
1. **Tarif Veritabanı:** Yeterli tarif bulmak zaman alabilir
2. **UI/UX:** İyi bir deneyim için iterasyon gerekir
3. **Hata Yönetimi:** Edge case'ler eksik kalabilir

### Çözümler
- AI API için ücretsiz alternatifler araştır
- Basit bir mock AI servisi oluştur (geliştirme için)
- Minimal UI ile başla, sonra iyileştir

---

## 📊 Başarı Kriterleri (3 Gün Sonunda)

### ✅ Minimum Başarı
- [ ] Fotoğraf çek/yükle
- [ ] AI ile malzeme tanıma (en az 3-5 malzeme)
- [ ] Basit tarif önerisi (en az 3 tarif)
- [ ] Tarif detayı görüntüleme
- [ ] Adım adım yapılış gösterimi

### 🎯 İdeal Başarı
- [ ] 10+ malzeme tanıma
- [ ] 20+ tarif önerisi
- [ ] AI ipuçları çalışıyor
- [ ] Temiz UI/UX
- [ ] Temel hata yönetimi

---

## 🚀 Hızlı Başlangıç Checklist

### Gün 1 Başlangıcı
- [ ] OpenAI API key al (veya alternatif)
- [ ] Backend projesi oluştur
- [ ] Expo projesi hazır
- [ ] Tüm paketler yüklü

### Geliştirme Sırası
1. **Önce backend'i çalışır hale getir** (mock data ile)
2. **Sonra frontend'i bağla**
3. **AI entegrasyonunu en son ekle** (çünkü en pahalı/test edilmesi zor)

---

## 💰 Tahmini Maliyet (3 Gün)

### AI API Maliyetleri
- **GPT-4 Vision:** ~$0.01-0.03 per image (test için ~$5-10)
- **GPT-3.5-turbo:** ~$0.001 per request (ipuçları için ~$1-2)
- **Toplam:** ~$10-15 (test ve geliştirme için)

### Alternatif: Ücretsiz
- Hugging Face API (yavaş ama ücretsiz)
- Mock AI servisi (geliştirme için)

---

## 📝 Notlar

1. **MVP Odaklı:** Production-ready değil, çalışan prototip
2. **Hızlı İterasyon:** Önce çalışır hale getir, sonra iyileştir
3. **Mock Data:** AI çalışmazsa mock data ile devam et
4. **Basit UI:** Karmaşık animasyonlar sonra
5. **Test:** Manuel test yeterli (otomatik test sonra)

---

## 🎯 Sonuç

### ⏰ Yeni Zaman Tahmini (MasterFabric ile)

**Önceki Tahmin:** 24 saat (3 gün x 8 saat)  
**Yeni Tahmin:** 15 saat (3 gün x 5 saat)  
**Tasarruf:** 9 saat (%37.5 daha hızlı!)

### ✅ MasterFabric Avantajları Özeti

1. **UI Components:** ~3 saat tasarruf
2. **State Management:** ~2 saat tasarruf
3. **Navigation:** ~1 saat tasarruf
4. **Theme System:** ~2 saat tasarruf
5. **i18n System:** ~2 saat tasarruf
6. **Helpers:** ~3 saat tasarruf (özellikle Permissions!)
7. **Services:** ~2 saat tasarruf
8. **Hooks:** ~1 saat tasarruf
9. **Screen Pattern:** ~2 saat tasarruf

**Toplam:** ~18 saat tasarruf (2.25 gün!)

### 📊 Gerçekçi 3 Günlük Plan

**3 günde çalışan bir MVP prototip geliştirilebilir**, ancak:
- Production-ready değil
- Sınırlı özellikler
- Basit UI (ama MasterFabric ile profesyonel görünüm!)
- Temel hata yönetimi

**MasterFabric ile Başarı için:**
- ✅ Mevcut komponentleri kullan (yeniden yazma!)
- ✅ Store pattern'ini kopyala (validator-helper'dan)
- ✅ Screen yapısını kopyala (mevcut screen'lerden)
- ✅ Helper'ları kullan (permissions, logger, time)
- ✅ API service'i kullan (hazır)
- ✅ i18n sistemini kullan (çevirileri ekle)
- Net öncelikler belirle
- Gereksiz özellikleri ertele
- Hızlı iterasyon yap
- Mock data ile başla, gerçek API'yi sonra ekle

### 🚀 MasterFabric ile Hızlandırılmış Geliştirme

**Gün 1:** 5 saat (3 saat tasarruf)  
**Gün 2:** 5 saat (3 saat tasarruf)  
**Gün 3:** 5 saat (3 saat tasarruf)  

**Toplam:** 15 saat aktif geliştirme  
**Tasarruf:** 9 saat (hazır sistemler sayesinde)

**Sonuç:** 3 günde daha kaliteli, daha tutarlı, daha profesyonel bir MVP!

---

**Hazırlayan:** AI Assistant  
**Tarih:** 2024  
**Versiyon:** 1.0

