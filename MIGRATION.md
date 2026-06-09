# EchoOwl: Next.js to React Native + Expo Migration Guide

## Overview

This document outlines the complete migration of EchoOwl from a Next.js web application to a React Native + Expo mobile application (version 54.0.8).

## Key Changes & Migration Patterns

### 1. Project Structure

#### Before (Next.js)
```
.
├── src/
│   ├── app/          # Next.js App Router
│   ├── components/   # React components
│   ├── lib/          # Utilities
│   └── hooks/        # Custom hooks
├── prisma/          # Database schema
└── package.json
```

#### After (React Native + Expo)
```
app/
├── app/             # Expo Router (file-based routing)
├── src/
│   ├── components/  # React Native components
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Utilities, API client
│   ├── store/       # Zustand state management
│   ├── types/       # TypeScript types
│   └── utils/       # Constants and helpers
└── package.json
```

### 2. Component Migration

#### Web Components → React Native Components

| Web (Next.js) | Mobile (React Native) | Notes |
|---|---|---|
| `<div>` | `<View>` | Main container |
| `<p>`, `<span>` | `<Text>` | Text content |
| `<button>` | `<TouchableOpacity>` + `<Button>` | User interactions |
| `<input>` | `<TextInput>` | Input fields |
| `<form>` | Form validation with `react-hook-form` | Form handling |
| CSS/Tailwind | `StyleSheet` API | Styling |
| `next/link` | `expo-router` | Navigation |
| `next/router` | `useRouter` from `expo-router` | Routing |

#### Example: Button Component

**Before (Next.js + Tailwind):**
```tsx
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
  Click me
</button>
```

**After (React Native):**
```tsx
<TouchableOpacity 
  style={[styles.button, { backgroundColor: "#2563EB" }]}
  onPress={handlePress}
>
  <Text style={styles.buttonText}>Click me</Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
  }
})
```

### 3. State Management Migration

#### Before (Next.js): Client-side only with React Query
```tsx
const { data: categories } = useQuery({
  queryKey: ["categories"],
  queryFn: async () => {
    const res = await client.category.getEventCategories.$get()
    return res.json()
  }
})
```

#### After (React Native + Zustand + React Query)
```tsx
// Store (Zustand)
export const useCategoryStore = create((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
}))

// Hook
export const useEventCategories = () => {
  const setCategories = useCategoryStore((state) => state.setCategories)
  return useQuery({
    queryKey: ["user-event-categories"],
    queryFn: async () => {
      const response = await apiService.category.getEventCategories()
      setCategories(response.categories)
      return response.categories
    },
  })
}
```

### 4. Authentication Changes

#### Before (Next.js with Clerk)
- Used `@clerk/nextjs` for server-side and client-side auth
- Clerk middleware for route protection
- `currentUser()` helper for server components

#### After (React Native with Clerk)
- Uses `@clerk/clerk-react-native` for native auth
- `ClerkProvider` wrapper around app
- `useAuth()` hook for user information
- Token stored in secure store (Expo Secure Store)

```tsx
import { useAuth } from "@clerk/clerk-react-native"

export default function MyScreen() {
  const { user, isSignedIn, signOut } = useAuth()
  
  return (
    <View>
      <Text>{user?.emailAddresses[0].emailAddress}</Text>
      <Button onPress={signOut} title="Sign Out" />
    </View>
  )
}
```

### 5. API Client Migration

#### Before (Next.js with Hono)
```tsx
import { hc } from "hono/client"

export const baseClient = hc<any>(getBaseUrl(), {
  fetch: async (input, init) => {
    const token = await getClerkToken()
    // Add authorization header
  }
})
```

#### After (React Native with Axios)
```tsx
import axios from "axios"
import * as SecureStore from "expo-secure-store"

export const getApiClient = async () => {
  return axios.create({
    baseURL: getBaseURL(),
    headers: { "Content-Type": "application/json" },
  })
}
```

### 6. Styling Approach

#### Before (Next.js + Tailwind)
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <span className="text-lg font-semibold text-gray-900">Title</span>
</div>
```

#### After (React Native + StyleSheet)
```tsx
<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  }
})
```

### 7. Navigation Structure

#### Before (Next.js App Router)
```
src/app/
├── layout.tsx           # Root layout
├── dashboard/
│   ├── page.tsx         # /dashboard
│   └── category/
│       └── [name]/
│           └── page.tsx # /dashboard/category/[name]
├── (auth)/
│   ├── sign-in/page.tsx
│   └── sign-up/page.tsx
└── (landing)/
    └── page.tsx
```

#### After (Expo Router)
```
app/
├── _layout.tsx          # Root layout
├── (auth)/
│   ├── _layout.tsx
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   └── welcome.tsx
└── (app)/
    ├── _layout.tsx      # Tab navigator
    └── (tabs)/
        ├── _layout.tsx
        ├── dashboard/
        │   ├── _layout.tsx
        │   ├── index.tsx
        │   └── category.tsx
        ├── activity.tsx
        └── settings.tsx
```

### 8. Form Handling

#### Before (Next.js with shadcn/ui)
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const form = useForm({ resolver: zodResolver(schema) })
const onSubmit = form.handleSubmit(async (data) => {
  // Submit form
})

return (
  <form onSubmit={onSubmit}>
    <Input {...form.register("email")} />
  </form>
)
```

#### After (React Native)
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const { register, handleSubmit, watch, formState: { errors } } = 
  useForm({ resolver: zodResolver(schema) })

