document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const cartList = document.getElementById("cart-list");
  const totalPriceElement = document.getElementById("total-price");

  if (productList) {
    fetchProducts();
  }

  if (cartList) {
    fetchCart();
  }

  const addProductForm = document.getElementById("product-form");
  if (addProductForm) {
    handleAddProductForm(addProductForm);
  }

  const editProductForm = document.getElementById("edit-product-form");
  if (editProductForm) {
    populateEditForm(editProductForm);
  }
});
