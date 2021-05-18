#!/usr/bin/env bash

set -eo pipefail

base_path=capacitor.config.json
android_path=android/app/src/main/assets/capacitor.config.json
ios_path=ios/App/App/capacitor.config.json

get_local_ip() {
  ip route get 1 | awk '{print $7}'
}

apply_dynamic_config() {
  DEV_SERVER_URL="http://$(get_local_ip):3000" \
    envsubst < $base_path > $android_path

  cp $android_path $ios_path
}

run_dev_server() {
  npx next dev
}

reset_config() {
  rm -f $android_path $ios_path
  cp $base_path $android_path
  cp $base_path $ios_path
}

apply_dynamic_config

trap reset_config EXIT

run_dev_server
