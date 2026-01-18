# Views Index

Recipio uygulamasının tüm ekran görünümlerinin listesi.

## Ekran Listesi

1. **[Splash View](./00-splash-view.md)** - Uygulama başlatma ekranı
2. **[Onboarding View](./01-onboarding-view.md)** - İlk kullanım tanıtım ekranları
3. **[Home View](./02-home-view.md)** - Ana sayfa
4. **[Ingredient Input View](./03-ingredient-input-view.md)** - Malzeme giriş ekranı
5. **[Recipe List View](./04-recipe-list-view.md)** - Tarif listesi ekranı
6. **[Recipe Detail View](./05-recipe-detail-view.md)** - Tarif detay ekranı
7. **[Cooking Guide View](./06-cooking-guide-view.md)** - Adım adım yemek yapma rehberi
8. **[Favorites View](./07-favorites-view.md)** - Favori tarifler ekranı
9. **[History View](./08-history-view.md)** - Tarif geçmişi ekranı
10. **[Profile View](./09-profile-view.md)** - Kullanıcı profil ekranı

## Navigasyon Akışı

```
Splash → Onboarding → Home
                          ↓
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
  Ingredient Input   Recipe List      Favorites
        ↓                 ↓                 ↓
  Recipe List    →  Recipe Detail  →  Recipe Detail
        ↓                 ↓                 ↓
  Recipe Detail  →  Cooking Guide         History
        ↓
  Cooking Guide
        ↓
  History
```
