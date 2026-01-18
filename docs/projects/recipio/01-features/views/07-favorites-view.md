# 7. Favorites View

Favori tarifler ekranı, kullanıcının favorilerine eklediği tarifleri gösterir.

### Core Logic & Functionality

- **Favori Tarifler Listesi**: Kullanıcının favorilerine eklediği tarifler
- **Arama**: Favoriler içinde arama
- **Filtreleme**: Kategori, zorluk seviyesi
- **Sıralama**: Tarih, alfabetik
- **Favoriden Çıkar**: Favorilerden kaldırma

### Architecture & Components

Bu görünüm `src/screens/favorites/` klasörü altında yer alacaktır.

#### Dosya Yapısı

```
src/screens/favorites/
├── components/
│   ├── favorites-screen.tsx
│   ├── sections/
│   │   ├── search-section.tsx
│   │   └── favorites-grid.tsx
│   └── favorite-card.tsx
├── hooks/
│   └── use-favorites-view-model.ts
├── models/
│   └── favorites-models.ts
├── store/
│   └── favorites-store.ts
└── ...
```

### Translation Keys

```json
{
  "favorites": {
    "title": "Favoriler",
    "empty": "Henüz favori tarif yok",
    "remove": "Favorilerden Çıkar"
  }
}
```
