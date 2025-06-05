const Product = require("../models/Product");

const ProductController = {
    async create(req, res) {
        try {
            const product = await Product.create(req.body)
            res.status(201).send(product)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al crear el producto' })
        }
    },
    async getAll(req, res) {
        try {
            const products = await Product.find()
            res.send(products)
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Ha habido un problema al traer los productos' })
        }
    },
    async getById(req, res) {
        try {
            const product = await Product.findById(req.params._id)
            res.send(product)
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Ha habido un problema al traer el producto' })
        }
    },
    // async getProductsByName(req, res) {
    //     try {
    //         if (req.params.name.length > 20) {
    //             return res.status(400).send('Búsqueda demasiado larga')
    //         }
    //         const name = new RegExp(req.params.name, "i");
    //         const products = await Product.find({ name });
    //         res.send(products);
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).send({ message: 'Ha habido un problema al traer los productos' })
    //     }
    // },
    async getProductsByName(req, res) {
        try {
            const products = await Product.find({
                $text: {
                    $search: req.params.name,
                },
            });
            res.send(products);
        } catch (error) {
            console.log(error);
        }
    },
    async delete(req, res) {
        try {
            const product = await Product.findByIdAndDelete(req.params._id)
            res.send({ message: 'Producto eliminado', product })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al eliminar el producto' })
        }
    },
    async update(req, res) {
        try {
            const product = await Product.findByIdAndUpdate(req.params._id, req.body, { new: true })
            res.send({ message: "Producto actualizado correctamente", product });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Ha habido un problema al actualizar el producto' })

        }
    },
}

module.exports = ProductController;
