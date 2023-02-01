/* import  express  from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// importo Rutas
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

// Routes:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(8080,()=>{
    console.log("escuchando al puerto 8080")
}) */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('port', PORT);
app.use('/api/productos', productsRouter);
app.use('/api/carrito', cartRouter);

const server = app.listen(PORT, () => {
    console.log('server connected on port:', app.get('port'))
});
server.on('error', error => console.log(`Error en el servidor: ${error}`));

export default app;