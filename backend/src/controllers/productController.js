exports.getAllProducts = (req, res) => {
    const db = req.app.locals.db;
    db.all('SELECT * FROM Product', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  };
  
  exports.getProductById = (req, res) => {
    const db = req.app.locals.db;
    const id = req.params.id;
    db.get('SELECT * FROM Product WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  };
  
  exports.createProduct = (req, res) => {
    const db = req.app.locals.db;
    const { name, description, price, stockQuantity } = req.body;
    const sql = 'INSERT INTO Product (name, description, price, stockQuantity) VALUES (?, ?, ?, ?)';
    const params = [name, description, price, stockQuantity];
  
    db.run(sql, params, function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const newProduct = {
        id: this.lastID,
        name,
        description,
        price,
        stockQuantity
      };
      req.app.locals.wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ action: 'create', product: newProduct }));
        }
      });
      res.status(201).json(newProduct);
    });
  };
  
  exports.updateProduct = (req, res) => {
    const db = req.app.locals.db;
    const { name, description, price, stockQuantity } = req.body;
    const id = req.params.id;
    const sql = 'UPDATE Product SET name = ?, description = ?, price = ?, stockQuantity = ? WHERE id = ?';
    const params = [name, description, price, stockQuantity, id];
  
    db.run(sql, params, function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      const updatedProduct = { id, name, description, price, stockQuantity };
      req.app.locals.wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ action: 'update', product: updatedProduct }));
        }
      });
      res.json(updatedProduct);
    });
  };
  
  exports.deleteProduct = (req, res) => {
    const db = req.app.locals.db;
    const id = req.params.id;
    db.run('DELETE FROM Product WHERE id = ?', id, function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      req.app.locals.wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ action: 'delete', productId: id }));
        }
      });
      res.status(204).send();
    });
  };
  
