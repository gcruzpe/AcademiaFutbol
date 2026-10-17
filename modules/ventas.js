// modules/ventas.js - Módulo de Ventas COMPLETO
let carritoVentas = [];

async function renderVentas() {
    const container = document.getElementById('contentContainer');
    container.innerHTML = `
        <div class="ventas-panel"><div class="row g-4">
            <div class="col-md-8">
                <div class="module-card">
                    <div class="module-header">
                        <h4><i class="bi bi-cart"></i> Punto de Venta</h4>
                        <div class="d-flex align-items-center gap-2">
                            <div class="search-box" style="width: 100%; max-width: 300px;">
                                <i class="bi bi-search"></i>
                                <input type="text" class="form-control" id="buscarProductoVenta" placeholder="Buscar producto..." oninput="filtrarProductosVenta()">
                            </div>
                            <button class="btn btn-outline-primary d-md-none" onclick="toggleProductosVenta()" id="btnToggleProductos" title="Ver Carrito">
                                <i class="bi bi-cart-check"></i>
                            </button>
                        </div>
                    </div>
                    <div id="contenedorProductosVenta">
                        <div class="mb-3">
                            <select class="form-select" id="filtroCategoriaVenta" onchange="cargarProductosVenta()">
                                <option value="">Todas las categorías</option>
                            </select>
                        </div>
                        <div class="row" id="productosVentaGrid"></div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="module-card">
                    <div class="module-header">
                        <h4><i class="bi bi-cart-check"></i> Carrito</h4>
                        <button class="btn btn-sm btn-danger" onclick="limpiarCarrito()"><i class="bi bi-trash"></i></button>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Cliente (Opcional)</label>
                        <input type="text" class="form-control" id="ventaClienteBuscar" placeholder="Buscar cliente..." value="Cliente general" list="listaClientes" oninput="filtrarClientes()" onclick="limpiarSelectorCliente()">
                        <datalist id="listaClientes"></datalist>
                        <input type="hidden" id="ventaCliente">
                    </div>
                    <div id="carritoVentaItems" style="max-height: 300px; overflow-y: auto;"></div>
                    <hr>
                    <div class="mb-3">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <strong id="subtotalVenta">S/ 0.00</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-3">
                            <h5>Total:</h5>
                            <h5 class="text-primary" id="totalVenta">S/ 0.00</h5>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Método de Pago</label>
                            <select class="form-select" id="metodoPagoVenta">
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Transferencia">Transferencia</option>
                                <option value="Yape/Plin">Yape/Plin</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Tipo de Comprobante</label>
                            <select class="form-select" id="tipoComprobanteVenta">
                                <option value="Ticket">Ticket</option>
                                <option value="Boleta">Boleta</option>
                                <option value="Factura">Factura</option>
                            </select>
                        </div>
                        <button class="btn btn-success w-100" onclick="procesarVenta()" id="btnProcesarVenta" disabled>
                            <i class="bi bi-check-circle"></i> Procesar Venta
                        </button>
                    </div>
                </div>
                <div class="module-card mt-3">
                    <h6 class="text-primary mb-3"><i class="bi bi-clock-history"></i> Ventas del Día</h6>
                    <div id="ventasDelDia"></div>
                </div>
            </div>
        </div>
        </div>
        <div class="modal fade" id="modalComprobante" tabindex="-1">
            <div class="modal-dialog" style="max-width:520px">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="bi bi-receipt"></i> Comprobante de Venta</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="comprobanteContent"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="imprimirComprobante()"><i class="bi bi-printer"></i> Imprimir</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    await cargarClientesVenta();
    await cargarCategoriasVentaFiltro();
    await cargarProductosVenta();
    await cargarVentasDelDia();
    actualizarCarritoVenta();
}

async function cargarClientesVenta() {
    const datalist = document.getElementById('listaClientes');
    if (!datalist) return;
    const alumnos = await getDataByEmpresa('alumnos', getCurrentEmpresa().id);
    window.clientesVenta = alumnos.filter(a => a.activo); // Guardar en variable global para filtrado
    datalist.innerHTML = '<option value="Cliente general"></option>' +
        window.clientesVenta.map(a => `<option value="${a.nombres} ${a.apellidos}" data-id="${a.id}"></option>`).join('');
}

function filtrarClientes() {
    const input = document.getElementById('ventaClienteBuscar');
    const hiddenInput = document.getElementById('ventaCliente');
    const valor = input.value;

    // Buscar si el valor coincide con algún cliente
    const clienteEncontrado = window.clientesVenta?.find(a =>
        `${a.nombres} ${a.apellidos}` === valor
    );

    // Actualizar el campo oculto con el ID del cliente
    if (clienteEncontrado) {
        hiddenInput.value = clienteEncontrado.id;
    } else if (valor === 'Cliente general' || valor === '') {
        hiddenInput.value = '';
    }
}

function limpiarSelectorCliente() {
    const input = document.getElementById('ventaClienteBuscar');
    if (input.value === 'Cliente general') {
        input.value = '';
        input.select(); // Selecciona todo el texto para facilitar la escritura
    }
}

async function cargarProductosVenta() {
    const productos = await getDataByEmpresa('productos', getCurrentEmpresa().id);
    const filtro = document.getElementById('filtroCategoriaVenta').value;
    let productosFiltrados = productos.filter(p => p.stock > 0);
    if (filtro) productosFiltrados = productosFiltrados.filter(p => p.categoria === filtro);

    const grid = document.getElementById('productosVentaGrid');
    if (productosFiltrados.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted py-4">No hay productos disponibles</div>';
        return;
    }

    grid.innerHTML = productosFiltrados.map(p => `
        <div class="col-md-4 mb-2" data-nombre="${p.nombre.toLowerCase()}">
            <div class="card h-100">
                <div class="card-body" style="padding:10px;">
                    <div class="text-center mb-2">
                        <img src="${p.imagen || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect fill='%23e9ecef' width='120' height='120'/%3E%3C/svg%3E"}" alt="${p.nombre}" style="width:120px;height:120px;object-fit:cover;border-radius:6px;border:1px solid #ddd;">
                    </div>
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <span style="font-size:14px;font-weight:600;">${p.nombre}</span>
                        <span class="badge bg-info">${p.categoria}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="text-muted" style="font-size:12px;">Stock</span>
                        <span class="badge ${p.stock <= p.stockMinimo ? 'bg-warning' : 'bg-success'}">${p.stock}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-primary" style="font-size:16px;font-weight:700;">${formatearMoneda(p.precioVenta)}</span>
                        <button class="btn btn-sm btn-primary px-3" style="min-width:120px;" onclick="agregarAlCarritoVenta(${p.id})">
                            <i class="bi bi-cart-plus"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function agregarAlCarritoVenta(productoId) {
    const producto = await getData('productos', productoId);
    if (!producto) return;

    const itemExistente = carritoVentas.find(item => item.id === productoId);
    if (itemExistente) {
        if (itemExistente.cantidad < producto.stock) itemExistente.cantidad++;
        else { mostrarAlerta('Stock insuficiente', 'warning'); return; }
    } else {
        carritoVentas.push({
            id: producto.id, sku: producto.sku, nombre: producto.nombre,
            categoria: producto.categoria, precio: producto.precioVenta,
            cantidad: 1, stockDisponible: producto.stock
        });
    }
    actualizarCarritoVenta();
    mostrarAlerta('Producto agregado', 'success');
}

