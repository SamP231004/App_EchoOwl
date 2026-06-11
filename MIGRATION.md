# 🧭 EchoOwl Migration Guide

This document explains the migration of EchoOwl from a Next.js web app to a React Native + Expo mobile app.

The goal of the migration was to keep the same backend and product workflow while creating a native mobile experience for authentication, dashboard monitoring, category management, usage tracking, and Stripe-powered upgrades.

## 📌 Migration Summary

| Area | Before | After |
|---|---|---|
| App shell | Next.js App Router | Expo Router |
| UI runtime | React DOM | React Native |
| Styling | CSS / Tailwind-style web layout | React Native `StyleSheet` |
| Auth | Clerk for Next.js | Clerk Expo SDK |
| Data layer | Web API client | Axios REST client |
| State | React Query focused | React Query + Zustand |
| Secure storage | Browser/session storage patterns | Expo Secure Store |
| Deployment | Web hosting | Expo EAS Android APK |
| Backend | Spring Boot | Spring Boot unchanged |

## 🏗️ Project Structure

### Before: Next.js

```text
.
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # Web components
│   ├── hooks/                  # Web hooks
│   └── lib/                    # Web utilities
├── prisma/                     # Database schema
└── package.json
```

### After: React Native + Expo

```text
.
├── app/                        # Expo Router routes
│   ├── (auth)/                 # Sign in, sign up, verification
│   ├── (landing)/              # Landing screen
│   └── (app)/(tabs)/           # Protected mobile app screens
├── src/
│   ├── components/             # React Native components
│   ├── hooks/                  # React Query hooks
│   ├── lib/                    # API client, providers, utilities
│   ├── store/                  # Zustand stores
│   ├── types/                  # Shared TypeScript types
│   └── utils/                  # Helper exports
├── assets/                     # Icons, splash, brand files
├── ScreenShots/                # Mobile screenshots
├── app.json                    # Expo config
├── eas.json                    # EAS build profiles
└── package.json
```

## 🧩 Component Migration

| Web Component | React Native Equivalent | Notes |
|---|---|---|
| `<div>` | `<View>` | Layout container |
| `<p>`, `<span>`, headings | `<Text>` | All text must live inside `Text` |
| `<button>` | `<TouchableOpacity>` / custom `Button` | Press interactions |
| `<input>` | `<TextInput>` | Native text input |
| `<form>` | `react-hook-form` + handlers | No browser form submit |
| CSS classes | `StyleSheet.create` | Native styling object |
| `next/link` | `Link` / `useRouter` from Expo Router | Native navigation |
| Browser modal | React Native modal components | Mobile-first interaction |

### Example

```tsx
<TouchableOpacity style={styles.button} onPress={handlePress}>
  <Text style={styles.buttonText}>Create Category</Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#3B5CCC",
    borderRadius: 14,
    height: 56,
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
})
```

## 🔐 Authentication Migration

### Before

- `@clerk/nextjs`
- Middleware-based route protection
- Server helpers such as `currentUser()`
- Browser redirect flows

### After

- `@clerk/expo`
- `ClerkProvider` in the root layout
- `useAuth`, `useSignIn`, and `useSignUp`
- Expo Secure Store token cache
- Expo Router protected route groups

