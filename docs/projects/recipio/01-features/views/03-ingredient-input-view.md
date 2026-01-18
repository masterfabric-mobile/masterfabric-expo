# 3. Ingredient Input View

Malzeme giriş ekranı, kullanıcının elindeki malzemeleri ve ölçülerini girebileceği ekrandır.

### Core Logic & Functionality

- **Malzeme Ekleme**: Kullanıcı malzeme adı ve ölçü girebilir
- **Otomatik Tamamlama**: Malzeme adı yazarken öneriler gösterilir
- **Kategori Filtreleme**: Malzemeler kategorilere göre filtrelenebilir
- **Ölçü Birimleri**: Gram, adet, fincan, yemek kaşığı, vb.
- **Malzeme Listesi**: Eklenen malzemelerin listesi
- **Tarif Öner**: Malzemelere göre tarif önerisi butonu

### Architecture & Components

Bu görünüm `src/screens/ingredient-input/` klasörü altında yer alacaktır.

#### Dosya Yapısı

```
src/screens/ingredient-input/
├── components/
│   ├── ingredient-input-screen.tsx
│   ├── sections/
│   │   ├── search-section.tsx        # Malzeme arama
│   │   ├── category-filter.tsx       # Kategori filtresi
│   │   └── ingredient-list.tsx       # Eklenen malzemeler listesi
│   └── ingredient-item.tsx           # Malzeme öğesi
├── hooks/
│   └── use-ingredient-input-view-model.ts
├── models/
│   └── ingredient-input-models.ts
├── store/
│   └── ingredient-input-store.ts
├── styles/
│   └── ...
└── index.ts
```

### Translation Keys

```json
{
  "ingredientInput": {
    "title": "Malzeme Ekle",
    "searchPlaceholder": "Malzeme ara...",
    "addButton": "Ekle",
    "suggestRecipe": "Tarif Öner",
    "empty": "Henüz malzeme eklenmedi",
    "categories": {
      "all": "Tümü",
      "vegetable": "Sebze",
      "meat": "Et",
      "spice": "Baharat",
      "dairy": "Süt Ürünleri"
    }
  }
}
```
