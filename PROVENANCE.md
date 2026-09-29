# lastikadi-site — public mirror of the built lastikadi.com landing page

This repository is a **mirror**. It holds only the built static output.

- Source of truth: the private `josephmalaba/lastikadi-web` repository,
  branch `web/verify-toolchain`, commit 54a4080a06e19035626e711f316a855590dc1ba8.
- Built with `npm run build` (`scripts/emit-dist.mjs`): content-addressed
  assets, generated cache policy, claim guard enforced at build time.
- Every claim on this page resolves to `data/truth.json` in the source repo.
  The KADI entry is labelled EXPERIMENTAL PREVIEW. Nothing is playable,
  installable, or for sale. No accessibility conformance is claimed.
- Do not edit files here. Change the source, rebuild, re-mirror.