// backend/index.js
const express = require('express');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const wss = new WebSocket.Server({ noServer: true });
const db = new sqlite3.Database(':memory:');

app.use(express.json());

// Initialize the database
db.serialize(() => {
    db.run("CREATE TABLE product (id INTEGER PRIMARY KEY, name TEXT, description TEXT, price REAL, quantity INTEGER)");
});

// CRUD API Endpoints
app.get('/products', (req, res) => {
    db.all("SELECT * FROM product", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.post('/products', (req, res) => {
    const { name, description, price, quantity } = req.body;
    db.run(`INSERT INTO product (name, description, price, quantity) VALUES (?, ?, ?, ?)`,
        [name, description, price, quantity],
        function (err) {
            if (err) {
                return console.log(err.message);
            }
            res.json({ id: this.lastID });
            broadcast({ type: 'ADD', product: { id: this.lastID, name, description, price, quantity } });
        });
});

app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;
    db.run(`UPDATE product SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?`,
        [name, description, price, quantity, id],
        function (err) {
            if (err) {
                return console.log(err.message);
            }
            res.json({ changes: this.changes });
            broadcast({ type: 'UPDATE', product: { id, name, description, price, quantity } });
        });
});

app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM product WHERE id = ?`, id, function (err) {
        if (err) {
            return console.log(err.message);
        }
        res.json({ changes: this.changes });
        broadcast({ type: 'DELETE', id });
    });
});

// WebSocket Broadcast
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});
