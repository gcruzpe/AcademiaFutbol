// Función para filtrar categorías en tiempo real
function filtrarCategorias() {
    const filtro = document.getElementById('buscarCategoria').value.toLowerCase();
    const cards = document.querySelectorAll('.categoria-card-item');

    cards.forEach(card => {
        const texto = card.textContent.toLowerCase();
        card.style.display = texto.includes(filtro) ? '' : 'none';
    });
}

// Función para ver detalle de categoría (placeholder)
async function verDetalleCategoria(id) {
    const categoria = await getData('categorias', id);
    const empresa = getCurrentEmpresa();
    const deportes = await getDataByEmpresa('deportes', empresa.id);
    const profesores = await getDataByEmpresa('profesores', empresa.id);
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);

    const deporte = deportes.find(d => d.id === categoria.deporteId);
    const profesor = profesores.find(p => p.id === categoria.profesorId);
    const profesor2 = profesores.find(p => p.id === categoria.profesorId2);
    const alumnosCategoria = alumnos.filter(a => a.categoriaId === categoria.id && a.activo);

    let horarioDetalle = 'No especificado';
    if (categoria.horarios && categoria.horarios.dias && categoria.horarios.dias.length > 0) {
        horarioDetalle = `
            <strong>Días:</strong> ${categoria.horarios.dias.join(', ')}<br>
            ${categoria.horarios.turno ? `<strong>Turno:</strong> ${categoria.horarios.turno}<br>` : ''}
            ${categoria.horarios.horaInicio && categoria.horarios.horaFin ? `<strong>Horario:</strong> ${categoria.horarios.horaInicio} - ${categoria.horarios.horaFin}<br>` : ''}
            ${categoria.horarios.duracion ? `<strong>Duración:</strong> ${categoria.horarios.duracion} minutos<br>` : ''}
            ${categoria.horarios.frecuencia ? `<strong>Frecuencia:</strong> ${categoria.horarios.frecuencia} veces por semana` : ''}
        `;
    }

    const contenido = `
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-primary"><i class="bi bi-info-circle"></i> Información General</h6>
                <p><strong>Nombre:</strong> ${categoria.nombre}</p>
                <p><strong>Deporte:</strong> ${deporte ? deporte.nombre : '-'}</p>
                <p><strong>Nivel:</strong> ${categoria.nivel}</p>
                <p><strong>Edad:</strong> ${categoria.edadMinima || 0} - ${categoria.edadMaxima || 100} años</p>
                <p><strong>Cupo Máximo:</strong> ${categoria.cupoMaximo}</p>
                <p><strong>Alumnos Inscritos:</strong> ${alumnosCategoria.length}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary"><i class="bi bi-people"></i> Profesores</h6>
                <p><strong>Profesor 1:</strong> ${profesor ? profesor.nombre : 'Sin asignar'}</p>
                <p><strong>Profesor 2:</strong> ${profesor2 ? profesor2.nombre : 'Sin asignar'}</p>
                
                <h6 class="text-primary mt-3"><i class="bi bi-clock"></i> Horarios</h6>
                <p>${horarioDetalle}</p>
            </div>
        </div>
        
        ${alumnosCategoria.length > 0 ? `
            <hr>
            <h6 class="text-primary"><i class="bi bi-list-ul"></i> Lista de Alumnos</h6>
            <ul class="list-group">
                ${alumnosCategoria.map(a => `<li class="list-group-item">${a.nombres} ${a.apellidos}</li>`).join('')}
            </ul>
        ` : ''}
    `;

    // Crear modal temporal
    const modalHTML = `
        <div class="modal fade" id="modalDetalleCategoria" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="bi bi-tags"></i> Detalle de Categoría</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${contenido}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="editarCategoria(${id}); bootstrap.Modal.getInstance(document.getElementById('modalDetalleCategoria')).hide();">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insertar modal si no existe
    let modalEl = document.getElementById('modalDetalleCategoria');
    if (!modalEl) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modalEl = document.getElementById('modalDetalleCategoria');
    } else {
        modalEl.querySelector('.modal-body').innerHTML = contenido;
    }

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}
