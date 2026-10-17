async function renderConfiguracion() {
    const container = document.getElementById('contentContainer');
    const empresa = getCurrentEmpresa();
    container.innerHTML = `
        <div class="module-card">
            <div class="module-header">
                <h4><i class="bi bi-gear"></i> Configuración</h4>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <h5 class="mb-3"><i class="bi bi-building"></i> Datos de la Empresa</h5>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">RUC</label>
                            <input type="text" class="form-control" id="configEmpresaRuc" placeholder="RUC">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Razón Social</label>
                            <input type="text" class="form-control" id="configEmpresaRazonSocial" placeholder="Razón Social">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Dirección</label>
                            <input type="text" class="form-control" id="configEmpresaDireccion" placeholder="Dirección">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Teléfono</label>
                            <input type="text" class="form-control" id="configEmpresaTelefono" placeholder="Teléfono">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" id="configEmpresaEmail" placeholder="Email">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Logotipo de Empresa</label>
                            <input type="file" class="form-control" id="configEmpresaLogoInput" accept="image/*" onchange="previewEmpresaLogo(this)">
                            <div class="mt-2 d-flex align-items-center w-100" style="gap:12px;">
                                <div id="previewEmpresaLogo" style="width:120px;height:120px;border:1px dashed #ccc;border-radius:8px;background-size:contain;background-repeat:no-repeat;background-position:center"></div>
                                <button class="btn btn-success ms-auto" onclick="guardarConfigGeneral()"><i class="bi bi-check2-circle"></i> Guardar Configuración</button>
                            </div>
                            <div class="mt-2">
                                <button class="btn btn-secondary btn-sm" onclick="limpiarEmpresaLogo()"><i class="bi bi-x-lg"></i> Quitar Logotipo</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-md-12">
                    <h5 class="mb-3"><i class="bi bi-receipt"></i> Comprobantes</h5>
                    <div class="row g-2">
                        <div class="col-md-6">
                            <label class="form-label">Serie Boleta</label>
                            <input type="text" class="form-control" id="configSerieBoleta" placeholder="B001">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Número Boleta</label>
                            <input type="number" class="form-control" id="configNumeroBoleta" placeholder="1">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Serie Factura</label>
                            <input type="text" class="form-control" id="configSerieFactura" placeholder="F001">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Número Factura</label>
                            <input type="number" class="form-control" id="configNumeroFactura" placeholder="1">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Serie Ticket</label>
                            <input type="text" class="form-control" id="configSerieTicket" placeholder="T001">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Número Ticket</label>
                            <input type="number" class="form-control" id="configNumeroTicket" placeholder="1">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Serie Recibo</label>
                            <input type="text" class="form-control" id="configSerieRecibo" placeholder="R001">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Número Recibo</label>
                            <input type="number" class="form-control" id="configNumeroRecibo" placeholder="1">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Serie Nota de Venta</label>
                            <input type="text" class="form-control" id="configSerieNotaVenta" placeholder="NV01">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Número Nota de Venta</label>
                            <input type="number" class="form-control" id="configNumeroNotaVenta" placeholder="1">
                        </div>
                    </div>
                    <hr>
                    <h5 class="mb-3"><i class="bi bi-cash-coin"></i> Impuestos y Moneda</h5>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Moneda del Sistema</label>
                            <select class="form-select" id="configMonedaSistema"></select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Símbolo de Moneda</label>
                            <input type="text" class="form-control" id="configMonedaSimbolo" placeholder="S/">
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-md-6">
                    <h5 class="mb-3"><i class="bi bi-tags"></i> Categorías de Productos</h5>
                    <div class="input-group mb-2" style="max-width:500px;">
                        <input type="text" class="form-control" id="nuevoCategoriaProducto" placeholder="Nueva categoría">
                        <button class="btn btn-primary" onclick="agregarCategoriaProducto()"><i class="bi bi-plus-circle"></i> Agregar</button>
                    </div>
                    <ul class="list-group" id="listaCategoriasProducto"></ul>
                </div>
                <div class="col-md-6">
                    <h5 class="mb-3"><i class="bi bi-calendar2-week"></i> Tipos de Membresía</h5>
                    <div class="input-group mb-2" style="max-width:500px;">
                        <input type="text" class="form-control" id="nuevoTipoMembresia" placeholder="Nuevo tipo (Ej: Mensual)">
                        <button class="btn btn-primary" onclick="agregarTipoMembresia()"><i class="bi bi-plus-circle"></i> Agregar</button>
                    </div>
                    <ul class="list-group" id="listaTiposMembresia"></ul>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-6">
                    <h5 class="mb-3"><i class="bi bi-dribbble"></i> Deportes</h5>
                    <div class="input-group mb-2" style="max-width:500px;">
                        <input type="text" class="form-control" id="nuevoDeporte" placeholder="Nuevo deporte">
                        <button class="btn btn-primary" onclick="agregarDeporte()"><i class="bi bi-plus-circle"></i> Agregar</button>
                    </div>
                    <ul class="list-group" id="listaDeportes"></ul>
                </div>
                <div class="col-md-6">
                    <h5 class="mb-3"><i class="bi bi-receipt"></i> Tipo de Comprobantes</h5>
                    <ul class="list-group" id="listaTiposComprobante">
                        <li class="list-group-item">Boleta</li>
                        <li class="list-group-item">Factura</li>
                        <li class="list-group-item">Ticket</li>
                        <li class="list-group-item">Recibo</li>
                        <li class="list-group-item">Nota de Venta</li>
                    </ul>
                    <div class="text-muted small mt-2">Lista fija, no editable ni eliminable</div>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-md-6">
                    <h5 class="mb-3"><i class="bi bi-award"></i> Credenciales (Club)</h5>
                    <div class="mb-3">
                        <label class="form-label">Nombre del Club</label>
                        <input type="text" class="form-control" id="configClubNombre" placeholder="Ej: CLUB DEPORTIVO REAL MADRID">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Título superior línea 1</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="configTitulo1" placeholder="Ej: CLUB DEPORTIVO">
                            <input type="color" class="form-control form-control-color" id="configTitulo1Color" title="Color de tableta línea 1" value="#1e56a0">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Título superior línea 2</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="configTitulo2" placeholder="Ej: REAL MADRID">
                            <input type="color" class="form-control form-control-color" id="configTitulo2Color" title="Color de tableta línea 2" value="#2d7dd2">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Dirección</label>
                        <input type="text" class="form-control" id="configClubDireccion" placeholder="Dirección del club">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Logo del Club</label>
                        <input type="file" class="form-control" id="configLogoInput" accept="image/*" onchange="previewLogoCredencial(this)">
                        <div class="mt-2" id="previewLogo" style="width:120px;height:120px;border:1px dashed #ccc;border-radius:8px;background-size:contain;background-repeat:no-repeat;background-position:center"></div>
                        <div class="mt-2">
                            <button class="btn btn-secondary btn-sm" onclick="limpiarLogoCredencial()"><i class="bi bi-x-lg"></i> Quitar Logo</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <h5 class="mb-3"><i class="bi bi-image"></i> Fondo de Credencial</h5>
                    <div class="mb-3">
                        <label class="form-label">Fondo de Credencial</label>
                        <input type="file" class="form-control" id="configFondoInput" accept="image/*" onchange="previewFondoCredencial(this)">
                    </div>
                    <div id="previewFondo" style="height:220px;border:1px dashed #ccc;border-radius:8px;background-size:cover;background-position:center"></div>
                    <div class="mt-2">
                        <button class="btn btn-primary" onclick="guardarFondoCredencial()"><i class="bi bi-save"></i> Guardar Fondo</button>
                        <button class="btn btn-secondary ms-2" onclick="limpiarFondoCredencial()"><i class="bi bi-trash"></i> Quitar Fondo</button>
                    </div>
                </div>
            </div>
            
            <hr>
            <div class="row">
                <div class="col-md-12">
                    <h5 class="mb-3"><i class="bi bi-person-gear"></i> Gestión de Usuarios</h5>
                    <button class="btn btn-primary" onclick="mostrarModalUsuario()"><i class="bi bi-plus-circle"></i> Nuevo Usuario</button>
                    <div class="table-responsive mt-3">
                        <table class="table table-modern">
                            <thead>
                                <tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
                            </thead>
                            <tbody id="usuariosTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalUsuario" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">Nuevo Usuario</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formUsuario">
                                <input type="hidden" id="usuarioId">
                                <div class="mb-3">
                                    <label class="form-label">Nombre *</label>
                                    <input type="text" class="form-control" id="usuarioNombre" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Usuario *</label>
                                    <input type="text" class="form-control" id="usuario" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Contraseña *</label>
                                    <input type="password" class="form-control" id="usuarioPassword" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Rol</label>
                                    <select class="form-select" id="usuarioRol">
                                        <option value="admin">Administrador</option>
                                        <option value="recepcion">Recepción</option>
                                        <option value="profesor">Profesor</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="guardarUsuario()"><i class="bi bi-save"></i> Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    `;
    await cargarConfiguracion();
    await cargarUsuarios();
}

