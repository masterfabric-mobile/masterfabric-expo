# 9. Profile View

Kullanıcı profil ekranı, kullanıcı bilgileri ve ayarları gösterir.

### Core Logic & Functionality

- **Kullanıcı Bilgileri**: İsim, e-posta, profil fotoğrafı
- **İstatistikler**: Toplam tarif sayısı, favori sayısı
- **Ayarlar**: Dil, tema, bildirimler
- **Çıkış Yap**: Oturum kapatma

### Architecture & Components

Bu görünüm `src/screens/profile/` klasörü altında yer alacaktır.

#### Dosya Yapısı

```
src/screens/profile/
├── components/
│   ├── profile-screen.tsx
│   ├── sections/
│   │   ├── user-info-section.tsx    # Kullanıcı bilgileri
│   │   ├── stats-section.tsx        # İstatistikler
│   │   └── settings-section.tsx     # Ayarlar
│   └── stat-card.tsx                # İstatistik kartı
├── hooks/
│   └── use-profile-view-model.ts
├── models/
│   └── profile-models.ts
├── store/
│   └── profile-store.ts
└── ...
```

### Translation Keys

```json
{
  "profile": {
    "title": "Profil",
    "stats": {
      "totalRecipes": "Toplam Tarif",
      "favorites": "Favoriler",
      "cooked": "Yapılanlar"
    },
    "settings": {
      "language": "Dil",
      "theme": "Tema",
      "notifications": "Bildirimler"
    },
    "signOut": "Çıkış Yap"
  }
}
```
