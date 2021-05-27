# Capacitor and Next.js

Give a [Next.js](https://nextjs.org) app, compile it into a mobile app using the [Capactior](https://capacitorjs.com/) toolchain.

## Build details

- We use a custom webpack config to build a single-page-app and `index.html` file because we can't use Next.js's build process (i.e. `next build` and `next export`) because it doesn't work with SSP (server-side-props i.e. `getServerSideProps`).
- The frontend code calls a hardcoded "deployment" (aka version) of the Next.js server, e.g. https://$project_id-$deployment_id-$org_id.vercel.app, so updating the backend code on the primary server doesn't break the mobile app code in a backwards imcompatible way.

## Deployment guide

Build the JS/HTML assets for the mobile app

```bash
yarn build-app
npx cap sync
```