async function cargarConfiguracion() {
    const empresa = getCurrentEmpresa();
    const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    const cfg = rows && rows[0] ? rows[0] : null;
    const preview = document.getElementById('previewFondo');
    const previewLogo = document.getElementById('previewLogo');
    document.getElementById('configClubNombre').value = cfg && cfg.clubNombre ? cfg.clubNombre : '';
    document.getElementById('configTitulo1').value = cfg && cfg.clubTitulo1 ? cfg.clubTitulo1 : '';
    document.getElementById('configTitulo2').value = cfg && cfg.clubTitulo2 ? cfg.clubTitulo2 : '';
    document.getElementById('configClubDireccion').value = cfg && cfg.clubDireccion ? cfg.clubDireccion : '';
    document.getElementById('configTitulo1Color').value = cfg && cfg.clubTitulo1Color ? cfg.clubTitulo1Color : '#1e56a0';
    document.getElementById('configTitulo2Color').value = cfg && cfg.clubTitulo2Color ? cfg.clubTitulo2Color : '#2d7dd2';
    if (cfg && cfg.credencialFondo) {
        preview.style.backgroundImage = `url('${cfg.credencialFondo}')`;
        preview.dataset.base64 = cfg.credencialFondo;
    } else {
        preview.style.backgroundImage = '';
        preview.dataset.base64 = '';
    }
    if (cfg && cfg.clubLogo) {
        previewLogo.style.backgroundImage = `url('${cfg.clubLogo}')`;
        previewLogo.dataset.base64 = cfg.clubLogo;
    } else {
        previewLogo.style.backgroundImage = '';
        previewLogo.dataset.base64 = '';
    }
    document.getElementById('configEmpresaRuc').value = cfg && cfg.empresaRuc ? cfg.empresaRuc : '';
    document.getElementById('configEmpresaRazonSocial').value = cfg && cfg.empresaRazonSocial ? cfg.empresaRazonSocial : '';
    document.getElementById('configEmpresaDireccion').value = cfg && cfg.empresaDireccion ? cfg.empresaDireccion : '';
    document.getElementById('configEmpresaTelefono').value = cfg && cfg.empresaTelefono ? cfg.empresaTelefono : '';
    document.getElementById('configEmpresaEmail').value = cfg && cfg.empresaEmail ? cfg.empresaEmail : '';
    const previewEmpresaLogo = document.getElementById('previewEmpresaLogo');
    if (cfg && cfg.empresaLogo) {
        previewEmpresaLogo.style.backgroundImage = `url('${cfg.empresaLogo}')`;
        previewEmpresaLogo.dataset.base64 = cfg.empresaLogo;
    } else {
        previewEmpresaLogo.style.backgroundImage = '';
        previewEmpresaLogo.dataset.base64 = '';
    }
    const monedaSelect = document.getElementById('configMonedaSistema');
    monedaSelect.innerHTML = getMonedasOptions();
    monedaSelect.value = cfg && cfg.monedaSistema ? cfg.monedaSistema : 'PEN';
    const simboloInput = document.getElementById('configMonedaSimbolo');
    simboloInput.value = cfg && cfg.monedaSimbolo ? cfg.monedaSimbolo : getMonedaSymbol(monedaSelect.value);
    monedaSelect.addEventListener('change', () => {
        document.getElementById('configMonedaSimbolo').value = getMonedaSymbol(monedaSelect.value);
    });
    document.getElementById('configSerieBoleta').value = cfg && cfg.serieBoleta ? cfg.serieBoleta : '';
    document.getElementById('configNumeroBoleta').value = cfg && cfg.numeroBoleta ? cfg.numeroBoleta : '';
    document.getElementById('configSerieFactura').value = cfg && cfg.serieFactura ? cfg.serieFactura : '';
    document.getElementById('configNumeroFactura').value = cfg && cfg.numeroFactura ? cfg.numeroFactura : '';
    document.getElementById('configSerieTicket').value = cfg && cfg.serieTicket ? cfg.serieTicket : '';
    document.getElementById('configNumeroTicket').value = cfg && cfg.numeroTicket ? cfg.numeroTicket : '';
    document.getElementById('configSerieRecibo').value = cfg && cfg.serieRecibo ? cfg.serieRecibo : '';
    document.getElementById('configNumeroRecibo').value = cfg && cfg.numeroRecibo ? cfg.numeroRecibo : '';
    document.getElementById('configSerieNotaVenta').value = cfg && cfg.serieNotaVenta ? cfg.serieNotaVenta : '';
    document.getElementById('configNumeroNotaVenta').value = cfg && cfg.numeroNotaVenta ? cfg.numeroNotaVenta : '';
    const categoriasProducto = cfg && Array.isArray(cfg.categoriasProducto) && cfg.categoriasProducto.length ? cfg.categoriasProducto : ['Uniformes', 'Pelotas', 'Suplementos', 'Accesorios'];
    renderCategoriasProductoList(categoriasProducto);
    const tiposMembresia = cfg && Array.isArray(cfg.tiposMembresia) && cfg.tiposMembresia.length ? cfg.tiposMembresia : ['Mensual', 'Quincenal', 'Semanal', 'Dia'];
    renderTiposMembresiaList(tiposMembresia);
    const deportes = cfg && Array.isArray(cfg.deportes) && cfg.deportes.length ? cfg.deportes : ['Futbol', 'Voley'];
    renderDeportesList(deportes);
}

