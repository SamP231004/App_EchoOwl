import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import { SafeAreaWrapper } from "@src/components/SafeAreaWrapper";

export default function Landing() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  return (
    <SafeAreaWrapper style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            Echo<Text style={styles.logoBlue}>Owl</Text>
          </Text>

          <View style={styles.nav}>
            {/* <TouchableOpacity>
              <Text style={styles.navLink}>Pricing</Text>
            </TouchableOpacity> */}

            {isSignedIn ? (
              <TouchableOpacity
                style={styles.signUpBtn}
                onPress={() =>
                  router.push("/(app)/(tabs)/dashboard")
                }
              >
                <Text style={styles.signUpText}>
                  Dashboard →
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => router.push("/sign-in")}
                >
                  <Text style={styles.navLink}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.signUpBtn}
                  onPress={() => router.push("/sign-up")}
                >
                  <Text style={styles.signUpText}>
                    Sign Up →
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={require("assets/images/brand-asset-wave.png")}
            style={styles.wave}
          />

          <Text style={styles.heading}>
            Real-Time SaaS Insights,
          </Text>

          <Text style={styles.headingBlue}>
            Delivered to Your Discord
          </Text>

          <Text style={styles.description}>
            EchoOwl is the easiest way to monitor your SaaS.
            Get instant notifications for sales, new users,
            or any other event sent directly to your Discord.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.feature}>
            ✓ Real-time Discord alerts for critical events
          </Text>

          <Text style={styles.feature}>
            ✓ Buy once, use forever
          </Text>

          <Text style={styles.feature}>
            ✓ Track sales, new users, or any other event
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.cta}
          onPress={() =>
            router.push(
              isSignedIn
                ? "/(app)/(tabs)/dashboard"
                : "/sign-up"
            )
          }
        >
          <Text style={styles.ctaText}>
            {isSignedIn
              ? "Go To Dashboard →"
              : "Start For Free Today →"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FB",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  header: {
    marginTop: 16,
  },

  logo: {
    fontSize: 42,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  logoBlue: {
    color: "#3B5CCC",
  },

  nav: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 22,
    flexWrap: "wrap",
  },

  navLink: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "500",
  },

  signUpBtn: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  signUpText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },

  hero: {
    marginTop: 20,
    alignItems: "center",
  },

  wave: {
    width: 240,
    height: 240,
    resizeMode: "contain",
    marginBottom: 8,
  },

  heading: {
    textAlign: "center",
    fontSize: 32,
    color: "#111827",
    lineHeight: 48,
    fontFamily: "PlayfairDisplay",
  },

  headingBlue: {
    textAlign: "center",
    fontSize: 32,
    color: "#3B5CCC",
    lineHeight: 48,
    marginBottom: 18,
    fontFamily: "PlayfairDisplay",
  },

  description: {
    textAlign: "center",
    color: "#4B5563",
    fontSize: 17,
    lineHeight: 30,
    width: "100%",
  },

  features: {
    marginTop: 34,
    width: "95%",
    alignSelf: "center",
  },

  feature: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
    marginBottom: 14,
  },

  cta: {
    marginTop: 20,
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",

    backgroundColor: "#3B5CCC",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",

    shadowColor: "#3B5CCC",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 5,
  },

  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});