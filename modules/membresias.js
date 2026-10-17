// modules/membresias.js - Módulo de Membresías
async function renderMembresias() {
    const container = document.getElementById('contentContainer');

    container.innerHTML = `
        <div class="module-card">
            <div class="module-header">
                <h4><i class="bi bi-credit-card"></i> Gestión de Membresías</h4>
                <button class="btn btn-primary" onclick="mostrarModalMembresia()">
                    <i class="bi bi-plus-circle"></i> Nueva Membresía
                </button>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <div class="search-box">
                        <i class="bi bi-search"></i>
                        <input type="text" class="form-control" id="buscarMembresia" placeholder="Buscar membresía...">
                    </div>
                </div>
            </div>

            <div class="row g-3" id="membresiasCards"></div>
        </div>

        <!-- Modal Membresía -->
        <div class="modal fade" id="modalMembresia" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="modalMembresiaTitle">
                            <i class="bi bi-credit-card"></i> Nueva Membresía
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formMembresia">
                            <input type="hidden" id="membresiaId">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Nombre de la Membresía *</label>
                                    <input type="text" class="form-control" id="membresiaNombre" required>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label">Tipo de Membresía</label>
                                    <select class="form-select" id="membresiaTipo"></select>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label">Duración (días) *</label>
                                    <input type="number" class="form-control" id="membresiaDuracion" min="1" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Precio (S/) *</label>
                                    <input type="number" class="form-control" id="membresiaPrecio" step="0.01" min="0" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Descuento (%)</label>
                                    <input type="number" class="form-control" id="membresiaDescuento" min="0" max="100" value="0">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Precio Final</label>
                                    <input type="text" class="form-control" id="membresiaPrecioFinal" readonly>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Fecha de Inicio</label>
                                    <input type="date" class="form-control" id="membresiaFechaInicio" value="${getFechaActual()}">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Fecha de Fin</label>
                                    <input type="date" class="form-control" id="membresiaFechaFin">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Próxima Fecha de Pago</label>
                                    <input type="date" class="form-control" id="membresiaFechaPago" readonly>
                                </div>
                            </div>
                            <div class="alert alert-info">
                                <div class="fw-bold mb-1"><i class="bi bi-calendar-check"></i> Programación de pagos</div>
                                <div id="membresiaProgramacionPagos" style="max-height:160px; overflow:auto;"></div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Cantidad de cuotas</label>
                                    <input type="number" class="form-control" id="membresiaCuotasTotal" value="0" readonly>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Beneficios Incluidos</label>
                                <textarea class="form-control" id="membresiaBeneficios" rows="3" 
                                    placeholder="Ej: Acceso a todas las instalaciones, Seguro incluido..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarMembresia()">
                            <i class="bi bi-save"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalVerMembresia" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="bi bi-eye"></i> Detalle de Membresía</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="verMembresiaBody"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    await cargarMembresias();
    const buscar = document.getElementById('buscarMembresia');
    if (buscar) buscar.addEventListener('input', filtrarMembresias);
    configurarCalculoPrecio();
    configurarFechasMembresia();
}

async function verMembresia(id) {
    const m = await getData('membresias', id);
    const precioFinal = (m.precio || 0) - ((m.precio || 0) * (m.descuento || 0) / 100);
    const body = document.getElementById('verMembresiaBody');
    if (body) {
        const inicio = ((m.fechaInicio || '').split('T')[0]) || m.fechaInicio || getFechaActual();
        const fin = m.fechaFin || sumarDias(inicio, Math.max((m.duracion || 0) - 1, 0));
        const intervalo = obtenerDiasPorTipo(m.tipo || 'Mensual');
        const fechas = [];
        if (inicio && (m.duracion || 0) > 0) {
            fechas.push(inicio);
            let actual = sumarDias(inicio, intervalo);
            while (actual && new Date(actual) <= new Date(fin)) {
                fechas.push(actual);
                actual = sumarDias(actual, intervalo);
            }
        }
        const proxima = fechas[0] || '';
        const chipsHorario = (Array.isArray(m.dias) && m.dias.length) ? m.dias.map(d => `<span class="badge bg-light text-dark" style="margin-right:6px;">${d}</span>`).join('') : '—';
        body.innerHTML = `
            <div class="row g-3">
                <div class="col-12">
                    <div style="padding:12px;background:linear-gradient(135deg,#e65100,#ff9800);color:#fff;border-radius:8px;">
                        <div class="d-flex justify-content-between align-items-center">
                            <div style="font-size:20px;font-weight:800;">${m.nombre}</div>
                            <span class="badge bg-light text-dark">${m.tipo || '—'}</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted">Duración</div>
                    <div><i class="bi bi-hourglass-split me-1"></i> <span style="font-weight:700;">${m.duracion || 0}</span> días</div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted">Descuento</div>
                    <div>${m.descuento ? m.descuento + '%' : '—'}</div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted">Monto por cuota</div>
                    <div style="font-weight:700;color:#0d6efd;">${formatearMoneda(precioFinal)}</div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted">Fecha de inicio</div>
                    <div style="font-weight:700;">${inicio ? formatearFecha(inicio) : '—'}</div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted">Fecha de fin</div>
                    <div>${fin ? formatearFecha(fin) : '—'}</div>
                </div>
                <div class="col-md-4">
                    <div class="text-muted">Próxima fecha de pago</div>
                    <div>${proxima ? formatearFecha(proxima) : '—'}</div>
                </div>
                <div class="col-12">
                    <div class="text-muted">Beneficios</div>
                    <div>${m.beneficios || '—'}</div>
                </div>
                <div class="col-12">
                    <div class="fw-bold mb-1"><i class="bi bi-calendar-check"></i> Programación de pagos</div>
                    <div style="max-height:180px; overflow:auto; border:1px solid #eee; border-radius:8px; padding:8px;">
                        ${fechas.length ? fechas.map(f => `<div><i class="bi bi-dot"></i> ${formatearFecha(f)}</div>`).join('') : '<div class="text-muted">Sin fechas dentro del rango</div>'}
                    </div>
                    <div class="mt-2 text-muted">Cuotas programadas: <span style="font-weight:700;">${fechas.length}</span></div>
                </div>
                <div class="col-12">
                    <div class="text-muted">Precio base</div>
                    <div>${formatearMoneda(m.precio || 0)}</div>
                </div>
                <div class="col-12">
                    <div class="text-muted">Fecha de creación</div>
                    <div>${m.fechaCreacion ? formatearFecha((m.fechaCreacion || '').split('T')[0]) : '—'}</div>
                </div>
            </div>
        `;
    }
    new bootstrap.Modal(document.getElementById('modalVerMembresia')).show();
}

function configurarCalculoPrecio() {
    const precio = document.getElementById('membresiaPrecio');
    const descuento = document.getElementById('membresiaDescuento');
    const precioFinal = document.getElementById('membresiaPrecioFinal');

    const calcular = () => {
        const p = parseFloat(precio.value) || 0;
        const d = parseFloat(descuento.value) || 0;
        const final = p - (p * d / 100);
        precioFinal.value = formatearMoneda(final);
    };

    if (precio && descuento) {
        precio.addEventListener('input', calcular);
        descuento.addEventListener('input', calcular);
    }
}

function obtenerDiasPorTipo(tipo) {
    const t = (tipo || '').toLowerCase();
    if (t.startsWith('mensual')) return 30;
    if (t.startsWith('quincenal')) return 15;
    if (t.startsWith('semanal')) return 7;
    if (t.startsWith('diario')) return 1;
    if (t.startsWith('dia')) return 1;
    return 30;
}

function sumarDias(fechaStr, dias) {
    if (!fechaStr) return '';
    const d = new Date(fechaStr + 'T00:00:00');
    d.setDate(d.getDate() + dias);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
}

function actualizarFechasMembresia() {
    const inicioEl = document.getElementById('membresiaFechaInicio');
    const finEl = document.getElementById('membresiaFechaFin');
    const pagoEl = document.getElementById('membresiaFechaPago');
    const tipoEl = document.getElementById('membresiaTipo');
    const durEl = document.getElementById('membresiaDuracion');
    const infoEl = document.getElementById('membresiaProgramacionPagos');
    const cuotasEl = document.getElementById('membresiaCuotasTotal');

    if (!inicioEl || !finEl || !tipoEl || !durEl || !infoEl) return;
    const inicio = inicioEl.value || getFechaActual();
    const duracion = parseInt(durEl.value) || 0;
    if (!inicio || !duracion) { finEl.value = ''; pagoEl && (pagoEl.value = ''); infoEl.innerHTML = ''; return; }
    const fin = sumarDias(inicio, Math.max(duracion - 1, 0));
    finEl.value = fin;
    const intervalo = obtenerDiasPorTipo(tipoEl.value);
    if (pagoEl) pagoEl.value = inicio;
    const lista = [];
    lista.push(`<div><i class=\"bi bi-dot\"></i> ${formatearFecha(inicio)}</div>`);
    let actual = sumarDias(inicio, intervalo);
    while (actual && new Date(actual) <= new Date(fin)) {
        lista.push(`<div><i class=\"bi bi-dot\"></i> ${formatearFecha(actual)}</div>`);
        actual = sumarDias(actual, intervalo);
    }
    infoEl.innerHTML = lista.length ? lista.join('') : '<div class="text-muted">Sin fechas dentro del rango</div>';
    if (cuotasEl) cuotasEl.value = lista.length;
}