async function previewFondoCredencial(input) {
    if (input.files && input.files[0]) {
        const base64 = await cargarImagenBase64(input.files[0]);
        const preview = document.getElementById('previewFondo');
        preview.style.backgroundImage = `url('${base64}')`;
        preview.dataset.base64 = base64;
    }
}

async function guardarFondoCredencial() {
    const empresa = getCurrentEmpresa();
    const preview = document.getElementById('previewFondo');
    const base64 = preview.dataset.base64 || '';
    try {
        const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
        if (rows && rows[0]) {
            const cfg = rows[0];
            cfg.credencialFondo = base64;
            await updateData('configuracion', cfg);
        } else {
            await addData('configuracion', {
                empresaId: empresa.id,
                credencialFondo: base64,
                fechaCreacion: new Date().toISOString()
            });
        }
        mostrarAlerta('Fondo de credencial guardado', 'success');
    } catch (e) {
        mostrarAlerta('Error al guardar fondo', 'danger');
    }
}

async function limpiarFondoCredencial() {
    const empresa = getCurrentEmpresa();
    try {
        const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
        if (rows && rows[0]) {
            const cfg = rows[0];
            cfg.credencialFondo = '';
            await updateData('configuracion', cfg);
        }
        const preview = document.getElementById('previewFondo');
        preview.style.backgroundImage = '';
        preview.dataset.base64 = '';
        mostrarAlerta('Fondo eliminado', 'success');
    } catch (e) {
        mostrarAlerta('Error al eliminar fondo', 'danger');
    }
}
async function previewLogoCredencial(input) {
    if (input.files && input.files[0]) {
        const base64 = await cargarImagenBase64(input.files[0]);
        const preview = document.getElementById('previewLogo');
        preview.style.backgroundImage = `url('${base64}')`;
        preview.dataset.base64 = base64;
    }
}

