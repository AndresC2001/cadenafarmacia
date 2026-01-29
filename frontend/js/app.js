const tokenInput = document.getElementById('token');
const loginButton = document.getElementById('login');
const copyButton = document.getElementById('copy-token');
const roleInfo = document.getElementById('role-info');
const userNameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const tableBodies = {
  catalogo: document.getElementById('catalogo-table-body'),
  inventario: document.getElementById('inventario-table-body'),
  ventas: document.getElementById('ventas-table-body')
};

const emptyStates = {
  catalogo: document.getElementById('catalogo-empty'),
  inventario: document.getElementById('inventario-empty'),
  ventas: document.getElementById('ventas-empty')
};

const statusLabels = {
  catalogo: document.getElementById('catalogo-status'),
  inventario: document.getElementById('inventario-status'),
  ventas: document.getElementById('ventas-status')
};

const sectionState = {
  catalogo: [],
  inventario: [],
  ventas: []
};

const parseJwt = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    return null;
  }
};

const updateRoleUI = () => {
  const adminOnlyElements = document.querySelectorAll('[data-admin-only]');
  const token = Api.getToken();
  tokenInput.value = token;
  const payload = token ? parseJwt(token) : null;
  const roles = payload?.roles || [];
  roleInfo.textContent = roles.length ? roles.join(', ') : 'Sin sesión activa';
  const isAdmin = roles.includes('ROLE_ADMIN');
  adminOnlyElements.forEach((element) => {
    element.disabled = !isAdmin;
    element.classList.toggle('disabled', !isAdmin);
  });
};

const login = async () => {
  const username = userNameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) {
    alert('Ingresa usuario y contraseña.');
    return;
  }
  try {
    const response = await fetch('http://localhost:9000/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Credenciales inválidas');
    }
    const data = await response.json();
    Api.setToken(data.accessToken);
    updateRoleUI();
  } catch (error) {
    alert(`Error al iniciar sesión: ${error.message}`);
  }
};

const copyToken = async () => {
  if (!tokenInput.value) {
    alert('No hay token para copiar.');
    return;
  }
  try {
    await navigator.clipboard.writeText(tokenInput.value);
    alert('Token copiado al portapapeles.');
  } catch (error) {
    alert('No se pudo copiar el token.');
  }
};

loginButton.addEventListener('click', login);
copyButton.addEventListener('click', copyToken);

const actions = {
  catalogo: () => Api.request('/catalogo/productos'),
  inventario: () => Api.request('/inventario/inventario'),
  ventas: () => Api.request('/ventas/ventas')
};

document.querySelectorAll('button[data-action]').forEach((button) => {
  button.addEventListener('click', async () => {
    const action = button.dataset.action;
    await loadData(action);
  });
});

const currencyFormatter = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD'
});

const formatMoney = (value) => currencyFormatter.format(Number(value || 0));

const renderTable = (section, rows) => {
  const tableBody = tableBodies[section];
  tableBody.innerHTML = '';

  if (!rows.length) {
    emptyStates[section].style.display = 'block';
    return;
  }

  emptyStates[section].style.display = 'none';
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = row;
    tableBody.appendChild(tr);
  });
};

const renderCatalogo = (productos) => {
  const rows = productos.map((producto) => `
    <tr data-row-id="${producto.id}">
      <td>${producto.id ?? '-'}</td>
      <td>${producto.nombre ?? '-'}</td>
      <td>${producto.descripcion ?? '-'}</td>
      <td>${formatMoney(producto.precio)}</td>
      <td>
        <div class="table-actions">
          <button data-table-action="edit" data-section="catalogo" data-id="${producto.id}" data-admin-only>Editar</button>
          <button data-table-action="disable" data-section="catalogo" data-id="${producto.id}" data-admin-only class="ghost">Deshabilitar</button>
          <button data-table-action="delete" data-section="catalogo" data-id="${producto.id}" data-admin-only class="danger">Eliminar</button>
        </div>
      </td>
    </tr>
  `);
  renderTable('catalogo', rows);
};

