# Wild Florida 6th Grade Field Trip

A one-page site for the SSCS 6th grade trip to Wild Florida on Friday, December 11, 2026. Parents get here from the flyer, mostly on their phones.

It's plain HTML, CSS, and JavaScript. There's no framework and no build step.

```
index.html      the page
styles.css      all styles
script.js       countdown, calendar, checklist, image viewer
assets/         seal, photos, calendar (.ics) files
assets/downloads/  flyer, permission slip, and social post files
```

## Turn on GitHub Pages

1. Push this repo to GitHub.
2. On GitHub, open the repo and go to **Settings**, then **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Pick your branch (for example `main`) and the **/ (root)** folder. Click **Save**.
5. Wait a minute or two. The site address shows at the top of the Pages screen, something like `https://<your-username>.github.io/wild/`.

Put that address (or a QR code for it) on the flyer.

## Adding or swapping files

Drop files into `assets/` with the exact names below. The page picks them up on its own. Until a file is there, the page shows a clean "coming soon" placeholder, and download buttons for missing files turn grey.

- `assets/seal-molecule.png`
- `assets/park-map.jpg`, `entrance-sign.jpg`, `gator-show.jpg`
- `assets/alligator.jpg`, `sloth.jpg`, `lemur.jpg`, `otter.jpg`, `daphne-bobcat.jpg`
- `assets/wild-florida-logo.png`
- `assets/downloads/Wild-Florida-Flyer.png`
- `assets/downloads/Wild-Florida-Permission-Slip.png`
- `assets/downloads/Wild-Florida-Flyer-and-Permission-Slip.pdf`
- `assets/downloads/Wild-Florida-Permission-Slip-Fillable.pdf`
- `assets/downloads/Wild-Florida-Social-Post.png`

## Online permission form

The "Fill it out online" buttons go to the Google Form. To change it, search `index.html` for `docs.google.com` and swap in the new link (it appears twice).

## Previewing other dates

The countdown and the "today" box on the calendar follow Eastern time. To see how the page looks on another day, add `?now=` to the address:

- `?now=2026-12-02T09:00:00-05:00` (forms countdown)
- `?now=2026-12-08T09:00:00-05:00` (trip countdown)
- `?now=2026-12-12T09:00:00-05:00` (thank-you message)

## Running it on your computer

Open `index.html` in a browser, or run a tiny server from this folder:

```bash
python3 -m http.server 8000
```

Then go to http://localhost:8000.
