// pagos.js
async function renderPagos() {
    const container = document.getElementById('contentContainer');
    container.innerHTML = `
        <div class="module-card">
            <h4><i class="bi bi-cash-coin"></i> Control de Pagos</h4>
            <div class="table-responsive">
                <table class="table table-modern">
                    <thead>
                        <tr><th>Alumno</th><th>Membresía</th><th>Vencimiento</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody id="pagosTableBody"></tbody>
                </table>
            </div>
        </div>
        
        <div class="modal fade" id="modalPago" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Registrar Pago</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formPago">
                            <input type="hidden" id="pagoAlumnoId">
                            <div class="mb-3">
                                <label class="form-label">Membresía *</label>
                                <select class="form-select" id="pagoMembresia" required onchange="calcularVencimiento()"></select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Monto *</label>
                                <input type="number" step="0.01" class="form-control" id="pagoMonto" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Nueva Fecha Vencimiento</label>
                                <input type="date" class="form-control" id="pagoVencimiento" readonly>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarPago()">Registrar Pago</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    await cargarPagos();
}

async function cargarPagos() {
    const alumnos = await getDataByEmpresa('alumnos', getCurrentEmpresa().id);
    const membresias = await getDataByEmpresa('membresias', getCurrentEmpresa().id);
    const tbody = document.getElementById('pagosTableBody');
    
    tbody.innerHTML = alumnos.filter(a => a.activo).map(alumno => {
        const membresia = membresias.find(m => m.id === alumno.membresiaId);
        const estado = verificarEstadoPagoSync(alumno.fechaVencimiento);
        let badge = '';
        
        if (estado === 'al-dia') badge = '<span class="badge-status badge-paid">Al día</span>';
        else if (estado === 'proximo-vencer') badge = '<span class="badge-status badge-pending">Próximo a vencer</span>';
        else badge = '<span class="badge-status badge-overdue">Vencido</span>';

        return `
            <tr>
                <td>${alumno.nombres} ${alumno.apellidos}</td>
                <td>${membresia ? membresia.nombre : '-'}</td>
                <td>${formatearFecha(alumno.fechaVencimiento)}</td>
                <td>${badge}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="mostrarModalPago(${alumno.id})">
                        <i class="bi bi-cash"></i> Registrar Pago
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function mostrarModalPago(alumnoId) {
    document.getElementById('pagoAlumnoId').value = alumnoId;
    const membresias = await getDataByEmpresa('membresias', getCurrentEmpresa().id);
    document.getElementById('pagoMembresia').innerHTML = membresias.map(m => `<option value="${m.id}" data-duracion="${m.duracion}" data-precio="${m.precio}">${m.nombre} - ${formatearMoneda(m.precio)}</option>`).join('');
    calcularVencimiento();
    new bootstrap.Modal(document.getElementById('modalPago')).show();
}

function calcularVencimiento() {
    const select = document.getElementById('pagoMembresia');
    const option = select.selectedOptions[0];
    const duracion = parseInt(option.dataset.duracion);
    const precio = parseFloat(option.dataset.precio);
    
    document.getElementById('pagoMonto').value = precio;
    document.getElementById('pagoVencimiento').value = calcularFechaVencimiento(duracion);
}

async function guardarPago() {
    const alumnoId = parseInt(document.getElementById('pagoAlumnoId').value);
    const membresiaId = parseInt(document.getElementById('pagoMembresia').value);
    const monto = parseFloat(document.getElementById('pagoMonto').value);
    const fechaVencimiento = document.getElementById('pagoVencimiento').value;
    
    try {
        await addData('pagos', {
            empresaId: getCurrentEmpresa().id,
            alumnoId: alumnoId,
            membresiaId: membresiaId,
            monto: monto,
            fecha: new Date().toISOString(),
            metodoPago: 'Efectivo'
        });
        
        const alumno = await getData('alumnos', alumnoId);
        alumno.fechaVencimiento = fechaVencimiento;
        alumno.membresiaId = membresiaId;
        await updateData('alumnos', alumno);
        
        const modalEl = document.getElementById('modalPago');
        const modal = bootstrap.Modal.getInstance(modalEl);
        document.activeElement.blur();
        modalEl.addEventListener('hidden.bs.modal', async () => {
            mostrarAlerta('Pago registrado correctamente', 'success');
            await cargarPagos();
        }, { once: true });
        modal.hide();
    } catch (error) {
        mostrarAlerta('Error al registrar pago', 'danger');
    }
}
