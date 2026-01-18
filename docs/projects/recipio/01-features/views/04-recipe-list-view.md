# 4. Recipe List View

Tarif listesi ekranı, kullanıcıya önerilen tarifleri gösterir. Uyumluluk skoruna göre sıralanır.

### Core Logic & Functionality

- **Tarif Listesi**: Uyumluluk skoruna göre sıralanmış tarifler
- **Filtreleme**: Hız, pratiklik, zorluk seviyesi filtreleri
- **Arama**: Tarif adına göre arama
- **Sıralama**: Uyumluluk, popülerlik, tarih
- **Tekrar Öner**: Yeni tarif önerileri için buton
- **Uyumluluk Skoru**: Her tarif için % uyumluluk göstergesi

### Architecture & Components

Bu görünüm `src/screens/recipe-list/` klasörü altında yer alacaktır.

#### Dosya Yapısı

```
src/screens/recipe-list/
├── components/
│   ├── recipe-list-screen.tsx
│   ├── sections/
│   │   ├── filter-section.tsx        # Filtreler
│   │   ├── sort-section.tsx          # Sıralama
│   │   └── recipe-grid.tsx           # Tarif grid'i
│   └── recipe-card.tsx               # Tarif kartı
├── hooks/
│   └── use-recipe-list-view-model.ts
├── models/
│   └── recipe-list-models.ts
├── store/
│   └── recipe-list-store.ts
└── ...
```

### Translation Keys

```json
{
  "recipeList": {
    "title": "Tarif Önerileri",
    "suggestAgain": "Tekrar Öner",
    "filters": {
      "speed": "Hız",
      "practicality": "Pratiklik",
      "difficulty": "Zorluk"
    },
    "sort": {
      "match": "Uyumluluk",
      "popularity": "Popülerlik",
      "date": "Tarih"
    },
    "empty": "Tarif bulunamadı"
  }
}
```