async function previewEmpresaLogo(input) {
    if (input.files && input.files[0]) {
        const base64 = await cargarImagenBase64(input.files[0]);
        const preview = document.getElementById('previewEmpresaLogo');
        preview.style.backgroundImage = `url('${base64}')`;
        preview.dataset.base64 = base64;
    }
}

async function guardarConfigGeneral() {
    const empresa = getCurrentEmpresa();
    const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    const fondo = document.getElementById('previewFondo').dataset.base64 || '';
    const logo = document.getElementById('previewLogo').dataset.base64 || '';
    const clubNombre = document.getElementById('configClubNombre').value.trim();
    const clubTitulo1 = document.getElementById('configTitulo1').value.trim();
    const clubTitulo2 = document.getElementById('configTitulo2').value.trim();
    const clubDireccion = document.getElementById('configClubDireccion').value.trim();
    const clubTitulo1Color = document.getElementById('configTitulo1Color').value;
    const clubTitulo2Color = document.getElementById('configTitulo2Color').value;
    const empresaRuc = document.getElementById('configEmpresaRuc').value.trim();
    const empresaRazonSocial = document.getElementById('configEmpresaRazonSocial').value.trim();
    const empresaDireccion = document.getElementById('configEmpresaDireccion').value.trim();
    const empresaTelefono = document.getElementById('configEmpresaTelefono').value.trim();
    const empresaEmail = document.getElementById('configEmpresaEmail').value.trim();
    const empresaLogo = document.getElementById('previewEmpresaLogo').dataset.base64 || '';
    const monedaSistema = document.getElementById('configMonedaSistema').value;
    const monedaSimbolo = document.getElementById('configMonedaSimbolo').value.trim() || getMonedaSymbol(monedaSistema);
    const serieBoleta = document.getElementById('configSerieBoleta').value.trim();
    const numeroBoleta = parseInt(document.getElementById('configNumeroBoleta').value) || 0;
    const serieFactura = document.getElementById('configSerieFactura').value.trim();
    const numeroFactura = parseInt(document.getElementById('configNumeroFactura').value) || 0;
    const serieTicket = document.getElementById('configSerieTicket').value.trim();
    const numeroTicket = parseInt(document.getElementById('configNumeroTicket').value) || 0;
    const serieRecibo = document.getElementById('configSerieRecibo').value.trim();
    const numeroRecibo = parseInt(document.getElementById('configNumeroRecibo').value) || 0;
    const serieNotaVenta = document.getElementById('configSerieNotaVenta').value.trim();
    const numeroNotaVenta = parseInt(document.getElementById('configNumeroNotaVenta').value) || 0;
    try {
        if (rows && rows[0]) {
            const cfg = rows[0];
            cfg.credencialFondo = fondo;
            cfg.clubLogo = logo;
            cfg.clubNombre = clubNombre;
            cfg.clubTitulo1 = clubTitulo1;
            cfg.clubTitulo2 = clubTitulo2;
            cfg.clubDireccion = clubDireccion;
            cfg.clubTitulo1Color = clubTitulo1Color;
            cfg.clubTitulo2Color = clubTitulo2Color;
            cfg.empresaRuc = empresaRuc;
            cfg.empresaRazonSocial = empresaRazonSocial;
            cfg.empresaDireccion = empresaDireccion;
            cfg.empresaTelefono = empresaTelefono;
            cfg.empresaEmail = empresaEmail;
            cfg.empresaLogo = empresaLogo;
            cfg.monedaSistema = monedaSistema;
            cfg.monedaSimbolo = monedaSimbolo;
            cfg.serieBoleta = serieBoleta;
            cfg.numeroBoleta = numeroBoleta;
            cfg.serieFactura = serieFactura;
            cfg.numeroFactura = numeroFactura;
            cfg.serieTicket = serieTicket;
            cfg.numeroTicket = numeroTicket;
            cfg.serieRecibo = serieRecibo;
            cfg.numeroRecibo = numeroRecibo;
            cfg.serieNotaVenta = serieNotaVenta;
            cfg.numeroNotaVenta = numeroNotaVenta;
            await updateData('configuracion', cfg);
        } else {
            await addData('configuracion', {
                empresaId: empresa.id,
                credencialFondo: fondo,
                clubLogo: logo,
                clubNombre,
                clubTitulo1,
                clubTitulo2,
                clubDireccion,
                clubTitulo1Color,
                clubTitulo2Color,
                empresaRuc,
                empresaRazonSocial,
                empresaDireccion,
                empresaTelefono,
                empresaEmail,
                empresaLogo,
                monedaSistema,
                monedaSimbolo,
                serieBoleta,
                numeroBoleta,
                serieFactura,
                numeroFactura,
                serieTicket,
                numeroTicket,
                serieRecibo,
                numeroRecibo,
                serieNotaVenta,
                numeroNotaVenta,
                fechaCreacion: new Date().toISOString()
            });
        }
        mostrarAlerta('Configuración guardada', 'success');
    } catch (e) {
        mostrarAlerta('Error al guardar configuración', 'danger');
    }
}

