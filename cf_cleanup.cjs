const https = require('https');

const TOKEN = "cfut_D4o2CAOp0eMq6yl7mjzUaoJpDkHKocXpxT6USuDY3905fe87";
const ZONE_ID = "41cffa813076c8714b0a8303d8ebedce";

async function cfApi(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/zones/${ZONE_ID}${path}`,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve(data); } // Sometimes DELETE returns empty string
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function cleanupDNS() {
  console.log("Fetching existing records...");
  const res = await cfApi('GET', '/dns_records');
  if (!res.success) {
    console.error("Failed to fetch records", res.errors);
    return;
  }
  
  const existing = res.result;

  for (const r of existing) {
    if (r.name === "roshmusik.com" && r.type === "A" && r.content !== "76.76.21.21") {
      console.log(`Deleting conflicting A record for ${r.name} pointing to ${r.content}...`);
      const delRes = await cfApi('DELETE', `/dns_records/${r.id}`);
      console.log("Deleted!");
    }
  }
  console.log("Cleanup Done!");
}

cleanupDNS();
