# Photos — drop your images here

Drop image files into these subfolders using the **exact filenames** below.
The site auto-picks them up; until a file exists, a clean placeholder shows in
its place (nothing breaks).

- Format: **JPG** or **WebP** (WebP preferred for size)
- Photos are auto-cropped to the right shape, so don't worry about exact framing
- Keep the **subject centered** where possible

## hero/  (landscape, 4:3 or wider)
Recommended: 2400×1800 px or larger — these run full-bleed behind the home
headline, so anything smaller looks soft on large screens.

The home banner cycles these three destination markets, in this order:
- `skyline-dubai.jpg`    — Dubai Business Bay, towers under construction
- `skyline-malaysia.jpg` — Kuala Lumpur skyline
- `skyline-saudi.jpg`    — Riyadh, Kingdom Centre tower

All three are from Unsplash, free for commercial use with no attribution
required. To change a market, swap the file and update the city name under
`hero.slides.*` in `messages/en.json` and `messages/bn.json`.

The photos were shot in different light, so each slide carries a small
brightness correction (`lift`) in `src/components/home/hero.tsx` to stop the
cross-fade flickering. Replacing a photo means re-checking its value.

## office/  (landscape, ~3:2)
Recommended: 1600×1067 px or larger.
- `office-1.jpg`  — main office shot (used on the home "Who we are" section + About hero)
- `office-2.jpg`  — optional second office/reception shot (About page)

## team/  (portrait, 4:5 for headshots)
Recommended: 1000×1250 px, face centered. Rendered with `overlay={false}`
so the brand colour-blend doesn't discolour skin tones.
- `founder.png`   — Managing Director (Shafiqul Haider Bhuiyan), About → leadership
- `team-1.jpg` … `team-4.jpg` — team member headshots (About page)

## process/  (landscape, ~3:2)
Recommended: 1400×933 px or larger.
- `interview.jpg`   — candidate interview
- `skills-test.jpg` — skills / trade testing
- `orientation.jpg` — pre-departure orientation
- `documents.jpg`   — document / visa assistance

All images get a consistent, subtle brand grade automatically (see
`src/components/ui/photo.tsx`). Replace any file anytime — just keep the name.
