import { Request, Response } from "express"
import Products from "../models/Product.model"


export const getProductsById = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await Products.findByPk(id)
    if (!product) {
        res.status(404).json({
            error: "El producto no existe"
        })
        return
    }
    res.json({ data: product })
}


export const getProducts = async (req: Request, res: Response) => {
    const products = await Products.findAll({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        order: [
            ["id", "DESC"]
        ]
    })

    res.json({ data: products })
}

export const createProduct = async (req: Request, res: Response) => {
    const product = await Products.create(req.body)
    res.status(201).json({ data: product })

}


export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await Products.findByPk(id)

    if (!product) {
        res.status(404).json({
            error: "El producto no existe"
        })
        return
    }
    //Actualizar
    await product.update(req.body)
    await product.save()

    res.json({ data: product })
}

export const updateAvailability = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await Products.findByPk(id)

    if (!product) {
        res.status(404).json({
            error: "El producto no existe"
        })
        return
    }
    product.availability = !product.dataValues.availability
    await product.save()
    res.json({ data: product })
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await Products.findByPk(id)
    if (!product) {
        res.status(404).json({
            error: "El producto no existe"
        })
        return
    }
    await product.destroy()
    res.json({ data: "Producto Eleminado" })

}