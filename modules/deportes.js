// modules/deportes.js - Módulo de Deportes
async function renderDeportes() {
    const container = document.getElementById('contentContainer');
    const empresa = getCurrentEmpresa();

    container.innerHTML = `
        <div class="module-card">
            <div class="module-header">
                <h4><i class="bi bi-dribbble"></i> Gestión de Deportes</h4>
                <button class="btn btn-primary" onclick="mostrarModalDeporte()">
                    <i class="bi bi-plus-circle"></i> Nuevo Deporte
                </button>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <div class="search-box">
                        <i class="bi bi-search"></i>
                        <input type="text" class="form-control" id="buscarDeporte" placeholder="Buscar deporte...">
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-modern" id="tablaDeportes">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Edad Mín-Máx</th>
                            <th>Alumnos</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="deportesTableBody"></tbody>
                </table>
            </div>
        </div>

        <!-- Modal Deporte -->
        <div class="modal fade" id="modalDeporte" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="modalDeporteTitle">
                            <i class="bi bi-dribbble"></i> Nuevo Deporte
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formDeporte">
                            <input type="hidden" id="deporteId">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Nombre del Deporte *</label>
                                    <input type="text" class="form-control" id="deporteNombre" required>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label">Edad Mínima</label>
                                    <input type="number" class="form-control" id="deporteEdadMin" min="0" value="0">
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label">Edad Máxima</label>
                                    <input type="number" class="form-control" id="deporteEdadMax" min="0" value="100">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Descripción</label>
                                <textarea class="form-control" id="deporteDescripcion" rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Equipamiento Requerido</label>
                                <textarea class="form-control" id="deporteEquipamiento" rows="2" 
                                    placeholder="Ej: Pelota, Uniforme, Zapatillas..."></textarea>
                            </div>
                            <div class="mb-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="deporteActivo" checked>
                                    <label class="form-check-label" for="deporteActivo">Activo</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarDeporte()">
                            <i class="bi bi-save"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    await cargarDeportes();
    buscarEnTabla('buscarDeporte', 'tablaDeportes');
}

async function cargarDeportes() {
    const empresa = getCurrentEmpresa();
    const deportes = await getDataByEmpresa('deportes', empresa.id);
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const tbody = document.getElementById('deportesTableBody');

    if (deportes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay deportes registrados</td></tr>';
        return;
    }

    tbody.innerHTML = deportes.map(deporte => {
        const cantidadAlumnos = alumnos.filter(a => a.deporteId === deporte.id && a.activo).length;
        const estadoBadge = deporte.activo ? 
            '<span class="badge-status badge-active">Activo</span>' : 
            '<span class="badge-status badge-inactive">Inactivo</span>';

        return `
            <tr>
                <td><strong>${deporte.nombre}</strong></td>
                <td>${deporte.descripcion || '-'}</td>
                <td>${deporte.edadMinima || 0} - ${deporte.edadMaxima || 100} años</td>
                <td><span class="badge badge-alumnos rounded-pill bg-info">${cantidadAlumnos}</span></td>
                <td>${estadoBadge}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-icon" onclick="editarDeporte(${deporte.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon" onclick="eliminarDeporte(${deporte.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function mostrarModalDeporte() {
    document.getElementById('formDeporte').reset();
    document.getElementById('deporteId').value = '';
    document.getElementById('modalDeporteTitle').innerHTML = '<i class="bi bi-dribbble"></i> Nuevo Deporte';
    document.getElementById('deporteActivo').checked = true;
    
    const modal = new bootstrap.Modal(document.getElementById('modalDeporte'));
    modal.show();
}

async function editarDeporte(id) {
    const deporte = await getData('deportes', id);
    
    document.getElementById('deporteId').value = deporte.id;
    document.getElementById('deporteNombre').value = deporte.nombre;
    document.getElementById('deporteDescripcion').value = deporte.descripcion || '';
    document.getElementById('deporteEdadMin').value = deporte.edadMinima || 0;
    document.getElementById('deporteEdadMax').value = deporte.edadMaxima || 100;
    document.getElementById('deporteEquipamiento').value = deporte.equipamiento || '';
    document.getElementById('deporteActivo').checked = deporte.activo;
    
    document.getElementById('modalDeporteTitle').innerHTML = '<i class="bi bi-pencil"></i> Editar Deporte';
    
    const modal = new bootstrap.Modal(document.getElementById('modalDeporte'));
    modal.show();
}

async function guardarDeporte() {
    const id = document.getElementById('deporteId').value;
    const nombre = document.getElementById('deporteNombre').value.trim();
    const descripcion = document.getElementById('deporteDescripcion').value.trim();
    const edadMinima = parseInt(document.getElementById('deporteEdadMin').value) || 0;
    const edadMaxima = parseInt(document.getElementById('deporteEdadMax').value) || 100;
    const equipamiento = document.getElementById('deporteEquipamiento').value.trim();
    const activo = document.getElementById('deporteActivo').checked;

    if (!nombre) {
        mostrarAlerta('El nombre del deporte es obligatorio', 'warning');
        return;
    }

    const empresa = getCurrentEmpresa();
    const deporteData = {
        empresaId: empresa.id,
        nombre,
        descripcion,
        edadMinima,
        edadMaxima,
        equipamiento,
        activo,
        fechaCreacion: new Date().toISOString()
    };

    try {
        if (id) {
            deporteData.id = parseInt(id);
            await updateData('deportes', deporteData);
            mostrarAlerta('Deporte actualizado correctamente', 'success');
        } else {
            await addData('deportes', deporteData);
            mostrarAlerta('Deporte creado correctamente', 'success');
        }

        const modalEl = document.getElementById('modalDeporte');
        const modal = bootstrap.Modal.getInstance(modalEl);
        document.activeElement.blur();
        modalEl.addEventListener('hidden.bs.modal', async () => {
            await cargarDeportes();
        }, { once: true });
        modal.hide();
    } catch (error) {
        console.error('Error al guardar deporte:', error);
        mostrarAlerta('Error al guardar el deporte', 'danger');
    }
}

async function eliminarDeporte(id) {
    // Verificar si hay alumnos asociados
    const empresa = getCurrentEmpresa();
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const alumnosDeporte = alumnos.filter(a => a.deporteId === id);

    if (alumnosDeporte.length > 0) {
        mostrarAlerta(`No se puede eliminar el deporte porque tiene ${alumnosDeporte.length} alumno(s) asociado(s)`, 'warning');
        return;
    }

    const confirmar = await confirmarAccion('¿Está seguro de eliminar este deporte?');
    if (!confirmar) return;

    try {
        await deleteData('deportes', id);
        mostrarAlerta('Deporte eliminado correctamente', 'success');
        await cargarDeportes();
    } catch (error) {
        console.error('Error al eliminar deporte:', error);
        mostrarAlerta('Error al eliminar el deporte', 'danger');
    }
}
