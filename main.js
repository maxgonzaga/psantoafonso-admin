const functionsBaseUrl = 'http://localhost:8888/.netlify/functions'

document.addEventListener('DOMContentLoaded', () => {

  if (isAuthenticated()) {
    document.querySelector('#login').classList.add('hidden');
    document.getElementById('admin').classList.remove('hidden');
  }
  const menuContainer = document.getElementById('menu-container');
  const menuForm = document.getElementById('menu-form');
  const itemIdInput = document.getElementById('item-id');
  const itemNameInput = document.getElementById('item-name');
  const itemCategoryInput = document.getElementById('item-category');
  const itemThumbnailUrlInput = document.getElementById('item-thumbnailUrl');
  const itemPriceInput = document.getElementById('item-price');
  const itemIsVisibleInput = document.getElementById('item-isVisible');

  let menuItems = [];

  fetch('menu-items.json')
    .then(response => response.json())
    .then(data => {
      menuItems = data;
      renderMenuItems();
    });

  function renderMenuItems() {
    menuContainer.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Visible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${menuItems.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.category}</td>
              <td>$${item.price}</td>
              <td>${item.isVisible}</td>
              <td>
                <button onclick="editItem(${item.id})">Edit</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  window.editItem = function(id) {
    const item = menuItems.find(item => item.id === id);
    itemIdInput.value = item.id;
    itemNameInput.value = item.name;
    itemCategoryInput.value = item.category;
    itemThumbnailUrlInput.value = item.thumbnailUrl;
    itemPriceInput.value = item.price;
    itemIsVisibleInput.checked = item.isVisible;
  };

  window.deleteItem = function(id) {
    menuItems = menuItems.filter(item => item.id !== id);
    renderMenuItems();
  };

  menuForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = itemIdInput.value ? parseInt(itemIdInput.value) : Date.now();
    const newItem = {
      id,
      name: itemNameInput.value,
      category: itemCategoryInput.value,
      thumbnailUrl: itemThumbnailUrlInput.value,
      price: parseFloat(itemPriceInput.value),
      isVisible: itemIsVisibleInput.checked
    };

    const existingIndex = menuItems.findIndex(item => item.id === id);
    if (existingIndex > -1) {
      menuItems[existingIndex] = newItem;
    } else {
      menuItems.push(newItem);
    }

    renderMenuItems();
    menuForm.reset();
  });

  document.getElementById('login-button').addEventListener('click', (e) => {
    const password = document.getElementById('password').value;
    fetch(`${functionsBaseUrl}/validatePassword`, {
      method: 'POST',
      body: JSON.stringify({ "password": password }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthorized) {
          document.querySelector('#login').classList.toggle('hidden');
          document.getElementById('admin').classList.toggle('hidden');
          localStorage.setItem('authenticationToken', btoa(password));
        }
      });
  });
});

function isAuthenticated() {
  return localStorage.getItem('authenticationToken') !== null;
}