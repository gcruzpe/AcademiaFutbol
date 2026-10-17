// Módulo de Inventario
async function renderInventario() {
    const container = document.getElementById('contentContainer');
    container.innerHTML = `
        <div class="module-card">
            <div class="module-header">
                <h4><i class="bi bi-box-seam"></i> Gestión de Inventario</h4>
                <div class="d-flex gap-2">
                    <button class="btn btn-success" onclick="mostrarModalAumentarStock()">
                        <i class="bi bi-plus-square"></i> Aumentar Stock
                    </button>
                    <button class="btn btn-primary" onclick="mostrarModalProducto()">
                        <i class="bi bi-plus-circle"></i> Nuevo Producto
                    </button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-modern">
                    <thead>
                        <tr>
                            <th style="background-color: var(--very-light-blue); color: var(--text-dark);">Imagen</th>
                            <th style="background-color: var(--very-light-blue); color: var(--text-dark);">Producto</th>
                            <th style="background-color: var(--very-light-blue); color: var(--text-dark);">Categoría</th>
                            <th style="background-color: var(--very-light-blue); color: var(--text-dark);">Stock</th>
                            <th style="background-color: var(--very-light-blue); color: var(--text-dark);">Precio</th>
                            <th style="background-color: var(--very-light-blue); color: var(--text-dark);">Detalle</th>
                            <th style="background-color: var(--very-light-blue); color: var(--text-dark);">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="productosTableBody"></tbody>
                </table>
            </div>
        </div>
        <div class="modal fade" id="modalProducto" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Nuevo Producto</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formProducto">
                            <input type="hidden" id="productoId">
                            <div class="mb-3">
                                <label class="form-label">SKU *</label>
                                <input type="text" class="form-control" id="productoSku" required readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Nombre *</label>
                                <input type="text" class="form-control" id="productoNombre" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Categoría</label>
                                <select class="form-select" id="productoCategoria">
                                    <option value="Uniformes">Uniformes</option>
                                    <option value="Pelotas">Pelotas</option>
                                    <option value="Suplementos">Suplementos</option>
                                    <option value="Accesorios">Accesorios</option>
                                </select>
                            </div>
                            <div class="row">
                                <div class="col-6 mb-3">
                                    <label class="form-label">Stock *</label>
                                    <input type="number" class="form-control" id="productoStock" required>
                                </div>
                                <div class="col-6 mb-3">
                                    <label class="form-label">Stock Mínimo</label>
                                    <input type="number" class="form-control" id="productoStockMin" value="10">
                                </div>
                            </div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label">Precio Compra</label>
                                <input type="number" step="0.01" class="form-control" id="productoPrecioCompra">
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label">Precio Venta *</label>
                                <input type="number" step="0.01" class="form-control" id="productoPrecioVenta" required>
                            </div>
                        </div>
                        <div class="mb-3 text-center">
                            <img id="productoImagenPreview" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect fill='%23e9ecef' width='120' height='120'/%3E%3Ctext fill='%236c757d' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='14'%3ESin imagen%3C/text%3E%3C/svg%3E" style="width:120px;height:120px;object-fit:cover;border-radius:6px;border:2px solid #1e56a0;">
                            <div class="mt-2">
                                <input type="file" id="productoImagenFile" accept="image/*" onchange="previewImagenProducto(this)" style="display:none;">
                                <input type="hidden" id="productoImagenBase64">
                                <button type="button" class="btn btn-outline-primary" onclick="cargarImagenProducto()"><i class="bi bi-image"></i> Cargar imagen</button>
                            </div>
                        </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarProducto()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal Detalle de Producto -->
        <div class="modal fade" id="modalDetalleProducto" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header text-white" style="background: linear-gradient(90deg, #4b2e83 0%, #6a42c1 50%, #b57edc 100%);">
                        <h5 class="modal-title"><i class="bi bi-box-seam"></i> Detalle de Inventario - <span id="detalleProductoNombre"></span></h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Información General -->
                        <div class="mb-4">
                            <h6 class="text-muted mb-3"><i class="bi bi-info-circle"></i> Información General</h6>
                            <div class="row">
                                <div class="col-md-3 text-center">
                                    <img id="detalleProductoImagen" src="" style="width:150px;height:150px;object-fit:cover;border-radius:8px;border:2px solid #ddd;">
                                </div>
                                <div class="col-md-9">
                                    <div class="row">
                                        <div class="col-md-4 mb-3">
                                            <small class="text-muted">Código/SKU</small>
                                            <div class="fw-bold" id="detalleProductoSku"></div>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <small class="text-muted">Categoría</small>
                                            <div class="fw-bold" id="detalleProductoCategoria"></div>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <small class="text-muted">Precio Costo</small>
                                            <div class="fw-bold" id="detalleProductoPrecioCosto"></div>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <small class="text-muted">Precio Retail</small>
                                            <div class="fw-bold text-success" id="detalleProductoPrecioRetail"></div>
                                        </div>
                                        <div class="col-md-8 mb-3">
                                            <small class="text-muted">Descripción</small>
                                            <div id="detalleProductoDescripcion">Sin descripción</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Stock Total Disponible -->
                        <div class="text-center p-4 mb-4" style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); border-radius: 12px;">
                            <div style="color: white; font-size: 2.5rem; font-weight: 700;">
                                <i class="bi bi-box-seam"></i> <span id="detalleProductoStockTotal"></span>
                            </div>
                            <div style="color: rgba(255,255,255,0.9); font-size: 1.1rem;">Stock Total Disponible</div>
                        </div>
                        
                        <!-- Detalle del Inventario -->
                        <div>
                            <h6 class="text-white p-2 mb-3" style="background-color: #6c757d; border-radius: 6px;">
                                <i class="bi bi-table"></i> Detalle del Inventario
                            </h6>
                            <div class="row text-center">
                                <div class="col-3">
                                    <div class="fw-bold text-uppercase" style="font-size: 0.85rem;">Stock Actual</div>
                                    <div class="mt-2">
                                        <span class="badge bg-primary" style="font-size: 1.1rem; padding: 8px 16px;" id="detalleStockActual"></span>
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="fw-bold text-uppercase" style="font-size: 0.85rem;">Stock Mínimo</div>
                                    <div class="mt-2" style="font-size: 1.1rem;" id="detalleStockMinimo"></div>
                                </div>
                                <div class="col-3">
                                    <div class="fw-bold text-uppercase" style="font-size: 0.85rem;">Estado</div>
                                    <div class="mt-2">
                                        <span class="badge" style="font-size: 0.9rem; padding: 6px 12px;" id="detalleEstado"></span>
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="fw-bold text-uppercase" style="font-size: 0.85rem;">Ubicación</div>
                                    <div class="mt-2" style="font-size: 1.1rem;" id="detalleUbicacion">Almacén Principal</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="bi bi-x-circle"></i> Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal Kardex de Producto -->
        <div class="modal fade" id="modalKardexProducto" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header text-white" style="background: linear-gradient(90deg, #4b2e83 0%, #6a42c1 50%, #b57edc 100%);">
                        <h5 class="modal-title"><i class="bi bi-journal-text"></i> Kardex - <span id="kardexProductoNombre"></span></h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Información del producto -->
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <small class="text-muted">Código/SKU:</small>
                                <div class="fw-bold" id="kardexProductoSku"></div>
                            </div>
                            <div class="col-md-6">
                                <small class="text-muted">Categoría:</small>
                                <div class="fw-bold" id="kardexProductoCategoria"></div>
                            </div>
                        </div>
                        
                        <!-- Stock Actual -->
                        <div class="text-center p-4 mb-4" style="background: linear-gradient(135deg, #00bcd4 0%, #00acc1 100%); border-radius: 12px;">
                            <div style="color: white; font-size: 2.5rem; font-weight: 700;">
                                <i class="bi bi-box-seam"></i> <span id="kardexStockActual"></span>
                            </div>
                            <div style="color: rgba(255,255,255,0.95); font-size: 1.1rem;">Stock Actual</div>
                        </div>
                        
                        <!-- Movimientos de Inventario -->
                        <div>
                            <h6 class="text-white p-2 mb-3" style="background-color: #6c757d; border-radius: 6px;">
                                <i class="bi bi-list-ul"></i> Movimientos de Inventario
                            </h6>
                            <div class="table-responsive">
                                <table class="table table-sm table-hover">
                                    <thead style="background-color: #f8f9fa;">
                                        <tr>
                                            <th>FECHA</th>
                                            <th>USUARIO</th>
                                            <th>OPERACIÓN</th>
                                            <th>REFERENCIA</th>
                                            <th>MOTIVO</th>
                                            <th class="text-center">INGRESO</th>
                                            <th class="text-center">SALIDA</th>
                                            <th class="text-center">SALDO</th>
                                        </tr>
                                    </thead>
                                    <tbody id="kardexMovimientos">
                                        <tr>
                                            <td colspan="8" class="text-center text-muted">Cargando movimientos...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="bi bi-x-circle"></i> Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal Aumentar Stock -->
        <div class="modal fade" id="modalAumentarStock" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="bi bi-plus-square"></i> Aumentar Stock de Producto</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formAumentarStock">
                            <div class="mb-3">
                                <label class="form-label">Producto *</label>
                                <select class="form-select" id="aumentarStockProducto" required onchange="actualizarStockActualAumentar()">
                                    <option value="">Seleccione un producto</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Stock Actual</label>
                                <input type="text" class="form-control" id="aumentarStockActual" readonly style="background-color: #e9ecef; font-weight: bold;">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Cantidad a Aumentar *</label>
                                <input type="number" class="form-control" id="aumentarStockCantidad" min="1" required placeholder="Ingrese cantidad">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Nuevo Stock</label>
                                <input type="text" class="form-control" id="aumentarStockNuevo" readonly style="background-color: #d1ecf1; font-weight: bold; color: #0c5460;">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Motivo</label>
                                <select class="form-select" id="aumentarStockMotivo">
                                    <option value="Compra">Compra</option>
                                    <option value="Reposición">Reposición</option>
                                    <option value="Ajuste de inventario">Ajuste de inventario</option>
                                    <option value="Devolución">Devolución</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Observaciones</label>
                                <textarea class="form-control" id="aumentarStockObservaciones" rows="2" placeholder="Observaciones adicionales (opcional)"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" onclick="guardarAumentoStock()">
                            <i class="bi bi-check-circle"></i> Guardar Aumento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    await cargarProductos();
}

async function cargarProductos() {
    const empresa = getCurrentEmpresa();
    const productos = await getDataByEmpresa('productos', empresa.id);
    const tbody = document.getElementById('productosTableBody');

    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos</td></tr>';
        return;
    }

    tbody.innerHTML = productos.map(p => {
        const imgSrc = p.imagen || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23e9ecef' width='40' height='40'/%3E%3C/svg%3E";
        return `
        <tr>
            <td><img src="${imgSrc}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;border:1px solid #ddd;"></td>
            <td>${p.nombre}</td>
            <td>${p.categoria}</td>
            <td><span class="badge ${p.stock <= p.stockMinimo ? 'bg-danger' : 'bg-success'}">${p.stock}</span></td>
            <td>${formatearMoneda(p.precioVenta)}</td>
            <td>
                <a href="javascript:void(0)" onclick="verDetalleProducto(${p.id})" class="text-primary" style="text-decoration: none;">
                    <i class="bi bi-eye"></i> Ver Detalle
                </a>
            </td>
            <td>
                <button class="btn btn-sm btn-info btn-icon text-white" onclick="verKardexProducto(${p.id})" title="Ver Kardex">
                    <i class="bi bi-journal-text"></i>
                </button>
                <button class="btn btn-sm btn-primary btn-icon" onclick="editarProducto(${p.id})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-danger btn-icon" onclick="eliminarProducto(${p.id})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
        `;
    }).join('');
}

function mostrarModalProducto() {
    document.getElementById('formProducto').reset();
    document.getElementById('productoId').value = '';
    document.getElementById('productoSku').value = generarCodigo('PRD');
    document.getElementById('productoImagenPreview').src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect fill='%23e9ecef' width='120' height='120'/%3E%3Ctext fill='%236c757d' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='14'%3ESin imagen%3C/text%3E%3C/svg%3E";
    document.getElementById('productoImagenBase64').value = '';
    cargarCategoriasProductoSelect();
    new bootstrap.Modal(document.getElementById('modalProducto')).show();
}

async function guardarProducto() {
    const id = document.getElementById('productoId').value;
    const data = {
        empresaId: getCurrentEmpresa().id,
        sku: document.getElementById('productoSku').value,
        nombre: document.getElementById('productoNombre').value,
        categoria: document.getElementById('productoCategoria').value,
        stock: parseInt(document.getElementById('productoStock').value),
        stockMinimo: parseInt(document.getElementById('productoStockMin').value),
        precioCompra: parseFloat(document.getElementById('productoPrecioCompra').value) || 0,
        precioVenta: parseFloat(document.getElementById('productoPrecioVenta').value),
        imagen: document.getElementById('productoImagenBase64').value,
        fechaCreacion: new Date().toISOString()
    };

    try {
        if (id) {
            data.id = parseInt(id);
            await updateData('productos', data);
        } else {
            await addData('productos', data);
        }
        const modalEl = document.getElementById('modalProducto');
        const modal = bootstrap.Modal.getInstance(modalEl);
        document.activeElement.blur();
        modalEl.addEventListener('hidden.bs.modal', async () => {
            mostrarAlerta('Producto guardado correctamente', 'success');
            await cargarProductos();
        }, { once: true });
        modal.hide();
    } catch (error) {
        mostrarAlerta('Error al guardar producto', 'danger');
    }
}

async function editarProducto(id) {
    const p = await getData('productos', id);
    document.getElementById('productoId').value = p.id;
    document.getElementById('productoSku').value = p.sku;
    document.getElementById('productoNombre').value = p.nombre;
    await cargarCategoriasProductoSelect(p.categoria);
    document.getElementById('productoStock').value = p.stock;
    document.getElementById('productoStockMin').value = p.stockMinimo;
    document.getElementById('productoPrecioCompra').value = p.precioCompra;
    document.getElementById('productoPrecioVenta').value = p.precioVenta;
    if (p.imagen) {
        document.getElementById('productoImagenPreview').src = p.imagen;
        document.getElementById('productoImagenBase64').value = p.imagen;
    }
    new bootstrap.Modal(document.getElementById('modalProducto')).show();
}

async function eliminarProducto(id) {
    if (!await confirmarAccion('¿Eliminar este producto?')) return;
    try {
        await deleteData('productos', id);
        mostrarAlerta('Producto eliminado', 'success');
        await cargarProductos();
    } catch (error) {
        mostrarAlerta('Error al eliminar', 'danger');
    }
}

function cargarImagenProducto() {
    document.getElementById('productoImagenFile').click();
}

function previewImagenProducto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('productoImagenPreview').src = e.target.result;
            document.getElementById('productoImagenBase64').value = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

async function cargarCategoriasProductoSelect(selected) {
    const empresa = getCurrentEmpresa();
    const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    const cfg = rows && rows[0] ? rows[0] : null;
    const categorias = cfg && Array.isArray(cfg.categoriasProducto) && cfg.categoriasProducto.length ? cfg.categoriasProducto : ['Uniformes', 'Pelotas', 'Suplementos', 'Accesorios'];
    const select = document.getElementById('productoCategoria');
    if (!select) return;
    select.innerHTML = categorias.map(c => `<option value="${c}">${c}</option>`).join('');
    if (selected) {
        if (!categorias.includes(selected)) {
            select.innerHTML = `<option value="${selected}">${selected}</option>` + select.innerHTML;
        }
        select.value = selected;
    }
}

async function verDetalleProducto(id) {
    const p = await getData('productos', id);
    if (!p) return;

    // Llenar información general
    document.getElementById('detalleProductoNombre').textContent = p.nombre;
    document.getElementById('detalleProductoSku').textContent = p.sku || 'N/A';
    document.getElementById('detalleProductoCategoria').textContent = p.categoria || 'N/A';
    document.getElementById('detalleProductoPrecioCosto').textContent = formatearMoneda(p.precioCompra || 0);
    document.getElementById('detalleProductoPrecioRetail').textContent = formatearMoneda(p.precioVenta || 0);
    document.getElementById('detalleProductoDescripcion').textContent = p.descripcion || 'Sin descripción';

    // Imagen
    const imgSrc = p.imagen || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e9ecef' width='150' height='150'/%3E%3Ctext fill='%236c757d' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='14'%3ESin imagen%3C/text%3E%3C/svg%3E";
    document.getElementById('detalleProductoImagen').src = imgSrc;

    // Stock total
    document.getElementById('detalleProductoStockTotal').textContent = p.stock || 0;

    // Detalle del inventario
    document.getElementById('detalleStockActual').textContent = p.stock || 0;
    document.getElementById('detalleStockMinimo').textContent = p.stockMinimo || 0;

    // Estado
    const estadoBadge = document.getElementById('detalleEstado');
    if (p.stock <= 0) {
        estadoBadge.textContent = 'Agotado';
        estadoBadge.className = 'badge bg-danger';
    } else if (p.stock <= p.stockMinimo) {
        estadoBadge.textContent = 'Bajo Stock';
        estadoBadge.className = 'badge bg-warning text-dark';
    } else {
        estadoBadge.textContent = '✓ Normal';
        estadoBadge.className = 'badge bg-success';
    }

    // Mostrar modal
    new bootstrap.Modal(document.getElementById('modalDetalleProducto')).show();
}

async function verKardexProducto(productoId) {
    const producto = await getData('productos', productoId);
    if (!producto) return;

    // Llenar información del producto
    document.getElementById('kardexProductoNombre').textContent = producto.nombre;
    document.getElementById('kardexProductoSku').textContent = producto.sku || 'N/A';
    document.getElementById('kardexProductoCategoria').textContent = producto.categoria || 'N/A';
    document.getElementById('kardexStockActual').textContent = producto.stock || 0;

    // Obtener movimientos de inventario
    const empresaId = getCurrentEmpresa().id;
    const todasVentas = await getDataByEmpresa('ventas', empresaId);
    const todosMovimientos = await getDataByEmpresa('movimientos_inventario', empresaId);

    // Construir movimientos del kardex
    let movimientos = [];

    // Agregar stock inicial como primer movimiento
    movimientos.push({
        fecha: producto.fechaCreacion || new Date().toISOString(),
        usuario: 'sistema',
        operacion: 'Entrada',
        referencia: `Inicial producto ${producto.sku}`,
        motivo: 'Inicial',
        ingreso: producto.stock || 0,
        salida: 0,
        saldo: 0 // Se calculará después
    });

    // Agregar movimientos de entrada (aumentos de stock)
    todosMovimientos
        .filter(m => m.productoId === productoId && m.tipo === 'Entrada')
        .forEach(mov => {
            movimientos.push({
                fecha: mov.fecha,
                usuario: mov.usuario,
                operacion: mov.operacion,
                referencia: mov.referencia,
                motivo: mov.motivo,
                ingreso: mov.cantidad,
                salida: 0,
                saldo: 0 // Se calculará después
            });
        });

    // Procesar ventas que incluyen este producto (salidas)
    todasVentas.forEach(venta => {
        if (venta.productos && Array.isArray(venta.productos)) {
            const itemVenta = venta.productos.find(p => p.id === productoId);
            if (itemVenta) {
                movimientos.push({
                    fecha: venta.fecha,
                    usuario: venta.usuario || 'administrador',
                    operacion: 'Salida',
                    referencia: venta.numeroComprobante || `Venta ${venta.id}`,
                    motivo: 'Venta',
                    ingreso: 0,
                    salida: itemVenta.cantidad,
                    saldo: 0 // Se calculará después
                });
            }
        }
    });

    // Ordenar movimientos por fecha
    movimientos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Recalcular saldos correctamente
    let saldoAcumulado = 0;
    movimientos.forEach(mov => {
        saldoAcumulado += mov.ingreso - mov.salida;
        mov.saldo = saldoAcumulado;
    });

    // Renderizar tabla de movimientos
    const tbody = document.getElementById('kardexMovimientos');
    if (movimientos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No hay movimientos registrados</td></tr>';
    } else {
        tbody.innerHTML = movimientos.map((mov, index) => {
            const fechaObj = new Date(mov.fecha);
            const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const motivoBadge = mov.motivo === 'Inicial'
                ? '<span class="badge bg-primary">Inicial</span>'
                : mov.motivo;

            return `
                <tr>
                    <td>${fechaFormateada}</td>
                    <td>${mov.usuario}</td>
                    <td>${mov.operacion}</td>
                    <td>${motivoBadge}</td>
                    <td>${mov.referencia}</td>
                    <td class="text-center ${mov.ingreso > 0 ? 'text-success fw-bold' : ''}">${mov.ingreso > 0 ? mov.ingreso : ''}</td>
                    <td class="text-center ${mov.salida > 0 ? 'text-danger fw-bold' : ''}">${mov.salida > 0 ? mov.salida : ''}</td>
                    <td class="text-center fw-bold">${mov.saldo}</td>
                </tr>
            `;
        }).join('');
    }

    // Mostrar modal
    new bootstrap.Modal(document.getElementById('modalKardexProducto')).show();
}

async function mostrarModalAumentarStock() {
    // Limpiar formulario
    document.getElementById('formAumentarStock').reset();
    document.getElementById('aumentarStockActual').value = '';
    document.getElementById('aumentarStockNuevo').value = '';

    // Cargar productos en el selector
    const empresaId = getCurrentEmpresa().id;
    const productos = await getDataByEmpresa('productos', empresaId);
    const select = document.getElementById('aumentarStockProducto');

    select.innerHTML = '<option value="">Seleccione un producto</option>' +
        productos.map(p => `<option value="${p.id}" data-stock="${p.stock}">${p.nombre} (SKU: ${p.sku})</option>`).join('');

    // Agregar evento para calcular nuevo stock
    document.getElementById('aumentarStockCantidad').addEventListener('input', calcularNuevoStock);

    // Mostrar modal
    new bootstrap.Modal(document.getElementById('modalAumentarStock')).show();
}

function actualizarStockActualAumentar() {
    const select = document.getElementById('aumentarStockProducto');
    const selectedOption = select.options[select.selectedIndex];

    if (selectedOption && selectedOption.value) {
        const stockActual = selectedOption.getAttribute('data-stock') || 0;
        document.getElementById('aumentarStockActual').value = stockActual;
        calcularNuevoStock();
    } else {
        document.getElementById('aumentarStockActual').value = '';
        document.getElementById('aumentarStockNuevo').value = '';
    }
}

function calcularNuevoStock() {
    const stockActual = parseInt(document.getElementById('aumentarStockActual').value) || 0;
    const cantidad = parseInt(document.getElementById('aumentarStockCantidad').value) || 0;
    const nuevoStock = stockActual + cantidad;

    document.getElementById('aumentarStockNuevo').value = nuevoStock > 0 ? nuevoStock : '';
}

async function guardarAumentoStock() {
    const productoId = parseInt(document.getElementById('aumentarStockProducto').value);
    const cantidad = parseInt(document.getElementById('aumentarStockCantidad').value);
    const motivo = document.getElementById('aumentarStockMotivo').value;
    const observaciones = document.getElementById('aumentarStockObservaciones').value;

    // Validaciones
    if (!productoId) {
        mostrarAlerta('Debe seleccionar un producto', 'warning');
        return;
    }

    if (!cantidad || cantidad <= 0) {
        mostrarAlerta('La cantidad debe ser mayor a 0', 'warning');
        return;
    }

    try {
        // Obtener producto actual
        const producto = await getData('productos', productoId);
        if (!producto) {
            mostrarAlerta('Producto no encontrado', 'danger');
            return;
        }

        const stockAnterior = producto.stock || 0;
        const usuario = getCurrentUser();
        const empresaId = getCurrentEmpresa().id;

        // Actualizar stock
        producto.stock = stockAnterior + cantidad;
        await updateData('productos', producto);

        // Registrar movimiento en el kardex
        const movimiento = {
            empresaId: empresaId,
            productoId: productoId,
            productoNombre: producto.nombre,
            productoSku: producto.sku,
            tipo: 'Entrada',
            operacion: 'Entrada',
            cantidad: cantidad,
            stockAnterior: stockAnterior,
            stockNuevo: producto.stock,
            motivo: motivo,
            observaciones: observaciones || '',
            usuario: usuario.nombre || usuario.usuario,
            fecha: new Date().toISOString(),
            referencia: `Aumento de stock - ${motivo}`
        };

        await addData('movimientos_inventario', movimiento);

        // Cerrar modal
        const modalEl = document.getElementById('modalAumentarStock');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        // Mostrar mensaje de éxito
        mostrarAlerta(`Stock aumentado exitosamente. Nuevo stock: ${producto.stock}`, 'success');

        // Recargar productos
        await cargarProductos();

    } catch (error) {
        console.error('Error al aumentar stock:', error);
        mostrarAlerta('Error al aumentar el stock', 'danger');
    }
}
