import { Router } from "express"
import { createProduct, deleteProduct, getProducts, getProductsById, updateAvailability, updateProduct } from "./handlers/products"
import { body, param } from "express-validator"
import { handleInputsErrors } from "./middleware"

const router = Router()

/** 
* @swagger
* components:
*   schemas:
*       Product:
*           type: object
*           properties: 
*               id:
*                   type: integer
*                   description: The Product ID
*                   example: 1
*               name:
*                   type: string
*                   description: The Product name
*                   example: Monitor curvo 49 pulgadas
*               price:
*                   type: number
*                   description: The Product price
*                   example: 120
*               availability:
*                   type: boolean
*                   description: The Product availability
*                   example: true
*/


//Routing 


/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products         
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses: 
 *                  200: 
 *                      description: Successful response
 *                      content: 
 *                              application/json:
 *                                      schema: 
 *                                         type: array
 *                                         items:
 *                                              $ref: "#/components/schemas/Product"
 */

router.get("/", getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags: 
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters: 
 *        - in: path 
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema: 
 *              type: integer
 *      responses: 
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Product"
 *          404:
 *              description: Not found
 *          400:
 *              description: Bad Request - Invalid ID
 */

router.get("/:id",
    param("id").isInt().withMessage("ID no valido"),
    handleInputsErrors,
    getProductsById)


/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Create a new product
 *      tags: 
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json: 
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo"
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *          201:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#components/schemas/Product"
 *          400:
 *              description: Bad Request - Invalid input data
 */

router.post("/",
    //validacion 
    body("name").notEmpty().withMessage("El nombre del producto no puede ir vacio"),
    body("price")
        .isNumeric().withMessage("El precio tiene que ser un numero")
        .notEmpty().withMessage("El precio del producto no puede ir vacio")
        .custom(value => value > 0).withMessage("Precio no valido"),
    handleInputsErrors,
    createProduct)


/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      sumarry: Updates a product with user input
 *      tags: 
 *          - Products
 *      description: Returns the update product
 *      parameters:
 *        - in: path 
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema: 
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json: 
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo"
 *                          price:
 *                              type: number
 *                              example: 399
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#components/schemas/Product"
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Product Not Found
 */


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

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update products availability
 *      tags:
 *          - Products
 *      description: Returns the update availability
 *      parameters:
 *        - in: path 
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema: 
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#components/schemas/Product"
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found
 */


router.patch("/:id",
    param("id").isInt().withMessage("ID no valido"),
    handleInputsErrors,
    updateAvailability)


/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Delete a product by ID
 *      tags:
 *          - Products
 *      description: Returns a confirmation message
 *      parameters:
 *        - in: path 
 *          name: id
 *          description: The ID of the product to delete
 *          required: true
 *          schema: 
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: Producto Eleminado
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found
 */
 
router.delete("/:id",
    param("id").isInt().withMessage("ID no valido"),
    handleInputsErrors,
    deleteProduct
)


export default router