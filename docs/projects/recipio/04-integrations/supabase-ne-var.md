# Recipio — Supabase’de Ne Var? (Kontrol Listesi)

Bu dosya, **Recipio uygulamasının kullandığı** Supabase tabloları, view’lar ve kolonları özetler. Supabase Dashboard’da (Table Editor / SQL) bunları kontrol edebilirsin.

---

## 1. Tablolar (Tables)

### `profiles`
Kullanıcı profili ve plan bilgisi. **User service** ve **CURRENT PLAN kartı** buradan veri alır.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID (PK, auth.users’a referans) | Kullanıcı ID |
| `display_name` veya `name` | TEXT | Görünen isim (kodda `display_name` kullanılıyor) |
| `avatar_url` | TEXT | Profil fotoğrafı URL |
| `plan_name` | TEXT | Plan adı (örn. "Pro Chef") — varsayılan: 'Pro Chef' |
| `plan_active` | BOOLEAN | Plan aktif mi — varsayılan: true |
| `recipes_limit` | INTEGER | Aylık kayıt limiti — varsayılan: 50 |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**Not:** Dokümandaki şemada `name` yazıyor; kod `display_name` ile select yapıyor. Supabase’de hangisi varsa ona göre migration veya kod tarafında düzeltme gerekebilir.

---

### `recipes`
Tarifler. **Recipe service** bu tabloyu (ve view’ları) kullanır.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID (PK) | |
| `user_id` | UUID (nullable) | |
| `status` | TEXT | Örn. 'published' |
| `is_free` | BOOLEAN | |
| `cover_image_url` | TEXT | |
| `title`, `description`, `cooking_time`, `difficulty`, `tags`, `ingredients`, `cooking_steps`, `servings`, `calories`, `cuisine` | (docs’a göre) | Tam şema GitHub DB_SCHEMA’da |
| `created_at`, `updated_at` | TIMESTAMPTZ | |

---

### `user_activities`
Kullanıcının “kaydettiği” veya “bitirdiği” tarifler. **Aylık kayıt sayısı** (CURRENT PLAN kartı) buradan sayılıyor.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | UUID (PK) | |
| `user_id` | UUID (auth.users) | |
| `type` | TEXT | **'saved'** veya **'finished'** |
| `recipe_id` | UUID (recipes) | |
| `created_at` | TIMESTAMPTZ | |

**Not:** Kod önce `user_activities` (type='saved') ile sayıyor; yoksa `saved_recipes` tablosuna fallback yapıyor.

---

### `saved_recipes` (opsiyonel)
Eğer projede **user_activities** yoksa, aylık sayım için kullanılan yedek tablo.

| Kolon | Beklenen | Açıklama |
|-------|----------|----------|
| `user_id` | UUID | |
| `recipe_id` veya benzeri | UUID | |
| `created_at` | TIMESTAMPTZ | Bu aya göre filtre |

---

### Tarif detayı için ek tablolar (recipe-service kullanıyor)

- **`recipe_translations`** — recipe_id, title, description, tips, locale  
- **`recipe_steps`** — recipe_id, step_number, text, locale  
- **`recipe_variants`** — id, recipe_id, servings  
- **`recipe_variant_ingredients`** — variant_id, ingredient_id, amount, unit_id  
- **`ingredient_translations`** — ingredient_id, name, locale  
- **`units`** — id, code  

---

## 2. View’lar (Views)

### `v_public_recipe_cards`
Tarif listesi için. Recipe service önce buna sorgu atar.

Beklenen kolonlar: `recipe_id`, `title`, `description`, `cover_image_url`, `is_free`, (opsiyonel) `category_slug`.

### `v_recipe_detail` (dokümanda var, kodda doğrudan kullanım kontrol et)
Tek tarif detayı için tek sorguda veri döndüren view.

---

## 3. Auth

- **auth.users** — Supabase Auth kullanıcıları.  
- `profiles.id` = `auth.users.id` ile eşleşmeli.  
- Giriş yoksa uygulama “Guest” gösterir; plan ve aylık sayı varsayılan/0 olur.

---

## 4. Uygulama Hangi Veriyi Nereden Alıyor?

| Ekran / Bileşen | Veri | Kaynak |
|------------------|------|--------|
| CURRENT PLAN kartı | Plan adı, Active, X/Y kayıt | `profiles` (plan_name, plan_active, recipes_limit) + aylık sayım |
| Aylık kayıt sayısı | Bu ay kaç tarif “saved” | `user_activities` (type='saved') veya `saved_recipes` |
| Cook Tonight / Liste | Tarif kartları | `v_public_recipe_cards` veya `recipes` + `recipe_translations` |
| Tarif detay | Tek tarif | `recipes`, `recipe_translations`, `recipe_steps`, `recipe_variants`, vb. |
| Profil (isim, avatar) | Kullanıcı adı, foto | `profiles` (display_name, avatar_url) |

---

## 5. Kontrol Adımları (Supabase Dashboard)

1. **Table Editor**  
   Şu tabloların varlığını kontrol et:  
   `profiles`, `recipes`, `user_activities`  
   (İstersen `saved_recipes`, `recipe_translations`, `recipe_steps`, `recipe_variants`, `recipe_variant_ingredients`, `ingredient_translations`, `units`.)

2. **profiles**  
   Kolon isimleri: `display_name` mi `name` mi?  
   Varsa: `plan_name`, `plan_active`, `recipes_limit`.

3. **user_activities**  
   `type` değerleri: `'saved'` ve `'finished'`.

4. **View’lar**  
   `v_public_recipe_cards` view’ı var mı, kolonları: recipe_id, title, description, cover_image_url, is_free.

5. **RLS**  
   Docs’a göre recipes, user_activities, profiles için SELECT policy’ler tanımlı olmalı (demo için “viewable by everyone” vb.).

---

**Son güncelleme:** Proje kodu ve `docs/projects/recipio/04-integrations/supabase.md` dosyasına göre derlendi.
