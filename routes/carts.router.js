import { Router } from "express";
import { cartController } from "../controller/carts.controller.js";
const cartRouter = Router();

cartRouter.post('/', cartController.saveCart);                                    // Creamos un carrito
cartRouter.delete('/:id', cartController.deleteCart);                                // Elimina un carrito
cartRouter.get('/:id/products', cartController.getProducts);                           // Traemos todos los productos del carrito
cartRouter.post('/:id/products', cartController.saveProductByID);                         // Agregamos productos al carrito desde el id
cartRouter.delete('/:id/products/:id_product', cartController.deleteCartProductByID);       // Eliminamos un producto especifico de un carrito especifico mediante ids

export default cartRouter;