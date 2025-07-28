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
    },
    linking: {
      prefixes: ["madraxis://"],
      config: {
        screens: {
          "(auth)": {
            path: "auth",
            screens: {
              "login": "login",
              "reset-password": "reset-password"
            }
          },
          "(teacher)": {
            path: "teacher",
            screens: {
              "dashboard": "dashboard",
              "students": {
                path: "students",
                screens: {
                  "index": "",
                  "[id]": ":id"
                }
              },
              "class": {
                path: "class",
                screens: {
                  "index": "",
                  "[id]": {
                    path: ":id",
                    screens: {
                      "index": "",
                      "add-students": "add-students",
                      "students": "students",
                      "schedule": "schedule",
                      "reports": "reports"
                    }
                  }
                }
              }
            }
          },
          "(management)": {
            path: "management",
            screens: {
              "dashboard": "dashboard",
              "setup": "setup",
              "user-management": "user-management"
            }
          },
          "(parent)": {
            path: "parent",
            screens: {
              "dashboard": "dashboard",
              "anti-bullying": "anti-bullying",
              "cctv-request": "cctv-request",
              "incident-report": "incident-report"
            }
          },
          "(student)": {
            path: "student",
            screens: {
              "dashboard": "dashboard",
              "anti-bullying": "anti-bullying",
              "boarding-info": "boarding-info",
              "schedule": "schedule",
              "quran-progress": "quran-progress",
              "incident-report": "incident-report"
            }
          }
        }
      }
    }
  }
};
