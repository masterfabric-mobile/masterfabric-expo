# Features Overview

Recipio uygulamasının temel ve gelişmiş özelliklerinin genel bakışı.

## 📱 İçindekiler

### ✅ İlk Aşama Ekranları (Tamamlandı)

- **[Splash View](./views/00-splash-view.md)** - Uygulama başlangıç ekranı
- **[Onboarding View](./views/01-onboarding-view.md)** - İlk kullanım tanıtım ekranları
- **[Home View](./views/02-home-view.md)** - Ana sayfa (Dashboard)

### ⏳ Sonraki Aşama Ekranları

- **[Ingredient Input View](./views/03-ingredient-input-view.md)** - Malzeme giriş ekranı
- **[Recipe List View](./views/04-recipe-list-view.md)** - Tarif listesi
- **[Recipe Detail View](./views/05-recipe-detail-view.md)** - Tarif detayı
- **[Cooking Guide View](./views/06-cooking-guide-view.md)** - Adım adım yemek yapma rehberi
- **[Favorites View](./views/07-favorites-view.md)** - Favori tarifler
- **[History View](./views/08-history-view.md)** - Tarif geçmişi
- **[Profile View](./views/09-profile-view.md)** - Kullanıcı profili

## 🎯 Temel Özellikler

### 1. Akıllı Tarif Önerisi (Sonraki Aşama)

- Kullanıcının girdiği malzemelere göre otomatik tarif önerisi
- Uyumluluk skoruna göre sıralama (%100 uyuşandan uyuşmayana)
- Hız ve pratiklik filtreleri
- Eksik malzeme durumuna göre öneriler
- AI-powered ingredient matching

### 2. Malzeme Yönetimi (Sonraki Aşama)

- Malzeme ve ölçü girişi
- Malzeme arama ve otomatik tamamlama
- Malzeme kategorileri (sebze, et, baharat, vb.)

### 3. Tarif Yönetimi

- ✅ **Cook Tonight**: Supabase'den random tarifler
- ✅ **Recent Activity**: Kullanıcı aktiviteleri
- ⏳ Detaylı tarif görüntüleme (sonraki aşama)
- ⏳ Favorilere ekleme/çıkarma (sonraki aşama)
- ⏳ Tarif geçmişi (sonraki aşama)
- ⏳ Tarif arama ve filtreleme (sonraki aşama)

### 4. Adım Adım Yemek Yapma Rehberi (Sonraki Aşama)

- Görsel adım adım rehber
- Zamanlayıcı desteği
- İlerleme takibi
- Not alma özelliği

### 5. Kullanıcı Profili

- ✅ **Dashboard**: Kullanıcı karşılama ve plan bilgileri
- ✅ **Current Plan**: Plan durumu ve ilerleme
- ⏳ Profil bilgileri (sonraki aşama)
- ⏳ Favori tarifler (sonraki aşama)
- ⏳ Yemek geçmişi (sonraki aşama)
- ⏳ Ayarlar (sonraki aşama)

## 🏗️ Mimari Özellikler

### MasterFabric Core Integration

- **ThemedView**: Tema desteği olan View component
- **ThemedText**: Tema desteği olan Text component
- **Colors**: MasterFabric color palette
- **ThemeProvider**: Theme context provider

### Supabase Integration

- **Recipe Service**: Tarif işlemleri
- **User Service**: Kullanıcı işlemleri
- **Recipe Search Service**: AI-powered search (sonraki aşama)

### State Management

- **Zustand**: Global state management
- **AsyncStorage**: Kalıcı veri depolama
- **Local State**: Component-specific state

## 📊 Mevcut Durum

**Tamamlanan:**
- ✅ Splash Screen
- ✅ Onboarding Screen (multi-step)
- ✅ Home Screen (Dashboard)
- ✅ Supabase Integration
- ✅ Dark Theme Design

**Sonraki Aşamalar:**
- ⏳ Enter Ingredients Screen
- ⏳ Recipe Results Screen
- ⏳ Recipe Detail Screen
- ⏳ Cooking Guide Screen
- ⏳ Favorites Screen
- ⏳ History Screen
- ⏳ Profile Screen

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0
