# WefieHome website

Static site (HTML/CSS/JS) on Cloudflare. Facts follow the WefieHome Master Business & Brand Profile v1.1;
structure follows the Search, Content & Conversion Architecture v1.1.

## Pages (URL → file)
- `/` → public/index.html
- `/airbnb-management-kl/` → public/airbnb-management-kl/index.html (main owner page)
- `/stay/` → public/stay/index.html (guest hub)
- `/stay/<building>/` → public/stay/<building>/index.html (6 building pages)
- `/case-studies/`, `/about/`, `/contact/`

## Where to edit
- Contact details & Airbnb listing links: `public/js/config.js`
- Colours & layout: `public/css/style.css` (brand colour #A4F4F7)
- Photos: `public/images/`

## Still to fill (marked "TO FILL" on the pages)
- Building pages: verified amenities, transport (MRT/LRT), guest FAQs, real photos
- Airbnb link for each building (config.js → listings)
- Case studies (verified figures + owner permission only)

## Dynamic facts to re-check before launch
Airbnb rating (4.85), review count (1,000+), Superhost status, guests (5,000+), nights (10,000+), unit/property count (18/6).

## Before launch on wefiehome.com
1. Remove `<meta name="robots" content="noindex, nofollow">` from every page
2. Change `public/robots.txt` to `Allow: /` and add a sitemap
3. Delete `public/_headers`
