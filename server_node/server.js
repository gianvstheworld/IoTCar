const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('index.html', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Erro interno do servidor');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.url === '/streaming.js') {
        fs.readFile('streaming.js', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Erro interno do servidor');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
    } else if (req.url === '/key.js') {
        fs.readFile('key.js', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Erro interno do servidor');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
    } else if (req.url === '/style.css') {
        fs.readFile('style.css', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Erro interno do servidor');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
    } else if (req.url.startsWith('/assets/')) {
        const imagePath = req.url.slice(1); // Remove a barra inicial ("/") da URL
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Imagem não encontrada');
            } else {
                const contentType = getContentType(imagePath);
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });     
    } else {
        res.writeHead(404);
        res.end('Página não encontrada');
    }
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('Usuário conectado');

    socket.on('comando-teclado', (comando) => {
        console.log('Comando recebido:', comando);
        io.emit('comando-teclado', comando);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor está ouvindo na porta 3000');
});
