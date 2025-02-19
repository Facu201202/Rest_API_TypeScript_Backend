import { Router } from "express"
import { createProduct, deleteProduct, getProducts, getProductsById, updateAvailability, updateProduct } from "./handlers/products"
import { body, param } from "express-validator"
import { handleInputsErrors } from "./middleware"

const router = Router()

//Routing 

router.get("/", getProducts)

router.get("/:id",
    param("id").isInt().withMessage("ID no valido"),
    handleInputsErrors,
    getProductsById)

router.post("/",
    //validacion 
    body("name").notEmpty().withMessage("El nombre del producto no puede ir vacio"),
    body("price")
        .isNumeric().withMessage("El precio tiene que ser un numero")
        .notEmpty().withMessage("El precio del producto no puede ir vacio")
        .custom(value => value > 0).withMessage("Precio no valido"),
    handleInputsErrors,
    createProduct)



router.put("/:id",
    //validacion 
    param("id").isInt().withMessage("ID no valido"),
    body("name").notEmpty().withMessage("El nombre del producto no puede ir vacio"),
    body("price")
        .isNumeric().withMessage("El precio tiene que ser un numero")
        .notEmpty().withMessage("El precio del producto no puede ir vacio")
        .custom(value => value > 0).withMessage("Precio no valido"),
    body("availability")
        .isBoolean().withMessage("Valor para disponibilidad no válido"),
    handleInputsErrors,
    updateProduct)


router.patch("/:id",
    param("id").isInt().withMessage("ID no valido"),
    handleInputsErrors,
    updateAvailability)

router.delete("/:id",
    param("id").isInt().withMessage("ID no valido"),
    handleInputsErrors,
    deleteProduct
)


export default router