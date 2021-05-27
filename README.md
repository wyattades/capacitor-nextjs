# Capacitor and Next.js

Given a [Next.js](https://nextjs.org) app, compile it into a mobile app using the [Capacitor](https://capacitorjs.com/) toolchain.

## Build details

- We use a custom webpack config to build a single-page-app and `index.html` file because we can't use Next.js's build process (i.e. `next build` and `next export`) because it doesn't work with SSP (server-side-props i.e. `getServerSideProps`).
- The frontend code calls a hardcoded "deployment" (aka version) of the Next.js server, e.g. https://$project_id-$deployment_id-$org_id.vercel.app, so updating the backend code on the primary server doesn't break the mobile app code in a backwards imcompatible way.
- `<filename>.mobile.js` files have priority and will be loaded instead of `<filename>.js` files

## Mobile app development

Environment setup:

- Follow the instructions here to setup Android Studio and/or XCode: https://capacitorjs.com/docs/getting-started/environment-setup
- Run `yarn install`

In separate terminals, run the Next.js dev server (for serving api requests) and the mobile app dev server (for serving static assets):

```bash
# Next.js
yarn dev

# Mobile app assets
yarn mobile:dev
```

Then, run `yarn mobile:android-dev` or `yarn mobile:ios-dev` to open Android Studio or XCode respectively. From their, launch an emulator or physical device and your app should show up!

NOTE: You can edit your app's source code and the device should hot-reload automatically.

## Installing Capacitor plugins

You can view the available plugins and their installation instructions here: https://capacitorjs.com/docs/plugins
