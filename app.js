import  express  from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// importo Rutas
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

// Routes:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(8081,()=>{
    console.log("escuchando al puerto 8081")
})