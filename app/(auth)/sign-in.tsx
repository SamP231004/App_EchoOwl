import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSSO, useSignIn } from "@clerk/expo";
import * as Linking from "expo-linking";

export default function SignIn() {
  const router = useRouter();

  const { startSSOFlow } = useSSO();
  const { signIn } = useSignIn();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const redirectUrl = Linking.createURL("/sso-callback");

      const { createdSessionId, setActive } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl,
        });

      if (createdSessionId) {
        await setActive?.({
          session: createdSessionId,
        });

        router.replace("/(app)/(tabs)/dashboard");
      }
    } catch (err) {
      console.log("Google Sign In Error:", err);
    }
  };

  const handleSendCode = async () => {
    try {
      setError("");

      await signIn.create({
        identifier: email,
      });

      // Cast to 'any' to bypass missing TypeScript definitions for this helper
      await (signIn as any).sendEmailCode();

      router.push({
        pathname: "/verify-email",
        params: {
          email,
        },
      });
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Failed to send code");
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Image
        source={require("../../assets/images/brand-asset-heart.png")}
        style={styles.heroImage}
      />

      <Text style={styles.title}>Sign in to EchoOwl</Text>

      <Text style={styles.subtitle}>
        Welcome back! Please sign in to continue.
      </Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
      >
        <Image
          source={require("../../assets/images/google_icon.jpg")}
          style={styles.googleIcon}
        />

        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>

      <Text style={styles.label}>Email address</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        style={styles.input}
        autoCapitalize="none"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleSendCode}
      >
        <Text style={styles.continueText}>Send Code →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  heroImage: {
    width: 120,
    height: 120,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    color: "#0F172A",
  },
  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 8,
    marginBottom: 28,
  },
  googleButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  googleText: {
    fontWeight: "600",
    fontSize: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#64748B",
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    height: 56,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  continueButton: {
    height: 56,
    marginTop: 20,
    backgroundColor: "#3B5CCC",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  continueText: {
    color: "#FFF",
    fontWeight: "700",
  },
  error: {
    color: "red",
    marginTop: 8,
  },
});