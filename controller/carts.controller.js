import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataCart = path.join(__dirname, '../data/carts.data.json');
const dataProducts = path.join(__dirname, '../data/products.data.json');

const readFile = async(file) => {
    try {
        const data = await fs.promises.readFile(file, 'utf-8', (err, data) =>{
            if(err) throw err
            return data
        })
        return JSON.parse(data)
    } catch (error) {
        console.error(`Error: ${error}`)        
    }
}

const getMaxId = async() => {
    try {
        const dataData = await readFile(dataCart);
        const ids = dataData.map(item => item.id);
        if (ids.length === 0){
            return 0;
        }
        return Math.max(...ids);
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

const saveCart = async(req, res) => {
    try {
        const dataData = await readFile(dataCart)
        const id = await getMaxId() + 1;
        const cart = {
            id: id,
            timestamp: Date.now(),
            products: []
        }
        dataData.push(cart)
        await fs.promises.writeFile(dataCart, JSON.stringify(dataData, null, 2), err => {
            if(err) throw err
        })
        res.status(200).json({message: `Carrito creado, ID: ${cart.id}`})
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

const deleteCart = async(req, res) => {
    const { id } = req.params
    try {
        const dataData = await readFile(dataCart)
        const indexCart = dataData.findIndex(cart => cart.id == id)
        if(indexCart != -1){
            dataData.splice(indexCart, 1)
            await fs.promises.writeFile(dataCart, JSON.stringify(dataData, null, 2), err => {
                if(err) throw err
            })
            res.status(200).json({message: `Carrito con ID: ${id} borrado!`})
        } else {
            res.status(400).json({error: 'El carrito no existe'})
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

const getProducts = async(req, res) => {
    const {id} = req.params
    try {
        const dataData = await readFile(dataCart)
        const cartWanted = await dataData.find(cart => cart.id == id)
        if(cartWanted != undefined){
            res.send(cartWanted.products)
        } else {
            res.status(400).json({error: `El carrito de ID: ${id} no existe`})
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

const saveProductByID = async (req, res) => {
    const {id} = req.params
    const {arrayProductsIds} = req.body

    try {
        const dataDataCart = await readFile(dataCart)
        const cartIndex = dataDataCart.findIndex(cart => cart.id == id)
        if(cartIndex != -1){
            const dataDataProducts = await readFile(dataProducts)
            const data1Products = []
            dataDataProducts.forEach(product => {
                arrayProductsIds.forEach(id => {
                    if(product.id == id){
                        data1Products.push(product)
                    }
                })
            })
            if(data1Products.length != 0){
                let concatData = dataDataCart[cartIndex].products.concat(data1Products)
                dataDataCart[cartIndex].products = concatData
                await fs.promises.writeFile(dataCart, JSON.stringify(dataDataCart, null, 2), err => {
                    if(err) throw err
                })
                res.status(200).json({message: 'Productos agregados!'})
            } else {
                res.status(400).json({error: 'No se encontraron productos'})
            }
        } else {
            res.status(400).json({error: 'Carrito no encontrado'})
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

 const deleteCartProductByID = async(req, res) => {
    const {id, id_producto} = req.params 
    try {
        const dataDataCart = await readFile(dataCart)
        const cartData = dataDataCart.find(cart => cart.id == id)
        if(cartData){
            const productIndex = cartData.products.findIndex(product => product.id == id_producto)
            if(productIndex != -1){
                cartData.products.splice(productIndex, 1)
                await fs.promises.writeFile(dataCart, JSON.stringify(dataDataCart, null, 2), err => {
                    if(err) throw err
                })
                res.status(200).json({message: 'Producto borrado'})
            } else {
                res.status(400).json({error: 'Producto no encontrado'})
            }
        } else {
            res.status(400).json({error: 'Carrito no encontrado'})
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

export const cartController = {
    saveCart, deleteCart, getProducts, saveProductByID, deleteCartProductByID
}