// usuarios.js
async function renderUsuarios() {
    const container = document.getElementById('contentContainer');
    container.innerHTML = `
        <div class="module-card">
            <h4><i class="bi bi-person-gear"></i> Gestión de Usuarios</h4>
            <button class="btn btn-primary" onclick="mostrarModalUsuario()">Nuevo Usuario</button>
            <div class="table-responsive mt-3">
                <table class="table table-modern">
                    <thead>
                        <tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody id="usuariosTableBody"></tbody>
                </table>
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
                        <button type="button" class="btn btn-primary" onclick="guardarUsuario()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    await cargarUsuarios();
}

async function cargarUsuarios() {
    const usuarios = await getDataByIndex('usuarios', 'empresaId', getCurrentEmpresa().id);
    document.getElementById('usuariosTableBody').innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.usuario}</td>
            <td>${u.nombre}</td>
            <td>${u.rol}</td>
            <td><span class="badge ${u.activo ? 'bg-success' : 'bg-danger'}">${u.activo ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <button class="btn btn-sm btn-danger btn-icon" onclick="eliminarUsuario(${u.id})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function mostrarModalUsuario() {
    document.getElementById('formUsuario').reset();
    document.getElementById('usuarioId').value = '';
    new bootstrap.Modal(document.getElementById('modalUsuario')).show();
}

async function guardarUsuario() {
    const data = {
        empresaId: getCurrentEmpresa().id,
        nombre: document.getElementById('usuarioNombre').value,
        usuario: document.getElementById('usuario').value,
        password: document.getElementById('usuarioPassword').value,
        rol: document.getElementById('usuarioRol').value,
        activo: true,
        fechaCreacion: new Date().toISOString()
    };
    
    try {
        await addData('usuarios', data);
        const modalEl = document.getElementById('modalUsuario');
        const modal = bootstrap.Modal.getInstance(modalEl);
        document.activeElement.blur();
        modalEl.addEventListener('hidden.bs.modal', async () => {
            mostrarAlerta('Usuario creado correctamente', 'success');
            await cargarUsuarios();
        }, { once: true });
        modal.hide();
    } catch (error) {
        mostrarAlerta('Error al crear usuario', 'danger');
    }
}

async function eliminarUsuario(id) {
    if (!await confirmarAccion('¿Eliminar este usuario?')) return;
    try {
        await deleteData('usuarios', id);
        mostrarAlerta('Usuario eliminado', 'success');
        await cargarUsuarios();
    } catch (error) {
        mostrarAlerta('Error al eliminar', 'danger');
    }
}
