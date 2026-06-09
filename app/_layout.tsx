import "react-native-gesture-handler";
import "react-native-reanimated";

import * as WebBrowser from "expo-web-browser";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Providers } from "../src/lib/Providers";

WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers>
        <Slot />
      </Providers>
    </GestureHandlerRootView>
  );
}