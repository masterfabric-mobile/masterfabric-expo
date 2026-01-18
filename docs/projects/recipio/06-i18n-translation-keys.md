# i18n Translation Keys

Recipio uygulaması için i18n çeviri anahtarları yapısı.

## Translation Structure

Çeviri dosyaları `src/shared/i18n/translations/` klasöründe bulunur:
- `en.json`: İngilizce çeviriler
- `tr.json`: Türkçe çeviriler

## Complete Translation Keys

### app.json

```json
{
  "app": {
    "name": "Recipio",
    "tagline": "Akıllı Tarif Önerileri"
  }
}
```

### common.json

```json
{
  "common": {
    "ok": "OK",
    "cancel": "İptal",
    "save": "Kaydet",
    "delete": "Sil",
    "edit": "Düzenle",
    "loading": "Yükleniyor...",
    "error": "Hata",
    "retry": "Tekrar Dene",
    "success": "Başarılı",
    "previous": "Önceki",
    "next": "Sonraki",
    "skip": "Atla",
    "getStarted": "Başlayalım",
    "close": "Kapat",
    "search": "Ara...",
    "filter": "Filtrele",
    "sort": "Sırala"
  }
}
```

### splash.json

```json
{
  "splash": {
    "appName": "Recipio",
    "tagline": "Akıllı Tarif Önerileri",
    "loading": {
      "fonts": "Fontlar yükleniyor",
      "services": "Servisler başlatılıyor",
      "auth": "Kimlik doğrulama kontrol ediliyor",
      "preferences": "Kullanıcı tercihleri yükleniyor",
      "finalize": "Kurulum tamamlanıyor"
    }
  }
}
```

### onboarding.json

```json
{
  "onboarding": {
    "welcome": {
      "title": "Hoş Geldiniz!",
      "description": "Recipio ile elinizdeki malzemelere göre akıllı tarif önerileri alın"
    },
    "step1": {
      "title": "Malzeme Girişi",
      "description": "Elinizdeki malzemeleri ve ölçülerini girin"
    },
    "step2": {
      "title": "Akıllı Öneriler",
      "description": "Uyumluluk skoruna göre size en uygun tarifleri bulun"
    },
    "step3": {
      "title": "Adım Adım Rehber",
      "description": "Yemek yapma sürecini kolayca takip edin"
    },
    "step4": {
      "title": "Favoriler",
      "description": "Beğendiğiniz tarifleri kaydedin ve kolayca erişin"
    },
    "controls": {
      "back": "Geri",
      "next": "İleri",
      "skip": "Atla",
      "getStarted": "Başlayalım"
    }
  }
}
```

### home.json

```json
{
  "home": {
    "title": "Ana Sayfa",
    "greeting": {
      "hello": "Merhaba",
      "goodMorning": "Günaydın",
      "goodAfternoon": "İyi günler",
      "goodEvening": "İyi akşamlar"
    },
    "quickActions": {
      "addIngredients": "Malzeme Ekle",
      "quickRecipe": "Hızlı Tarif",
      "favorites": "Favoriler"
    },
    "sections": {
      "recommended": "Önerilen Tarifler",
      "recent": "Son Görüntülenenler",
      "categories": "Popüler Kategoriler"
    },
    "empty": {
      "noRecipes": "Henüz tarif yok",
      "noRecent": "Son görüntülenen tarif yok"
    }
  }
}
```

### ingredientInput.json

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

### recipeList.json

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

### recipeDetail.json

```json
{
  "recipeDetail": {
    "prepTime": "Hazırlık",
    "cookTime": "Pişirme",
    "totalTime": "Toplam",
    "servings": "Porsiyon",
    "difficulty": {
      "title": "Zorluk",
      "easy": "Kolay",
      "medium": "Orta",
      "hard": "Zor"
    },
    "ingredients": "Malzemeler",
    "startCooking": "Yemek Yapmaya Başla",
    "addToFavorites": "Favorilere Ekle",
    "removeFromFavorites": "Favorilerden Çıkar"
  }
}
```

### cookingGuide.json

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
    "notes": "Notlar",
    "congratulations": "Tebrikler! Yemeğiniz hazır!"
  }
}
```

### favorites.json

```json
{
  "favorites": {
    "title": "Favoriler",
    "empty": "Henüz favori tarif yok",
    "remove": "Favorilerden Çıkar"
  }
}
```

### history.json

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

### profile.json

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

## Usage Example

```typescript
import { t } from '@/src/shared/i18n';

// Basic usage
const title = t('home.title');

// With interpolation
const greeting = t('home.greeting.hello', { name: 'John' });

// In component
<ThemedText>{t('common.loading')}</ThemedText>
```
