async function renderGastos() {
    const container = document.getElementById('contentContainer');
    const hoy = getFechaActual();
    container.innerHTML = `
        <div class="module-card">
            <div class="module-header d-flex justify-content-between align-items-center">
                <div>
                    <h4><i class="bi bi-wallet2"></i> Gastos</h4>
                    <div class="text-muted" style="font-size:12px;">Registro y control de egresos</div>
                </div>
                <div>
                    <button class="btn btn-success" onclick="mostrarModalGasto()"><i class="bi bi-plus-circle"></i> Nuevo Gasto</button>
                </div>
            </div>

            <div class="row g-3 align-items-end mb-3">

                <div class="col-md-3">
                    <label class="form-label">Categoría</label>
                    <select class="form-select" id="filtroCategoriaGastos"></select>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Desde</label>
                    <input type="date" class="form-control" id="gastoDesde" value="${hoy}">
                </div>
                <div class="col-md-2">
                    <label class="form-label">Hasta</label>
                    <input type="date" class="form-control" id="gastoHasta" value="${hoy}">
                </div>
                <div class="col-md-2 text-end">
                    <div class="text-muted">Total</div>
                    <div id="gastosTotal" style="font-size:20px;font-weight:700;color:#dc3545;">S/ 0.00</div>
                </div>
            </div>

            <div class="card" style="border:none;box-shadow:0 6px 14px rgba(0,0,0,0.06);">
                <div class="table-responsive">
                    <table class="table table-sm table-hover mb-0" id="tablaGastos">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Deporte</th>
                                <th>Categoría</th>
                                <th>Detalle</th>
                                <th class="text-end">Importe</th>
                            </tr>
                        </thead>
                        <tbody id="gastosTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalGasto" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="bi bi-plus-circle"></i> Registrar Gasto</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Fecha</label>
                                <input type="date" class="form-control" id="gastoFecha" value="${hoy}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Tipo de gasto</label>
                                <select class="form-select" id="gastoTipo">
                                    <option value="Operativo">Operativo</option>
                                    <option value="Servicios">Servicios</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Deporte</label>
                                <select class="form-select" id="gastoDeporte"></select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Categoría</label>
                                <select class="form-select" id="gastoCategoria"></select>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">Detalle</label>
                                <input type="text" class="form-control" id="gastoDescripcion" placeholder="Detalle del gasto">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Importe (S/)</label>
                                <input type="number" class="form-control" id="gastoMonto" step="0.01" min="0">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button class="btn btn-success" onclick="guardarGastoGastos()"><i class="bi bi-save"></i> Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    await cargarFiltrosGastos();
    await actualizarGastos();
}

async function cargarFiltrosGastos() {
    const empresa = getCurrentEmpresa();
    const categorias = await getDataByEmpresa('categorias', empresa.id);
    const gastos = await getDataByEmpresa('gastos', empresa.id);

    const categoriasSet = new Set(gastos.map(g => (g.categoria || '').trim()).filter(c => c));
    const selCat = document.getElementById('filtroCategoriaGastos');
    if (selCat) selCat.innerHTML = '<option value="">Todas</option>' + Array.from(categoriasSet).map(c => `<option value="${c}">${c}</option>`).join('');

    const selDepModal = document.getElementById('gastoDeporte');
    if (selDepModal) {
        // Obtener deportes desde configuración
        const deportes = await getDeportesFromConfig();
        selDepModal.innerHTML = '<option value="">Sin deporte</option>' + deportes.map(d => `<option value="${d}">${d}</option>`).join('');

        // Seleccionar "Futbol" por defecto
        const futbol = deportes.find(d => d.toLowerCase() === 'futbol' || d.toLowerCase() === 'fútbol');
        if (futbol) {
            selDepModal.value = futbol;
        }

        // Asegurar que el selector esté habilitado
        selDepModal.disabled = false;
    }

    const selCatModal = document.getElementById('gastoCategoria');
    if (selCatModal) {
        const depSel = selDepModal ? selDepModal.value : '';
        const opciones = categorias.filter(c => depSel ? (c.deporte && c.deporte.toLowerCase() === depSel.toLowerCase()) : false).map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
        selCatModal.innerHTML = '<option value="">Sin categoría</option>' + opciones;
    }

    if (selDepModal) selDepModal.addEventListener('change', () => {
        const selCat = document.getElementById('gastoCategoria');
        if (!selCat) return;
        const depSel = selDepModal.value;
        const opciones = categorias.filter(c => depSel ? (c.deporte && c.deporte.toLowerCase() === depSel.toLowerCase()) : false).map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
        selCat.innerHTML = '<option value="">Sin categoría</option>' + opciones;
    });


    if (selCat) selCat.addEventListener('change', actualizarGastos);
    const desde = document.getElementById('gastoDesde');
    const hasta = document.getElementById('gastoHasta');
    if (desde) desde.addEventListener('change', actualizarGastos);
    if (hasta) hasta.addEventListener('change', actualizarGastos);
}

async function actualizarGastos() {
    const empresa = getCurrentEmpresa();

    const categoria = document.getElementById('filtroCategoriaGastos').value;
    const desde = document.getElementById('gastoDesde').value;
    const hasta = document.getElementById('gastoHasta').value;
    const gastos = await getDataByEmpresa('gastos', empresa.id);

    const entreFechas = (f) => {
        const d = new Date((f || '').split('T')[0] || f);
        return (!desde || d >= new Date(desde)) && (!hasta || d <= new Date(hasta));
    };

    const filtrados = gastos.filter(g => entreFechas(g.fecha))

        .filter(g => {
            if (!categoria) return true;
            return (g.categoria || '').trim().toLowerCase() === categoria.trim().toLowerCase();
        });

    const tbody = document.getElementById('gastosTableBody');
    if (tbody) {
        tbody.innerHTML = filtrados.map(g => {
            const depNombre = g.deporte || '—'; // Ahora es string directo
            return `
                <tr>
                    <td>${formatearFecha(g.fecha)}</td>
                    <td>${g.tipo || '—'}</td>
                    <td>${depNombre}</td>
                    <td>${g.categoria || '—'}</td>
                    <td>${g.descripcion || '—'}</td>
                    <td class="text-end">${formatearMoneda(g.monto || 0)}</td>
                </tr>
            `;
        }).join('');
    }

    const total = filtrados.reduce((sum, g) => sum + (g.monto || 0), 0);
    const totalEl = document.getElementById('gastosTotal');
    if (totalEl) totalEl.textContent = formatearMoneda(total);
}

function mostrarModalGasto() {
    // Reset fields
    document.getElementById('gastoFecha').value = getFechaActual();
    document.getElementById('gastoTipo').selectedIndex = 0;
    document.getElementById('gastoCategoria').value = "";
    document.getElementById('gastoDescripcion').value = "";
    document.getElementById('gastoMonto').value = "";

    // Ensure sport is set correctly (re-apply logic if needed, but it should be static from load)
    // We don't clear gastoDeporte because it's read-only/fixed

    new bootstrap.Modal(document.getElementById('modalGasto')).show();
}

async function guardarGastoGastos() {
    const empresa = getCurrentEmpresa();
    const fecha = document.getElementById('gastoFecha').value;
    const tipo = document.getElementById('gastoTipo').value.trim();
    const deporte = document.getElementById('gastoDeporte').value.trim(); // Ahora es string
    const categoria = document.getElementById('gastoCategoria').value.trim();
    const descripcion = document.getElementById('gastoDescripcion').value.trim();
    const monto = parseFloat(document.getElementById('gastoMonto').value) || 0;
    if (!fecha || !monto) { mostrarAlerta('Complete fecha e importe', 'warning'); return; }
    await addData('gastos', { empresaId: empresa.id, fecha, tipo, deporte, categoria, descripcion, monto, fechaCreacion: new Date().toISOString() });
    mostrarAlerta('Gasto guardado', 'success');
    const modalEl = document.getElementById('modalGasto');
    const modal = bootstrap.Modal.getInstance(modalEl);
    document.activeElement.blur();
    modalEl.addEventListener('hidden.bs.modal', actualizarGastos, { once: true });
    modal.hide();
}
