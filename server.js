const http = require('http');
const https = require('https');

const TARGET = process.env.TARGET_DOMAIN || '185.158.249.43:2087';

const server = http.createServer(async (req, res) => {
  const options = {
    hostname: TARGET.split(':')[0],
    port: TARGET.split(':')[1] || 80,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: TARGET.split(':')[0] },
  };

  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxy.on('error', (err) => {
    res.writeHead(502);
    res.end('Bad Gateway');
  });

  req.pipe(proxy);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Relay running on port ${PORT}`);
});
