import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = "https://laya-exclusive.com"; // Placeholder production domain

// Target high-value locations and niches
const LOCATIONS = ["kochi", "trivandrum", "kozhikode", "thrissur", "dubai", "bangalore", "chennai"];
const NICHES = ["doctors", "entrepreneurs", "engineers", "nris", "artists", "creatives", "professionals", "founders"];

const STATIC_ROUTES = [
  "/",
  "/request-access"
];

let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// Add static routes
STATIC_ROUTES.forEach(route => {
  sitemapXML += `
  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;
});

// Add dynamic programmatic SEO routes
LOCATIONS.forEach(location => {
  NICHES.forEach(niche => {
    sitemapXML += `
  <url>
    <loc>${DOMAIN}/network/${location}/${niche}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });
});

sitemapXML += `\n</urlset>`;

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXML);

console.log(`✅ Successfully generated sitemap.xml with ${STATIC_ROUTES.length + (LOCATIONS.length * NICHES.length)} URLs`);