let categoriasProductoCache = [];
let dragCategoriaIndex = null;
let tiposMembresiaCache = [];
let dragTipoIndex = null;

function renderCategoriasProductoList(arr) {
    categoriasProductoCache = arr.slice();
    const ul = document.getElementById('listaCategoriasProducto');
    if (!ul) return;
    ul.innerHTML = categoriasProductoCache.map((c, idx) => `
        <li class="list-group-item d-flex justify-content-between align-items-center" draggable="true" data-index="${idx}">
            <div class="d-flex align-items-center">
                <i class="bi bi-grip-vertical me-2 text-muted"></i>
                <span>${c}</span>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarCategoriaProducto(${idx})"><i class="bi bi-trash"></i></button>
        </li>
    `).join('');
    ul.querySelectorAll('li').forEach(li => {
        li.addEventListener('dragstart', categoriaDragStart);
        li.addEventListener('dragover', categoriaDragOver);
        li.addEventListener('drop', categoriaDrop);
        li.addEventListener('dragend', categoriaDragEnd);
    });
}

function categoriaDragStart(e) {
    dragCategoriaIndex = parseInt(this.dataset.index);
    e.dataTransfer.effectAllowed = 'move';
}

function categoriaDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function categoriaDrop(e) {
    e.preventDefault();
    const destIndex = parseInt(this.dataset.index);
    if (dragCategoriaIndex === null || destIndex === dragCategoriaIndex) return;
    const arr = categoriasProductoCache.slice();
    const [moved] = arr.splice(dragCategoriaIndex, 1);
    arr.splice(destIndex, 0, moved);
    guardarCategoriasProducto(arr);
    renderCategoriasProductoList(arr);
    dragCategoriaIndex = null;
}

