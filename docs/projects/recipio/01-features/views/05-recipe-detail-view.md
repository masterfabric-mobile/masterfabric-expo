# 5. Recipe Detail View

Tarif detay ekranı, seçilen tarifin tüm bilgilerini gösterir.

### Core Logic & Functionality

- **Tarif Bilgileri**: Başlık, açıklama, görsel
- **Malzemeler Listesi**: Gerekli malzemeler ve ölçüleri
- **Hazırlık Süresi**: Hazırlık, pişirme, toplam süre
- **Porsiyon**: Kaç kişilik
- **Zorluk Seviyesi**: Kolay, orta, zor
- **Favoriye Ekle/Çıkar**: Favori butonu
- **Yemek Yapmaya Başla**: Adım adım rehbere geçiş butonu

### Architecture & Components

Bu görünüm `src/screens/recipe-detail/` klasörü altında yer alacaktır.

#### Dosya Yapısı

```
src/screens/recipe-detail/
├── components/
│   ├── recipe-detail-screen.tsx
│   ├── sections/
│   │   ├── header-section.tsx        # Başlık ve görsel
│   │   ├── info-section.tsx          # Süre, porsiyon, zorluk
│   │   ├── ingredients-section.tsx    # Malzemeler
│   │   └── actions-section.tsx       # Butonlar
│   └── ingredient-row.tsx             # Malzeme satırı
├── hooks/
│   └── use-recipe-detail-view-model.ts
├── models/
│   └── recipe-detail-models.ts
├── store/
│   └── recipe-detail-store.ts
└── ...
```

### Translation Keys

```json
{
  "recipeDetail": {
    "prepTime": "Hazırlık",
    "cookTime": "Pişirme",
    "totalTime": "Toplam",
    "servings": "Porsiyon",
    "difficulty": "Zorluk",
    "ingredients": "Malzemeler",
    "startCooking": "Yemek Yapmaya Başla",
    "addToFavorites": "Favorilere Ekle",
    "removeFromFavorites": "Favorilerden Çıkar"
  }
}
```
