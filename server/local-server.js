// local-server.js (for local Node dev)
const app = require('./index.js');

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Local server running on http://localhost:${port}`);
});
