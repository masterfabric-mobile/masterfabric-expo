# 8. History View

Tarif geçmişi ekranı, kullanıcının daha önce görüntülediği veya yaptığı tarifleri gösterir.

### Core Logic & Functionality

- **Görüntüleme Geçmişi**: Son görüntülenen tarifler
- **Yapılan Tarifler**: Kullanıcının yaptığı tarifler
- **Tarih Filtreleme**: Bugün, bu hafta, bu ay
- **Temizle**: Geçmişi temizleme

### Architecture & Components

Bu görünüm `src/screens/history/` klasörü altında yer alacaktır.

#### Dosya Yapısı

```
src/screens/history/
├── components/
│   ├── history-screen.tsx
│   ├── sections/
│   │   ├── filter-section.tsx
│   │   └── history-list.tsx
│   └── history-item.tsx
├── hooks/
│   └── use-history-view-model.ts
├── models/
│   └── history-models.ts
├── store/
│   └── history-store.ts
└── ...
```

### Translation Keys

```json
{
  "history": {
    "title": "Geçmiş",
    "viewed": "Görüntülenenler",
    "cooked": "Yapılanlar",
    "today": "Bugün",
    "thisWeek": "Bu Hafta",
    "thisMonth": "Bu Ay",
    "clear": "Temizle",
    "empty": "Geçmiş yok"
  }
}
```