function categoriaDragEnd() {
    dragCategoriaIndex = null;
}

async function guardarCategoriasProducto(arr) {
    const empresa = getCurrentEmpresa();
    const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    if (rows && rows[0]) {
        const cfg = rows[0];
        cfg.categoriasProducto = arr;
        await updateData('configuracion', cfg);
    } else {
        await addData('configuracion', {
            empresaId: empresa.id,
            categoriasProducto: arr,
            fechaCreacion: new Date().toISOString()
        });
    }
    categoriasProductoCache = arr.slice();
}

async function agregarCategoriaProducto() {
    const input = document.getElementById('nuevoCategoriaProducto');
    if (!input) return;
    const nombre = input.value.trim();
    if (!nombre) return;
    const existe = categoriasProductoCache.some(c => c.toLowerCase() === nombre.toLowerCase());
    if (existe) { mostrarAlerta('La categoría ya existe', 'warning'); return; }
    const arr = categoriasProductoCache.slice();
    arr.push(nombre);
    await guardarCategoriasProducto(arr);
    renderCategoriasProductoList(arr);
    input.value = '';
}

async function eliminarCategoriaProducto(idx) {
    const confirmar = await confirmarAccion('¿Eliminar esta categoría?');
    if (!confirmar) return;
    const arr = categoriasProductoCache.slice();
    arr.splice(idx, 1);
    await guardarCategoriasProducto(arr);
    renderCategoriasProductoList(arr);
}

function renderTiposMembresiaList(arr) {
    tiposMembresiaCache = arr.slice();
    const ul = document.getElementById('listaTiposMembresia');
    if (!ul) return;
    ul.innerHTML = tiposMembresiaCache.map((t, idx) => `
        <li class="list-group-item d-flex justify-content-between align-items-center" draggable="true" data-index="${idx}">
            <div class="d-flex align-items-center">
                <i class="bi bi-grip-vertical me-2 text-muted"></i>
                <span>${t}</span>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarTipoMembresia(${idx})"><i class="bi bi-trash"></i></button>
        </li>
    `).join('');
    ul.querySelectorAll('li').forEach(li => {
        li.addEventListener('dragstart', tipoDragStart);
        li.addEventListener('dragover', tipoDragOver);
        li.addEventListener('drop', tipoDrop);
        li.addEventListener('dragend', tipoDragEnd);
    });
}

