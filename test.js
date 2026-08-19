const http = require("http");
const server = http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World\n");
  })
  .listen(3005, () => {
    console.log("running on port 3005");
  });