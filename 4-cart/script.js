const products = [
  { id: 1, name: "Кофе", price: 300 },
  { id: 2, name: "Чай", price: 200 },
  { id: 3, name: "Круассан", price: 150 },
  { id: 4, name: "Маффин", price: 180 },
];

let cart = [];
let discount = 0;

const productsEl = document.getElementById("products");
const cartItemsEl = document.getElementById("cart-items");
const badgeEl = document.getElementById("badge");
const totalEl = document.getElementById("total");
const emptyMsg = document.getElementById("empty-msg");
const promoInput = document.getElementById("promo-input");
const promoBtn = document.getElementById("promo-btn");
const clearBtn = document.getElementById("clear-btn");

function renderProducts() {
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `<h3>${product.name}</h3><p>${product.price} ₽</p>`;

    const button = document.createElement("button");
    button.textContent = "В корзину";
    button.addEventListener("click", () => addToCart(product.id));
    card.appendChild(button);
    productsEl.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  const cartItem = cart.find((item) => item.id === id);
  if (cartItem) {
    cartItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
}

function increaseQty(id) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;

  item.qty += 1;
  renderCart();
}

function decreaseQty(id) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;

  if (item.qty > 1) {
    item.qty -= 1;
    renderCart();
  }
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
}

function applyPromo() {
  discount = promoInput.value.trim().toUpperCase() === "SALE10" ? 0.1 : 0;
  renderCart();
}

function clearCart() {
  cart = [];
  discount = 0;
  promoInput.value = "";
  renderCart();
}

function renderCart() {
  cartItemsEl.innerHTML = "";

  let total = 0;
  let itemCount = 0;

  cart.forEach((item) => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    itemCount += item.qty;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `<span>${item.name}</span>
      <button class="qty-btn" data-act="dec" aria-label="Уменьшить количество ${item.name}">−</button>
      <span class="qty">${item.qty}</span>
      <button class="qty-btn" data-act="inc" aria-label="Увеличить количество ${item.name}">+</button>
      <span class="line">${lineTotal} ₽</span>
      <button class="remove" aria-label="Удалить ${item.name}">✕</button>`;

    li.querySelector('[data-act="inc"]').addEventListener("click", () => increaseQty(item.id));
    li.querySelector('[data-act="dec"]').addEventListener("click", () => decreaseQty(item.id));
    li.querySelector(".remove").addEventListener("click", () => removeItem(item.id));
    cartItemsEl.appendChild(li);
  });

  total *= 1 - discount;
  badgeEl.textContent = itemCount;
  totalEl.textContent = Number(total.toFixed(2));
  emptyMsg.hidden = cart.length > 0;
}

promoBtn.addEventListener("click", applyPromo);
clearBtn.addEventListener("click", clearCart);

renderProducts();
renderCart();
