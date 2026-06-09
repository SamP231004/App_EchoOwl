import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSignIn, useSignUp } from "@clerk/expo";

export default function VerifyEmail() {
  const router = useRouter();

  const { email, mode } = useLocalSearchParams<{
    email: string;
    mode?: string;
  }>();

  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError("");

      if (mode === "signup") {
        // SIGN UP FLOW
        await signUp.verifications.verifyEmailCode({
          code,
        });

        // Refresh auth state
        router.replace("/(app)/(tabs)/dashboard");
      } else {
        // SIGN IN FLOW
        await (signIn as any).verifyEmailCode({
          code,
        });

        await signIn.finalize();

        router.replace("/(app)/(tabs)/dashboard");
      }
    } catch (err: any) {
      console.log(err);

      setError(
        err?.errors?.[0]?.message ||
        "Invalid verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/brand-asset-heart.png")}
        style={styles.image}
      />

      <Text style={styles.title}>
        Verify your email
      </Text>

      <Text style={styles.email}>
        Code sent to {email}
      </Text>

      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="Enter verification code"
        keyboardType="number-pad"
        style={styles.input}
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleVerify}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Verify →"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },

  image: {
    width: 120,
    height: 120,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#0F172A",
  },

  email: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
    color: "#64748B",
  },

  input: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
  },

  button: {
    marginTop: 20,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#3B5CCC",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  error: {
    color: "#EF4444",
    marginTop: 10,
    textAlign: "center",
  },
});