function tipoDragStart(e) {
    dragTipoIndex = parseInt(this.dataset.index);
    e.dataTransfer.effectAllowed = 'move';
}

function tipoDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function tipoDrop(e) {
    e.preventDefault();
    const destIndex = parseInt(this.dataset.index);
    if (dragTipoIndex === null || destIndex === dragTipoIndex) return;
    const arr = tiposMembresiaCache.slice();
    const [moved] = arr.splice(dragTipoIndex, 1);
    arr.splice(destIndex, 0, moved);
    guardarTiposMembresia(arr);
    renderTiposMembresiaList(arr);
    dragTipoIndex = null;
}

function tipoDragEnd() {
    dragTipoIndex = null;
}

async function guardarTiposMembresia(arr) {
    const empresa = getCurrentEmpresa();
    const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    if (rows && rows[0]) {
        const cfg = rows[0];
        cfg.tiposMembresia = arr;
        await updateData('configuracion', cfg);
    } else {
        await addData('configuracion', {
            empresaId: empresa.id,
            tiposMembresia: arr,
            fechaCreacion: new Date().toISOString()
        });
    }
    tiposMembresiaCache = arr.slice();
}

async function agregarTipoMembresia() {
    const input = document.getElementById('nuevoTipoMembresia');
    if (!input) return;
    const nombre = input.value.trim();
    if (!nombre) return;
    const existe = tiposMembresiaCache.some(t => t.toLowerCase() === nombre.toLowerCase());
    if (existe) { mostrarAlerta('El tipo ya existe', 'warning'); return; }
    const arr = tiposMembresiaCache.slice();
    arr.push(nombre);
    await guardarTiposMembresia(arr);
    renderTiposMembresiaList(arr);
    input.value = '';
}

async function eliminarTipoMembresia(idx) {
    const confirmar = await confirmarAccion('¿Eliminar este tipo?');
    if (!confirmar) return;
    const arr = tiposMembresiaCache.slice();
    arr.splice(idx, 1);
    await guardarTiposMembresia(arr);
    renderTiposMembresiaList(arr);
}

async function limpiarLogoCredencial() {
    const empresa = getCurrentEmpresa();
    try {
        const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
        if (rows && rows[0]) {
            const cfg = rows[0];
            cfg.clubLogo = '';
            await updateData('configuracion', cfg);
        }
        const preview = document.getElementById('previewLogo');
        preview.style.backgroundImage = '';
        preview.dataset.base64 = '';
        mostrarAlerta('Logo eliminado', 'success');
    } catch (e) {
        mostrarAlerta('Error al eliminar logo', 'danger');
    }
}

async function limpiarEmpresaLogo() {
    const empresa = getCurrentEmpresa();
    try {
        const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
        if (rows && rows[0]) {
            const cfg = rows[0];
            cfg.empresaLogo = '';
            await updateData('configuracion', cfg);
        }
        const preview = document.getElementById('previewEmpresaLogo');
        preview.style.backgroundImage = '';
        preview.dataset.base64 = '';
        mostrarAlerta('Logotipo eliminado', 'success');
    } catch (e) {
        mostrarAlerta('Error al eliminar logotipo', 'danger');
    }
}

