const fetchProducts = (queryParams = "") => {
  fetch(`/api/products${queryParams}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        renderProductList(data.payload);
        updatePagination(data);
      }
    })
    .catch((error) => console.error("Error fetching products:", error));
};

const renderProductList = (products) => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
      <h2>${product.title}</h2>
      <p>${product.description}</p>
      <p>Code: ${product.code}</p>
      <p>Price: $${product.price}</p>
      <p>Status: ${product.status ? "Available" : "Unavailable"}</p>
      <p>Stock: ${product.stock}</p>
      <p>Category: ${product.category}</p>
      <div class="actions">
        <button class="btn btn-primary edit-product" data-id="${
          product._id
        }">Edit</button>
        <button class="btn btn-danger delete-product" data-id="${
          product._id
        }">Delete</button>
        <button class="btn btn-secondary add-to-cart" data-id="${
          product._id
        }" data-title="${product.title}" data-price="${
      product.price
    }" data-stock="${product.stock}">Add to Cart</button>
      </div>
    `;
    productList.appendChild(productDiv);
  });

  document.querySelectorAll(".edit-product").forEach((button) => {
    button.addEventListener("click", handleEditProduct);
  });

  document.querySelectorAll(".delete-product").forEach((button) => {
    button.addEventListener("click", handleDeleteProduct);
  });

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", handleAddToCart);
  });
};

const updatePagination = (data) => {
  const pageInfo = document.getElementById("page-info");
  pageInfo.textContent = `Page ${data.page} of ${data.totalPages}`;

  const prevPage = document.getElementById("prev-page");
  const nextPage = document.getElementById("next-page");

  prevPage.disabled = !data.hasPrevPage;
  nextPage.disabled = !data.hasNextPage;

  prevPage.dataset.page = data.prevPage;
  nextPage.dataset.page = data.nextPage;
};

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");

  if (productList) {
    fetchProducts();
  }

  const applyFiltersButton = document.getElementById("apply-filters");
  applyFiltersButton.addEventListener("click", () => {
    const sort = document.getElementById("sort").value;
    const limit = document.getElementById("limit").value;
    const page = 1;

    let queryParams = `?limit=${limit}&page=${page}`;
    if (sort) queryParams += `&sort=${sort}`;

    fetchProducts(queryParams);
  });

  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");

  prevPageButton.addEventListener("click", () => {
    const sort = document.getElementById("sort").value;
    const limit = document.getElementById("limit").value;
    const page = prevPageButton.dataset.page;
    let queryParams = `?limit=${limit}&page=${page}`;
    if (sort) queryParams += `&sort=${sort}`;

    fetchProducts(queryParams);
  });

  nextPageButton.addEventListener("click", () => {
    const sort = document.getElementById("sort").value;
    const limit = document.getElementById("limit").value;
    const page = nextPageButton.dataset.page;
    let queryParams = `?limit=${limit}&page=${page}`;
    if (sort) queryParams += `&sort=${sort}`;

    fetchProducts(queryParams);
  });
});

const handleEditProduct = (event) => {
  const productId = event.target.getAttribute("data-id");
  fetch(`/api/products/${productId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const product = data.product;
        window.location.href = `/products/edit/${productId}?title=${encodeURIComponent(
          product.title
        )}&description=${encodeURIComponent(
          product.description
        )}&code=${encodeURIComponent(product.code)}&price=${
          product.price
        }&status=${product.status}&stock=${
          product.stock
        }&category=${encodeURIComponent(product.category)}`;
      } else {
        alert("Product not found");
      }
    })
    .catch((error) => console.error("Error fetching product:", error));
};

const handleDeleteProduct = (event) => {
  const productId = event.target.getAttribute("data-id");
  fetch(`/api/products/${productId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Product deleted");
        fetchProducts();
      } else {
        alert("Failed to delete product");
      }
    })
    .catch((error) => console.error("Error deleting product:", error));
};

const handleAddToCart = (event) => {
  const productId = event.target.getAttribute("data-id");
  const productTitle = event.target.getAttribute("data-title");
  const productPrice = event.target.getAttribute("data-price");
  const productStock = parseInt(event.target.getAttribute("data-stock"), 10);
  const quantity = 1;

  if (productStock < quantity) {
    alert("Stock insuficiente");
    return;
  }

  fetch("/api/carts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Product added to cart");
        fetchProducts();
      } else {
        alert("Failed to add product to cart");
      }
    })
    .catch((error) => console.error("Error adding product to cart:", error));
};

// Export functions for use in main.js
window.fetchProducts = fetchProducts;
