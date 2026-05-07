# Neural Railgun: Steampunk Gallery Shooter

## Links
- **Working Game:** [\[Insert GitHub Pages URL\]](https://aryanpatelucsc.github.io/Gallary-Shooter-Prototype/)
- **GitHub Repo:** [\[Insert URL\]](https://github.com/AryanPatelUCSC/Gallary-Shooter-Prototype)

## Implementation Overview
- **Reset Logic:** Game variables are reset via scene transitions to the `titleScene`, meeting the `init_game()` requirement.
- **Collisions:** Implements optimized AABB overlap checks for performance.
- **Cinematic Entrance:** Level 1 features a unique intro sequence with a connected train lead.

## Bonus Features
- **Phase 1:** Horizontal sine-wave sweeping.
- **Phase 2:** Procedural Infinity Path (Lissajous Curve) to avoid ground collision.
- **Advanced Combat:** Boss uses heavy missiles with high damage (2x Integrity) and randomized firing offsets.
- **UI:** Real-time Core Integrity (Health) bar for the boss.