# Advertisements with Google AdMob & Meta Audience Network

Monetization for the free (Bronze) tier is handled by displaying advertisements from multiple platforms to maximize fill rate and revenue.

---

### **Google AdMob**

- **Description**: Google's mobile advertising platform is used to display various ad formats (e.g., banner, interstitial).
- **Configuration**: The AdMob App ID is configured in `app.json` and potentially in `src/config/monetization.ts`.
- **Required Packages**:
  ```bash
  npm install react-native-google-mobile-ads
  ```

---

### **Meta Audience Network**

- **Description**: Meta's (Facebook's) advertising network serves as another source of ads.
- **Configuration**: The Meta App ID is configured in `app.json` and `src/config/monetization.ts`.
- **Required Packages**:
  ```bash
  npm install react-native-fbads
  ```
