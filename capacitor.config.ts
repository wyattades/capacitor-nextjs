import { CapacitorConfig } from "@capacitor/cli";
import { execSync } from "child_process";

const devServerUrl = process.env.CAPACITOR_DEV
  ? `http://${execSync("ip route get 1 | awk '{print $7}'")
      .toString()
      .trim()}:3000`
  : null;

console.log({ devServerUrl });

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