function configurarFechasMembresia() {
    const inicioEl = document.getElementById('membresiaFechaInicio');
    const tipoEl = document.getElementById('membresiaTipo');
    const durEl = document.getElementById('membresiaDuracion');
    const finEl = document.getElementById('membresiaFechaFin');

    if (inicioEl) inicioEl.addEventListener('change', actualizarFechasMembresia);
    if (tipoEl) tipoEl.addEventListener('change', actualizarFechasMembresia);
    if (durEl) durEl.addEventListener('input', actualizarFechasMembresia);

    // Permitir edición manual de la fecha de fin
    if (finEl) {
        finEl.addEventListener('change', function () {
            // Cuando el usuario cambia manualmente la fecha de fin, recalcular la programación de pagos
            const inicioEl = document.getElementById('membresiaFechaInicio');
            const tipoEl = document.getElementById('membresiaTipo');
            const pagoEl = document.getElementById('membresiaFechaPago');
            const infoEl = document.getElementById('membresiaProgramacionPagos');
            const cuotasEl = document.getElementById('membresiaCuotasTotal');

            if (!inicioEl || !finEl || !tipoEl || !infoEl) return;

            const inicio = inicioEl.value || getFechaActual();
            const fin = finEl.value;

            if (!inicio || !fin) {
                if (pagoEl) pagoEl.value = '';
                infoEl.innerHTML = '';
                if (cuotasEl) cuotasEl.value = 0;
                return;
            }

            // Verificar que la fecha de fin sea posterior a la fecha de inicio
            if (new Date(fin) < new Date(inicio)) {
                mostrarAlerta('La fecha de fin debe ser posterior a la fecha de inicio', 'warning');
                finEl.value = '';
                return;
            }

            const intervalo = obtenerDiasPorTipo(tipoEl.value);
            if (pagoEl) pagoEl.value = inicio;

            const lista = [];
            lista.push(`<div><i class="bi bi-dot"></i> ${formatearFecha(inicio)}</div>`);
            let actual = sumarDias(inicio, intervalo);
            while (actual && new Date(actual) <= new Date(fin)) {
                lista.push(`<div><i class="bi bi-dot"></i> ${formatearFecha(actual)}</div>`);
                actual = sumarDias(actual, intervalo);
            }

            infoEl.innerHTML = lista.length ? lista.join('') : '<div class="text-muted">Sin fechas dentro del rango</div>';
            if (cuotasEl) cuotasEl.value = lista.length;
        });
    }

    actualizarFechasMembresia();
}

