import { CapacitorConfig } from "@capacitor/cli";
import { execSync } from "child_process";

const DEV_PORT = 8080;

const devServerUrl = process.env.CAPACITOR_DEV
  ? `http://${execSync("ip route get 1 | awk '{print $7}'")
      .toString()
      .trim()}:${DEV_PORT}`
  : null;

const config: CapacitorConfig = {
  appId: "com.wyattades.capacitornextjs",
  appName: "Capacitor Next.js",
  bundledWebRuntime: false,
  webDir: "www",
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
  server: devServerUrl
    ? {
        url: devServerUrl,
        cleartext: true,
      }
    : undefined,
  cordova: {},
};

export default config;
