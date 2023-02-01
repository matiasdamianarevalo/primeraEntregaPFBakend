import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataProducts = path.join(__dirname, '../data/products.data.json')
const administrador = true;

const readFile = async(file) => {
    try {
        const data = await fs.promises.readFile(file, 'utf-8', (err, data) => {
            if(err) throw err
            return data;
        })
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error: ${error}`)        
    }
}

const getMaxId = async() => {
    try {
        const dataData = await readFile(dataProducts);
        const ids = dataData.map(item => item.id);
        if (ids.length === 0){
            return 0;
        }
        return Math.max(...ids);
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

const getProductById = async(req, res) => {
    const {id} = req.params;
    try {
        const dataData = await readFile(dataProducts);
        if(!id){
            res.send(dataData)
        }else{
            const info = dataData.find(product => product.id == id)
            if (info){
                res.send(info)
            }else{
                res.status(400).json({error: 'producto no encontrado'})
            }
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

const saveProduct = async(req, res) => {
    if(administrador == true){
        const {title, price, image, description, code, stock} = req.body
        if(!title|| !price || !image || !description || !code || !stock){
            res.status(400).json({error: 'Por favor ingrese todos los datos'})
        } else {
            const product = req.body
            try {
                const dataData = await readFile(dataProducts)
                product.id = await getMaxId() + 1
                product.timestamp = Date.now()
                dataData.push(product)
                await fs.promises.writeFile(dataProducts, JSON.stringify(dataData, null, 2), err => {
                    if(err) throw err
                })
                res.status(200).json({message: 'producto agregado!'})
            } catch (error) {
                console.error(`Error: ${error}`)
            }
        }
    } else {
        res.status(400).json({message: 'necesita permisos de administrador para continuar.'});
    }
}

const updateProductById = async(req, res) => {
    if(administrador == true){
        const {id} = req.params
        const {title, price, image, description, code, stock} = req.body

        if(!title||!price||!image||!description||!code||!stock){
            res.status(400).json({error: 'Por favor ingrese todos los datos'})
        } else {
            try {
                const dataData = await readFile(dataProducts)
                let wasUpdated = false;
                for(let index = 0; index < dataData.length; index++){
                    if(dataData[index].id == id){
                        dataData[index].title = title
                        dataData[index].price = price
                        dataData[index].image = image
                        dataData[index].description = description
                        dataData[index].code = code
                        dataData[index].stock = stock
                        dataData[index].timestamp = Date.now()
                        wasUpdated = true
                        break
                    }
                }
                if(wasUpdated){
                    await fs.promises.writeFile(dataProducts, JSON.stringify(dataData, null, 2), err => {
                        if(err) throw err
                    })
                    res.status(200).json({message: 'producto actualizado!'})
                } else {
                    res.status(400).json({error: 'Producto no encontrado'})
                }
            } catch (error) {
                console.error(`Error: ${error}`)
            }
        }
    } else {
        res.status(400).json({message: 'necesita permisos de administrador para continuar.'})
    }
}

const deleteProductById = async(req, res) => {
    if(administrador == true){
        const {id} = req.params
        try {
            const dataData = await readFile(dataProducts)
            const index = dataData.findIndex(product => product.id == id)
            if(index != -1){
                dataData.splice(index, 1)
                await fs.promises.writeFile(dataProducts, JSON.stringify(dataData, null, 2), err => {
                    if(err) throw err
                })
                res.status(200).json({message: 'Producto borrado!'})
            } else {
                res.status(400).json({error: 'Producto no encontrado'})
            }
        } catch (error) {
            console.error(`Error: ${error}`)
        }
    } else {
        res.status(400).json({message: 'necesita permisos de administrador para continuar.'})
    }
}

export const productController = {
    getProductById, saveProduct, deleteProductById, updateProductById
}