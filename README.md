# Dr. Revathy & Karthik — Digital Wedding Invitation

A mobile-first Next.js invitation website with Tailwind CSS and Framer Motion.

## Included
- Cinematic opening cover with invitation reveal
- Four supplied UK photoshoot photographs
- Editable couple and family details
- Scratch-to-reveal wedding date and animated decorative petals
- Live countdown to the ceremony
- Wedding and reception venue cards with Google Maps links
- Floating background music control
- Open Graph metadata for link previews

## Run locally
Use Node.js 18.17+ or Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add background music
Place a licensed instrumental audio file at:

`public/audio/romantic-flute.mp3`

The player is already wired to this path. The project intentionally does not include copyrighted music. If the file is missing, the site displays a small helpful message when music playback is attempted.

## Edit wedding details
Open `app/page.jsx` and edit the `wedding` configuration object near the top. It contains:
- Couple and family names
- Wedding date/time and venue
- Reception date/time and venue
- Google Maps URLs
- Photo paths
- Audio path

The ceremony countdown uses `2026-11-15T11:55:00+05:30` (India Standard Time). Update the ISO timestamp if the date or time changes.

## Replace photographs
The four supplied photographs are stored in `public/images/`. Replace those files while keeping their filenames, or update the paths in the configuration object.

## Deployment
Deploy to a Next.js-compatible host such as Vercel or any host that supports Node.js. For WhatsApp link previews, use a public HTTPS URL and ensure the Open Graph image is publicly accessible after deployment.

## Notes
- Audio autoplay is attempted only after the visitor taps the cover; browsers may still require use of the floating music toggle.
- This is a front-end invitation website. No RSVP submission backend is configured.
