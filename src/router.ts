import { Router } from "express";
import { body, param } from "express-validator";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  updateAvaliability,
  deleteProduct,
} from "./handlers/product";
import { handleInputErrors } from "./middleware";

const router = Router();

/**
 * @swagger
 * components:
 *    schemas:
 *        Product:
 *            type: object
 *            properties:
 *                id:
 *                    type: integer
 *                    description: The Product ID
 *                    example: 1
 *                name:
 *                    type: string
 *                    description: The Product name
 *                    example: Monitor Curvo de 50 Pulgadas
 *                price:
 *                    type: number
 *                    description: The Product price
 *                    example: 300
 *                availability:
 *                    type: boolean
 *                    description: The Product availability
 *                    example: true
 */

/**
 * @swagger
 * /api/products:
 *    get:
 *        summary: Get a list of products
 *        tags:
 *            - Products
 *        description: Return a list of products
 *        responses:
 *            200:
 *                description: Successful response
 *                content:
 *                    application/json:
 *                         schema:
 *                            type: array
 *                            items:
 *                                $ref: '#/components/schemas/Product'
 */

// Routing
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *    get:
 *        summary: Get a product by ID
 *        tags:
 *            - Products
 *        description: Return a product based on its unique ID
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: Integer
 *        responses:
 *            200:
 *                description: Successful Response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *
 *            404:
 *                description: Not found
 *
 *            400:
 *                description: Bad Request - Invalid ID
 *
 */
router.get(
  "/:id",
  param("id").isInt().withMessage("El ID no es valido"),
  handleInputErrors,
  getProductById,
);

/**
 * @swagger
 * /api/products:
 *   post:
 *      summary: Create a new Product
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
 *                              example: "Monitor Curvo 50 Pulgadas"
 *                          price:
 *                              type: number
 *                              example: 499
 *
 *      responses:
 *          201:
 *              description: Product created successful
 *              content:
 *                application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - invalid input data
 */

router.post(
  "/",

  // Validacion
  body("name").notEmpty().withMessage("El nombre es obligatorio"),

  body("price")
    .isNumeric()
    .withMessage("El precio debe ser un número")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .custom((value) => value > 0)
    .withMessage("El precio debe ser mayor a 0"),
  handleInputErrors,
  createProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *    summary: Updates a product with user input
 *    tags:
 *        - Products
 *    description: Returns the updated product
 *    parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: Integer
 *    requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo 50 Pulgadas"
 *                          price:
 *                              type: number
 *                              example: 499
 *                          availability:
 *                              type: boolean
 *                              example: true
 *    responses:
 *        200:
 *            description: Successful response
 *            content:
 *                application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
 *        400:
 *            description: Bad request - Invalid ID or Invalid input data
 *        404:
 *            description: Product not found
 */

router.put(
  "/:id",

  // Validacion
  param("id").isInt().withMessage("El ID no es valido"),
  body("name").notEmpty().withMessage("El nombre es obligatorio"),

  body("price")
    .isNumeric()
    .withMessage("El precio debe ser un número")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .custom((value) => value > 0)
    .withMessage("El precio debe ser mayor a 0"),
  handleInputErrors,
  updateProduct,
);

/**
 * @swagger
 * /api/product/{id}:
 *  delete:
 *    summary: Delete a product by a given ID
 *    tags:
 *        - Products
 *    description: Returns a confirmation message
 *    parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to delete
 *            required: true
 *            schema:
 *                type: Integer
 *    responses:
 *        200:
 *            description: Successful response
 *            content:
 *                application/json:
 *                  schema:
 *                      type: string
 *                      value: 'Product Eliminado'
 *        400:
 *            description: Bad request - Invalid ID
 *        404:
 *            description: Product not found
 */

router.patch(
  "/:id",
  param("id").isInt().withMessage("El ID no es valido"),
  handleInputErrors,
  updateAvaliability,
);

/**
 * @swagger
 * /api/product/{id}:
 *  patch:
 *    summary: Update Product availability
 *    tags:
 *        - Products
 *    description: Returns the updated availability
 *    parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: Integer
 *    responses:
 *        200:
 *            description: Successful response
 *            content:
 *                application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
 *        400:
 *            description: Bad request - Invalid ID
 *        404:
 *            description: Product not found
 */

router.delete(
  "/:id",
  param("id").isInt().withMessage("El ID no es valido"),
  handleInputErrors,
  deleteProduct,
);

export default router;
