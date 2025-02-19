import { Request, Response } from "express"
import Products from "../models/Product.model"


export const getProductsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Products.findByPk(id)

        if (!product) {
            res.status(404).json({
                error: "El producto no existe"
            })
        }

        res.json({ data: product })

    } catch (error) {
        console.log(error)
    }
}


export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Products.findAll({
            attributes: { exclude: ["updatedAt", "createdAt"] }
        })

        res.json({ data: products })

    } catch (error) {
        console.log(error)
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await Products.create(req.body)

        res.json({ data: product })

    } catch (error) {
        console.log(error)
    }
}


export const updateProduct = async (req: Request, res: Response) => {
    try {

        const { id } = req.params
        const product = await Products.findByPk(id)

        if (!product) {
            res.status(404).json({
                error: "El producto no existe"
            })
        }

        //Actualizar
        await product.update(req.body)
        await product.save()

        res.json({ data: product })

    } catch (error) {
        console.log(error)
    }
}

export const updateAvailability = async (req: Request, res: Response) => {
    try {

        const { id } = req.params
        const product = await Products.findByPk(id)

        if (!product) {
            res.status(404).json({
                error: "El producto no existe"
            })
        }

        //Actualizar
        product.availability = !product.dataValues.availability
        await product.save()

        res.json({ data: product })

    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {

        const { id } = req.params
        const product = await Products.findByPk(id)

        if (!product) {
            res.status(404).json({
                error: "El producto no existe"
            })
        }

        await product.destroy()
        res.json({data: "Producto Eleminado"})

    } catch (error) {
        console.log(error)
    }
}