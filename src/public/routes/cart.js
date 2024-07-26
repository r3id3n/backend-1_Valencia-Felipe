const fetchCart = () => {
  fetch("/api/carts")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        renderCart(data.carts);
      }
    })
    .catch((error) => console.error("Error fetching cart:", error));
};

const renderCart = (carts) => {
  const cartList = document.getElementById("cart-list");
  const totalPriceElement = document.getElementById("total-price");
  cartList.innerHTML = "";
  let totalPrice = 0;
  carts.forEach((cart) => {
    cart.products.forEach((item) => {
      if (item.product) {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.classList.add("cart-item");
        cartItemDiv.innerHTML = `
            <h2>${item.product.title}</h2>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.product.price}</p>
            <p>Total: $${item.product.price * item.quantity}</p>
            <div class="form-group">
              <label for="quantity-${
                item.product._id
              }">Quantity to Remove</label>
              <input type="number" class="quantity-to-remove" id="quantity-${
                item.product._id
              }" min="1" max="${
          item.quantity
        }" value="1" placeholder="Enter quantity to remove" title="Quantity to Remove">
            </div>
            <button class="btn btn-warning remove-quantity-from-cart" data-id="${
              item.product._id
            }">Remove Quantity</button>
            <button class="btn btn-danger remove-from-cart" data-id="${
              item.product._id
            }">Remove Product</button>
          `;
        cartList.appendChild(cartItemDiv);
        totalPrice += item.product.price * item.quantity;
      }
    });
  });
  totalPriceElement.textContent = totalPrice;

  document.querySelectorAll(".remove-quantity-from-cart").forEach((button) => {
    button.addEventListener("click", handleRemoveQuantityFromCart);
  });

  document.querySelectorAll(".remove-from-cart").forEach((button) => {
    button.addEventListener("click", handleRemoveFromCart);
  });
};

const handleRemoveQuantityFromCart = (event) => {
  const productId = event.target.getAttribute("data-id");
  const quantityInput = event.target.previousElementSibling.querySelector(
    ".quantity-to-remove"
  );
  const quantity = parseInt(quantityInput.value, 10);

  fetch(`/api/carts/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Quantity removed from cart");
        fetchCart();
      } else {
        alert("Failed to remove quantity from cart");
      }
    })
    .catch((error) =>
      console.error("Error removing quantity from cart:", error)
    );
};

const handleRemoveFromCart = (event) => {
  const productId = event.target.getAttribute("data-id");

  fetch(`/api/carts/products/${productId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Product removed from cart");
        fetchCart();
      } else {
        alert("Failed to remove product from cart");
      }
    })
    .catch((error) =>
      console.error("Error removing product from cart:", error)
    );
};

window.fetchCart = fetchCart;
