const functionsBaseUrl = 'http://localhost:8888/.netlify/functions'

document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.querySelector('.modal');
  const dialogCloseButton = document.querySelector("dialog .btn-close");

  dialogCloseButton.addEventListener("click", () => {
    dialog.close();
  });

  if (isAuthenticated()) {
    document.querySelector('#login').classList.add('hidden');
    document.getElementById('admin').classList.remove('hidden');
  }

  const menuContainer = document.getElementById('menu-container');
  const menuForm = document.getElementById('menu-form');
  const itemIdInput = document.getElementById('item-id');
  const itemNameInput = document.getElementById('item-name');
  const itemCategoryInput = document.getElementById('item-category');
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
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Habilitado</th>
            <th>Ações</th>
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
                <button onclick="editItem(${item.id})">Editar</button>
                <button onclick="deleteItem(${item.id})">Apagar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  window.editItem = function(id) {
    dialog.showModal();
    const item = menuItems.find(item => item.id === id);
    itemIdInput.value = item.id;
    itemNameInput.value = item.name;
    itemCategoryInput.value = item.category;
    itemPriceInput.value = item.price;
    itemIsVisibleInput.checked = item.isVisible;
  };

  window.deleteItem = function(id) {
    menuItems = menuItems.filter(item => item.id !== id);
    renderMenuItems();
  };

  menuForm.addEventListener('submit', (e) => {
    const id = itemIdInput.value ? parseInt(itemIdInput.value) : Date.now();
    const newItem = {
      id,
      name: itemNameInput.value,
      category: itemCategoryInput.value,
      price: parseFloat(itemPriceInput.value),
      isVisible: itemIsVisibleInput.checked
    };

    const existingIndex = menuItems.findIndex(item => item.id === id);
    if (existingIndex > -1) {
      menuItems[existingIndex] = newItem;
    } else {
      menuItems.push(newItem);
    }
    fetch(`${functionsBaseUrl}/updateMenu`, {
      method: 'POST',
      body: JSON.stringify(menuItems),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(response => response.json())
    .then(() => { renderMenuItems(); menuForm.reset(); })
    .catch(error => console.error('Error:', error));
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