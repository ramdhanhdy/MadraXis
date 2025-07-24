export default {
  expo: {
    name: "MadraXis",
    slug: "MadraXis",
    version: "1.0.0",
    sdkVersion: "53.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "madraxis",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    owner: "ramdhanhdy",
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.ramdhanhdy.madraxis",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash.png",
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      [
        "expo-custom-assets",
        {
          assetsPaths: ["./assets/animations"]
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "ec6e3f49-6b99-442a-a112-d3dda628767d",
      },
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    }
  }
};
