import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "finanzas",
  webDir: "dist",
  android: {
    allowMixedContent: true,
  },
  plugins: {
    StatusBar: {
      style: "light",
      backgroundColor: "#ffffff",
      overlaysWebView: false,
    },
  },
};

export default config;
