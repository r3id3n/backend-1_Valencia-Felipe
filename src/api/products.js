const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const mongoosePaginate = require("mongoose-paginate-v2");
const { body, validationResult } = require("express-validator");

// Agregar el plugin de paginación al esquema de productos
Product.schema.plugin(mongoosePaginate);

// Obtener todos los productos con paginación y ordenamiento
router.get("/", async (req, res) => {
  try {
    const { limit = 5, page = 1, sort } = req.query;

    // Construir las opciones de paginación
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort.toLowerCase() === "asc" ? 1 : -1 } : {},
    };

    // Realizar la consulta paginada
    const result = await Product.paginate({}, options);

    // Formatear la respuesta
    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}`
        : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    res.json({ status: "success", product });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error fetching product" });
  }
});

// Crear un nuevo producto con validación
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("code").notEmpty().withMessage("Code is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be a number greater than 0"),
    body("stock").isInt({ gt: 0 }).withMessage("Stock must be an integer greater than 0"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newProduct = new Product(req.body);
    try {
      const savedProduct = await newProduct.save();
      res.status(201).json({ status: "success", product: savedProduct });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error adding product" });
    }
  }
);

// Actualizar un producto por ID
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ status: "success", product: updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error updating product" });
  }
});

// Eliminar un producto por ID
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ status: "success", message: "Product deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error deleting product" });
  }
});

module.exports = router;