function getMonedasOptions() {
    const monedas = [
        { code: 'PEN', name: 'Perú (PEN)', symbol: 'S/' },
        { code: 'BOB', name: 'Bolivia (BOB)', symbol: 'Bs' },
        { code: 'CLP', name: 'Chile (CLP)', symbol: '$' },
        { code: 'ARS', name: 'Argentina (ARS)', symbol: '$' },
        { code: 'BRL', name: 'Brasil (BRL)', symbol: 'R$' },
        { code: 'COP', name: 'Colombia (COP)', symbol: '$' },
        { code: 'USD', name: 'Ecuador (USD)', symbol: '$' },
        { code: 'UYU', name: 'Uruguay (UYU)', symbol: '$' },
        { code: 'PYG', name: 'Paraguay (PYG)', symbol: '₲' },
        { code: 'VES', name: 'Venezuela (VES)', symbol: 'Bs.' },
        { code: 'CRC', name: 'Costa Rica (CRC)', symbol: '₡' },
        { code: 'GTQ', name: 'Guatemala (GTQ)', symbol: 'Q' },
        { code: 'HNL', name: 'Honduras (HNL)', symbol: 'L' },
        { code: 'NIO', name: 'Nicaragua (NIO)', symbol: 'C$' },
        { code: 'USD_PA', name: 'Panamá (USD)', symbol: '$' },
        { code: 'BZD', name: 'Belice (BZD)', symbol: '$' },
        { code: 'USD_SV', name: 'El Salvador (USD)', symbol: '$' }
    ];
    return monedas.map(m => `<option value="${m.code}">${m.name}</option>`).join('');
}

function getMonedaSymbol(code) {
    const map = {
        PEN: 'S/',
        BOB: 'Bs',
        CLP: '$',
        ARS: '$',
        BRL: 'R$',
        COP: '$',
        USD: '$',
        UYU: '$',
        PYG: '₲',
        VES: 'Bs.',
        CRC: '₡',
        GTQ: 'Q',
        HNL: 'L',
        NIO: 'C$',
        USD_PA: '$',
        BZD: '$',
        USD_SV: '$'
    };
    return map[code] || 'S/';
}

// ==================== Gestión de Deportes ====================
let deportesCache = [];
let dragDeporteIndex = null;

function renderDeportesList(arr) {
    deportesCache = arr.slice();
    const ul = document.getElementById('listaDeportes');
    if (!ul) return;
    ul.innerHTML = deportesCache.map((d, idx) => `
        <li class="list-group-item d-flex justify-content-between align-items-center" draggable="true" data-index="${idx}">
            <div class="d-flex align-items-center">
                <i class="bi bi-grip-vertical me-2 text-muted"></i>
                <span>${d}</span>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarDeporte(${idx})"><i class="bi bi-trash"></i></button>
        </li>
    `).join('');
    ul.querySelectorAll('li').forEach(li => {
        li.addEventListener('dragstart', deporteDragStart);
        li.addEventListener('dragover', deporteDragOver);
        li.addEventListener('drop', deporteDrop);
        li.addEventListener('dragend', deporteDragEnd);
    });
}

function deporteDragStart(e) {
    dragDeporteIndex = parseInt(this.dataset.index);
    e.dataTransfer.effectAllowed = 'move';
}

function deporteDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function deporteDrop(e) {
    e.preventDefault();
    const destIndex = parseInt(this.dataset.index);
    if (dragDeporteIndex === null || destIndex === dragDeporteIndex) return;
    const arr = deportesCache.slice();
    const [moved] = arr.splice(dragDeporteIndex, 1);
    arr.splice(destIndex, 0, moved);
    guardarDeportes(arr);
    renderDeportesList(arr);
    dragDeporteIndex = null;
}

function deporteDragEnd() {
    dragDeporteIndex = null;
}

async function guardarDeportes(arr) {
    const empresa = getCurrentEmpresa();
    const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    if (rows && rows[0]) {
        const cfg = rows[0];
        cfg.deportes = arr;
        await updateData('configuracion', cfg);
    } else {
        await addData('configuracion', {
            empresaId: empresa.id,
            deportes: arr,
            fechaCreacion: new Date().toISOString()
        });
    }
    deportesCache = arr.slice();
}

async function agregarDeporte() {
    const input = document.getElementById('nuevoDeporte');
    if (!input) return;
    const nombre = input.value.trim();
    if (!nombre) return;
    const existe = deportesCache.some(d => d.toLowerCase() === nombre.toLowerCase());
    if (existe) { mostrarAlerta('El deporte ya existe', 'warning'); return; }
    const arr = deportesCache.slice();
    arr.push(nombre);
    await guardarDeportes(arr);
    renderDeportesList(arr);
    input.value = '';
}

async function eliminarDeporte(idx) {
    const confirmar = await confirmarAccion('¿Eliminar este deporte?');
    if (!confirmar) return;
    const arr = deportesCache.slice();
    arr.splice(idx, 1);
    await guardarDeportes(arr);
    renderDeportesList(arr);
}
