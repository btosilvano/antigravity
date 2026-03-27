const https = require('https');
https.get('https://instanttraining.lightspeedvt.com', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const text = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                     .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                     .replace(/<[^>]+>/g, '\n')
                     .replace(/\n\s*\n/g, '\n')
                     .replace(/&nbsp;/g, ' ')
                     .replace(/&#39;/g, "'");
    console.log(text.trim());
  });
});
