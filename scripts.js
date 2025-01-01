let desserts = [];
let cart = [];

// Fetch data from data.json
const fetchDesserts = async () => {
  try {
    const response = await fetch('./data.json'); // Adjust the path if needed
    if (!response.ok) throw new Error('Failed to fetch data');
    desserts = await response.json();
    renderProducts();
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Utility Functions
const updateCart = () => {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="cart-item">
        <img src="${item.image.thumbnail}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <span>${item.name}</span>
          <p>$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <button class="remove-item" onclick="removeFromCart(${index})"><i class="fa-light fa-x"></i></button>
      </div>
    `;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.length;

  // Disable confirm order button if cart is empty
  document.getElementById('confirm-order').disabled = cart.length === 0;
};

const addToCart = (product) => {
  const item = cart.find((item) => item.name === product.name);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
  renderProducts();
};

const increaseQuantity = (index) => {
  cart[index].quantity++;
  updateCart();
};

const decreaseQuantity = (index) => {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1); // Remove item if quantity becomes 0
  }
  updateCart();
};

const removeFromCart = (index) => {
  cart.splice(index, 1);
  updateCart();
};

const renderProducts = () => {
  const productContainer = document.getElementById('products');
  productContainer.innerHTML = ''; // Clear existing products

  desserts.forEach((dessert) => {
    const itemInCart = cart.find((item) => item.name === dessert.name);

    const card = document.createElement('div');
    card.classList.add('product-card');

    if (itemInCart) {
      card.innerHTML = `
        <picture>
          <img src="${dessert.image.thumbnail}" alt="${dessert.name}" class="product-image" loading="lazy">
        </picture>
        <h3>${dessert.name}</h3>
        <p>$${dessert.price.toFixed(2)}</p>
        <div class="quantity-controls">
          <button onclick="decreaseQuantity(${cart.indexOf(itemInCart)})">-</button>
          <span>${itemInCart.quantity}</span>
          <button onclick="increaseQuantity(${cart.indexOf(itemInCart)})">+</button>
        </div>
      `;
    } else {
      card.innerHTML = `
        <picture>
          <img src="${dessert.image.thumbnail}" alt="${dessert.name}" class="product-image" loading="lazy">
        </picture>
        <h3>${dessert.name}</h3>
        <p>$${dessert.price.toFixed(2)}</p>
        <button onclick='addToCart(${JSON.stringify(dessert).replace(/"/g, '&quot;')})'>Add to Cart</button>
      `;
    }

    productContainer.appendChild(card);
  });
};

// Load data and initialize
fetchDesserts();

const confirmOrder = () => {
  const modal = document.getElementById('order-modal');
  const orderSummary = document.getElementById('order-summary');
  orderSummary.innerHTML = '';
  let total = 0;

  // Populate the order summary
  cart.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="order-item">
        <img src="${item.image.thumbnail}" alt="${item.name}" class="order-item-image">
        <div class="order-item-details">
          <span>${item.name}</span>
          <p> <span class="spanPrice">Price</span> $${item.price} <span class="spanPrice">Quntity</span>  ${item.quantity}</p>

        </div>
      </div>
    `;
    orderSummary.appendChild(li);
    total += item.price * item.quantity;
  });

  const totalElement = document.getElementById('order-total');
  totalElement.innerHTML = `<h4 class="h4">Total Amount: $${total.toFixed(2)}</h4>`;

  // Show the modal
  modal.classList.remove('hidden');
};

const resetOrder = () => {
  cart = [];
  updateCart();
  document.getElementById('order-modal').classList.add('hidden');
};

// Event Listeners
document.getElementById('confirm-order').addEventListener('click', confirmOrder);
document.getElementById('new-order').addEventListener('click', resetOrder);

