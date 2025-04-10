import { createServer } from 'node:http';
import { next } from 'next';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(handle);

    server.listen(port, () => {
      console.log(`Next.js server running on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error during Next.js preparation:', err);
    process.exit(1);
  });
