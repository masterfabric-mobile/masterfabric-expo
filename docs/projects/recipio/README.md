# Recipio Application Documentation

Bu dokümantasyon, **Recipio** uygulamasının teknik bir genel bakışını sağlar. Recipio, kullanıcıların elindeki malzemelere göre akıllı tarif önerileri alabileceği, adım adım yemek yapma rehberi sunan bir mobil uygulamadır.

Proje, MasterFabric Expo ekosistemi üzerine inşa edilmiştir ve ölçeklenebilir, tutarlı bir mimari için `@masterfabric-expo/core` paketini kullanır.

## 📚 Dokümantasyon Bölümleri

Projenin yapısını, özelliklerini ve kurulumunu anlamak için aşağıdaki bölümlere bakın:

- **[0. Implementation Analysis](./00-implementation-analysis.md)** ⭐ **Başlamadan önce mutlaka okuyun!**
  - İlk aşama implementasyon analizi
  - Gereklilikler ve hata önleme stratejileri
  - Dosya yapısı, isimlendirme kuralları
  - MasterFabric Core kullanımı
  - Supabase entegrasyonu
  - Metro bundler ve stubs yapılandırması

- **[1. Features](./01-features/)** - Uygulamanın temel ve gelişmiş özelliklerinin genel bakışı
  - Splash View
  - Onboarding View
  - Home View (Dashboard)
  - Ingredient Input View (sonraki aşama)
  - Recipe List View (sonraki aşama)
  - Recipe Detail View (sonraki aşama)

- **[2. Architecture & Folder Structure](./02-architecture/)** - Projenin mimarisi, tasarım desenleri ve klasör organizasyonu
  - Feature-based architecture
  - MasterFabric Core entegrasyonu
  - State management (Zustand)
  - Navigation yapısı (Expo Router)

- **[3. Technology Stack](./03-tech-stack/)** - Uygulamada kullanılan framework'ler, kütüphaneler ve araçlar
  - Core Framework (Expo SDK 54, React Native, TypeScript)
  - UI & Styling (MasterFabric Core, StyleSheet)
  - State Management (Zustand, AsyncStorage)
  - Navigation (Expo Router)
  - Backend (Supabase)

- **[4. Integrations](./04-integrations/)** - Üçüncü taraf servisler ve proje içindeki entegrasyonları
  - Supabase entegrasyonu
  - Database schema
  - Authentication
  - Real-time subscriptions

- **[5. Getting Started](./05-getting-started/)** - Projeyi yerel olarak kurma ve çalıştırma için adım adım talimatlar
  - Prerequisites
  - Installation
  - Configuration (Supabase, app.json)
  - Running the App

- **[6. i18n Translation Keys](./06-i18n-translation-keys.md)** - Çeviri anahtarları ve dil desteği

## 🎯 Uygulama Özeti

Recipio, kullanıcıların:
- Elindeki malzemeleri ve ölçülerini girebileceği
- Hız, pratiklik ve eksik malzeme durumuna göre akıllı tarif önerileri alabileceği
- %100 uyuşandan uyuşmayana doğru azalan sıralamada tarifler görebileceği
- Favori tarifleri kaydedebileceği
- Tarif geçmişini görüntüleyebileceği
- Seçilen tarifi adım adım yapma rehberi ile takip edebileceği

bir yemek tarifi uygulamasıdır.

## 🚀 İlk Aşama Durumu

**Tamamlanan Ekranlar:**
- ✅ Splash Screen
- ✅ Onboarding Screen
- ✅ Home Screen (Dashboard)

**Sonraki Aşamalar:**
- ⏳ Enter Ingredients Screen
- ⏳ Recipe Results Screen
- ⏳ Recipe Detail Screen
- ⏳ Favorites Screen
- ⏳ History Screen
- ⏳ Profile Screen

## 🏗️ Teknik Özellikler

- **Framework**: Expo SDK 54, React Native 0.81.5
- **Language**: TypeScript 5.9
- **State Management**: Zustand 4.4
- **Navigation**: Expo Router 6.0
- **Backend**: Supabase (PostgreSQL)
- **UI Components**: MasterFabric Core
- **Storage**: AsyncStorage

## 📖 Referans Tasarım

Uygulama, [Google Stitch projesi](https://stitch.withgoogle.com/projects/16264947854290603127) referans alınarak tasarlanmıştır. Özellikle adım adım yemek yapma deneyimi bu tasarımdan ilham alınmıştır.

## 🔗 Hızlı Bağlantılar

- [Implementation Analysis](./00-implementation-analysis.md) - Detaylı implementasyon analizi
- [Getting Started](./05-getting-started/) - Kurulum ve çalıştırma
- [Supabase Integration](./04-integrations/supabase.md) - Backend yapılandırması
- [Folder Structure](./02-architecture/folder-structure.md) - Proje yapısı

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0  
**Durum:** ✅ İlk aşama tamamlandı