The standalone APK needs these build-time values:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=https://your-backend-url.com
```

## 🔌 API Client Migration

The backend remains unchanged. The mobile app communicates with the same Spring Boot API through Axios.

| Feature | Endpoint |
|---|---|
| Auth sync | `GET /api/auth/getDatabaseSyncStatus` |
| Categories | `GET /api/category/getEventCategories` |
| Create category | `POST /api/category/createEventCategory` |
| Delete category | `POST /api/category/deleteCategory` |
| Category events | `GET /api/category/getEventsByCategoryName` |
| Usage | `GET /api/project/getUsage` |
| Plan | `GET /api/payment/getUserPlan` |
| Mobile checkout | `POST /api/payment/createMobileCheckoutSession` |
| Discord ID | `POST /api/project/setDiscordID` |
| Events webhook | `POST /api/events` |

## 🧠 State Management

| Concern | Tool |
|---|---|
| Server cache | TanStack React Query |
| Auth/user state | Clerk hooks + local stores |
| Category state | Zustand |
| Usage state | Zustand |
| Token persistence | Expo Secure Store |

React Query handles API freshness and retry behavior, while Zustand keeps lightweight app state available across screens.

## 🧭 Navigation Mapping

| Web Route | Mobile Route | Purpose |
|---|---|---|
| `/` | `app/(landing)/index.tsx` | Landing page |
| `/sign-in` | `app/(auth)/sign-in.tsx` | Sign in |
| `/sign-up` | `app/(auth)/sign-up.tsx` | Sign up |
| `/verify-email` | `app/(auth)/verify-email.tsx` | Email verification |
| `/dashboard` | `app/(app)/(tabs)/dashboard/index.tsx` | Category dashboard |
| `/dashboard/category/[name]` | `app/(app)/(tabs)/dashboard/category/[name].tsx` | Category detail |
| `/settings` | `app/(app)/(tabs)/settings.tsx` | Account settings |
| `/api-keys` | `app/(app)/(tabs)/api-keys.tsx` | API key settings |
| `/upgrade` | `app/(app)/(tabs)/upgrade.tsx` | Plan upgrade |

## 📱 Mobile Screens

| Screenshot | Screen |
|---|---|
| `SS_1.jpeg` | Landing page |
| `SS_2.jpeg` | Dashboard |
| `SS_3.jpeg` | Create category |
| `SS_4.jpeg` | Category detail |
| `SS_5.jpeg` | API key setting |
| `SS_6.jpeg` | Upgrade page |
| `SS_7.jpeg` | Stripe integration payment page |
| `SS_8.jpeg` | Account setting page |

## 📸 Screenshot Gallery

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="./ScreenShots/SS_1.jpeg" alt="Landing page" width="170" /><br /><sub>Landing</sub></td>
      <td align="center"><img src="./ScreenShots/SS_2.jpeg" alt="Dashboard" width="170" /><br /><sub>Dashboard</sub></td>
      <td align="center"><img src="./ScreenShots/SS_3.jpeg" alt="Create category" width="170" /><br /><sub>Create Category</sub></td>
      <td align="center"><img src="./ScreenShots/SS_4.jpeg" alt="Category detail" width="170" /><br /><sub>Category Detail</sub></td>
    </tr>
    <tr>
      <td align="center"><img src="./ScreenShots/SS_5.jpeg" alt="API key setting" width="170" /><br /><sub>API Key</sub></td>
      <td align="center"><img src="./ScreenShots/SS_6.jpeg" alt="Upgrade page" width="170" /><br /><sub>Upgrade</sub></td>
      <td align="center"><img src="./ScreenShots/SS_7.jpeg" alt="Stripe payment page" width="170" /><br /><sub>Stripe</sub></td>
      <td align="center"><img src="./ScreenShots/SS_8.jpeg" alt="Account setting page" width="170" /><br /><sub>Account</sub></td>
    </tr>
  </table>
</div>

## ✅ Feature Status

| Feature | Status | Notes |
|---|---|---|
| Sign in / sign up | ✅ Done | Clerk Expo SDK |
| Email verification | ✅ Done | Clerk verification flow |
| Dashboard | ✅ Done | Category list and usage overview |
| Create category | ✅ Done | Mobile modal flow |
| Category detail | ✅ Done | Event list per category |
| Plan upgrade | ✅ Done | Stripe checkout via backend |
| Account settings | ✅ Done | Sign out and account options |
| API key screen | ⚠️ Partial | Use web version to edit/view sensitive keys |
| Discord key management | ⚠️ Partial | Use web version for key management |

## 🚧 Removed or Simplified Web Features

- Server-side rendering is not used in mobile.
- Browser-specific layout and hover states were replaced with native interactions.
- Web navbar was replaced with mobile navigation.
- API key and Discord key editing are currently handled by the web version.
- Direct database access remains backend-only.

## 📦 EAS Build Notes

Preview APK:

```bash
eas build --platform android --profile preview
```

The Android keystore is managed by Expo. Future builds should use the same Expo account so new APKs install as updates over older versions.

## 🧪 Verification

```bash
npm run typecheck
npm run lint
```

## 🧯 Troubleshooting

| Issue | Fix |
|---|---|
| APK closes immediately | Check EAS environment values for Clerk and API URL |
| API works locally but not on phone | Replace `localhost` with a deployed backend URL or LAN IP |
| Clerk fails in APK | Confirm `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is included in the EAS profile |
| TypeScript path warnings | Avoid deprecated `baseUrl`; keep aliases mapped to `./src/*` paths |
| Old launcher icon remains | Uninstall old APK or clear launcher cache before installing the new build |

## 🔗 Related Links

- [README](./README.md)
- [Expo Documentation](https://docs.expo.dev)
- [Expo Router](https://docs.expo.dev/routing/introduction)
- [EAS Build](https://docs.expo.dev/build/introduction)
- [React Native](https://reactnative.dev)
- [Clerk Expo SDK](https://clerk.com/docs/references/expo/overview)

---

**Version:** 0.1.0  
**Expo SDK:** 54  
**React Native:** 0.81.5  
**Last Updated:** 2026-06-11
