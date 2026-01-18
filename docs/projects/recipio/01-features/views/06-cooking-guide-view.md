# 6. Cooking Guide View

Adım adım yemek yapma rehberi ekranı. Google Stitch projesindeki gibi görsel ve interaktif bir deneyim sunar.

### Core Logic & Functionality

- **Adım Adım Rehber**: Her adım için görsel ve açıklama
- **İlerleme Takibi**: Hangi adımda olduğunu gösterir
- **Zamanlayıcı**: Adımlarda zamanlayıcı varsa gösterilir
- **Not Alma**: Her adım için not eklenebilir
- **İleri/Geri**: Adımlar arası geçiş
- **Tamamlandı**: Tüm adımlar tamamlandığında bildirim

### Architecture & Components

Bu görünüm `src/screens/cooking-guide/` klasörü altında yer alacaktır.

#### Dosya Yapısı

```
src/screens/cooking-guide/
├── components/
│   ├── cooking-guide-screen.tsx
│   ├── sections/
│   │   ├── step-content.tsx          # Adım içeriği
│   │   ├── step-navigation.tsx       # İleri/geri butonları
│   │   ├── progress-indicator.tsx    # İlerleme göstergesi
│   │   └── timer-section.tsx         # Zamanlayıcı
│   └── step-image.tsx                # Adım görseli
├── hooks/
│   └── use-cooking-guide-view-model.ts
├── models/
│   └── cooking-guide-models.ts
├── store/
│   └── cooking-guide-store.ts
└── ...
```

### Reference Design

Bu ekran, [Google Stitch projesi](https://stitch.withgoogle.com/projects/16264947854290603127) referans alınarak tasarlanmıştır. Görsel ve interaktif bir yemek yapma deneyimi sunar.

### Translation Keys

```json
{
  "cookingGuide": {
    "title": "Yemek Yapma Rehberi",
    "step": "Adım",
    "of": "/",
    "next": "İleri",
    "previous": "Geri",
    "complete": "Tamamlandı",
    "timer": "Zamanlayıcı",
    "addNote": "Not Ekle",
    "notes": "Notlar"
  }
}
```
