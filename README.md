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

`node node_modules/typescript/bin/tsc --noEmit` and `node scripts/test-api.mjs` check types and mocked validation/upload/task/polling paths without consuming live units. Six agent-run live sample tasks were previously recorded as successful; the exact unit debit was not independently measured. More personal-photo coverage remains to be validated with consent.

## Hosting status

The existing Sites project is owner-private and has no deployed version. Site identity is preserved in `.openai/hosting.json`. Production build/publishing from this Codex environment is blocked by Windows child-process permissions (`spawn EPERM`). A normal CMD release check is provided. Do not expose the funded proxy publicly until durable budgets, abuse controls and judge access are configured. Never describe an expected hostname as a live deployment.

## Licences and attribution

Original source and generated artwork: MIT, see LICENSE. Fraunces by The Fraunces Project Authors: SIL Open Font License 1.1, included in `public/fonts/Fraunces-OFL.txt`. Gouttes has been removed from publishable files because its public-use rights were not established. Third-party dependencies retain their licences; sample media and YouCam output are subject to provider terms. The campaign image is AI-generated original artwork.

API documentation: https://docs.perfectcorp.com/reference/ai_nail_vto
