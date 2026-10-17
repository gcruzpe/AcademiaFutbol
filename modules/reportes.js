async function renderReportes() {
    const container = document.getElementById('contentContainer');
    const hoy = getFechaActual();
    container.innerHTML = `
        <div class="module-card">
            <div class="module-header d-flex justify-content-between align-items-center">
                <div>
                    <h4><i class="bi bi-graph-up"></i> Reporte General</h4>
                    <div class="text-muted" style="font-size:12px;">Control de ingresos y egresos</div>
                </div>
                <div class="d-flex" style="gap:8px;">
                    <button class="btn btn-outline-primary" onclick="exportarVistaReportes()"><i class="bi bi-download"></i> Exportar</button>
                    <button class="btn btn-success" onclick="mostrarModalNuevoGasto()"><i class="bi bi-cash-coin"></i> Nuevo Gasto</button>
                </div>
            </div>

            <div class="row g-3 align-items-end mb-2">

                <div class="col-md-2">
                    <label class="form-label">Desde</label>
                    <input type="date" class="form-control" id="repDesde" value="${hoy}">
                </div>
                <div class="col-md-2">
                    <label class="form-label">Hasta</label>
                    <input type="date" class="form-control" id="repHasta" value="${hoy}">
                </div>
                <div class="col-md-5">
                    <label class="form-label">Vista</label>
                    <div class="btn-group w-100" role="group">
                        <button class="btn btn-primary" id="btnVistaIngresos" onclick="setVistaReportes('ingresos')"><i class="bi bi-graph-up"></i> Ingresos</button>
                        <button class="btn btn-outline-primary" id="btnVistaGastos" onclick="setVistaReportes('gastos')"><i class="bi bi-graph-down"></i> Gastos</button>
                    </div>
                </div>
            </div>

            <div class="row g-3 mb-3">
                <div class="col-md-4">
                    <div class="card" style="border:none;box-shadow:0 6px 14px rgba(0,0,0,0.06);">
                        <div class="card-body">
                            <div class="text-muted">Ingresos Totales</div>
                            <div id="repIngresosTotal" style="font-size:28px;font-weight:700;color:#198754;">S/ 0.00</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card" style="border:none;box-shadow:0 6px 14px rgba(0,0,0,0.06);">
                        <div class="card-body">
                            <div class="text-muted">Egresos Totales</div>
                            <div id="repEgresosTotal" style="font-size:28px;font-weight:700;color:#dc3545;">S/ 0.00</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card" style="border:none;box-shadow:0 6px 14px rgba(0,0,0,0.06);">
                        <div class="card-body">
                            <div class="text-muted">Balance</div>
                            <div id="repBalance" style="font-size:28px;font-weight:700;color:#0d6efd;">S/ 0.00</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-3">
                <div class="col-md-4">
                    <div class="module-card">
                        <div class="module-header"><h5>Distribución de Ingresos por Categoría</h5></div>
                        <div style="height:280px"><canvas id="chartIngresosCategoria"></canvas></div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="module-card">
                        <div class="module-header"><h5>Distribución de Gastos por Categoría</h5></div>
                        <div style="height:280px"><canvas id="chartGastosCategoria"></canvas></div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="module-card">
                        <div class="module-header"><h5>Ingresos vs Gastos por Mes</h5></div>
                        <div style="height:280px"><canvas id="chartIngresosVsGastos"></canvas></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalNuevoGasto" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="bi bi-cash-coin"></i> Nuevo Gasto</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Fecha</label>
                                <input type="date" class="form-control" id="gastoFecha" value="${hoy}">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Categoría</label>
                                <select class="form-select" id="gastoCategoria"></select>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">Descripción</label>
                                <input type="text" class="form-control" id="gastoDescripcion" placeholder="Detalle del gasto">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Monto (S/)</label>
                                <input type="number" class="form-control" id="gastoMonto" step="0.01" min="0">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button class="btn btn-success" onclick="guardarGasto()"><i class="bi bi-save"></i> Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    await cargarFiltroReportes();
    await actualizarReportes();
}

async function cargarFiltroReportes() {
    const empresa = getCurrentEmpresa();

    document.getElementById('repDesde').addEventListener('change', actualizarReportes);
    document.getElementById('repHasta').addEventListener('change', actualizarReportes);
}

function setVistaReportes(v) {
    const b1 = document.getElementById('btnVistaIngresos');
    const b2 = document.getElementById('btnVistaGastos');
    if (v === 'ingresos') {
        b1.classList.remove('btn-outline-primary');
        b1.classList.add('btn-primary');
        b2.classList.remove('btn-primary');
        b2.classList.add('btn-outline-primary');
    } else {
        b2.classList.remove('btn-outline-primary');
        b2.classList.add('btn-primary');
        b1.classList.remove('btn-primary');
        b1.classList.add('btn-outline-primary');
    }
    actualizarReportes();
}

async function actualizarReportes() {
    const empresa = getCurrentEmpresa();

    const desde = document.getElementById('repDesde').value;
    const hasta = document.getElementById('repHasta').value;
    const pagos = await getDataByEmpresa('pagos', empresa.id);
    const ventas = await getDataByEmpresa('ventas', empresa.id);
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const gastos = await getDataByEmpresa('gastos', empresa.id);
    const entreFechas = (f) => {
        const d = new Date(f.split('T')[0] || f);
        return (!desde || d >= new Date(desde)) && (!hasta || d <= new Date(hasta));
    };
    const pagosFiltrados = pagos.filter(p => entreFechas(p.fecha));
    const ventasFiltradas = ventas.filter(v => entreFechas(v.fecha));
    const gastosFiltrados = gastos.filter(g => entreFechas(g.fecha));
    const alumnosMap = new Map(alumnos.map(a => [a.id, a]));
    const ingresosPagos = pagosFiltrados

        .reduce((sum, p) => sum + (p.monto || 0), 0);
    const ingresosVentas = ventasFiltradas.reduce((sum, v) => sum + (v.total || 0), 0);
    const ingresosTotal = ingresosPagos + ingresosVentas;
    const egresosTotal = gastosFiltrados.reduce((sum, g) => sum + (g.monto || 0), 0);
    const balance = ingresosTotal - egresosTotal;
    document.getElementById('repIngresosTotal').textContent = formatearMoneda(ingresosTotal);
    document.getElementById('repEgresosTotal').textContent = formatearMoneda(egresosTotal);
    document.getElementById('repBalance').textContent = formatearMoneda(balance);
    await renderGraficoIngresosCategoria(pagosFiltrados, alumnosMap);
    await renderGraficoGastosCategoria(gastosFiltrados);
    await renderGraficoIngresosVsGastosMes(pagosFiltrados, ventasFiltradas, gastosFiltrados);
}

async function renderGraficoIngresosCategoria(pagos, alumnosMap) {
    const empresa = getCurrentEmpresa();
    const categorias = await getDataByEmpresa('categorias', empresa.id);
    const mapa = new Map();
    pagos.forEach(p => {
        const a = alumnosMap.get(p.alumnoId);
        if (!a) return;
        if (a.categoriaId) {
            mapa.set(a.categoriaId, (mapa.get(a.categoriaId) || 0) + (p.monto || 0));
        }
    });
    const labels = [];
    const data = [];
    const bgColors = [];
    const palette = ['#1e56a0', '#2d7dd2', '#85c7f2', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#6610f2'];
    let i = 0;
    for (const [catId, monto] of mapa.entries()) {
        const cat = categorias.find(c => c.id === catId);
        if (cat) {
            labels.push(cat.nombre);
            data.push(monto);
            bgColors.push(palette[i % palette.length]);
            i++;
        }
    }
    const ctxEl = document.getElementById('chartIngresosCategoria');
    if (!ctxEl) return;
    const ctx = ctxEl.getContext('2d');
    if (ctxEl._chart) ctxEl._chart.destroy();
    ctxEl._chart = new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: bgColors }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
}

async function renderGraficoGastosCategoria(gastos) {
    const mapa = new Map();
    gastos.forEach(g => {
        const cat = (g.categoria || 'Otros').trim();
        mapa.set(cat, (mapa.get(cat) || 0) + (g.monto || 0));
    });
    const labels = Array.from(mapa.keys());
    const data = Array.from(mapa.values());
    const ctxEl = document.getElementById('chartGastosCategoria');
    if (!ctxEl) return;
    const ctx = ctxEl.getContext('2d');
    if (ctxEl._chart) ctxEl._chart.destroy();
    ctxEl._chart = new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#0d6efd', '#20c997', '#6f42c1'] }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
}

async function renderGraficoIngresosVsGastosMes(pagos, ventas, gastos) {
    const mapMes = new Map();
    const add = (f, monto, tipo) => {
        const d = new Date((f || '').split('T')[0] || f);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!mapMes.has(key)) mapMes.set(key, { ingresos: 0, gastos: 0 });
        mapMes.get(key)[tipo] += monto;
    };
    pagos.forEach(p => add(p.fecha, (p.monto || 0), 'ingresos'));
    ventas.forEach(v => add(v.fecha, (v.total || 0), 'ingresos'));
    gastos.forEach(g => add(g.fecha, (g.monto || 0), 'gastos'));
    const labels = Array.from(mapMes.keys()).sort();
    const ingresos = labels.map(k => mapMes.get(k).ingresos);
    const egresos = labels.map(k => mapMes.get(k).gastos);
    const ctxEl = document.getElementById('chartIngresosVsGastos');
    if (!ctxEl) return;
    const ctx = ctxEl.getContext('2d');
    if (ctxEl._chart) ctxEl._chart.destroy();
    ctxEl._chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels, datasets: [
                { label: 'Ingresos', data: ingresos, backgroundColor: '#0d6efd' },
                { label: 'Gastos', data: egresos, backgroundColor: '#dc3545' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
    });
}

async function mostrarModalNuevoGasto() {
    const empresa = getCurrentEmpresa();
    const gastos = await getDataByEmpresa('gastos', empresa.id);
    const categoriasSet = new Set(gastos.map(g => (g.categoria || '').trim()).filter(c => c));
    const sel = document.getElementById('gastoCategoria');
    if (sel) sel.innerHTML = '<option value="">Sin categoría</option>' + Array.from(categoriasSet).map(c => `<option value="${c}">${c}</option>`).join('');
    new bootstrap.Modal(document.getElementById('modalNuevoGasto')).show();
}

async function guardarGasto() {
    const empresa = getCurrentEmpresa();
    const fecha = document.getElementById('gastoFecha').value;
    const categoria = document.getElementById('gastoCategoria').value.trim();
    const descripcion = document.getElementById('gastoDescripcion').value.trim();
    const monto = parseFloat(document.getElementById('gastoMonto').value) || 0;
    if (!fecha || !monto) { mostrarAlerta('Complete fecha y monto', 'warning'); return; }
    await addData('gastos', { empresaId: empresa.id, fecha, categoria, descripcion, monto, fechaCreacion: new Date().toISOString() });
    mostrarAlerta('Gasto guardado', 'success');
    const modalEl = document.getElementById('modalNuevoGasto');
    const modal = bootstrap.Modal.getInstance(modalEl);
    document.activeElement.blur();
    modalEl.addEventListener('hidden.bs.modal', actualizarReportes, { once: true });
    modal.hide();
}

function exportarVistaReportes() {
    const empresa = getCurrentEmpresa();
    const desde = document.getElementById('repDesde').value;
    const hasta = document.getElementById('repHasta').value;

    Promise.all([
        getDataByEmpresa('pagos', empresa.id),
        getDataByEmpresa('ventas', empresa.id),
        getDataByEmpresa('gastos', empresa.id)
    ]).then(([pagos, ventas, gastos]) => {
        const entreFechas = (f) => {
            const d = new Date(f.split('T')[0] || f);
            return (!desde || d >= new Date(desde)) && (!hasta || d <= new Date(hasta));
        };
        const alumnosPromise = getDataByEmpresa('alumnos', empresa.id);
        alumnosPromise.then(alumnos => {
            const alumnosMap = new Map(alumnos.map(a => [a.id, a]));
            const pagosFiltrados = pagos.filter(p => entreFechas(p.fecha));
            const ventasFiltradas = ventas.filter(v => entreFechas(v.fecha));
            const gastosFiltrados = gastos.filter(g => entreFechas(g.fecha));
            const datos = [
                ...pagosFiltrados.map(p => ({ tipo: 'Ingreso (Pago)', fecha: p.fecha, monto: p.monto })),
                ...ventasFiltradas.map(v => ({ tipo: 'Ingreso (Venta)', fecha: v.fecha, monto: v.total })),
                ...gastosFiltrados.map(g => ({ tipo: 'Gasto', fecha: g.fecha, categoria: g.categoria, monto: g.monto }))
            ];
            exportarCSV(datos, 'reporte_general');
        });
    });
}

async function generarReporteDeudores() {
    const alumnos = await getDataByEmpresa('alumnos', getCurrentEmpresa().id);
    const deudores = alumnos.filter(a => {
        const estado = verificarEstadoPagoSync(a.fechaVencimiento);
        return estado === 'vencido' && a.activo;
    });
    exportarCSV(deudores, 'alumnos_deudores');
}

async function generarReporteAsistencias() {
    const asistencias = await getAllData('asistencias');
    const asistenciasEmpresa = asistencias.filter(a => a.empresaId === getCurrentEmpresa().id);
    exportarCSV(asistenciasEmpresa, 'reporte_asistencias');
}

async function generarReporteVentas() {
    const ventas = await getDataByEmpresa('ventas', getCurrentEmpresa().id);
    exportarCSV(ventas, 'reporte_ventas');
}
