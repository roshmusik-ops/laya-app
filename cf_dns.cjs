const https = require('https');

const TOKEN = "cfut_D4o2CAOp0eMq6yl7mjzUaoJpDkHKocXpxT6USuDY3905fe87";
const ZONE_ID = "41cffa813076c8714b0a8303d8ebedce";

const recordsToAdd = [
  { type: "A", name: "roshmusik.com", content: "76.76.21.21", proxied: false },
  { type: "CNAME", name: "www.roshmusik.com", content: "cname.vercel-dns.com", proxied: false }
];

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
        catch(e) { reject(e); }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function updateDNS() {
  console.log("Fetching existing records...");
  const res = await cfApi('GET', '/dns_records');
  if (!res.success) {
    console.error("Failed to fetch records", res.errors);
    return;
  }
  
  const existing = res.result;

  for (const newRec of recordsToAdd) {
    // Find if record already exists
    const match = existing.find(r => r.name === newRec.name && r.type === newRec.type);
    
    if (match) {
      console.log(`Updating existing ${newRec.type} record for ${newRec.name}...`);
      const updateRes = await cfApi('PUT', `/dns_records/${match.id}`, newRec);
      console.log(updateRes.success ? "Success!" : updateRes.errors);
    } else {
      console.log(`Creating new ${newRec.type} record for ${newRec.name}...`);
      const createRes = await cfApi('POST', `/dns_records`, newRec);
      console.log(createRes.success ? "Success!" : createRes.errors);
    }
  }
  console.log("Done!");
}

updateDNS();
