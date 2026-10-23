# SwatchRoom

A personal nail design fitting room built with YouCam Nail Virtual Try-On. Explore 100 original design references and 50 solid colours, customise each finger, generate a preview, and keep a shortlist before visiting a salon. No prices, checkout or real orders.

## Run locally

Requires Node 22.13 or newer. Run `npm ci`, create an ignored `.dev.vars` file containing `YOUCAM_API_KEY=your_key`, then run `npm run dev`. On Windows, double-click `START-SWATCHROOM.cmd` and keep its window open. Open the Local URL printed in the terminal, normally http://127.0.0.1:5173/.

Run `CHECK-RELEASE.cmd` in normal Windows CMD to check types, run mocked API tests, and build the production bundle. Never commit `.dev.vars`, API keys, generated preview download URLs, or hand-photo test files.

## Features

- 100 original illustrated designs and 50 distinct solid colours, searchable by name/style.
- Custom colour/hex, art and finish per finger; apply one style to all fingers.
- Square, squoval, oval, almond and stiletto extension shapes for custom colours. Round and coffin/ballerina are salon preferences only. Pattern references determine the outline of patterned extensions.
- Relative extension length, with shorter thumb proportions. Materials such as acrylic, gel and dip powder are brief preferences, not physical material simulation.
- Downloadable salon brief, comparison shortlist of three, and saved collection.
- Browser-local saved metadata and preview pixels survive refresh. This is not an account or cross-device sync. Clearing site data removes saves.

## YouCam integration

The server route `app/api/try-on/route.ts` calls authenticated File API uploads and Nail VTO tasks. The browser polls signed, expiring task references. Keys remain server-side. Input styles, file type/size/signature and same-origin requests are validated. Completed images are provider results, never a CSS overlay on the hand photo. Results are approximations and can have placement/finish artifacts.

Polish references use opaque edge-to-edge artwork so YouCam supplies the detected nail contour. Extensions use transparent silhouettes and separate wider thumb references. `scripts/create-nail-designs.mjs` regenerates these assets and their server path manifest. PNG bytes are loaded through the static ASSETS binding, rather than embedded in the Worker code. `scripts/expanded-designs.mjs` contains the additional art recipes. Artwork is original, inspired by nail-art categories rather than copied salon photographs.

Uploads require consent and are re-encoded in the browser to strip metadata and limit dimensions. Source photos are not stored by the app server. Saved output images are stored on the visitor's device. YouCam processing/retention terms also apply. The sample hand is remotely supplied by YouCam's official example.

## Validation

`node node_modules/typescript/bin/tsc --noEmit` and `node scripts/test-api.mjs` check types and mocked validation/upload/task/polling paths without consuming live units. Seven agent-run live sample tasks were recorded as successful, including a hosted Cocoa Tartan preview; the exact unit debit was not independently measured. More personal-photo coverage remains to be validated with consent.

## Hosting status

The public app is deployed on Cloudflare Workers at https://swatchroom.swatchroom-studio.workers.dev/ . The app loaded in a fresh browser tab on 23 October 2026. The hosted YouCam sample preview and saved-image persistence across refresh were verified earlier that day before the account subdomain rename. No login is required to explore the studio.

The direct Cloudflare deployment uses the DB and ASSETS bindings, with the included database migration applied and the API key stored as a server secret. Build with `SWATCHROOM_DEPLOY_TARGET=cloudflare npm run build` and deploy using `npx wrangler deploy --config dist/server/wrangler.json`. GitHub Actions release checks and Cloudflare production builds passed. The separate original Sites project remains owner-private and undeployed; its identity is preserved in `.openai/hosting.json` and is distinct from this working public deployment.

Hosted preview reservations use D1: maximum 200 requests in total, 50 globally per UTC day, 10 per hashed visitor per UTC day, and a 60-second cooldown. These cap submitted requests, not provider units. Failed provider attempts also consume a reservation. The endpoint fails closed when D1 is unavailable. Localhost retains the existing local testing flow. No raw identity/IP is stored: a keyed hash identifies a visitor. The lifetime limit requires deliberate owner adjustment; it does not refill automatically. Keep judge access available throughout the judging period and check the remaining provider budget.

## Licences and attribution

Original source and generated artwork: MIT, see LICENSE. Fraunces by The Fraunces Project Authors: SIL Open Font License 1.1, included in `public/fonts/Fraunces-OFL.txt`. Gouttes has been removed from publishable files because its public-use rights were not established. Third-party dependencies retain their licences; sample media and YouCam output are subject to provider terms. The campaign image is AI-generated original artwork.

API documentation: https://docs.perfectcorp.com/reference/ai_nail_vto
