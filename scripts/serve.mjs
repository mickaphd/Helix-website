import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PORT) || 4321;
const types = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
    '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json',
};

http.createServer(async (req, res) => {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    try {
        let file = join(root, path);
        if ((await stat(file)).isDirectory()) {
            if (!path.endsWith('/')) { res.writeHead(308, { Location: path + '/' }); return res.end(); }
            file = join(file, 'index.html');
        }
        res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
        res.end(await readFile(file));
    } catch {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(await readFile(join(root, '404.html')).catch(() => 'Not found'));
    }
}).listen(port, () => console.log(`Helix site on http://localhost:${port}`));