async function cargarMembresias() {
    const empresa = getCurrentEmpresa();
    const membresias = await getDataByEmpresa('membresias', empresa.id);
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const grid = document.getElementById('membresiasCards');

    if (membresias.length === 0) {
        grid.innerHTML = '<div class="col-12"><div class="text-center text-muted">No hay membresías registradas</div></div>';
        return;
    }

    grid.innerHTML = membresias.map(membresia => {
        const cantidadAlumnos = alumnos.filter(a => a.membresiaId === membresia.id && a.activo).length;
        const precioFinal = membresia.precio - (membresia.precio * membresia.descuento / 100);
        const tipo = membresia.tipo || '—';

        return `
            <div class="col-md-4" data-nombre="${membresia.nombre.toLowerCase()}">
                <div class="card h-100" style="border:2px solid #ff9800;box-shadow:0 6px 14px rgba(0,0,0,0.06);border-radius:12px;overflow:hidden;">
                    <div style="padding:12px;background:linear-gradient(135deg,#e65100,#ff9800);color:#fff;text-align:center;">
                        <div style="font-size:28px;font-weight:700;margin-bottom:8px;">${membresia.nombre}</div>
                        <span class="badge bg-light text-dark"><i class="bi bi-award me-1"></i> ${tipo}</span>
                    </div>
                    <div class="card-body" style="padding:12px;background-color:#fef9f3;">
                        <div class="row mb-1">
                            <div class="col-6">
                                <div class="text-muted" style="font-size:14px;">Duración</div>
                                <div style="font-size:16px;"><i class="bi bi-hourglass-split me-1"></i> <span style="font-weight:700;">${membresia.duracion}</span> días</div>
                            </div>
                            <div class="col-6">
                                <div class="text-muted" style="font-size:14px;">Alumnos</div>
                                <div style="font-size:16px;"><i class="bi bi-people me-1"></i> <span style="font-weight:700;">${cantidadAlumnos}</span></div>
                            </div>
                        </div>
                        <div class="d-flex align-items-baseline justify-content-center" style="gap:6px;">
                            <div style="font-size:32px;font-weight:700;font-family:'Roboto', Arial, sans-serif;color:#0d6efd;">${formatearMoneda(precioFinal)}</div>
                            <div class="text-muted" style="font-size:14px;">Fecha inicio: ${membresia.fechaInicio ? '<span style="font-weight:700;">' + formatearFecha(((membresia.fechaInicio || '').split('T')[0] || membresia.fechaInicio)) + '</span>' : '—'}</div>
                        </div>
                        <div class="text-muted" style="font-size:14px;">Horario: ${Array.isArray(membresia.dias) && membresia.dias.length ? membresia.dias.join(', ') : '—'}</div>
                    </div>
                    <div class="card-footer bg-white d-flex justify-content-between align-items-center" style="border-top:1px solid #eee;padding:10px 12px;">
                        <button class="btn btn-link btn-sm" style="font-size:14px;" onclick="verMembresia(${membresia.id})"><i class="bi bi-eye"></i> Ver</button>
                        <div class="d-flex" style="gap:6px;">
                            <button class="btn btn-sm btn-primary" style="font-size:14px;" onclick="editarMembresia(${membresia.id})"><i class="bi bi-pencil"></i> Editar</button>
                            <button class="btn btn-sm btn-outline-danger btn-icon" style="font-size:14px;" onclick="eliminarMembresia(${membresia.id})" title="Eliminar"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filtrarMembresias() {
    const q = (document.getElementById('buscarMembresia').value || '').toLowerCase();
    document.querySelectorAll('#membresiasCards > div.col-md-4').forEach(card => {
        card.style.display = card.dataset.nombre.includes(q) ? '' : 'none';
    });
}

async function mostrarModalMembresia() {
    document.getElementById('formMembresia').reset();
    document.getElementById('membresiaId').value = '';
    document.getElementById('modalMembresiaTitle').innerHTML = '<i class="bi bi-credit-card"></i> Nueva Membresía';
    document.getElementById('membresiaPrecioFinal').value = '';
    const empresa = getCurrentEmpresa();
    const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    const tipos = rows && rows[0] && Array.isArray(rows[0].tiposMembresia) && rows[0].tiposMembresia.length ? rows[0].tiposMembresia : ['Mensual', 'Quincenal', 'Semanal', 'Dia'];
    const selectTipo = document.getElementById('membresiaTipo');
    if (selectTipo) selectTipo.innerHTML = tipos.map(t => `<option value="${t}">${t}</option>`).join('');

    const modal = new bootstrap.Modal(document.getElementById('modalMembresia'));
    modal.show();
    actualizarFechasMembresia();
}

async function editarMembresia(id) {
    const membresia = await getData('membresias', id);

    document.getElementById('membresiaId').value = membresia.id;
    document.getElementById('membresiaNombre').value = membresia.nombre;
    const empresa = getCurrentEmpresa();
    const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    const tipos = rows && rows[0] && Array.isArray(rows[0].tiposMembresia) && rows[0].tiposMembresia.length ? rows[0].tiposMembresia : ['Mensual', 'Quincenal', 'Semanal', 'Dia'];
    const selectTipo = document.getElementById('membresiaTipo');
    if (selectTipo) {
        selectTipo.innerHTML = tipos.map(t => `<option value="${t}">${t}</option>`).join('');
        if (membresia.tipo) {
            if (!tipos.includes(membresia.tipo)) {
                selectTipo.innerHTML = `<option value="${membresia.tipo}">${membresia.tipo}</option>` + selectTipo.innerHTML;
            }
            selectTipo.value = membresia.tipo;
        }
    }
    document.getElementById('membresiaDuracion').value = membresia.duracion;
    document.getElementById('membresiaPrecio').value = membresia.precio;
    document.getElementById('membresiaDescuento').value = membresia.descuento || 0;
    document.getElementById('membresiaBeneficios').value = membresia.beneficios || '';

    const precioFinal = membresia.precio - (membresia.precio * (membresia.descuento || 0) / 100);
    document.getElementById('membresiaPrecioFinal').value = formatearMoneda(precioFinal);

    document.getElementById('modalMembresiaTitle').innerHTML = '<i class="bi bi-pencil"></i> Editar Membresía';

    const modal = new bootstrap.Modal(document.getElementById('modalMembresia'));
    modal.show();
    document.querySelectorAll('input[name="membresiaDias"]').forEach(el => { el.checked = Array.isArray(membresia.dias) && membresia.dias.includes(el.value); });
    document.getElementById('membresiaFechaInicio').value = membresia.fechaInicio || getFechaActual();
    document.getElementById('membresiaFechaFin').value = membresia.fechaFin || '';
    actualizarFechasMembresia();
}

async function guardarMembresia() {
    const id = document.getElementById('membresiaId').value;
    const nombre = document.getElementById('membresiaNombre').value.trim();
    const tipo = document.getElementById('membresiaTipo').value;
    const duracion = parseInt(document.getElementById('membresiaDuracion').value);
    const precio = parseFloat(document.getElementById('membresiaPrecio').value);
    const descuento = parseFloat(document.getElementById('membresiaDescuento').value) || 0;
    const beneficios = document.getElementById('membresiaBeneficios').value.trim();
    const fechaInicio = document.getElementById('membresiaFechaInicio').value || '';
    const fechaFin = document.getElementById('membresiaFechaFin').value || '';
    const dias = Array.from(document.querySelectorAll('input[name="membresiaDias"]:checked')).map(el => el.value);

    if (!nombre || !duracion || !precio) {
        mostrarAlerta('Complete todos los campos obligatorios', 'warning');
        return;
    }

    if (precio < 0 || duracion < 1) {
        mostrarAlerta('Los valores deben ser positivos', 'warning');
        return;
    }

    const empresa = getCurrentEmpresa();
    const membresiaData = {
        empresaId: empresa.id,
        nombre,
        tipo,
        duracion,
        precio,
        descuento,
        beneficios,
        fechaInicio,
        fechaFin,
        dias,
        fechaCreacion: new Date().toISOString()
    };

    try {
        if (id) {
            membresiaData.id = parseInt(id);
            await updateData('membresias', membresiaData);
            mostrarAlerta('Membresía actualizada correctamente', 'success');
        } else {
            await addData('membresias', membresiaData);
            mostrarAlerta('Membresía creada correctamente', 'success');
        }

        const modalEl = document.getElementById('modalMembresia');
        const modal = bootstrap.Modal.getInstance(modalEl);
        document.activeElement.blur();
        modalEl.addEventListener('hidden.bs.modal', async () => {
            await cargarMembresias();
        }, { once: true });
        modal.hide();
    } catch (error) {
        console.error('Error al guardar membresía:', error);
        mostrarAlerta('Error al guardar la membresía', 'danger');
    }
}

async function eliminarMembresia(id) {
    const empresa = getCurrentEmpresa();
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const alumnosMembresia = alumnos.filter(a => a.membresiaId === id);

    if (alumnosMembresia.length > 0) {
        mostrarAlerta(`No se puede eliminar la membresía porque tiene ${alumnosMembresia.length} alumno(s) asociado(s)`, 'warning');
        return;
    }

    const confirmar = await confirmarAccion('¿Está seguro de eliminar esta membresía?');
    if (!confirmar) return;

    try {
        await deleteData('membresias', id);
        mostrarAlerta('Membresía eliminada correctamente', 'success');
        await cargarMembresias();
    } catch (error) {
        console.error('Error al eliminar membresía:', error);
        mostrarAlerta('Error al eliminar la membresía', 'danger');
    }
}
