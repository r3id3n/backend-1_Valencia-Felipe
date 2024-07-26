const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const router = express.Router();

// Obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().populate("products.product");
    res.json({ status: "success", carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error fetching carts" });
  }
});

// Crear un nuevo carrito o agregar productos al carrito existente
router.post("/", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ "products.product": productId });
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    if (cart) {
      const existingProduct = cart.products.find(p => p.product.toString() === productId);
      existingProduct.quantity += quantity;
    } else {
      cart = new Cart({
        products: [{ product: productId, quantity }]
      });
    }

    product.stock -= quantity;
    await product.save();
    await cart.save();

    res.status(201).json({ status: "success", cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error adding to cart" });
  }
});

// Editar la cantidad de un producto en el carrito
router.put("/products/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ "products.product": req.params.id });

    if (!cart) {
      return res.status(404).json({ status: "error", message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === req.params.id
    );

    if (productIndex !== -1) {
      const product = await Product.findById(req.params.id);
      if (cart.products[productIndex].quantity <= quantity) {
        product.stock += cart.products[productIndex].quantity;
        cart.products.splice(productIndex, 1);
      } else {
        cart.products[productIndex].quantity -= quantity;
        product.stock += quantity;
      }
      await product.save();
      await cart.save();
      res.json({ status: "success", cart });
    } else {
      res.status(404).json({ status: "error", message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error updating cart" });
  }
});

// Eliminar un producto del carrito
router.delete("/products/:id", async (req, res) => {
  try {
    const cart = await Cart.findOne({ "products.product": req.params.id });

    if (!cart) {
      return res.status(404).json({ status: "error", message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === req.params.id
    );

    if (productIndex !== -1) {
      const product = await Product.findById(req.params.id);
      product.stock += cart.products[productIndex].quantity;
      cart.products.splice(productIndex, 1);
      await product.save();
      await cart.save();
      res.json({ status: "success", cart });
    } else {
      res.status(404).json({ status: "error", message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error removing product from cart" });
  }
});

module.exports = router;
