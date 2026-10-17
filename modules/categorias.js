// modules/categorias.js - Módulo de Categorías y Profesores
async function renderCategorias() {
    const container = document.getElementById('contentContainer');

    container.innerHTML = `
        <div class="row g-4">
            <!-- Categorías -->
            <div class="col-md-9">
                <div class="module-card">
                    <div class="module-header">
                        <h4><i class="bi bi-tags"></i> Categorías</h4>
                        <button class="btn btn-primary" onclick="mostrarModalCategoria()">
                            <i class="bi bi-plus-circle"></i> Nueva Categoría
                        </button>
                    </div>

                    <div class="search-box mb-3">
                        <i class="bi bi-search"></i>
                        <input type="text" class="form-control" id="buscarCategoria" placeholder="Buscar categoría..." oninput="filtrarCategorias()">
                    </div>

                    <div class="row g-3" id="categoriasGrid">
                        <!-- Las cards se generarán aquí -->
                    </div>
                </div>
            </div>

            <!-- Profesores -->
            <div class="col-md-3">
                <div class="module-card">
                    <div class="module-header">
                        <h4><i class="bi bi-person-badge"></i> Profesores</h4>
                        <button class="btn btn-primary btn-sm" onclick="mostrarModalProfesor()">
                            <i class="bi bi-plus-circle"></i>
                        </button>
                    </div>

                    <div id="listaProfesores"></div>
                </div>
            </div>
        </div>

        <!-- Modal Categoría -->
        <div class="modal fade" id="modalCategoria" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="modalCategoriaTitle">
                            <i class="bi bi-tags"></i> Nueva Categoría
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formCategoria">
                            <input type="hidden" id="categoriaId">
                            
                            <h6 class="text-primary mb-3"><i class="bi bi-info-circle"></i> Información General</h6>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Nombre *</label>
                                    <input type="text" class="form-control" id="categoriaNombre" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Deporte *</label>
                                    <select class="form-select" id="categoriaDeporte" required></select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Edad Mínima</label>
                                    <input type="number" class="form-control" id="categoriaEdadMin" min="0">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Edad Máxima</label>
                                    <input type="number" class="form-control" id="categoriaEdadMax" min="0">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Cupo Máximo</label>
                                    <input type="number" class="form-control" id="categoriaCupo" min="1" value="30">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Nivel</label>
                                    <select class="form-select" id="categoriaNivel">
                                        <option value="Principiante">Principiante</option>
                                        <option value="Intermedio">Intermedio</option>
                                        <option value="Avanzado">Avanzado</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Profesor Asignado 1</label>
                                    <select class="form-select" id="categoriaProfesor"></select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Profesor Asignado 2</label>
                                    <select class="form-select" id="categoriaProfesor2"></select>
                                </div>
                            </div>

                            <hr class="my-4">

                            <h6 class="text-primary mb-3"><i class="bi bi-clock"></i> Horarios de Entrenamiento</h6>
                            
                            <!-- Días de Entrenamiento -->
                            <div class="mb-3">
                                <label class="form-label fw-bold">Días de Entrenamiento</label>
                                <div class="row g-2">
                                    <div class="col-auto">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="diaLunes" value="Lunes">
                                            <label class="form-check-label" for="diaLunes">Lunes</label>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="diaMartes" value="Martes">
                                            <label class="form-check-label" for="diaMartes">Martes</label>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="diaMiercoles" value="Miércoles">
                                            <label class="form-check-label" for="diaMiercoles">Miércoles</label>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="diaJueves" value="Jueves">
                                            <label class="form-check-label" for="diaJueves">Jueves</label>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="diaViernes" value="Viernes">
                                            <label class="form-check-label" for="diaViernes">Viernes</label>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="diaSabado" value="Sábado">
                                            <label class="form-check-label" for="diaSabado">Sábado</label>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="diaDomingo" value="Domingo">
                                            <label class="form-check-label" for="diaDomingo">Domingo</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Turno y Horarios -->
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label fw-bold">Turno</label>
                                    <select class="form-select" id="categoriaTurno">
                                        <option value="">Seleccione un turno</option>
                                        <option value="Mañana">Mañana (06:00 - 12:00)</option>
                                        <option value="Tarde">Tarde (12:00 - 18:00)</option>
                                        <option value="Noche">Noche (18:00 - 22:00)</option>
                                    </select>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label fw-bold">Hora de Inicio</label>
                                    <input type="time" class="form-control" id="categoriaHoraInicio">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label fw-bold">Hora de Fin</label>
                                    <input type="time" class="form-control" id="categoriaHoraFin">
                                </div>
                            </div>

                            <!-- Duración y Frecuencia -->
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Duración por Sesión</label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="categoriaDuracion" min="30" step="15" placeholder="90">
                                        <span class="input-group-text">minutos</span>
                                    </div>
                                    <small class="text-muted">Duración típica de cada entrenamiento</small>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Frecuencia Semanal</label>
                                    <select class="form-select" id="categoriaFrecuencia">
                                        <option value="">Seleccione frecuencia</option>
                                        <option value="1">1 vez por semana</option>
                                        <option value="2">2 veces por semana</option>
                                        <option value="3">3 veces por semana</option>
                                        <option value="4">4 veces por semana</option>
                                        <option value="5">5 veces por semana</option>
                                        <option value="6">6 veces por semana</option>
                                        <option value="7">7 veces por semana</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarCategoria()">
                            <i class="bi bi-save"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Profesor -->
        <div class="modal fade" id="modalProfesor" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-person-badge"></i> Nuevo Profesor
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formProfesor">
                            <input type="hidden" id="profesorId">
                            <div class="mb-3">
                                <label class="form-label">Nombre Completo *</label>
                                <input type="text" class="form-control" id="profesorNombre" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Especialidad *</label>
                                <input type="text" class="form-control" id="profesorEspecialidad" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Teléfono</label>
                                <input type="tel" class="form-control" id="profesorTelefono">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="profesorEmail">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarProfesor()">
                            <i class="bi bi-save"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    await Promise.all([cargarCategorias(), cargarProfesores()]);
    buscarEnTabla('buscarCategoria', 'tablaCategorias');
}

async function cargarCategorias() {
    const empresa = getCurrentEmpresa();
    const categorias = await getDataByEmpresa('categorias', empresa.id);
    const profesores = await getDataByEmpresa('profesores', empresa.id);
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const grid = document.getElementById('categoriasGrid');

    if (categorias.length === 0) {
        grid.innerHTML = '<div class="col-12"><p class="text-center text-muted">No hay categorías registradas</p></div>';
        return;
    }

    // Colores vibrantes para las cards
    const colores = ['#FF6B35', '#F7931E', '#FDC830', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA15E'];

    grid.innerHTML = categorias.map((categoria, index) => {
        const deporte = categoria.deporte || 'Sin deporte'; // Ahora es string directo
        const profesor = profesores.find(p => p.id === categoria.profesorId);
        const alumnosCategoria = alumnos.filter(a => a.categoriaId === categoria.id && a.activo).length;

        const color = colores[index % colores.length];

        // Construir horario
        let horarioTexto = '';
        if (categoria.horarios && categoria.horarios.dias && categoria.horarios.dias.length > 0) {
            const diasAbrev = categoria.horarios.dias.map(d => {
                const abreviaturas = {
                    'Lunes': 'Lun', 'Martes': 'Mar', 'Miércoles': 'Mié',
                    'Jueves': 'Jue', 'Viernes': 'Vie', 'Sábado': 'Sáb', 'Domingo': 'Dom'
                };
                return abreviaturas[d] || d.substring(0, 3);
            });
            horarioTexto = diasAbrev.join(', ');
        } else {
            horarioTexto = 'No especificado';
        }

        // Calcular horas semanales totales
        let duracion = 'No especificado';
        if (categoria.horarios && categoria.horarios.duracion && categoria.horarios.frecuencia) {
            const minutosTotales = categoria.horarios.duracion * categoria.horarios.frecuencia;
            const horas = Math.floor(minutosTotales / 60);
            const minutos = minutosTotales % 60;

            console.log(`Categoría: ${categoria.nombre}, Duración: ${categoria.horarios.duracion} min, Frecuencia: ${categoria.horarios.frecuencia}x, Total: ${minutosTotales} min`);

            if (horas > 0 && minutos > 0) {
                duracion = `${horas} hrs. y ${minutos} min. x semana`;
            } else if (horas > 0) {
                duracion = `${horas} hrs. x semana`;
            } else {
                duracion = `${minutos} min. x semana`;
            }
        } else if (categoria.horarios && categoria.horarios.duracion) {
            duracion = `${categoria.horarios.duracion} min por sesión`;
        } else {
            console.log(`Categoría: ${categoria.nombre} - Sin datos de horarios completos`, categoria.horarios);
        }

        // Turno o frecuencia
        const frecuencia = categoria.horarios && categoria.horarios.frecuencia
            ? `${categoria.horarios.frecuencia}x semana`
            : (categoria.horarios && categoria.horarios.turno ? categoria.horarios.turno : '');

        // Fecha de inicio (simulada)
        const fechaInicio = categoria.fechaCreacion ? new Date(categoria.fechaCreacion).toLocaleDateString('es-PE') : '01/01/2026';

        return `
            <div class="col-md-6 col-lg-4 categoria-card-item">
                <div class="card categoria-card shadow-sm" style="border: 3px solid ${color}; border-radius: 12px; overflow: hidden;">
                    <!-- Header con color -->
                    <div class="card-header text-white text-center py-3" style="background: ${color}; border: none;">
                        <h5 class="mb-1 fw-bold">${categoria.nombre}</h5>
                        ${frecuencia ? `<span class="badge bg-white text-dark px-3 py-1" style="font-size: 0.85rem;"><i class="bi bi-calendar-week"></i> ${frecuencia}</span>` : ''}
                    </div>
                    
                    <!-- Body -->
                    <div class="card-body p-3" style="background: #fff;">
                        <div class="row mb-2">
                            <div class="col-6">
                                <small class="text-muted d-block"><i class="bi bi-hourglass-split"></i> Duración</small>
                                <strong>${duracion}</strong>
                            </div>
                            <div class="col-6 text-end">
                                <small class="text-muted d-block"><i class="bi bi-people-fill"></i> Alumnos</small>
                                <strong>${alumnosCategoria}</strong>
                            </div>
                        </div>
                        
                        <div class="mb-2">
                            <h4 class="mb-0" style="color: ${color}; font-weight: 700;">S/ 30.00</h4>
                            <small class="text-muted">Fecha inicio: ${fechaInicio}</small>
                        </div>
                        
                        <div class="mb-2">
                            <small class="text-primary"><i class="bi bi-clock"></i> <strong>Horario:</strong> ${horarioTexto}</small>
                        </div>
                        
                        <!-- Botones de acción -->
                        <div class="d-flex gap-2 mt-3">
                            <button class="btn btn-sm btn-outline-primary flex-fill" onclick="verDetalleCategoria(${categoria.id})" title="Ver detalles">
                                <i class="bi bi-eye"></i> Ver
                            </button>
                            <button class="btn btn-primary flex-fill" onclick="editarCategoria(${categoria.id})" title="Editar">
                                <i class="bi bi-pencil"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarCategoria(${categoria.id})" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function cargarProfesores() {
    const empresa = getCurrentEmpresa();
    const profesores = await getDataByEmpresa('profesores', empresa.id);
    const container = document.getElementById('listaProfesores');

    if (profesores.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No hay profesores registrados</p>';
        return;
    }

    container.innerHTML = profesores.map(profesor => `
        <div class="card mb-2">
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <strong>${profesor.nombre}</strong>
                        <br>
                        <small class="text-muted">${profesor.especialidad}</small>
                    </div>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProfesor(${profesor.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function mostrarModalCategoria() {
    document.getElementById('formCategoria').reset();
    document.getElementById('categoriaId').value = '';
    document.getElementById('modalCategoriaTitle').innerHTML = '<i class="bi bi-tags"></i> Nueva Categoría';

    const empresa = getCurrentEmpresa();

    // Obtener deportes desde configuración
    const deportes = await getDeportesFromConfig();
    const selectDeporte = document.getElementById('categoriaDeporte');

    // Generar opciones de deportes
    selectDeporte.innerHTML = deportes.map(d => `<option value="${d}">${d}</option>`).join('');

    // Seleccionar "Futbol" por defecto si existe
    const futbol = deportes.find(d => d.toLowerCase() === 'futbol' || d.toLowerCase() === 'fútbol');
    if (futbol) {
        selectDeporte.value = futbol;
    }

    // Asegurar que el selector esté habilitado
    selectDeporte.disabled = false;

    const profesores = await getDataByEmpresa('profesores', empresa.id);
    const selectProfesor = document.getElementById('categoriaProfesor');
    selectProfesor.innerHTML = '<option value="">Sin asignar</option>' +
        profesores.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');

    const selectProfesor2 = document.getElementById('categoriaProfesor2');
    selectProfesor2.innerHTML = '<option value="">Sin asignar</option>' +
        profesores.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');

    const modal = new bootstrap.Modal(document.getElementById('modalCategoria'));
    modal.show();
}

async function guardarCategoria() {
    const id = document.getElementById('categoriaId').value;
    const nombre = document.getElementById('categoriaNombre').value.trim();
    const deporte = document.getElementById('categoriaDeporte').value; // Ahora es string
    const edadMinima = parseInt(document.getElementById('categoriaEdadMin').value) || 0;
    const edadMaxima = parseInt(document.getElementById('categoriaEdadMax').value) || 100;
    const cupoMaximo = parseInt(document.getElementById('categoriaCupo').value) || 30;
    const nivel = document.getElementById('categoriaNivel').value;
    const profesorId = document.getElementById('categoriaProfesor').value ? parseInt(document.getElementById('categoriaProfesor').value) : null;
    const profesorId2 = document.getElementById('categoriaProfesor2').value ? parseInt(document.getElementById('categoriaProfesor2').value) : null;

    // Capturar días de entrenamiento
    const dias = [];
    const diasCheckboxes = ['diaLunes', 'diaMartes', 'diaMiercoles', 'diaJueves', 'diaViernes', 'diaSabado', 'diaDomingo'];
    diasCheckboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            dias.push(checkbox.value);
        }
    });

    // Capturar horarios
    const turno = document.getElementById('categoriaTurno').value;
    const horaInicio = document.getElementById('categoriaHoraInicio').value;
    const horaFin = document.getElementById('categoriaHoraFin').value;
    const duracion = parseInt(document.getElementById('categoriaDuracion').value) || null;
    const frecuencia = parseInt(document.getElementById('categoriaFrecuencia').value) || null;

    if (!nombre || !deporte) {
        mostrarAlerta('Complete todos los campos obligatorios', 'warning');
        return;
    }

    const empresa = getCurrentEmpresa();
    const categoriaData = {
        empresaId: empresa.id,
        nombre,
        deporte, // Guardar como string
        edadMinima,
        edadMaxima,
        cupoMaximo,
        nivel,
        profesorId,
        profesorId2,
        // Datos de horarios
        horarios: {
            dias: dias,
            turno: turno,
            horaInicio: horaInicio,
            horaFin: horaFin,
            duracion: duracion,
            frecuencia: frecuencia
        },
        fechaCreacion: new Date().toISOString()
    };

    try {
        if (id) {
            categoriaData.id = parseInt(id);
            await updateData('categorias', categoriaData);
            mostrarAlerta('Categoría actualizada correctamente', 'success');
        } else {
            await addData('categorias', categoriaData);
            mostrarAlerta('Categoría creada correctamente', 'success');
        }

        const modalEl = document.getElementById('modalCategoria');
        const modal = bootstrap.Modal.getInstance(modalEl);
        document.activeElement.blur();
        modalEl.addEventListener('hidden.bs.modal', async () => {
            await cargarCategorias();
        }, { once: true });
        modal.hide();
    } catch (error) {
        console.error('Error al guardar categoría:', error);
        mostrarAlerta('Error al guardar la categoría', 'danger');
    }
}

async function editarCategoria(id) {
    const categoria = await getData('categorias', id);

    await mostrarModalCategoria();

    document.getElementById('modalCategoriaTitle').innerHTML = '<i class="bi bi-tags"></i> Editar Categoría';

    document.getElementById('categoriaId').value = categoria.id;
    document.getElementById('categoriaNombre').value = categoria.nombre;
    document.getElementById('categoriaEdadMin').value = categoria.edadMinima || 0;
    document.getElementById('categoriaEdadMax').value = categoria.edadMaxima || 100;
    document.getElementById('categoriaCupo').value = categoria.cupoMaximo;
    document.getElementById('categoriaNivel').value = categoria.nivel;

    document.getElementById('categoriaDeporte').value = categoria.deporte || 'Futbol'; // Ahora es string
    if (categoria.profesorId) {
        document.getElementById('categoriaProfesor').value = categoria.profesorId;
    }
    if (categoria.profesorId2) {
        document.getElementById('categoriaProfesor2').value = categoria.profesorId2;
    }

    // Cargar datos de horarios si existen
    if (categoria.horarios) {
        // Marcar días de entrenamiento
        if (categoria.horarios.dias && Array.isArray(categoria.horarios.dias)) {
            const diasCheckboxes = ['diaLunes', 'diaMartes', 'diaMiercoles', 'diaJueves', 'diaViernes', 'diaSabado', 'diaDomingo'];
            diasCheckboxes.forEach(checkboxId => {
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    checkbox.checked = categoria.horarios.dias.includes(checkbox.value);
                }
            });
        }

        // Cargar turno y horarios
        if (categoria.horarios.turno) {
            document.getElementById('categoriaTurno').value = categoria.horarios.turno;
        }
        if (categoria.horarios.horaInicio) {
            document.getElementById('categoriaHoraInicio').value = categoria.horarios.horaInicio;
        }
        if (categoria.horarios.horaFin) {
            document.getElementById('categoriaHoraFin').value = categoria.horarios.horaFin;
        }
        if (categoria.horarios.duracion) {
            document.getElementById('categoriaDuracion').value = categoria.horarios.duracion;
        }
        if (categoria.horarios.frecuencia) {
            document.getElementById('categoriaFrecuencia').value = categoria.horarios.frecuencia;
        }
    }
}

async function eliminarCategoria(id) {
    const confirmar = await confirmarAccion('¿Está seguro de eliminar esta categoría?');
    if (!confirmar) return;

    try {
        await deleteData('categorias', id);
        mostrarAlerta('Categoría eliminada correctamente', 'success');
        await cargarCategorias();
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        mostrarAlerta('Error al eliminar la categoría', 'danger');
    }
}

function mostrarModalProfesor() {
    document.getElementById('formProfesor').reset();
    document.getElementById('profesorId').value = '';

    const modal = new bootstrap.Modal(document.getElementById('modalProfesor'));
    modal.show();
}

async function guardarProfesor() {
    const id = document.getElementById('profesorId').value;
    const nombre = document.getElementById('profesorNombre').value.trim();
    const especialidad = document.getElementById('profesorEspecialidad').value.trim();
    const telefono = document.getElementById('profesorTelefono').value.trim();
    const email = document.getElementById('profesorEmail').value.trim();

    if (!nombre || !especialidad) {
        mostrarAlerta('Complete todos los campos obligatorios', 'warning');
        return;
    }

    const empresa = getCurrentEmpresa();
    const profesorData = {
        empresaId: empresa.id,
        nombre,
        especialidad,
        telefono,
        email,
        fechaCreacion: new Date().toISOString()
    };

    try {
        if (id) {
            profesorData.id = parseInt(id);
            await updateData('profesores', profesorData);
        } else {
            await addData('profesores', profesorData);
        }

        const modalEl = document.getElementById('modalProfesor');
        const modal = bootstrap.Modal.getInstance(modalEl);
        document.activeElement.blur();
        modalEl.addEventListener('hidden.bs.modal', async () => {
            mostrarAlerta('Profesor guardado correctamente', 'success');
            await Promise.all([cargarProfesores(), cargarCategorias()]);
        }, { once: true });
        modal.hide();
    } catch (error) {
        console.error('Error al guardar profesor:', error);
        mostrarAlerta('Error al guardar el profesor', 'danger');
    }
}

async function eliminarProfesor(id) {
    const confirmar = await confirmarAccion('¿Está seguro de eliminar este profesor?');
    if (!confirmar) return;

    try {
        await deleteData('profesores', id);
        mostrarAlerta('Profesor eliminado correctamente', 'success');
        await Promise.all([cargarProfesores(), cargarCategorias()]);
    } catch (error) {
        console.error('Error al eliminar profesor:', error);
        mostrarAlerta('Error al eliminar el profesor', 'danger');
    }
}