function actualizarCarritoVenta() {
    const container = document.getElementById('carritoVentaItems');
    if (carritoVentas.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-4">Carrito vacío</p>';
        document.getElementById('subtotalVenta').textContent = 'S/ 0.00';
        document.getElementById('totalVenta').textContent = 'S/ 0.00';
        document.getElementById('btnProcesarVenta').disabled = true;
        return;
    }

    document.getElementById('btnProcesarVenta').disabled = false;
    container.innerHTML = carritoVentas.map((item, idx) => `
        <div class="cart-item mb-2">
            <div class="d-flex justify-content-between">
                <div>
                    <strong>${item.nombre}</strong><br>
                    <small>${formatearMoneda(item.precio)} x ${item.cantidad}</small>
                </div>
                <div class="text-end">
                    <strong>${formatearMoneda(item.precio * item.cantidad)}</strong><br>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary" onclick="cambiarCantidad(${idx}, -1)">-</button>
                        <button class="btn btn-outline-secondary" disabled>${item.cantidad}</button>
                        <button class="btn btn-outline-secondary" onclick="cambiarCantidad(${idx}, 1)">+</button>
                    </div>
                    <button class="btn btn-sm btn-danger" onclick="eliminarItem(${idx})"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        </div>
    `).join('');

    const total = carritoVentas.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    document.getElementById('subtotalVenta').textContent = formatearMoneda(total);
    document.getElementById('totalVenta').textContent = formatearMoneda(total);
}

function cambiarCantidad(idx, cambio) {
    const item = carritoVentas[idx];
    const nueva = item.cantidad + cambio;
    if (nueva <= 0) { eliminarItem(idx); return; }
    if (nueva > item.stockDisponible) { mostrarAlerta('Stock insuficiente', 'warning'); return; }
    item.cantidad = nueva;
    actualizarCarritoVenta();
}

function eliminarItem(idx) {
    carritoVentas.splice(idx, 1);
    actualizarCarritoVenta();
}

function limpiarCarrito() {
    if (carritoVentas.length && confirm('¿Limpiar carrito?')) {
        carritoVentas = [];
        actualizarCarritoVenta();
    }
}

