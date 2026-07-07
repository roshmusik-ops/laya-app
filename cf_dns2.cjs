const https = require('https');

const TOKEN = "cfut_D4o2CAOp0eMq6yl7mjzUaoJpDkHKocXpxT6USuDY3905fe87";
const ZONE_ID = "41cffa813076c8714b0a8303d8ebedce";

const newRec = { type: "CNAME", name: "laya.roshmusik.com", content: "cname.vercel-dns.com", proxied: false };

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
        catch(e) { resolve(data); } 
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function addSubdomain() {
  console.log("Adding CNAME record for laya...");
  const createRes = await cfApi('POST', `/dns_records`, newRec);
  console.log(createRes.success ? "Success!" : createRes.errors);
}

addSubdomain();
