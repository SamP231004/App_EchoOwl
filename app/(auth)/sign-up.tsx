import React, { useState, useEffect } from "react";
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
import { useSignUp, useAuth } from "@clerk/expo";

export default function SignUp() {
  const router = useRouter();

  const { isSignedIn } = useAuth();
  const { signUp } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(app)/(tabs)/dashboard");
    }
  }, [isSignedIn, router]);

  const handleSignUp = async () => {
    try {
      setError("");

      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.verifications.sendEmailCode();

      router.push({
        pathname: "/verify-email",
        params: {
          email,
          mode: "signup",
        },
      });
    } catch (err: any) {
      console.log(err);

      setError(
        err?.errors?.[0]?.message ||
        "Failed to create account"
      );
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require("../../assets/images/brand-asset-heart.png")}
        style={styles.heroImage}
      />

      <Text style={styles.title}>
        Create your EchoOwl account
      </Text>

      <Text style={styles.subtitle}>
        Start monitoring your SaaS events in minutes.
      </Text>

      <Text style={styles.label}>Email address</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Create a password"
        style={styles.input}
        secureTextEntry
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSignUp}
      >
        <Text style={styles.primaryButtonText}>
          Create Account →
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/sign-in")}
      >
        <Text style={styles.secondaryText}>
          Already have an account? Sign In
        </Text>
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

  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#0F172A",
  },

  input: {
    height: 56,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  primaryButton: {
    height: 56,
    marginTop: 8,
    backgroundColor: "#3B5CCC",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  secondaryText: {
    marginTop: 20,
    textAlign: "center",
    color: "#3B5CCC",
    fontWeight: "600",
  },

  error: {
    color: "#EF4444",
    marginBottom: 12,
    textAlign: "center",
  },
});