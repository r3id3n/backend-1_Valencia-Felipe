const handleAddProductForm = (form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const productId = document.getElementById("product-id").value;
    const productData = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      code: document.getElementById("code").value,
      price: document.getElementById("price").value,
      status: document.getElementById("status").value === "true",
      stock: document.getElementById("stock").value,
      category: document.getElementById("category").value,
    };

    const method = productId ? "PUT" : "POST";
    const url = productId ? `/api/products/${productId}` : "/api/products";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Product saved");
          window.location.href = "/list-products";
        } else {
          alert("Failed to save product");
        }
      })
      .catch((error) => console.error("Error saving product:", error));
  });
};

const populateEditForm = (form) => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = window.location.pathname.split("/").pop();
  document.getElementById("edit-product-id").value = productId;
  document.getElementById("edit-title").value = urlParams.get("title");
  document.getElementById("edit-description").value =
    urlParams.get("description");
  document.getElementById("edit-code").value = urlParams.get("code");
  document.getElementById("edit-price").value = urlParams.get("price");
  document.getElementById("edit-status").value = urlParams.get("status");
  document.getElementById("edit-stock").value = urlParams.get("stock");
  document.getElementById("edit-category").value = urlParams.get("category");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const productData = {
      title: document.getElementById("edit-title").value,
      description: document.getElementById("edit-description").value,
      code: document.getElementById("edit-code").value,
      price: document.getElementById("edit-price").value,
      status: document.getElementById("edit-status").value === "true",
      stock: document.getElementById("edit-stock").value,
      category: document.getElementById("edit-category").value,
    };

    fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Product updated");
          window.location.href = "/list-products";
        } else {
          alert("Failed to update product");
        }
      })
      .catch((error) => console.error("Error updating product:", error));
  });
};

window.handleAddProductForm = handleAddProductForm;
window.populateEditForm = populateEditForm;
