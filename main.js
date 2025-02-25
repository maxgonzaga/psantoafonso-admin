const functionsBaseUrl = 'https://psantoafonso-admin.netlify.app/api'

document.addEventListener('DOMContentLoaded', () => {

  const menuContainer = document.getElementById('menu-container');
  const menuForm = document.getElementById('menu-form');
  const itemIdInput = document.getElementById('item-id');
  const itemNameInput = document.getElementById('item-name');
  const itemCategoryInput = document.getElementById('item-category');
  const itemPriceInput = document.getElementById('item-price');
  const itemIsVisibleInput = document.getElementById('item-isVisible');
  const dialog = document.querySelector('.modal');
  const dialogCloseButton = document.querySelector("dialog .btn-close");
  const addItemButton = document.querySelector("#add-item");
  const logoutButton = document.getElementById('logout-button');

  let menuItems = [];

  function clearForm() {
    itemIdInput.value = '';
    itemNameInput.value = '';
    itemCategoryInput.value = '';
    itemPriceInput.value = '';
    itemIsVisibleInput.checked = true;
  }

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('authenticationToken');
    document.getElementById('login').classList.toggle('hidden');
    document.getElementById('admin').classList.toggle('hidden');
  });
  
  dialogCloseButton.addEventListener("click", () => {
    dialog.close();
    clearForm();
  });

  if (isAuthenticated()) {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('admin').classList.remove('hidden');
  }

  addItemButton.addEventListener("click", () => {
    dialog.showModal();
    itemIdInput.value = Math.max(...menuItems.map(item => item.id)) + 1;
  });

  fetch(`${functionsBaseUrl}/getMenu`)
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
            <th scope="col">Descrição</th>
            <th scope="col">Categoria</th>
            <th scope="col" class="small-width-column">Preço</th>
            <th scope="col" class="small-width-column">Mostrar?</th>
          </tr>
        </thead>
        <tbody>
          ${menuItems.map(item => `
            <tr>
              <td scope="row" onclick="editItem(${item.id})">${item.name}</td>
              <td>${item.category}</td>
              <td class="small-width-column">${formatAsCurrency(item.price)}</td>
              <td class="small-width-column">${item.isVisible ? "<span class='item-visible'>&#9989;</span>" : "<span class='item-hidden'>&#10060;</span>"}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  window.editItem = function (id) {
    dialog.showModal();
    const item = menuItems.find(item => item.id === id);
    itemIdInput.value = item.id;
    itemNameInput.value = item.name;
    itemCategoryInput.value = item.category;
    itemPriceInput.value = item.price;
    itemIsVisibleInput.checked = item.isVisible;
  };

  window.deleteItem = function (id) {
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
    updateMenu()
      .then(response => response.json())
      .then(() => { renderMenuItems(); menuForm.reset(); })
      .catch(error => console.error('Error:', error));
  });

  document.getElementById('login-button').addEventListener('click', (e) => {
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    fetch(`${functionsBaseUrl}/validatePassword`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthorized) {
          document.getElementById('login').classList.add('hidden');
          document.getElementById('admin').classList.remove('hidden');
          localStorage.setItem('authenticationToken', btoa(password));
          document.getElementById('password').value = '';
          document.getElementById('username').value = '';
        }
        else {
          document.getElementById('validation-message').classList.remove('not-visible');
        }
      });
  });

  function updateMenu() {
    return fetch(`${functionsBaseUrl}/updateMenu`, {
      method: 'POST',
      body: JSON.stringify(menuItems),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
  }

  function formatAsCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }
});

function isAuthenticated() {
  return localStorage.getItem('authenticationToken') !== null;
}
