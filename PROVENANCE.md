# lastikadi-site — public mirror of the built lastikadi.com landing page

This repository is a **mirror**. It holds only the built static output.

- Source of truth: the private `josephmalaba/lastikadi-web` repository,
  branch `main`, commit 85e41d9c08b8745de660e1dc6a2ee91e25b2f202.
- Built with `npm run build` (`scripts/emit-dist.mjs`): content-addressed
  assets, generated cache policy, claim guard enforced at build time.
- Every claim on this page resolves to `data/truth.json` in the source repo.
  The KADI entry is labelled EXPERIMENTAL PREVIEW. Nothing is playable,
  installable, or for sale. No accessibility conformance is claimed.
- Do not edit files here. Change the source, rebuild, re-mirror.