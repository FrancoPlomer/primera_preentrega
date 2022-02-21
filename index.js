const express = require("express");
const { Router } = express
let Administrador = true;

const app = express();

const productos = Router();


const PORT = 8080 || process.env.PORT;

let idSumador = 0;

let idSumadorCarrito = 0;

let idSumadorCarritoProductos = 0;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));

app.use('/api', productos);



class contenedorProductos {
    constructor(
        productos,
        carritos,
        id,
    ){
        this.productos = productos;
        this.carritos = carritos;
        this.id = id;
    }
    newCart()
    {
        productos.post('/carrito', ( req,res )=>{
            idSumadorCarrito += 1;
            this.carritos.push([{
                id: idSumadorCarrito,
                listadoProductos: []
            }])
            res.json({
                idCarrito: idSumadorCarrito
            })
        })
    }
    deleteCartForId(){
        {
            productos.delete('/carrito/:id', ( req, res ) => 
            {
                if(Administrador){
                    for (let index = 0; index < this.carritos.length; index++) {
                        this.carritos[index].map((carrito) => {
                            if(carrito.id === parseInt(req.params.id))
                            {
                                this.carritos.splice(index, 1)
                            }                  
                        })
                    }
                    this.carritos.map (producto => 
                        {
                            res.json(this.carritos)    
                        })
                }
                else{
                    res.json({
                        error: -1,
                        ruta: "/carrito/:id",
                        mensaje: "no autorizada"
                    })    
                }
            })
        }
    }
    
    getAllProductsInCart()
    {
        
        productos.get('/carrito/:id/productos',  ( req,res )=>{
            if (this.carritos)
            {
                for(let i=0 ; i < this.carritos.length; i++){
                    this.carritos[i].map((carrito) => {
                        if(carrito.id === parseInt(req.params.id))
                        {
                            if(carrito.listadoProductos){
                                const productosCarrito = carrito.listadoProductos.reduce((productoacc, producto) => 
                                {
                                    return productoacc = [...productoacc, producto]
                                }
                                , [])
                                res.json(productosCarrito)
                            }
                            else{
                                res.json({
                                    "error":"no hay productos en el carrito"
                                })
                            }
                        }
                    })
                }
            }
            else{
                res.send({error: "producto no encontrado"});
            }
        } )
    }

    addProductsInCart()
    {
        productos.post('/carrito/:id/productos', ( req,res )=>{
            const productNew = req.body;
            idSumadorCarritoProductos += 1;
            const timestamp = Date.now();
            if (this.carritos)
            {
                const nuevoProducto = {
                    productNew,
                    ID: idSumadorCarritoProductos,
                    timestamp: timestamp,
                }
                for(let i=0 ; i < this.carritos.length; i++){
                    this.carritos[i].map((carrito) => {
                        if(carrito.id === parseInt(req.params.id))
                        {
                            carrito.listadoProductos.push(nuevoProducto)
                        }
                    })
                }
            }
            res.json(this.carritos)
            
        })
    }

    deleteProductInCart(){
        productos.delete('/carrito/:id/productos/:id_prod', ( req,res )=>{
            if(Administrador){
                if (this.carritos)
                {
                    for(let i=0 ; i < this.carritos.length; i++){
                        this.carritos[i].map((carrito) => {
                            if(carrito.id === parseInt(req.params.id))
                            {
                                for (let index = 0; index < carrito.listadoProductos.length; index++) {
                                    if(carrito.listadoProductos[index].ID === parseInt(req.params.id_prod))
                                    {
                                        carrito.listadoProductos.splice(index, 1)
                                    }                  
                                }
                            }
                        })
                    }
                }
            }
            else{
                res.json({
                    error: -1,
                    ruta: "/carrito/:id/productos/:id_prod",
                    mensaje: "no autorizada"
                })    
            }                        
            res.json(this.carritos)

        })
    }
    getAll()
    {
        
        productos.get('/productos',  ( req,res )=>{
            if (this.productos)
            {
                res.json(this.productos)
            }
            else{
                res.send({error: "producto no encontrado"});
            }
        } )
    }
    getById()
    {
        productos.get('/productos/:id',  ( req,res )=>{
            this.productos.map((producto) => {
                
                if (producto.ID === parseInt(req.params.id))
                {
                    res.json(producto)

                }
                else{
                    res.send({error: "producto no encontrado"});
                }
            })
        } )
    }
    addProduct()
    {
        productos.post('/productos', ( req,res )=>{
            const productNew = req.body;
            idSumador += 1;
            const timestamp = Date.now();
            this.productos.push({
                productNew,
                timestamp: timestamp,
                ID: idSumador,
            })
            res.json({
                idProducto: idSumador
            })

        })
    }
    updateForId()
    {
        productos.put('/productos/:id', ( req, res ) =>
        {
            if(Administrador){
                const productNew = req.body;
                const timestamp = Date.now();
                for(let i = 0; i < this.productos.length ; i++)
                {
                    if(this.productos[i].ID === parseInt(req.params.id))
                    {
                        this.productos[i] = {
                            ... this.productos[i],
                            productNew,
                            timestamp: timestamp,
                        }
                        res.json({
                            nombreProducto: this.productos[i].title,
                            precioProdcuto: this.productos[i].price
                        })
                    }
                }
            }
            else{
                res.json({
                    error: -1,
                    ruta: "/productos/:id",
                    mensaje: "no autorizada"
                })    
            }
        })
    }
    deleteForId()
    {
        productos.delete('/productos/:id', ( req, res ) => 
        {
            if(Administrador){
                for (let index = 0; index < this.productos.length; index++) {
                    if(this.productos[index].ID === parseInt(req.params.id))
                    {
                        this.productos.splice(index, 1)
                    }                  
                }
                this.productos.map (producto => 
                    {
                        res.json(this.productos)
    
                    })
            }
            else{
                res.json({
                    error: -1,
                    ruta: "/productos/:id",
                    mensaje: "no autorizada"
                })    
            }
        })
    }
}

const contenedorStock = new contenedorProductos(
    [{
        title: "coca",
        descripcion: "descripcion de la coca",
        codigo: 415,
        fotoUrl: "https://thumbs.dreamstime.com/z/can-coca-cola-table-83009828.jpg",
        price: "$220",
        ID: 0,
        timestamp: Date.now(),
        stock: 1,
    }],
    [],
    1
)

contenedorStock.getAll();
contenedorStock.getById();
contenedorStock.addProduct();
contenedorStock.updateForId();
contenedorStock.deleteForId();
contenedorStock.newCart();
contenedorStock.deleteCartForId();
contenedorStock.getAllProductsInCart();
contenedorStock.addProductsInCart();
contenedorStock.deleteProductInCart();

app.listen(PORT)
