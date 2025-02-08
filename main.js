document.addEventListener('DOMContentLoaded', () => {
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
    menuContainer.innerHTML = '';
    menuItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'menu-item';
      itemDiv.innerHTML = `
        <h3>${item.name}</h3>
        <p>Categoria: ${item.category}</p>
        <p>Preço: $${item.price}</p>
        <p>Visível: ${item.isVisible}</p>
        <button onclick="editItem(${item.id})">Edit</button>
        <button onclick="deleteItem(${item.id})">Delete</button>
      `;
      menuContainer.appendChild(itemDiv);
    });
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
});
