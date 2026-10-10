# lastikadi-site — public mirror of the built lastikadi.com landing page

This repository is a **mirror**. It holds only the built static output.

- Source of truth: the private `josephmalaba/lastikadi-web` repository,
  branch `main`, commit ce82c95b822ced9c418894545ad150cb72fc8f5a.
- Built with `npm run build` (`scripts/emit-dist.mjs`): content-addressed
  assets, generated cache policy, claim guard enforced at build time.
- Every claim on this page resolves to `data/truth.json` in the source repo.
  The KADI entry is labelled EXPERIMENTAL PREVIEW. Nothing is playable,
  installable, or for sale. No accessibility conformance is claimed.
- Do not edit files here. Change the source, rebuild, re-mirror.

The 2026-10-10 publication updates only the standalone `tv/` artifact. The
already-published phone pairing and exact-table join clients remain unchanged.
