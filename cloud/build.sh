#!/bin/sh
# Rebuilds cloud/firebase.js from cloud/src.js. Needs Node. Run from the repository root:  sh cloud/build.sh
set -e
T=$(mktemp -d)
cp cloud/src.js "$T/src.js"
(cd "$T" && npm init -y >/dev/null && npm i --silent firebase@13 esbuild >/dev/null && npx esbuild src.js --bundle --minify --format=iife --target=es2019 --legal-comments=none --outfile=out.js)
{ echo "/* Firebase JS SDK $(node -p "require(\"$T/node_modules/firebase/package.json\").version") (app, auth, firestore/lite), bundled from cloud/src.js. Apache License 2.0, https://github.com/firebase/firebase-js-sdk */"; cat "$T/out.js"; } > cloud/firebase.js
rm -rf "$T"
echo "cloud/firebase.js: $(wc -c < cloud/firebase.js) bytes"
