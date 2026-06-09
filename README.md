# EchoOwl - React Native + Expo

This is the React Native + Expo 54.0.8 mobile version of EchoOwl - a production-ready SaaS event monitoring platform with real-time Discord alerts.

## 📱 Features

- 🔐 **Authentication** - Clerk integration for secure sign-in/sign-up
- 📊 **Dashboard** - Manage event categories with emoji and color customization
- 📈 **Activity** - Monitor recent events and activity
- ⚙️ **Settings** - Account management and plan upgrades
- 💳 **Plans** - FREE and PRO plans with different quotas
- 📱 **Responsive** - Mobile-first design for iOS and Android

## 🛠️ Tech Stack

| Category | Technology |
|--------|------------|
| Framework | React Native, Expo 54.0.8 |
| Language | TypeScript |
| State Management | Zustand, React Query |
| Authentication | Clerk |
| HTTP Client | Axios |
| Form Validation | Zod, React Hook Form |
| Navigation | Expo Router |
| Icons | Lucide React Native |
| UI Components | Custom components |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (for iOS development)
- Android: Android Studio (for Android development)

### Installation

1. **Install dependencies:**
   ```bash
   cd app
   pnpm install
   # or
   npm install
   ```

2. **Set up environment variables:**
   Create an `.env` file in the `app` directory:
   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
   EXPO_PUBLIC_API_URL=http://localhost:8080
   ```

3. **Run the app:**
   ```bash
   # Start Expo development server
   pnpm start

   # For iOS
   pnpm ios

   # For Android
   pnpm android

   # For Web
   pnpm web
   ```

## 📁 Project Structure

```
app/
├── app/                        # Expo Router file-based routing
│   ├── (auth)/                # Authentication screens
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── welcome.tsx
│   ├── (app)/                 # App screens (protected)
│   │   └── (tabs)/            # Bottom tab navigation
│   │       ├── dashboard/
│   │       ├── activity.tsx
│   │       └── settings.tsx
│   └── _layout.tsx            # Root layout
├── src/
│   ├── components/            # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities, API client, providers
│   ├── store/                 # Zustand state stores
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper functions and constants
├── app.json                   # Expo configuration
├── app.tsx                    # App entry point
├── package.json
└── tsconfig.json
```

## 🔌 API Integration

The app connects to the EchoOwl backend API (Spring Boot) at `http://localhost:8080` by default.

### Available Endpoints

- `GET /api/auth/getDatabaseSyncStatus` - Check auth sync status
- `GET /api/category/getEventCategories` - Fetch all categories
- `POST /api/category/createEventCategory` - Create new category
- `POST /api/category/deleteCategory` - Delete category
- `GET /api/category/getEventsByCategoryName` - Get events for a category
- `GET /api/payment/getUserPlan` - Get user's plan
- `POST /api/payment/createCheckoutSession` - Create Stripe session
- `GET /api/project/getUsage` - Get usage statistics
- `POST /api/project/setDiscordID` - Set Discord ID

## 🔐 Environment Variables

```env
# Clerk (Required)
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# API Base URL (Optional - defaults to localhost:8080 in dev)
EXPO_PUBLIC_API_URL=http://localhost:8080
```

## 📦 Building for Production

### Build with Expo Application Services (EAS)

1. **Set up EAS:**
   ```bash
   eas build --platform all
   ```

2. **Configure in `app.json`:**
   - Update `extra.eas.projectId`
   - Update package names for iOS and Android

3. **Submit to stores:**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## 🧪 Development

### Running Locally

```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Mobile app
cd app
pnpm start
```

### Hot Reloading

Expo supports fast refresh - changes to your code will automatically update on connected devices.

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router Guide](https://docs.expo.dev/routing/introduction)
- [Clerk React Native](https://clerk.com/docs/sdks/react-native)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Query](https://tanstack.com/query/latest)

## 🐛 Troubleshooting

### Connection Issues
- Ensure backend is running on the expected URL
- Check if API credentials are correctly set in `.env`
- Verify Clerk configuration is correct

### Build Issues
- Clear cache: `pnpm install --force`
- Reset Expo cache: `expo start --clear`
- Rebuild Expo modules: `eas build --platform ios --profile preview`

### Authentication Issues
- Verify `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is set correctly
- Check Clerk dashboard for API key configuration
- Ensure deep linking is configured in app.json

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is a demonstration/learning project. For contributions, please refer to the main EchoOwl repository.

---

**Note**: This is the mobile version of EchoOwl. The backend remains unchanged and continues to run separately using Spring Boot and Java.
