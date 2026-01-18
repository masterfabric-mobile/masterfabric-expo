# Running the App

Recipio uygulamasını çalıştırma ve test etme.

## 🚀 Quick Start

### Windows

```bash
cd project/recipio
run.bat
```

### Linux/macOS

```bash
cd project/recipio
chmod +x run.sh
./run.sh
```

## 📱 Manual Start

### Start Development Server

```bash
cd project/recipio
npm start
```

veya

```bash
npx expo start
```

### Platform Options

Development server başladıktan sonra:

- **iOS Simulator**: `i` tuşuna basın
- **Android Emulator**: `a` tuşuna basın
- **Web Browser**: `w` tuşuna basın
- **QR Code**: Expo Go uygulaması ile QR kodu tarayın

## 🎯 Running on Specific Platform

### iOS

```bash
npm run ios
```

veya

```bash
npx expo start --ios
```

### Android

```bash
npm run android
```

veya

```bash
npx expo start --android
```

### Web

```bash
npm run web
```

veya

```bash
npx expo start --web
```

## 📲 Using Expo Go

1. **Expo Go** uygulamasını cihazınıza yükleyin:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Development server'ı başlatın:
   ```bash
   npm start
   ```

3. QR kodu tarayın:
   - iOS: Camera uygulaması ile
   - Android: Expo Go uygulaması içinden

## 🔧 Troubleshooting

### Port Already in Use

Eğer port zaten kullanılıyorsa:

```bash
npx expo start --port 8082
```

### Clear Cache

```bash
npx expo start --clear
```

### Reset Metro Bundler

```bash
npx expo start --reset-cache
```

### Network Issues

Aynı WiFi ağında olduğunuzdan emin olun. Veya tunnel modunu kullanın:

```bash
npx expo start --tunnel
```

### Supabase Connection Issues

Eğer Supabase bağlantı hatası alıyorsanız:

1. `app.json` dosyasındaki Supabase credentials'ı kontrol edin
2. Console log'larını kontrol edin:
   ```
   ✅ Supabase client başlatıldı
   ```
3. Supabase Dashboard'da projenizin aktif olduğundan emin olun

## 💡 Development Tips

- **Hot Reload**: Varsayılan olarak etkindir. Kod değişiklikleri otomatik olarak yansır.
- **Fast Refresh**: React bileşenleri için hızlı yenileme.
- **Debugging**: Chrome DevTools veya React Native Debugger kullanılabilir.
- **Console Logs**: Terminal'de tüm console.log'ları görebilirsiniz.

## 🏗️ Building for Production

### iOS

```bash
npx expo build:ios
```

### Android

```bash
npx expo build:android
```

### EAS Build (Recommended)

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

## ✅ Running Checklist

- [ ] Development server başlatıldı (`npm start`)
- [ ] Platform seçildi (iOS/Android/Web)
- [ ] Supabase bağlantısı başarılı (console'da görünmeli)
- [ ] Splash screen görünüyor
- [ ] Onboarding/Home screen'e geçiş çalışıyor

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0