const renderInventario = (inventarios) => {
  const rows = inventarios.map((item) => `
    <tr data-row-id="${item.productoId}">
      <td>${item.productoId ?? '-'}</td>
      <td>${item.stock ?? '-'}</td>
      <td>
        <div class="table-actions">
          <button data-table-action="edit" data-section="inventario" data-id="${item.productoId}" data-admin-only>Editar</button>
          <button data-table-action="disable" data-section="inventario" data-id="${item.productoId}" data-admin-only class="ghost">Deshabilitar</button>
          <button data-table-action="delete" data-section="inventario" data-id="${item.productoId}" data-admin-only class="danger">Eliminar</button>
        </div>
      </td>
    </tr>
  `);
  renderTable('inventario', rows);
};

const renderVentas = (ventas) => {
  const rows = ventas.map((venta) => `
    <tr data-row-id="${venta.id}">
      <td>${venta.id ?? '-'}</td>
      <td>${venta.cliente ?? '-'}</td>
      <td>${venta.detalles?.length ?? 0}</td>
      <td>${formatMoney(venta.total)}</td>
      <td>
        <div class="table-actions">
          <button data-table-action="edit" data-section="ventas" data-id="${venta.id}" data-admin-only>Editar</button>
          <button data-table-action="disable" data-section="ventas" data-id="${venta.id}" data-admin-only class="ghost">Deshabilitar</button>
          <button data-table-action="delete" data-section="ventas" data-id="${venta.id}" data-admin-only class="danger">Eliminar</button>
        </div>
      </td>
    </tr>
  `);
  renderTable('ventas', rows);
};

const loadData = async (action) => {
  const statusLabel = statusLabels[action];
  statusLabel.textContent = 'Cargando...';

  try {
    const data = await actions[action]();
    sectionState[action] = Array.isArray(data) ? data : [];
    if (action === 'catalogo') {
      renderCatalogo(sectionState[action]);
    }
    if (action === 'inventario') {
      renderInventario(sectionState[action]);
    }
    if (action === 'ventas') {
      renderVentas(sectionState[action]);
    }
    statusLabel.textContent = `Actualizado: ${new Date().toLocaleTimeString('es-EC')}`;
    updateRoleUI();
  } catch (error) {
    statusLabel.textContent = `Error: ${error.message}`;
  }
};

const productForm = {
  id: document.getElementById('producto-id'),
  nombre: document.getElementById('producto-nombre'),
  descripcion: document.getElementById('producto-descripcion'),
  precio: document.getElementById('producto-precio')
};

