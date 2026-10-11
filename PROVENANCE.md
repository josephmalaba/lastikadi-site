# lastikadi-site — public mirror of the built lastikadi.com landing page

This repository is a **mirror**. It holds only the built static output.

- Source of truth: the private `josephmalaba/lastikadi-web` repository,
  branch `main`, commit 537d720b24f86af48c5dea4ace83402e188edc73.
- Built with `npm run build` (`scripts/emit-dist.mjs`): content-addressed
  assets, generated cache policy, claim guard enforced at build time.
- Every claim on this page resolves to `data/truth.json` in the source repo.
  The KADI entry is labelled EXPERIMENTAL PREVIEW. Nothing is playable,
  installable, or for sale. No accessibility conformance is claimed.
- Do not edit files here. Change the source, rebuild, re-mirror.

The 2026-10-11 publication re-mirrors the whole built tree from main@537d720 and is the first to carry
the bounded TV layout, the visible join QR, table setup on the phone surface, and the second-screen
attach module (	v/attach.e1a4a24c.mjs). The standalone display manifest stays root-scoped at
	v/site.webmanifest, because tv.lastikadi.com is the canonical venue address and there the display is
at the root; the page's link is rewritten to match.