// Importación de módulos necesarios
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const { engine } = require("express-handlebars");
// Importación de routers
const productsRouter = require("./api/products");
const cartsRouter = require("./api/carts");
// Configuración de la aplicación Express
const app = express();
const PORT = process.env.PORT || 8080;
require("dotenv").config();

// Conexión a MongoDB Atlas
mongoose
  .connect(
    process.env.MONGODB_URI
    // "mongodb+srv://r3id3n2091:r3id3n2091@aniwear.i4ffyt6.mongodb.net/aniwear?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Conexión exitosa a MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB Atlas:", err);
    process.exit(1);
  });
// Configuración del motor de plantillas Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// Rutas de la API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
// Ruta raíz que redirige a /list-products
app.get("/", (req, res) => {
  res.redirect("/list-products");
});
// Servir las vistas
app.get("/list-products", (req, res) => {
  res.render("listProducts");
});
//
app.get("/add-product", (req, res) => {
  res.render("addProduct");
});

app.get("/products/edit/:id", (req, res) => {
  res.render("editProduct");
});

app.get("/carts", (req, res) => {
  res.render("carts");
});
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