document.getElementById('crear-producto').addEventListener('click', async () => {
  try {
    await Api.request('/catalogo/productos', {
      method: 'POST',
      body: JSON.stringify({
        nombre: productForm.nombre.value,
        descripcion: productForm.descripcion.value,
        precio: Number(productForm.precio.value)
      })
    });
    await loadData('catalogo');
    alert('Producto creado');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

document.getElementById('actualizar-producto').addEventListener('click', async () => {
  try {
    await Api.request(`/catalogo/productos/${productForm.id.value}`, {
      method: 'PUT',
      body: JSON.stringify({
        nombre: productForm.nombre.value,
        descripcion: productForm.descripcion.value,
        precio: Number(productForm.precio.value)
      })
    });
    await loadData('catalogo');
    alert('Producto actualizado');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

document.getElementById('eliminar-producto').addEventListener('click', async () => {
  try {
    await Api.request(`/catalogo/productos/${productForm.id.value}`, {
      method: 'DELETE'
    });
    await loadData('catalogo');
    alert('Producto eliminado');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

const inventarioForm = {
  productoId: document.getElementById('inventario-producto-id'),
  stock: document.getElementById('inventario-stock')
};

document.getElementById('crear-inventario').addEventListener('click', async () => {
  try {
    await Api.request('/inventario/inventario', {
      method: 'POST',
      body: JSON.stringify({
        productoId: Number(inventarioForm.productoId.value),
        stock: Number(inventarioForm.stock.value)
      })
    });
    await loadData('inventario');
    alert('Inventario creado');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

document.getElementById('actualizar-inventario').addEventListener('click', async () => {
  try {
    await Api.request(`/inventario/inventario/${inventarioForm.productoId.value}`, {
      method: 'PUT',
      body: JSON.stringify({
        productoId: Number(inventarioForm.productoId.value),
        stock: Number(inventarioForm.stock.value)
      })
    });
    await loadData('inventario');
    alert('Inventario actualizado');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

document.getElementById('eliminar-inventario').addEventListener('click', async () => {
  try {
    await Api.request(`/inventario/inventario/${inventarioForm.productoId.value}`, {
      method: 'DELETE'
    });
    await loadData('inventario');
    alert('Inventario eliminado');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

const ventaForm = {
  id: document.getElementById('venta-id'),
  cliente: document.getElementById('venta-cliente'),
  productoId: document.getElementById('venta-producto-id'),
  cantidad: document.getElementById('venta-cantidad'),
  precio: document.getElementById('venta-precio')
};

document.getElementById('crear-venta').addEventListener('click', async () => {
  try {
    const cantidad = Number(ventaForm.cantidad.value);
    const precio = Number(ventaForm.precio.value);
    await Api.request('/ventas/ventas', {
      method: 'POST',
      body: JSON.stringify({
        cliente: ventaForm.cliente.value,
        total: cantidad * precio,
        detalles: [
          {
            productoId: Number(ventaForm.productoId.value),
            cantidad,
            precioUnitario: precio
          }
        ]
      })
    });
    await loadData('ventas');
    alert('Venta registrada');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

document.getElementById('actualizar-venta').addEventListener('click', async () => {
  try {
    const cantidad = Number(ventaForm.cantidad.value);
    const precio = Number(ventaForm.precio.value);
    await Api.request(`/ventas/ventas/${ventaForm.id.value}`, {
      method: 'PUT',
      body: JSON.stringify({
        cliente: ventaForm.cliente.value,
        total: cantidad * precio,
        detalles: [
          {
            productoId: Number(ventaForm.productoId.value),
            cantidad,
            precioUnitario: precio
          }
        ]
      })
    });
    await loadData('ventas');
    alert('Venta actualizada');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

document.getElementById('eliminar-venta').addEventListener('click', async () => {
  try {
    await Api.request(`/ventas/ventas/${ventaForm.id.value}`, {
      method: 'DELETE'
    });
    await loadData('ventas');
    alert('Venta eliminada');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

updateRoleUI();

document.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-table-action]');
  if (!button) {
    return;
  }

  if (button.disabled) {
    return;
  }

  const section = button.dataset.section;
  const action = button.dataset.tableAction;
  const id = button.dataset.id;

  if (action === 'edit') {
    if (section === 'catalogo') {
      const product = sectionState.catalogo.find((item) => String(item.id) === String(id));
      if (product) {
        productForm.id.value = product.id ?? '';
        productForm.nombre.value = product.nombre ?? '';
        productForm.descripcion.value = product.descripcion ?? '';
        productForm.precio.value = product.precio ?? '';
      }
    }
    if (section === 'inventario') {
      const item = sectionState.inventario.find((entry) => String(entry.productoId) === String(id));
      if (item) {
        inventarioForm.productoId.value = item.productoId ?? '';
        inventarioForm.stock.value = item.stock ?? '';
      }
    }
    if (section === 'ventas') {
      const venta = sectionState.ventas.find((entry) => String(entry.id) === String(id));
      if (venta) {
        ventaForm.id.value = venta.id ?? '';
        ventaForm.cliente.value = venta.cliente ?? '';
        const detalle = venta.detalles?.[0];
        ventaForm.productoId.value = detalle?.productoId ?? '';
        ventaForm.cantidad.value = detalle?.cantidad ?? '';
        ventaForm.precio.value = detalle?.precioUnitario ?? '';
      }
    }
    return;
  }

  if (action === 'disable') {
    const row = button.closest('tr');
    const isDisabled = row?.classList.toggle('is-disabled');
    button.textContent = isDisabled ? 'Habilitar' : 'Deshabilitar';
    return;
  }

  if (action === 'delete') {
    try {
      if (section === 'catalogo') {
        await Api.request(`/catalogo/productos/${id}`, { method: 'DELETE' });
        await loadData('catalogo');
        alert('Producto eliminado');
      }
      if (section === 'inventario') {
        await Api.request(`/inventario/inventario/${id}`, { method: 'DELETE' });
        await loadData('inventario');
        alert('Inventario eliminado');
      }
      if (section === 'ventas') {
        await Api.request(`/ventas/ventas/${id}`, { method: 'DELETE' });
        await loadData('ventas');
        alert('Venta eliminada');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
});
