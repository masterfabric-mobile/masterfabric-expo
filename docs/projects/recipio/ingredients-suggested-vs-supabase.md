# Recipio: Suggested ingredients vs Supabase

## Suggested list (Enter Ingredients screen)

The app suggests these 12 ingredients (English):

| # | Suggested (EN) | In DB? | DB id | DB name (en) | Used in recipes |
|---|----------------|--------|-------|--------------|------------------|
| 1 | Egg | ✅ | 11 | Egg | Recipe 2 (Brownie), 6 (Scrambled Eggs), 9 (Vanilla Ice Cream) |
| 2 | Milk | ✅ | 12 | Milk | Recipe 9 (Vanilla Ice Cream) |
| 3 | Flour | ✅ | 9 | Flour | Recipe 2 (Brownie) |
| 4 | Chicken | ✅ | 5 | Chicken Breast | Recipe 4 (Grilled Chicken) |
| 5 | Tomato | ✅ | 1 | Tomato | Recipe 7 (Bruschetta), 8 (Tomato Soup) |
| 6 | Onion | ✅ | 2 | Onion | Recipe 1 (Lentil Soup), 8 (Tomato Soup) |
| 7 | Garlic | ✅ | 3 | Garlic | Recipe 7 (Bruschetta) |
| 8 | Olive oil | ✅ | 8 | Olive Oil | Recipe 1 (Lentil Soup), 7 (Bruschetta) |
| 9 | Salt | ✅ | 14 | Salt | All recipes (1–9 where applicable) |
| 10 | Pepper | ✅ | 15 | Black Pepper | Recipe 4 (Grilled Chicken), 5 (Premium Steak) |
| 11 | Cheese | ❌ | — | — | — |
| 12 | Yogurt | ❌ | — | — | — |

Matching in `recipe-service` uses normalized names and `includes` (e.g. "Chicken" matches "Chicken Breast", "Pepper" matches "Black Pepper"), so the first 10 suggested ingredients already match DB content. **Cheese** and **Yogurt** were missing from the DB; they are added in seed and linked to recipes below.

---

## Current Supabase ingredients (after seed)

| id | slug | name (en) | name (tr) |
|----|------|-----------|-----------|
| 1 | tomato | Tomato | Domates |
| 2 | onion | Onion | Soğan |
| 3 | garlic | Garlic | Sarımsak |
| 4 | lentil | Red Lentil | Kırmızı Mercimek |
| 5 | chicken-breast | Chicken Breast | Tavuk Göğsü |
| 6 | lettuce | Lettuce | Marul |
| 7 | cucumber | Cucumber | Salatalık |
| 8 | olive-oil | Olive Oil | Zeytinyağı |
| 9 | flour | Flour | Un |
| 10 | sugar | Sugar | Şeker |
| 11 | egg | Egg | Yumurta |
| 12 | milk | Milk | Süt |
| 13 | butter | Butter | Tereyağı |
| 14 | salt | Salt | Tuz |
| 15 | black-pepper | Black Pepper | Karabiber |
| 16 | mint | Dried Mint | Nane |
| 17 | bulgur | Fine Bulgur | İnce Bulgur |
| 18 | parsley | Parsley | Maydanoz |
| 19 | lemon | Lemon | Limon |
| 20 | chocolate | Dark Chocolate | Bitter Çikolata |
| 21 | cheese | Cheese | Peynir |
| 22 | yogurt | Yogurt | Yoğurt |

---

## Recipes and their ingredients (published + free)

- **Recipe 1 – Classic Lentil Soup:** Red Lentil, Onion, Olive Oil, Butter, Dried Mint, Salt  
- **Recipe 2 – Fudgy Chocolate Brownies:** Dark Chocolate, Butter, Sugar, Egg, Flour, Salt  
- **Recipe 3 – Simple Green Salad:** Lettuce, Yogurt *(added)*  
- **Recipe 4 – Grilled Chicken:** Chicken Breast, Salt, Black Pepper  
- **Recipe 7 – Bruschetta:** Tomato, Garlic, Olive Oil, Cheese *(added)*  
- **Recipe 8 – Tomato Soup:** Tomato, Onion, Salt  
- **Recipe 9 – Vanilla Ice Cream:** Milk, Egg, Sugar  

*(Recipe 5 is premium; 6 is pending; 10 is rejected.)*