const onSubmit = handleSubmit(async (data) => {
  // Submit form
})

return (
  <View>
    <Input 
      value={email}
      onChangeText={setEmail}
      error={errors.email?.message}
    />
    <Button onPress={onSubmit} />
  </View>
)
```

### 9. Data Fetching & Caching

#### Before (Next.js)
- Used Prisma Client directly in server components
- Hono for API endpoints
- React Query for client-side data fetching

#### After (React Native)
- Only uses REST API (no direct database access from mobile)
- Axios for HTTP requests
- React Query for caching
- Zustand for client state

### 10. Environment Variables

#### Before (Next.js)
```env
NEXT_PUBLIC_API_URL=
DATABASE_URL=
CLERK_SECRET_KEY=
```

#### After (React Native with Expo)
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_API_URL=
```

**Note:** Variables prefixed with `EXPO_PUBLIC_` are available at build time.

## Screen-by-Screen Mapping

| Next.js Page | React Native Screen | Functionality |
|---|---|---|
| `/sign-in` | `/(auth)/sign-in.tsx` | Email/password sign-in |
| `/sign-up` | `/(auth)/sign-up.tsx` | Email/password registration |
| `/welcome` | `/(auth)/welcome.tsx` | Email verification |
| `/dashboard` | `/(app)/(tabs)/dashboard/index.tsx` | Main dashboard with categories |
| `/dashboard/category/[name]` | `/(app)/(tabs)/dashboard/category.tsx` | Category details & events |
| `/dashboard/settings` | `/(app)/(tabs)/settings.tsx` | Account & plan settings |
| `/pricing` | Included in settings | Plan upgrade |
| `/` | Landing page removed | Not needed in mobile app |

## API Integration

### Unchanged Backend
The Spring Boot backend remains **completely unchanged**. The React Native app communicates with the same API endpoints:

```
Base URL: http://localhost:8080 (dev) or https://your-backend.com (prod)

Endpoints:
- GET /api/auth/getDatabaseSyncStatus
- GET /api/category/getEventCategories
- POST /api/category/createEventCategory
- POST /api/category/deleteCategory
- GET /api/category/getEventsByCategoryName
- GET /api/payment/getUserPlan
- POST /api/payment/createCheckoutSession
- GET /api/project/getUsage
- POST /api/project/setDiscordID
- POST /api/events
- POST /api/webhooks/stripe
```

## Removed Features

Since this is a mobile app, some web-specific features were removed or simplified:

- **Landing Page**: Not needed on mobile (app is downloaded directly)
- **Pricing Page**: Integrated into Settings
- **Navbar**: Replaced with bottom tab navigation
- **Responsive Grid**: Simplified for mobile screens
- **Server-side Rendering**: Not applicable to mobile

## Added Features (Mobile-specific)

- **Bottom Tab Navigation**: Easy access to main sections
- **Modal Screens**: Better UX for modals in mobile
- **Secure Storage**: Token storage in secure enclave
- **Native Notifications**: Ready for push notifications
- **Haptic Feedback**: Ready for vibration feedback
- **Share Functionality**: Native share integration ready

## Development Workflow

### Setting Up Locally

1. **Backend (unchanged):**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Mobile App (new):**
   ```bash
   cd app
   pnpm install
   pnpm start
   # Scan QR code with Expo Go or run on emulator
   ```

### Key Differences in Development

| Aspect | Next.js | React Native |
|---|---|---|
| Dev Server | `npm run dev` | `expo start` |
| Hot Reload | Automatic | Fast Refresh (automatic) |
| Preview | Browser | Expo Go app or emulator |
| Debugging | Dev Tools | React Native Debugger |
| TypeScript | Built-in | TypeScript support |

## Performance Considerations

### Mobile-specific Optimizations

1. **API Caching**: React Query caches aggressively
2. **State Management**: Zustand for lightweight state
3. **Code Splitting**: Expo handles this automatically
4. **Image Optimization**: Use `expo-image` for better caching
5. **Lazy Loading**: Built into Expo Router

## Testing Strategy

### Unit Tests
```bash
pnpm test
```

### E2E Tests with Detox
```bash
pnpm test:e2e
```

### Manual Testing
- Use Expo Go for quick testing
- Test on physical device before release
- Test on both iOS and Android

## Deployment

### Development
```bash
expo start --clear
```

### Preview Build
```bash
eas build --platform all --profile preview
```

### Production Build
```bash
eas build --platform all --profile production
eas submit --platform ios
eas submit --platform android
```

## Troubleshooting

### Common Issues

1. **"Module not found"**
   - Clear cache: `expo start --clear`
   - Reinstall: `pnpm install --force`

2. **"Auth token not found"**
   - Check Secure Store access
   - Verify Clerk credentials in .env

3. **"API connection refused"**
   - Verify backend is running
   - Check API URL in environment

4. **"Build fails on EAS"**
   - Check app.json configuration
   - Verify credentials and signing

## Conclusion

The React Native + Expo migration maintains feature parity with the original Next.js application while providing a native mobile experience. The backend remains unchanged, allowing for continued development and updates without affecting the mobile app.

### Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Guide](https://reactnative.dev)
- [Expo Router Docs](https://docs.expo.dev/routing/introduction)
- [Clerk React Native SDK](https://clerk.com/docs/sdks/react-native)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction)

---

**Version**: 0.1.0  
**Expo Version**: 54.0.8  
**React Native Version**: 0.76.5  
**Last Updated**: 2026-06-05