async function procesarVenta() {
    if (carritoVentas.length === 0) return;

    const total = carritoVentas.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const ventaData = {
        empresaId: getCurrentEmpresa().id,
        fecha: new Date().toISOString(),
        clienteId: document.getElementById('ventaCliente').value || null,
        metodoPago: document.getElementById('metodoPagoVenta').value,
        tipoComprobante: document.getElementById('tipoComprobanteVenta').value,
        productos: carritoVentas,
        subtotal: total,
        total: total,
        numeroComprobante: 'V' + Date.now().toString().slice(-8),
        usuario: getCurrentUser().nombre || getCurrentUser().usuario
    };

    try {
        const ventaId = await addData('ventas', ventaData);
        for (const item of carritoVentas) await actualizarStock(item.id, item.cantidad);

        mostrarAlerta('Venta procesada exitosamente', 'success');
        ventaData.id = ventaId;
        await mostrarComprobante(ventaData);

        carritoVentas = [];
        actualizarCarritoVenta();
        await cargarProductosVenta();
        await cargarVentasDelDia();
    } catch (error) {
        mostrarAlerta('Error al procesar venta', 'danger');
    }
}

async function mostrarComprobante(venta) {
    const empresa = getCurrentEmpresa();
    const cliente = venta.clienteId ? await getData('alumnos', parseInt(venta.clienteId)) : null;

    document.getElementById('comprobanteContent').innerHTML = `
        <div class="text-center mb-4">
            <h3>${empresa.nombre}</h3>
            <h5>${venta.tipoComprobante}</h5>
            <p><strong>N° ${venta.numeroComprobante}</strong></p>
            <p class="text-muted small">${formatearFecha(venta.fecha)}</p>
        </div>
        ${cliente ? `<div class="mb-3"><strong>Cliente:</strong> ${cliente.nombres} ${cliente.apellidos}<br><strong>DNI:</strong> ${cliente.dni}</div>` : ''}
        <table class="table table-sm">
            <thead><tr><th>Producto</th><th>Cant.</th><th class="text-end">P. Unit.</th><th class="text-end">Total</th></tr></thead>
            <tbody>
                ${venta.productos.map(item => `<tr><td>${item.nombre}</td><td>${item.cantidad}</td><td class="text-end">${formatearMoneda(item.precio)}</td><td class="text-end">${formatearMoneda(item.precio * item.cantidad)}</td></tr>`).join('')}
            </tbody>
        </table>
        <div class="text-end">
            <h5 class="text-primary"><strong>Total: ${formatearMoneda(venta.total)}</strong></h5>
        </div>
        <hr>
        <div class="text-center">
            <p><strong>Método de Pago:</strong> ${venta.metodoPago}</p>
            <p class="text-muted small">Gracias por su compra</p>
        </div>
    `;

    window.ventaActual = venta;
    new bootstrap.Modal(document.getElementById('modalComprobante')).show();
}

function imprimirComprobante() {
    imprimirContenido(document.getElementById('comprobanteContent').innerHTML);
}

async function cargarVentasDelDia() {
    const ventas = await getDataByEmpresa('ventas', getCurrentEmpresa().id);
    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoy = ventas.filter(v => v.fecha.split('T')[0] === hoy);

    if (ventasHoy.length === 0) {
        document.getElementById('ventasDelDia').innerHTML = '<p class="text-muted small">Sin ventas hoy</p>';
        return;
    }

    const totalHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
    document.getElementById('ventasDelDia').innerHTML = `
        <div class="mb-2">
            <strong>${ventasHoy.length}</strong> ventas<br>
            <h5 class="text-success mb-0">${formatearMoneda(totalHoy)}</h5>
        </div>
        ${ventasHoy.slice(0, 5).map(v => `
            <div class="small mb-1 p-2 bg-light rounded">
                <strong>${v.numeroComprobante}</strong><br>
                ${formatearMoneda(v.total)} - ${v.metodoPago}
            </div>
        `).join('')}
    `;
}

function filtrarProductosVenta() {
    const filtro = document.getElementById('buscarProductoVenta').value.toLowerCase();
    document.querySelectorAll('#productosVentaGrid > div').forEach(div => {
        div.style.display = div.dataset.nombre.includes(filtro) ? '' : 'none';
    });
}

async function cargarCategoriasVentaFiltro() {
    const empresa = getCurrentEmpresa();
    const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    const cfg = rows && rows[0] ? rows[0] : null;
    const categorias = cfg && Array.isArray(cfg.categoriasProducto) && cfg.categoriasProducto.length ? cfg.categoriasProducto : ['Uniformes', 'Pelotas', 'Suplementos', 'Accesorios'];
    const select = document.getElementById('filtroCategoriaVenta');
    if (!select) return;
    select.innerHTML = '<option value="">Todas las categorías</option>' + categorias.map(c => `<option value="${c}">${c}</option>`).join('');
}

function toggleProductosVenta() {
    const contenedor = document.getElementById('contenedorProductosVenta');
    const btn = document.getElementById('btnToggleProductos');
    const icon = btn.querySelector('i');

    if (contenedor.style.display === 'none') {
        contenedor.style.display = 'block';
        icon.className = 'bi bi-cart-check';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
    } else {
        contenedor.style.display = 'none';
        icon.className = 'bi bi-grid';
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-primary');
    }
}
