const { createServer } = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { WebSocketServer } = require('ws');

const subDomains = ['script', 'style', ''];
const sites = ['scoreboard', 'lineup', 'events']

const server = createServer((req, res) => {
    console.log(`${req.method} ${req.url} HTTP`);
    domain = req.url.split('/');
    if (req.method === 'GET' && domain.length >= 2 && sites.includes(domain.at(-1)) && subDomains.includes(domain.at(-2))) {
        filePath = path.join(__dirname, domain.at(-1));
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*');
        switch (domain.at(-2)) {
            case '':
                res.setHeader('Content-Type', 'text/html');
                res.end(fs.readFileSync(path.join(filePath, "index.html")));
                break;
            case 'script':
                res.setHeader('Content-Type', 'text/javascript');
                res.end(fs.readFileSync(path.join(filePath, "script.js")));
                break;
            case 'style':
                res.setHeader('Content-Type', 'text/css');
                res.end(fs.readFileSync(path.join(filePath, "style.css")));
                break;
        }
    } else {
        res.writeHead(404);
        res.end();
    }
}).listen(3000, '127.0.0.1');

const wss = new WebSocketServer({ server })

let score, lineup, events;

wss.on('connection', (ws, req) => {
    console.log(`${req.method} ${req.url} WS`);
    switch (req.url) {
        case '/scoreboard':
            score = ws;
            break;
        case '/lineup':
            lineup = ws;
            break;
        case '/events':
            events = ws;
            break;
        default:
            ws.close()
    }
    ws.onmessage = (m) => console.log(m.data);
});