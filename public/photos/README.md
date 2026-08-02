# Photos — drop your images here

Drop image files into these subfolders using the **exact filenames** below.
The site auto-picks them up; until a file exists, a clean placeholder shows in
its place (nothing breaks).

- Format: **JPG** or **WebP** (WebP preferred for size)
- Photos are auto-cropped to the right shape, so don't worry about exact framing
- Keep the **subject centered** where possible

## office/  (landscape, ~3:2)
Recommended: 1600×1067 px or larger.
- `office-1.jpg`  — main office shot (used on the home "Who we are" section + About hero)
- `office-2.jpg`  — optional second office/reception shot (About page)

## team/  (portrait, 4:5 for headshots)
Recommended: 1000×1250 px, face centered. Rendered with `overlay={false}`
so the brand colour-blend doesn't discolour skin tones.
- `founder.jpeg`   — Managing Director (Shafiqul Haider Bhuiyan), About → leadership
- `team-1.jpg` … `team-4.jpg` — team member headshots (About page)

## process/  (landscape, ~3:2)
Recommended: 1400×933 px or larger.
- `interview.jpg`   — candidate interview
- `skills-test.jpg` — skills / trade testing
- `orientation.jpg` — pre-departure orientation
- `documents.jpg`   — document / visa assistance

All images get a consistent, subtle brand grade automatically (see
`src/components/ui/photo.tsx`). Replace any file anytime — just keep the name.
