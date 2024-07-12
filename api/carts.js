const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const router = express.Router();

// Obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().populate("products.product").lean();
    res.json({ status: "success", carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error fetching carts" });
  }
});

// Crear un nuevo carrito o agregar productos al carrito existente
router.post("/", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product || product.stock < quantity) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Invalid product or insufficient stock",
        });
    }

    const cart = await Cart.findOneAndUpdate(
      {},
      { $inc: { "products.$[elem].quantity": quantity } },
      {
        arrayFilters: [{ "elem.product": productId }],
        upsert: true,
        new: true,
      }
    ).populate("products.product");

    await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });

    res.status(201).json({ status: "success", cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error adding to cart" });
  }
});

// Editar la cantidad de un producto en el carrito
router.put("/products/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;

    const cart = await Cart.findOneAndUpdate(
      { "products.product": productId },
      { $inc: { "products.$.quantity": quantity } },
      { new: true }
    ).populate("products.product");

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found in cart" });
    }

    await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });

    res.json({ status: "success", cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error updating cart" });
  }
});

// Eliminar un producto del carrito
router.delete("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const cart = await Cart.findOneAndUpdate(
      { "products.product": productId },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate("products.product");

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found in cart" });
    }

    const removedProduct = cart.products.find(
      (p) => p.product.toString() === productId
    );
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: removedProduct.quantity },
    });

    res.json({ status: "success", cart });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error removing product from cart" });
  }
});

module.exports = router;
