// modules/evaluaciones.js - Módulo de Evaluaciones Deportivas
let chartFisica, chartTecnica, chartTactica, chartPsicologica;
let alumnoSeleccionado = null;

async function renderEvaluaciones() {
    const container = document.getElementById('contentContainer');

    container.innerHTML = `
        <div class="evaluaciones-container">
            <!-- Header con selector de alumno -->
            <div class="module-card mb-4">
                <div class="module-header">
                    <h4 style="font-family: 'Inter', sans-serif; font-weight: 700;"><i class="bi bi-clipboard-check"></i> Sistema de Evaluaciones Deportivas</h4>
                    <div class="header-actions">
                        <select class="form-select" id="selectAlumnoEval">
                            <option value="">Seleccione un alumno...</option>
                        </select>
                        <button class="btn btn-info" onclick="mostrarModalAntropometricos()" id="btnAntropometricos" disabled>
                            <i class="bi bi-person-badge"></i> Datos Antropométricos
                        </button>
                        <button class="btn btn-dark" onclick="new bootstrap.Modal(document.getElementById('modalLeyenda')).show()">
                            <i class="bi bi-info-circle"></i> Leyenda
                        </button>
                    </div>
                </div>
            </div>

            <!-- Panel de Datos Antropométricos -->
            <div id="panelAntropometricos" style="display: none;">
                <div class="row mb-4">
                    <div class="col-md-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-info text-white">
                                <h5 class="mb-0"><i class="bi bi-body-text"></i> Datos Antropométricos del Alumno</h5>
                            </div>
                            <div class="card-body">
                                <div id="datosAntropometricosContent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Menú de tipos de evaluaciones -->
            <div id="menuEvaluaciones" style="display: none;">
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <div class="eval-card eval-fisica" onclick="mostrarModalEvaluacion('fisica')">
                            <div class="eval-icon">🏃</div>
                            <h5>Evaluación Física</h5>
                            <p>Resistencia, velocidad, agilidad, fuerza y flexibilidad</p>
                            <button class="btn btn-primary btn-sm">
                                <i class="bi bi-plus-circle"></i> Nueva Evaluación
                            </button>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="eval-card eval-tecnica" onclick="mostrarModalEvaluacion('tecnica')">
                            <div class="eval-icon">⚽</div>
                            <h5>Evaluación Técnica</h5>
                            <p>Control, pases, dominio, tiros y recepción</p>
                            <button class="btn btn-success btn-sm">
                                <i class="bi bi-plus-circle"></i> Nueva Evaluación
                            </button>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="eval-card eval-tactica" onclick="mostrarModalEvaluacion('tactica')">
                            <div class="eval-icon">🧠</div>
                            <h5>Evaluación Táctica</h5>
                            <p>Decisiones, posicionamiento y visión de juego</p>
                            <button class="btn btn-warning btn-sm">
                                <i class="bi bi-plus-circle"></i> Nueva Evaluación
                            </button>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="eval-card eval-psicologica" onclick="mostrarModalEvaluacion('psicologica')">
                            <div class="eval-icon">💡</div>
                            <h5>Evaluación Psicológica</h5>
                            <p>Motivación, concentración y liderazgo</p>
                            <button class="btn btn-danger btn-sm">
                                <i class="bi bi-plus-circle"></i> Nueva Evaluación
                            </button>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="eval-card eval-medica" onclick="mostrarModalEvaluacion('medica')">
                            <div class="eval-icon">📊</div>
                            <h5>Historial Médico</h5>
                            <p>Chequeos, lesiones y estado nutricional</p>
                            <button class="btn btn-secondary btn-sm">
                                <i class="bi bi-plus-circle"></i> Nuevo Registro
                            </button>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="eval-card eval-progreso" onclick="mostrarProgreso()">
                            <div class="eval-icon">📈</div>
                            <h5>Progreso y Reportes</h5>
                            <p>Gráficas y análisis de evolución</p>
                            <button class="btn btn-info btn-sm">
                                <i class="bi bi-graph-up"></i> Ver Progreso
                            </button>
                        </div>
                    </div>
                </div>
                

                
                <!-- Historial de Evaluaciones -->
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0"><i class="bi bi-clock-history"></i> Historial de Evaluaciones</h5>
                    </div>
                    <div class="card-body">
                        <!-- Filtros de Búsqueda -->
                        <div class="row g-3 mb-4">
                            <div class="col-md-4">
                                <select id="filtroTipoEvaluacion" class="form-select">
                                    <option value="">Todos los tipos</option>
                                    <option value="fisica">🏃 Física</option>
                                    <option value="tecnica">⚽ Técnica</option>
                                    <option value="tactica">🧠 Táctica</option>
                                    <option value="psicologica">💡 Psicológica</option>
                                    <option value="medica">📊 Médica</option>
                                </select>
                            </div>
                            <div class="col-md-8">
                                <div class="input-group">
                                    <span class="input-group-text">Desde</span>
                                    <input type="date" id="fechaDesdeEvaluacion" class="form-control">
                                    <span class="input-group-text">Hasta</span>
                                    <input type="date" id="fechaHastaEvaluacion" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Tipo</th>
                                        <th>Nombre</th>
                                        <th>Nota del Entrenador</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="historialEvaluaciones"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        ${generarModales()}
    `;

    // Esperar a que el DOM esté listo antes de cargar alumnos
    setTimeout(async () => {
        await cargarAlumnosEvaluaciones();
        configurarEventos();
    }, 100);
}

// Cargar alumnos en el selector
async function cargarAlumnosEvaluaciones() {
    try {
        const empresa = getCurrentEmpresa();
        if (!empresa) {
            console.error('No hay empresa activa');
            return;
        }

        const select = document.getElementById('selectAlumnoEval');
        if (!select) {
            console.error('No se encontró el elemento selectAlumnoEval');
            return;
        }

        const alumnos = await getDataByEmpresa('alumnos', empresa.id);
        console.log('Alumnos encontrados:', alumnos.length);

        select.innerHTML = '<option value="">Seleccione un alumno...</option>';

        if (alumnos.length === 0) {
            select.innerHTML += '<option value="" disabled>No hay alumnos registrados</option>';
            console.warn('No hay alumnos registrados. Ejecuta generarDatosPruebaEvaluaciones() en la consola.');
            return;
        }

        // Mostrar estructura del primer alumno para depuración
        console.log('Estructura del primer alumno:', alumnos[0]);

        alumnos.forEach((alumno, index) => {
            // Intentar diferentes combinaciones de campos
            let nombreCompleto = '';

            if (alumno.nombre && alumno.apellido) {
                nombreCompleto = `${alumno.nombre} ${alumno.apellido}`;
            } else if (alumno.nombres && alumno.apellidos) {
                nombreCompleto = `${alumno.nombres} ${alumno.apellidos}`;
            } else if (alumno.nombre) {
                nombreCompleto = alumno.nombre;
            } else if (alumno.nombres) {
                nombreCompleto = alumno.nombres;
            } else if (alumno.nombreCompleto) {
                nombreCompleto = alumno.nombreCompleto;
            } else {
                nombreCompleto = `Alumno ${index + 1} (ID: ${alumno.id})`;
            }

            select.innerHTML += `<option value="${alumno.id}">${nombreCompleto}</option>`;
            console.log(`Alumno ${index + 1}:`, nombreCompleto, '- ID:', alumno.id);
        });

        console.log('✅ Selector de alumnos cargado correctamente con', alumnos.length, 'alumnos');
    } catch (error) {
        console.error('Error al cargar alumnos:', error);
    }
}

// Configurar eventos
function configurarEventos() {
    const select = document.getElementById('selectAlumnoEval');
    select.addEventListener('change', async (e) => {
        const alumnoId = parseInt(e.target.value);
        if (alumnoId) {
            alumnoSeleccionado = await getData('alumnos', alumnoId);
            document.getElementById('menuEvaluaciones').style.display = 'block';
            document.getElementById('btnAntropometricos').disabled = false;
            await cargarDatosAntropometricos();
            await cargarHistorialEvaluaciones();
        } else {
            document.getElementById('menuEvaluaciones').style.display = 'none';
            document.getElementById('panelAntropometricos').style.display = 'none';
            document.getElementById('btnAntropometricos').disabled = true;
        }
    });

    // Eventos de filtros
    const filtros = ['filtroTipoEvaluacion', 'fechaDesdeEvaluacion', 'fechaHastaEvaluacion'];
    filtros.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('input', cargarHistorialEvaluaciones);
        }
    });
}


// Cargar datos antropométricos
async function cargarDatosAntropometricos() {
    const empresa = getCurrentEmpresa();
    const datos = await getAllData('datos_antropometricos');
    const datosAlumno = datos.filter(d => d.alumnoId === alumnoSeleccionado.id && d.empresaId === empresa.id)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];

    const panel = document.getElementById('panelAntropometricos');
    const content = document.getElementById('datosAntropometricosContent');

    if (datosAlumno) {
        panel.style.display = 'block';
        const imc = datosAlumno.imc || (datosAlumno.peso / Math.pow(datosAlumno.talla / 100, 2)).toFixed(2);
        content.innerHTML = `
            <div class="row g-3">
                <div class="col-md-2">
                    <div class="antropometrico-card">
                        <i class="bi bi-arrows-vertical text-primary"></i>
                        <h6>Talla</h6>
                        <h4>${datosAlumno.talla} cm</h4>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="antropometrico-card">
                        <i class="bi bi-speedometer text-success"></i>
                        <h6>Peso</h6>
                        <h4>${datosAlumno.peso} kg</h4>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="antropometrico-card">
                        <i class="bi bi-calculator text-warning"></i>
                        <h6>IMC</h6>
                        <h4>${imc}</h4>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="antropometrico-card">
                        <i class="bi bi-percent text-danger"></i>
                        <h6>% Grasa</h6>
                        <h4>${datosAlumno.porcentajeGrasa || '-'}%</h4>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="antropometrico-card">
                        <i class="bi bi-calendar-event text-info"></i>
                        <h6>Última Actualización</h6>
                        <h4>${formatearFecha(datosAlumno.fecha)}</h4>
                    </div>
                </div>
            </div>
        `;
    } else {
        panel.style.display = 'block';
        content.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i> 
                No hay datos antropométricos registrados. 
                <button class="btn btn-sm btn-warning ms-2" onclick="mostrarModalAntropometricos()">
                    Registrar ahora
                </button>
            </div>
        `;
    }
}

// Cargar historial de evaluaciones
async function cargarHistorialEvaluaciones() {
    try {
        const empresa = getCurrentEmpresa();
        console.log('📊 Cargando historial de evaluaciones...');
        console.log('   Empresa:', empresa.id);
        console.log('   Alumno seleccionado:', alumnoSeleccionado);

        const evaluaciones = await getAllData('evaluaciones_deportivas');
        console.log('   Total evaluaciones en BD:', evaluaciones.length);

        // Obtener valores de filtros
        const tipo = document.getElementById('filtroTipoEvaluacion')?.value || '';
        const fechaDesde = document.getElementById('fechaDesdeEvaluacion')?.value;
        const fechaHasta = document.getElementById('fechaHastaEvaluacion')?.value;

        let evalAlumno = evaluaciones.filter(e => e.alumnoId === alumnoSeleccionado.id && e.empresaId === empresa.id);

        // Aplicar filtros
        if (tipo) {
            evalAlumno = evalAlumno.filter(e => e.tipo === tipo);
        }

        if (fechaDesde) {
            evalAlumno = evalAlumno.filter(e => e.fecha >= fechaDesde);
        }

        if (fechaHasta) {
            evalAlumno = evalAlumno.filter(e => e.fecha <= fechaHasta);
        }

        // Ordenar por fecha descendente
        evalAlumno.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        console.log('   Evaluaciones filtradas:', evalAlumno.length);

        const tbody = document.getElementById('historialEvaluaciones');

        if (evalAlumno.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay evaluaciones registradas</td></tr>';
            console.warn('⚠️ No se encontraron evaluaciones para este alumno');
            return;
        }

        tbody.innerHTML = evalAlumno.map(evaluacion => {
            const tipoLabel = {
                'fisica': '<span class="badge" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">🏃 Física</span>',
                'tecnica': '<span class="badge" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">⚽ Técnica</span>',
                'tactica': '<span class="badge" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">🧠 Táctica</span>',
                'psicologica': '<span class="badge" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">💡 Psicológica</span>',
                'medica': '<span class="badge" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">📊 Médica</span>'
            };

            return `
            <tr>
                <td>${formatearFecha(evaluacion.fecha)}</td>
                <td>${tipoLabel[evaluacion.tipo]}</td>
                <td><strong>${evaluacion.nombre}</strong></td>
                <td>${evaluacion.notasEntrenador || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verDetalleEvaluacion(${evaluacion.id})">
                        <i class="bi bi-eye"></i> Ver
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarEvaluacion(${evaluacion.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        }).join('');

        console.log('✅ Historial de evaluaciones cargado');
    } catch (error) {
        console.error('❌ Error al cargar historial:', error);
    }
}

// Mostrar modal según tipo de evaluación
async function mostrarModalEvaluacion(tipo) {
    if (!alumnoSeleccionado) {
        mostrarAlerta('Seleccione un alumno primero', 'warning');
        return;
    }

    // Obtener evaluaciones existentes del alumno para calcular el número correlativo
    const empresa = getCurrentEmpresa();
    const evaluaciones = await getDataByEmpresa('evaluaciones', empresa.id);
    const evaluacionesAlumno = evaluaciones.filter(e => e.alumnoId === alumnoSeleccionado && e.tipo === tipo);
    const numeroCorrelativo = evaluacionesAlumno.length + 1;

    // Nombres de tipos de evaluación
    const tiposNombres = {
        'fisica': 'Física',
        'tecnica': 'Técnica',
        'tactica': 'Táctica',
        'psicologica': 'Psicológica',
        'medica': 'Médica'
    };

    const tipoNombre = tiposNombres[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1);
    const tituloEvaluacion = `Evaluación ${tipoNombre} Nro ${numeroCorrelativo}`;

    const modalId = `modal${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
    const modal = new bootstrap.Modal(document.getElementById(modalId));

    // Limpiar formulario
    const form = document.getElementById(`form${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    if (form) form.reset();

    // Actualizar título del modal
    const modalElement = document.getElementById(modalId);
    const modalTitle = modalElement.querySelector('.modal-title');
    if (modalTitle) {
        const icon = modalTitle.querySelector('i');
        const emoji = modalTitle.textContent.match(/[🏃⚽🧠💡📊]/)?.[0] || '';
        if (icon) {
            modalTitle.innerHTML = `${icon.outerHTML} ${emoji} ${tituloEvaluacion}`;
        } else {
            modalTitle.textContent = `${emoji} ${tituloEvaluacion}`;
        }
    }

    // Establecer nombre de evaluación automáticamente
    const nombreInput = form.querySelector('input[id^="nombreEval"]');
    if (nombreInput) {
        nombreInput.value = tituloEvaluacion;
        nombreInput.readOnly = true;
        nombreInput.style.backgroundColor = '#e9ecef';
        nombreInput.style.cursor = 'not-allowed';
    }

    // Establecer fecha actual
    const fechaInput = form.querySelector('input[type="date"]');
    if (fechaInput) fechaInput.value = getFechaActual();

    // Configurar cálculo automático de IMC para Evaluación Física
    if (tipo === 'fisica') {
        const pesoEval = document.getElementById('pesoEval');
        const tallaEval = document.getElementById('tallaEval');
        const imcEval = document.getElementById('imcEval');

        if (pesoEval && tallaEval && imcEval) {
            const calcularIMC = () => {
                const peso = parseFloat(pesoEval.value);
                const talla = parseFloat(tallaEval.value);

                if (peso && talla && talla > 0) {
                    const imc = peso / Math.pow(talla / 100, 2);
                    imcEval.value = imc.toFixed(2);
                    imcEval.style.backgroundColor = '#e9ecef';
                } else {
                    imcEval.value = '';
                    imcEval.style.backgroundColor = '#e9ecef';
                }
            };

            pesoEval.addEventListener('input', calcularIMC);
            tallaEval.addEventListener('input', calcularIMC);
        }
    }

    modal.show();
}

// Guardar evaluación física
async function guardarEvaluacionFisica() {
    const empresa = getCurrentEmpresa();

    const evaluacion = {
        empresaId: empresa.id,
        alumnoId: alumnoSeleccionado.id,
        tipo: 'fisica',
        nombre: document.getElementById('nombreEvalFisica').value,
        fecha: document.getElementById('fechaEvalFisica').value,
        datos: {
            // Resistencia
            testCooper: parseFloat(document.getElementById('testCooper').value) || null,
            yoyoTest: parseInt(document.getElementById('yoyoTest').value) || null,
            // Velocidad
            sprint10m: parseFloat(document.getElementById('sprint10m').value) || null,
            sprint20m: parseFloat(document.getElementById('sprint20m').value) || null,
            sprint30m: parseFloat(document.getElementById('sprint30m').value) || null,
            // Agilidad
            testIllinois: parseFloat(document.getElementById('testIllinois').value) || null,
            // Fuerza
            saltoVertical: parseFloat(document.getElementById('saltoVertical').value) || null,
            saltoHorizontal: parseFloat(document.getElementById('saltoHorizontal').value) || null,
            // Flexibilidad
            sitAndReach: parseFloat(document.getElementById('sitAndReach').value) || null,
            // Composición corporal
            peso: parseFloat(document.getElementById('pesoEval').value) || null,
            talla: parseFloat(document.getElementById('tallaEval').value) || null,
            imc: parseFloat(document.getElementById('imcEval').value) || null,
            porcentajeGrasa: parseFloat(document.getElementById('grasaEval').value) || null
        },
        notasEntrenador: document.getElementById('notasFisica').value,
        fechaCreacion: new Date().toISOString()
    };

    try {
        await addData('evaluaciones_deportivas', evaluacion);
        mostrarAlerta('Evaluación física guardada correctamente', 'success');

        const modalEl = document.getElementById('modalFisica');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        await cargarHistorialEvaluaciones();
    } catch (error) {
        console.error('Error al guardar evaluación:', error);
        mostrarAlerta('Error al guardar la evaluación', 'danger');
    }
}

// Guardar evaluación técnica
async function guardarEvaluacionTecnica() {
    const empresa = getCurrentEmpresa();

    const evaluacion = {
        empresaId: empresa.id,
        alumnoId: alumnoSeleccionado.id,
        tipo: 'tecnica',
        nombre: document.getElementById('nombreEvalTecnica').value,
        fecha: document.getElementById('fechaEvalTecnica').value,
        datos: {
            controlConduccion: parseFloat(document.getElementById('controlConduccion').value) || null,
            pasesCorto: parseInt(document.getElementById('pasesCorto').value) || null,
            pasesLargo: parseInt(document.getElementById('pasesLargo').value) || null,
            dominioBalon: parseInt(document.getElementById('dominioBalon').value) || null,
            potenciaTiro: parseFloat(document.getElementById('potenciaTiro').value) || null,
            precisionTiro: parseInt(document.getElementById('precisionTiro').value) || null,
            recepcionOrientacion: parseInt(document.getElementById('recepcionOrientacion').value) || null
        },
        notasEntrenador: document.getElementById('notasTecnica').value,
        fechaCreacion: new Date().toISOString()
    };

    try {
        await addData('evaluaciones_deportivas', evaluacion);
        mostrarAlerta('Evaluación técnica guardada correctamente', 'success');

        const modalEl = document.getElementById('modalTecnica');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        await cargarHistorialEvaluaciones();
    } catch (error) {
        console.error('Error al guardar evaluación:', error);
        mostrarAlerta('Error al guardar la evaluación', 'danger');
    }
}

// Guardar evaluación táctica
async function guardarEvaluacionTactica() {
    const empresa = getCurrentEmpresa();

    const evaluacion = {
        empresaId: empresa.id,
        alumnoId: alumnoSeleccionado.id,
        tipo: 'tactica',
        nombre: document.getElementById('nombreEvalTactica').value,
        fecha: document.getElementById('fechaEvalTactica').value,
        datos: {
            tomaDecisiones: parseInt(document.getElementById('tomaDecisiones').value) || null,
            posicionamiento: parseInt(document.getElementById('posicionamiento').value) || null,
            visionJuego: parseInt(document.getElementById('visionJuego').value) || null,
            trabajoEquipo: parseInt(document.getElementById('trabajoEquipo').value) || null
        },
        notasEntrenador: document.getElementById('notasTactica').value,
        fechaCreacion: new Date().toISOString()
    };

    try {
        await addData('evaluaciones_deportivas', evaluacion);
        mostrarAlerta('Evaluación táctica guardada correctamente', 'success');

        const modalEl = document.getElementById('modalTactica');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        await cargarHistorialEvaluaciones();
    } catch (error) {
        console.error('Error al guardar evaluación:', error);
        mostrarAlerta('Error al guardar la evaluación', 'danger');
    }
}

// Guardar evaluación psicológica
async function guardarEvaluacionPsicologica() {
    const empresa = getCurrentEmpresa();

    const evaluacion = {
        empresaId: empresa.id,
        alumnoId: alumnoSeleccionado.id,
        tipo: 'psicologica',
        nombre: document.getElementById('nombreEvalPsicologica').value,
        fecha: document.getElementById('fechaEvalPsicologica').value,
        datos: {
            motivacion: parseInt(document.getElementById('motivacion').value) || null,
            concentracion: parseInt(document.getElementById('concentracion').value) || null,
            resiliencia: parseInt(document.getElementById('resiliencia').value) || null,
            liderazgo: parseInt(document.getElementById('liderazgo').value) || null,
            convivencia: parseInt(document.getElementById('convivencia').value) || null
        },
        notasEntrenador: document.getElementById('notasPsicologica').value,
        fechaCreacion: new Date().toISOString()
    };

    try {
        await addData('evaluaciones_deportivas', evaluacion);
        mostrarAlerta('Evaluación psicológica guardada correctamente', 'success');

        const modalEl = document.getElementById('modalPsicologica');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        await cargarHistorialEvaluaciones();
    } catch (error) {
        console.error('Error al guardar evaluación:', error);
        mostrarAlerta('Error al guardar la evaluación', 'danger');
    }
}

// Guardar historial médico
async function guardarHistorialMedico() {
    const empresa = getCurrentEmpresa();

    const evaluacion = {
        empresaId: empresa.id,
        alumnoId: alumnoSeleccionado.id,
        tipo: 'medica',
        nombre: document.getElementById('nombreEvalMedica').value,
        fecha: document.getElementById('fechaEvalMedica').value,
        datos: {
            chequeoMedico: document.getElementById('chequeoMedico').value,
            lesiones: document.getElementById('lesiones').value,
            estadoNutricional: document.getElementById('estadoNutricional').value,
            observaciones: document.getElementById('observacionesMedicas').value
        },
        notasEntrenador: document.getElementById('notasMedica').value,
        fechaCreacion: new Date().toISOString()
    };

    try {
        await addData('evaluaciones_deportivas', evaluacion);
        mostrarAlerta('Historial médico guardado correctamente', 'success');

        const modalEl = document.getElementById('modalMedica');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        await cargarHistorialEvaluaciones();
    } catch (error) {
        console.error('Error al guardar historial:', error);
        mostrarAlerta('Error al guardar el historial médico', 'danger');
    }
}

// Mostrar modal de datos antropométricos
function mostrarModalAntropometricos() {
    if (!alumnoSeleccionado) {
        mostrarAlerta('Seleccione un alumno primero', 'warning');
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('modalAntropometricos'));
    document.getElementById('formAntropometricos').reset();
    document.getElementById('fechaAntropometricos').value = getFechaActual();

    // Calcular IMC automáticamente
    const peso = document.getElementById('pesoAntro');
    const talla = document.getElementById('tallaAntro');
    const imc = document.getElementById('imcAntro');

    const calcularIMC = () => {
        if (peso.value && talla.value) {
            const imcValue = (peso.value / Math.pow(talla.value / 100, 2)).toFixed(2);
            imc.value = imcValue;
        }
    };

    peso.addEventListener('input', calcularIMC);
    talla.addEventListener('input', calcularIMC);

    modal.show();
}

// Guardar datos antropométricos
async function guardarDatosAntropometricos() {
    const empresa = getCurrentEmpresa();

    const datos = {
        empresaId: empresa.id,
        alumnoId: alumnoSeleccionado.id,
        fecha: document.getElementById('fechaAntropometricos').value,
        peso: parseFloat(document.getElementById('pesoAntro').value),
        talla: parseFloat(document.getElementById('tallaAntro').value),
        imc: parseFloat(document.getElementById('imcAntro').value),
        porcentajeGrasa: parseFloat(document.getElementById('grasaAntro').value) || null,
        observaciones: document.getElementById('observacionesAntro').value,
        fechaCreacion: new Date().toISOString()
    };

    try {
        await addData('datos_antropometricos', datos);
        mostrarAlerta('Datos antropométricos guardados correctamente', 'success');

        const modalEl = document.getElementById('modalAntropometricos');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        await cargarDatosAntropometricos();
    } catch (error) {
        console.error('Error al guardar datos:', error);
        mostrarAlerta('Error al guardar los datos antropométricos', 'danger');
    }
}

// Editar datos antropométricos existentes
async function editarDatosAntropometricos(id) {
    if (!alumnoSeleccionado) {
        mostrarAlerta('Seleccione un alumno primero', 'warning');
        return;
    }

    const datos = await getData('datos_antropometricos', id);

    if (!datos) {
        mostrarAlerta('No se encontraron los datos', 'danger');
        return;
    }

    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById('modalAntropometricos'));

    // Cargar datos en el formulario
    document.getElementById('fechaAntropometricos').value = datos.fecha;
    document.getElementById('pesoAntro').value = datos.peso;
    document.getElementById('tallaAntro').value = datos.talla;
    document.getElementById('imcAntro').value = datos.imc;
    document.getElementById('grasaAntro').value = datos.porcentajeGrasa || '';
    document.getElementById('observacionesAntro').value = datos.observaciones || '';

    // Configurar cálculo automático de IMC
    const pesoAntro = document.getElementById('pesoAntro');
    const tallaAntro = document.getElementById('tallaAntro');
    const imcAntro = document.getElementById('imcAntro');

    const calcularIMC = () => {
        if (pesoAntro.value && tallaAntro.value) {
            const imcValue = (pesoAntro.value / Math.pow(tallaAntro.value / 100, 2)).toFixed(2);
            imcAntro.value = imcValue;
        }
    };

    pesoAntro.addEventListener('input', calcularIMC);
    tallaAntro.addEventListener('input', calcularIMC);

    // Modificar el botón de guardar para actualizar en lugar de crear
    const btnGuardar = document.querySelector('#modalAntropometricos .btn-info');
    if (btnGuardar) {
        btnGuardar.onclick = async function () {
            const empresa = getCurrentEmpresa();

            const datosActualizados = {
                id: datos.id,
                empresaId: empresa.id,
                alumnoId: alumnoSeleccionado.id,
                fecha: document.getElementById('fechaAntropometricos').value,
                peso: parseFloat(document.getElementById('pesoAntro').value),
                talla: parseFloat(document.getElementById('tallaAntro').value),
                imc: parseFloat(document.getElementById('imcAntro').value),
                porcentajeGrasa: parseFloat(document.getElementById('grasaAntro').value) || null,
                observaciones: document.getElementById('observacionesAntro').value,
                fechaCreacion: datos.fechaCreacion
            };

            try {
                await updateData('datos_antropometricos', datosActualizados);
                mostrarAlerta('Datos antropométricos actualizados correctamente', 'success');

                const modalEl = document.getElementById('modalAntropometricos');
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();

                await cargarDatosAntropometricos();

                // Restaurar función original del botón
                btnGuardar.onclick = guardarDatosAntropometricos;
            } catch (error) {
                console.error('Error al actualizar datos:', error);
                mostrarAlerta('Error al actualizar los datos antropométricos', 'danger');
            }
        };
    }

    modal.show();
}

// Ver detalle de evaluación
async function verDetalleEvaluacion(id) {
    const evaluacion = await getData('evaluaciones_deportivas', id);

    // Configuración de colores y títulos por tipo
    const tipoConfig = {
        'fisica': {
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            icono: '🏃',
            titulo: 'Evaluación Física'
        },
        'tecnica': {
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            icono: '⚽',
            titulo: 'Evaluación Técnica'
        },
        'tactica': {
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            icono: '🧠',
            titulo: 'Evaluación Táctica'
        },
        'psicologica': {
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            icono: '💡',
            titulo: 'Evaluación Psicológica'
        },
        'medica': {
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            icono: '📊',
            titulo: 'Historial Médico'
        }
    };

    const config = tipoConfig[evaluacion.tipo] || tipoConfig['fisica'];

    let contenidoDetalle = `
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-header text-white" style="background: ${config.color};">
                <h4 class="mb-0">
                    <span class="me-2">${config.icono}</span>
                    ${config.titulo}
                </h4>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <h5 class="text-primary">${evaluacion.nombre}</h5>
                    </div>
                    <div class="col-md-6 text-end">
                        <span class="badge bg-secondary fs-6">
                            <i class="bi bi-calendar3"></i> ${formatearFecha(evaluacion.fecha)}
                        </span>
                    </div>
                </div>
    `;

    // Mostrar datos según el tipo de evaluación
    if (evaluacion.tipo === 'fisica') {
        contenidoDetalle += generarDetallesFisica(evaluacion.datos);
    } else if (evaluacion.tipo === 'tecnica') {
        contenidoDetalle += generarDetallesTecnica(evaluacion.datos);
    } else if (evaluacion.tipo === 'tactica') {
        contenidoDetalle += generarDetallesTactica(evaluacion.datos);
    } else if (evaluacion.tipo === 'psicologica') {
        contenidoDetalle += generarDetallesPsicologica(evaluacion.datos);
    } else if (evaluacion.tipo === 'medica') {
        contenidoDetalle += generarDetallesMedica(evaluacion.datos);
    }

    // Notas del entrenador
    if (evaluacion.notasEntrenador) {
        contenidoDetalle += `
            <div class="alert alert-info mt-4" style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border: none;">
                <h6 class="alert-heading">
                    <i class="bi bi-chat-left-text"></i> Notas del Entrenador
                </h6>
                <p class="mb-0">${evaluacion.notasEntrenador}</p>
            </div>
        `;
    }

    contenidoDetalle += `
            </div>
        </div>
    `;

    // Mostrar en modal
    const modalDetalle = document.getElementById('modalDetalleEvaluacion');
    document.getElementById('contenidoDetalleEval').innerHTML = contenidoDetalle;

    const modal = new bootstrap.Modal(modalDetalle);
    modal.show();
}

// Generar detalles de evaluación física
function generarDetallesFisica(datos) {
    let html = '<div class="row g-3">';

    // Resistencia
    if (datos.testCooper || datos.yoyoTest) {
        html += `
            <div class="col-12">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title text-primary">
                            <i class="bi bi-heart-pulse"></i> Resistencia
                        </h6>
                        <div class="row">
                            ${datos.testCooper ? `
                                <div class="col-md-6">
                                    <div class="metric-box">
                                        <span class="metric-label">Test de Cooper</span>
                                        <span class="metric-value">${datos.testCooper} m</span>
                                    </div>
                                </div>
                            ` : ''}
                            ${datos.yoyoTest ? `
                                <div class="col-md-6">
                                    <div class="metric-box">
                                        <span class="metric-label">Yo-Yo Test</span>
                                        <span class="metric-value">Nivel ${datos.yoyoTest}</span>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Velocidad
    if (datos.sprint10m || datos.sprint20m || datos.sprint30m) {
        html += `
            <div class="col-12">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title text-success">
                            <i class="bi bi-lightning-charge"></i> Velocidad
                        </h6>
                        <div class="row">
                            ${datos.sprint10m ? `
                                <div class="col-md-4">
                                    <div class="metric-box">
                                        <span class="metric-label">Sprint 10m</span>
                                        <span class="metric-value">${datos.sprint10m} seg</span>
                                    </div>
                                </div>
                            ` : ''}
                            ${datos.sprint20m ? `
                                <div class="col-md-4">
                                    <div class="metric-box">
                                        <span class="metric-label">Sprint 20m</span>
                                        <span class="metric-value">${datos.sprint20m} seg</span>
                                    </div>
                                </div>
                            ` : ''}
                            ${datos.sprint30m ? `
                                <div class="col-md-4">
                                    <div class="metric-box">
                                        <span class="metric-label">Sprint 30m</span>
                                        <span class="metric-value">${datos.sprint30m} seg</span>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Agilidad
    if (datos.testIllinois) {
        html += `
            <div class="col-md-6">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title text-warning">
                            <i class="bi bi-shuffle"></i> Agilidad
                        </h6>
                        <div class="metric-box">
                            <span class="metric-label">Test Illinois</span>
                            <span class="metric-value">${datos.testIllinois} seg</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Fuerza Explosiva
    if (datos.saltoVertical || datos.saltoHorizontal) {
        html += `
            <div class="col-md-6">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title text-danger">
                            <i class="bi bi-arrow-up-circle"></i> Fuerza Explosiva
                        </h6>
                        ${datos.saltoVertical ? `
                            <div class="metric-box mb-2">
                                <span class="metric-label">Salto Vertical</span>
                                <span class="metric-value">${datos.saltoVertical} cm</span>
                            </div>
                        ` : ''}
                        ${datos.saltoHorizontal ? `
                            <div class="metric-box">
                                <span class="metric-label">Salto Horizontal</span>
                                <span class="metric-value">${datos.saltoHorizontal} cm</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Flexibilidad
    if (datos.sitAndReach) {
        html += `
            <div class="col-md-6">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title text-info">
                            <i class="bi bi-arrows-angle-expand"></i> Flexibilidad
                        </h6>
                        <div class="metric-box">
                            <span class="metric-label">Sit and Reach</span>
                            <span class="metric-value">${datos.sitAndReach} cm</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Composición Corporal
    if (datos.peso || datos.talla || datos.imc || datos.porcentajeGrasa) {
        html += `
            <div class="col-md-6">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title text-secondary">
                            <i class="bi bi-person"></i> Composición Corporal
                        </h6>
                        <div class="row">
                            ${datos.peso ? `
                                <div class="col-6">
                                    <div class="metric-box-sm">
                                        <span class="metric-label-sm">Peso</span>
                                        <span class="metric-value-sm">${datos.peso} kg</span>
                                    </div>
                                </div>
                            ` : ''}
                            ${datos.talla ? `
                                <div class="col-6">
                                    <div class="metric-box-sm">
                                        <span class="metric-label-sm">Talla</span>
                                        <span class="metric-value-sm">${datos.talla} cm</span>
                                    </div>
                                </div>
                            ` : ''}
                            ${datos.imc ? `
                                <div class="col-6">
                                    <div class="metric-box-sm">
                                        <span class="metric-label-sm">IMC</span>
                                        <span class="metric-value-sm">${datos.imc}</span>
                                    </div>
                                </div>
                            ` : ''}
                            ${datos.porcentajeGrasa ? `
                                <div class="col-6">
                                    <div class="metric-box-sm">
                                        <span class="metric-label-sm">% Grasa</span>
                                        <span class="metric-value-sm">${datos.porcentajeGrasa}%</span>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    html += '</div>';
    return html;
}

// Generar detalles de evaluación técnica
function generarDetallesTecnica(datos) {
    let html = '<div class="row g-3">';

    if (datos.controlConduccion) {
        html += `
            <div class="col-md-6">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title"><i class="bi bi-dribbble"></i> Control y Conducción</h6>
                        <div class="metric-box">
                            <span class="metric-value">${datos.controlConduccion} seg</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    if (datos.dominioBalon) {
        html += `
            <div class="col-md-6">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title"><i class="bi bi-circle"></i> Dominio del Balón</h6>
                        <div class="metric-box">
                            <span class="metric-value">${datos.dominioBalon} toques</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    if (datos.pasesCorto || datos.pasesLargo) {
        html += `
            <div class="col-12">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title"><i class="bi bi-arrow-left-right"></i> Precisión de Pases</h6>
                        <div class="row">
                            ${datos.pasesCorto ? `
                                <div class="col-md-6">
                                    <div class="metric-box">
                                        <span class="metric-label">Pases Corto</span>
                                        <span class="metric-value">${datos.pasesCorto}%</span>
                                        <div class="progress mt-2" style="height: 10px;">
                                            <div class="progress-bar bg-success" style="width: ${datos.pasesCorto}%"></div>
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
                            ${datos.pasesLargo ? `
                                <div class="col-md-6">
                                    <div class="metric-box">
                                        <span class="metric-label">Pases Largo</span>
                                        <span class="metric-value">${datos.pasesLargo}%</span>
                                        <div class="progress mt-2" style="height: 10px;">
                                            <div class="progress-bar bg-info" style="width: ${datos.pasesLargo}%"></div>
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    if (datos.potenciaTiro || datos.precisionTiro) {
        html += `
            <div class="col-12">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title"><i class="bi bi-bullseye"></i> Tiros a Portería</h6>
                        <div class="row">
                            ${datos.potenciaTiro ? `
                                <div class="col-md-6">
                                    <div class="metric-box">
                                        <span class="metric-label">Potencia</span>
                                        <span class="metric-value">${datos.potenciaTiro} km/h</span>
                                    </div>
                                </div>
                            ` : ''}
                            ${datos.precisionTiro ? `
                                <div class="col-md-6">
                                    <div class="metric-box">
                                        <span class="metric-label">Precisión</span>
                                        <span class="metric-value">${datos.precisionTiro}%</span>
                                        <div class="progress mt-2" style="height: 10px;">
                                            <div class="progress-bar bg-warning" style="width: ${datos.precisionTiro}%"></div>
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    if (datos.recepcionOrientacion) {
        html += `
            <div class="col-md-6">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title"><i class="bi bi-compass"></i> Recepción y Orientación</h6>
                        <div class="metric-box">
                            ${generarEstrellas(datos.recepcionOrientacion)}
                            <span class="metric-value">${datos.recepcionOrientacion}/5</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    html += '</div>';
    return html;
}

// Generar detalles de evaluación táctica
function generarDetallesTactica(datos) {
    let html = '<div class="row g-3">';

    const aspectos = [
        { key: 'tomaDecisiones', label: 'Toma de Decisiones', icono: 'lightbulb' },
        { key: 'posicionamiento', label: 'Posicionamiento', icono: 'geo-alt' },
        { key: 'visionJuego', label: 'Visión de Juego', icono: 'eye' },
        { key: 'trabajoEquipo', label: 'Trabajo en Equipo', icono: 'people' }
    ];

    aspectos.forEach(aspecto => {
        if (datos[aspecto.key]) {
            html += `
                <div class="col-md-6">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">
                                <i class="bi bi-${aspecto.icono}"></i> ${aspecto.label}
                            </h6>
                            <div class="metric-box">
                                ${generarEstrellas(datos[aspecto.key])}
                                <span class="metric-value">${datos[aspecto.key]}/5</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    html += '</div>';
    return html;
}

// Generar detalles de evaluación psicológica
function generarDetallesPsicologica(datos) {
    let html = '<div class="row g-3">';

    const aspectos = [
        { key: 'motivacion', label: 'Motivación', icono: 'fire', color: 'danger' },
        { key: 'concentracion', label: 'Concentración', icono: 'bullseye', color: 'primary' },
        { key: 'resiliencia', label: 'Resiliencia', icono: 'shield-check', color: 'success' },
        { key: 'liderazgo', label: 'Liderazgo', icono: 'star', color: 'warning' },
        { key: 'convivencia', label: 'Convivencia', icono: 'heart', color: 'info' }
    ];

    aspectos.forEach(aspecto => {
        if (datos[aspecto.key]) {
            html += `
                <div class="col-md-6">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title text-${aspecto.color}">
                                <i class="bi bi-${aspecto.icono}"></i> ${aspecto.label}
                            </h6>
                            <div class="metric-box">
                                ${generarEstrellas(datos[aspecto.key])}
                                <span class="metric-value">${datos[aspecto.key]}/5</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    html += '</div>';
    return html;
}

// Generar detalles médicos
function generarDetallesMedica(datos) {
    let html = '<div class="row g-3">';

    if (datos.chequeoMedico) {
        html += `
            <div class="col-12">
                <div class="alert alert-success">
                    <h6 class="alert-heading"><i class="bi bi-clipboard2-pulse"></i> Chequeo Médico</h6>
                    <p class="mb-0">${datos.chequeoMedico}</p>
                </div>
            </div>
        `;
    }

    if (datos.lesiones) {
        html += `
            <div class="col-12">
                <div class="alert alert-warning">
                    <h6 class="alert-heading"><i class="bi bi-bandaid"></i> Lesiones Previas</h6>
                    <p class="mb-0">${datos.lesiones}</p>
                </div>
            </div>
        `;
    }

    if (datos.estadoNutricional) {
        html += `
            <div class="col-12">
                <div class="alert alert-info">
                    <h6 class="alert-heading"><i class="bi bi-egg-fried"></i> Estado Nutricional</h6>
                    <p class="mb-0">${datos.estadoNutricional}</p>
                </div>
            </div>
        `;
    }

    if (datos.observaciones) {
        html += `
            <div class="col-12">
                <div class="alert alert-secondary">
                    <h6 class="alert-heading"><i class="bi bi-journal-medical"></i> Observaciones Médicas</h6>
                    <p class="mb-0">${datos.observaciones}</p>
                </div>
            </div>
        `;
    }

    html += '</div>';
    return html;
}

// Función auxiliar para generar estrellas
function generarEstrellas(valor) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= valor) {
            estrellas += '<i class="bi bi-star-fill text-warning"></i> ';
        } else {
            estrellas += '<i class="bi bi-star text-muted"></i> ';
        }
    }
    return estrellas;
}

// Eliminar evaluación
async function eliminarEvaluacion(id) {
    const confirmar = await confirmarAccion('¿Está seguro de eliminar esta evaluación?');
    if (!confirmar) return;

    try {
        await deleteData('evaluaciones_deportivas', id);
        mostrarAlerta('Evaluación eliminada correctamente', 'success');
        await cargarHistorialEvaluaciones();
    } catch (error) {
        console.error('Error al eliminar evaluación:', error);
        mostrarAlerta('Error al eliminar la evaluación', 'danger');
    }
}

// Mostrar progreso con gráficos
async function mostrarProgreso() {
    if (!alumnoSeleccionado) {
        mostrarAlerta('Seleccione un alumno primero', 'warning');
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('modalProgreso'));
    modal.show();

    // Esperar a que el modal se muestre
    setTimeout(async () => {
        await generarGraficos();
    }, 300);
}

// Generar gráficos de progreso
async function generarGraficos() {
    const empresa = getCurrentEmpresa();
    const evaluaciones = await getAllData('evaluaciones_deportivas');
    const evalAlumno = evaluaciones.filter(e => e.alumnoId === alumnoSeleccionado.id && e.empresaId === empresa.id)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Gráfico de Evaluación Física
    const evalFisicas = evalAlumno.filter(e => e.tipo === 'fisica');
    if (evalFisicas.length > 0) {
        const ctxFisica = document.getElementById('chartFisica');
        if (chartFisica) chartFisica.destroy();

        chartFisica = new Chart(ctxFisica, {
            type: 'line',
            data: {
                labels: evalFisicas.map(e => formatearFecha(e.fecha)),
                datasets: [
                    {
                        label: 'Sprint 30m (seg)',
                        data: evalFisicas.map(e => e.datos.sprint30m),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.4
                    },
                    {
                        label: 'Salto Vertical (cm)',
                        data: evalFisicas.map(e => e.datos.saltoVertical),
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.4
                    },
                    {
                        label: 'Test Cooper (m)',
                        data: evalFisicas.map(e => e.datos.testCooper),
                        borderColor: 'rgb(54, 162, 235)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Progreso Físico'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Gráfico de Evaluación Técnica
    const evalTecnicas = evalAlumno.filter(e => e.tipo === 'tecnica');
    if (evalTecnicas.length > 0) {
        const ctxTecnica = document.getElementById('chartTecnica');
        if (chartTecnica) chartTecnica.destroy();

        chartTecnica = new Chart(ctxTecnica, {
            type: 'radar',
            data: {
                labels: ['Control', 'Pases Corto', 'Pases Largo', 'Dominio', 'Precisión Tiro', 'Recepción'],
                datasets: evalTecnicas.slice(-3).map((e, index) => ({
                    label: e.nombre,
                    data: [
                        e.datos.controlConduccion,
                        e.datos.pasesCorto,
                        e.datos.pasesLargo,
                        e.datos.dominioBalon,
                        e.datos.precisionTiro,
                        e.datos.recepcionOrientacion
                    ],
                    borderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)'][index],
                    backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'][index]
                }))
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Progreso Técnico (Últimas 3 Evaluaciones)'
                    }
                }
            }
        });
    }

    // Gráfico de Evaluación Táctica
    const evalTacticas = evalAlumno.filter(e => e.tipo === 'tactica');
    if (evalTacticas.length > 0) {
        const ctxTactica = document.getElementById('chartTactica');
        if (chartTactica) chartTactica.destroy();

        chartTactica = new Chart(ctxTactica, {
            type: 'bar',
            data: {
                labels: evalTacticas.map(e => formatearFecha(e.fecha)),
                datasets: [
                    {
                        label: 'Toma de Decisiones',
                        data: evalTacticas.map(e => e.datos.tomaDecisiones),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)'
                    },
                    {
                        label: 'Posicionamiento',
                        data: evalTacticas.map(e => e.datos.posicionamiento),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)'
                    },
                    {
                        label: 'Visión de Juego',
                        data: evalTacticas.map(e => e.datos.visionJuego),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)'
                    },
                    {
                        label: 'Trabajo en Equipo',
                        data: evalTacticas.map(e => e.datos.trabajoEquipo),
                        backgroundColor: 'rgba(153, 102, 255, 0.5)'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Progreso Táctico'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5
                    }
                }
            }
        });
    }

    // Gráfico de Evaluación Psicológica
    const evalPsicologicas = evalAlumno.filter(e => e.tipo === 'psicologica');
    if (evalPsicologicas.length > 0) {
        const ctxPsico = document.getElementById('chartPsicologica');
        if (chartPsicologica) chartPsicologica.destroy();

        chartPsicologica = new Chart(ctxPsico, {
            type: 'line',
            data: {
                labels: evalPsicologicas.map(e => formatearFecha(e.fecha)),
                datasets: [
                    {
                        label: 'Motivación',
                        data: evalPsicologicas.map(e => e.datos.motivacion),
                        borderColor: 'rgb(255, 159, 64)',
                        tension: 0.4
                    },
                    {
                        label: 'Concentración',
                        data: evalPsicologicas.map(e => e.datos.concentracion),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.4
                    },
                    {
                        label: 'Liderazgo',
                        data: evalPsicologicas.map(e => e.datos.liderazgo),
                        borderColor: 'rgb(153, 102, 255)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Progreso Psicológico'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5
                    }
                }
            }
        });
    }
}

// Ver detalle ampliado de gráfico con análisis
async function verDetalleGrafico(tipo) {
    const empresa = getCurrentEmpresa();
    const evaluaciones = await getAllData('evaluaciones_deportivas');
    const evalAlumno = evaluaciones.filter(e => e.alumnoId === alumnoSeleccionado.id && e.empresaId === empresa.id)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const evaluacionesTipo = evalAlumno.filter(e => e.tipo === tipo);

    if (evaluacionesTipo.length === 0) {
        mostrarNotificacion('No hay datos suficientes para generar el análisis.', 'warning');
        return;
    }

    // Configuración del modal
    const modalElement = document.getElementById('modalDetalleGrafico');
    const modal = new bootstrap.Modal(modalElement);
    const titulo = document.getElementById('tituloDetalleGrafico');
    const contenedorAnalisis = document.getElementById('contenidoAnalisisGrafico');

    // Títulos e Iconos
    const config = {
        'fisica': { titulo: 'Análisis de Rendimiento Físico', icono: '🏃' },
        'tecnica': { titulo: 'Análisis de Desarrollo Técnico', icono: '⚽' },
        'tactica': { titulo: 'Evaluación de Inteligencia Táctica', icono: '🧠' },
        'psicologica': { titulo: 'Perfil Psicológico y Social', icono: '💡' }
    };

    titulo.innerHTML = `<i class="bi bi-bar-chart-line"></i> ${config[tipo].icono} ${config[tipo].titulo}`;

    // Generar Gráfico Grande
    const ctx = document.getElementById('chartDetalleGrande');
    if (window.chartDetalle) window.chartDetalle.destroy();

    // Configuración específica del gráfico según tipo
    let chartConfig = {};

    if (tipo === 'fisica') {
        chartConfig = {
            type: 'line',
            data: {
                labels: evaluacionesTipo.map(e => formatearFecha(e.fecha)),
                datasets: [
                    { label: 'Sprint 30m (seg)', data: evaluacionesTipo.map(e => e.datos.sprint30m), borderColor: '#4bc0c0', tension: 0.3, fill: true, backgroundColor: 'rgba(75, 192, 192, 0.1)' },
                    { label: 'Salto Vertical (cm)', data: evaluacionesTipo.map(e => e.datos.saltoVertical), borderColor: '#ff6384', tension: 0.3, fill: true, backgroundColor: 'rgba(255, 99, 132, 0.1)' },
                    { label: 'Test Cooper (m)', data: evaluacionesTipo.map(e => e.datos.testCooper), borderColor: '#36a2eb', tension: 0.3, fill: true, backgroundColor: 'rgba(54, 162, 235, 0.1)' }
                ]
            }
        };
    } else if (tipo === 'tecnica') {
        // Radar chart para la última evaluación vs promedio
        const ultima = evaluacionesTipo[evaluacionesTipo.length - 1];
        chartConfig = {
            type: 'radar',
            data: {
                labels: ['Control', 'Pases Corto', 'Pases Largo', 'Dominio', 'Precisión Tiro', 'Recepción'],
                datasets: [
                    {
                        label: 'Nivel Actual',
                        data: [
                            ultima.datos.controlConduccion ? (20 - ultima.datos.controlConduccion) * 5 : 0, // Invertir escala tiempo
                            ultima.datos.pasesCorto,
                            ultima.datos.pasesLargo,
                            ultima.datos.dominioBalon,
                            ultima.datos.precisionTiro,
                            ultima.datos.recepcionOrientacion * 20
                        ],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgb(54, 162, 235)',
                        pointBackgroundColor: 'rgb(54, 162, 235)'
                    }
                ]
            },
            options: {
                scales: { r: { min: 0, max: 100 } }
            }
        };
    } else if (tipo === 'tactica') {
        chartConfig = {
            type: 'bar',
            data: {
                labels: evaluacionesTipo.map(e => formatearFecha(e.fecha)),
                datasets: [
                    { label: 'Toma de Decisiones', data: evaluacionesTipo.map(e => e.datos.tomaDecisiones), backgroundColor: '#ff9f40' },
                    { label: 'Posicionamiento', data: evaluacionesTipo.map(e => e.datos.posicionamiento), backgroundColor: '#36a2eb' },
                    { label: 'Visión de Juego', data: evaluacionesTipo.map(e => e.datos.visionJuego), backgroundColor: '#4bc0c0' },
                    { label: 'Trabajo en Equipo', data: evaluacionesTipo.map(e => e.datos.trabajoEquipo), backgroundColor: '#9966ff' }
                ]
            },
            options: { scales: { y: { max: 5 } } }
        };
    } else if (tipo === 'psicologica') {
        chartConfig = {
            type: 'line',
            data: {
                labels: evaluacionesTipo.map(e => formatearFecha(e.fecha)),
                datasets: [
                    { label: 'Motivación', data: evaluacionesTipo.map(e => e.datos.motivacion), borderColor: '#ff9f40', tension: 0.4 },
                    { label: 'Concentración', data: evaluacionesTipo.map(e => e.datos.concentracion), borderColor: '#4bc0c0', tension: 0.4 },
                    { label: 'Liderazgo', data: evaluacionesTipo.map(e => e.datos.liderazgo), borderColor: '#9966ff', tension: 0.4 }
                ]
            },
            options: { scales: { y: { max: 5 } } }
        };
    }

    window.chartDetalle = new Chart(ctx, {
        ...chartConfig,
        options: {
            ...chartConfig.options,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Evolución Histórica Detallada', font: { size: 16 } }
            }
        }
    });

    // Generar Análisis de Texto
    contenedorAnalisis.innerHTML = generarAnalisisProfesional(tipo, evaluacionesTipo);

    modal.show();
}

// Generador de Análisis Profesional
function generarAnalisisProfesional(tipo, datos) {
    if (!datos || datos.length === 0) return '<p class="text-muted">Sin datos suficientes.</p>';

    const actual = datos[datos.length - 1];
    const anterior = datos.length > 1 ? datos[datos.length - 2] : null;
    const inicio = datos[0];

    let html = '';
    let tendencia = '';
    let recomendaciones = '';

    // Helpers
    const getTendencia = (valActual, valAnterior) => {
        if (!valAnterior) return 'Estableciendo línea base.';
        const diff = valActual - valAnterior;
        if (Math.abs(diff) < 0.1) return 'Mantiene un rendimiento estable.';
        return diff > 0 ? 'Muestra una tendencia positiva de mejora.' : 'Presenta un ligero descenso en el rendimiento.';
    };

    if (tipo === 'fisica') {
        const mejoraCooper = inicio.datos.testCooper ? ((actual.datos.testCooper - inicio.datos.testCooper) / inicio.datos.testCooper * 100).toFixed(1) : 0;

        html += `
            <h6 class="text-dark fw-bold">Estado Físico Actual</h6>
            <p class="small">El atleta presenta una capacidad aeróbica de <strong>${actual.datos.testCooper}m</strong> (Test Cooper). 
            ${mejoraCooper > 0 ? `Se observa una mejora total del <span class="text-success fw-bold">+${mejoraCooper}%</span> desde el inicio de la temporada.` : ''}</p>
            
            <h6 class="text-dark fw-bold mt-3">Potencia y Velocidad</h6>
            <p class="small">En velocidad (30m), registra <strong>${actual.datos.sprint30m}s</strong>. 
            ${actual.datos.saltoVertical > 50 ? 'Destaca su potencia de piernas en el salto vertical.' : 'Se recomienda enfocar el trabajo en pliometría para mejorar la explosividad.'}</p>
            
            <div class="alert alert-light border mt-3">
                <h6 class="alert-heading text-primary fs-6"><i class="bi bi-lightbulb"></i> Recomendación</h6>
                <p class="mb-0 small">Mantener el trabajo de resistencia intermitente. Incrementar sesiones de fuerza explosiva para mejorar la salida en velocidad.</p>
            </div>
        `;
    } else if (tipo === 'tecnica') {
        const promedioTecnico = (actual.datos.pasesCorto + actual.datos.controlConduccion * 5 + actual.datos.dominioBalon) / 3; // Aprox

        html += `
            <h6 class="text-dark fw-bold">Desarrollo Técnico</h6>
            <p class="small">Muestra un dominio técnico general ${promedioTecnico > 80 ? '<strong>Sobresaliente</strong>' : '<strong>En Desarrollo</strong>'}.
            Su precisión en pases cortos es del <strong>${actual.datos.pasesCorto}%</strong>.</p>
            
            <h6 class="text-dark fw-bold mt-3">Áreas de Enfoque</h6>
            <ul class="small ps-3">
                <li>Control Orientado: ${actual.datos.recepcionOrientacion >= 4 ? 'Excelente ejecución.' : 'Necesita mejorar la primera toma de contacto.'}</li>
                <li>Golpeo: ${actual.datos.precisionTiro > 70 ? 'Muy buena precisión en finalización.' : 'Trabajar la técnica de golpeo con ambas piernas.'}</li>
            </ul>

            <div class="alert alert-light border mt-3">
                <h6 class="alert-heading text-success fs-6"><i class="bi bi-check-circle"></i> Sugerencia</h6>
                <p class="mb-0 small">Realizar ejercicios de rondo para mejorar la velocidad de toma de decisión técnica bajo presión.</p>
            </div>
        `;
    } else if (tipo === 'tactica') {
        html += `
            <h6 class="text-dark fw-bold">Inteligencia de Juego</h6>
            <p class="small">Su lectura de juego se califica con <strong>${actual.datos.visionJuego}/5</strong>. 
            ${getTendencia(actual.datos.visionJuego, anterior?.datos.visionJuego)}</p>
            
            <h6 class="text-dark fw-bold mt-3">Comportamiento Táctico</h6>
            <p class="small">En posicionamiento defensivo/ofensivo muestra un nivel <strong>${actual.datos.posicionamiento}/5</strong>.
            La toma de decisiones es ${actual.datos.tomaDecisiones >= 4 ? 'rápida y acertada' : 'un área de oportunidad para reducir errores no forzados'}.</p>

            <div class="alert alert-light border mt-3">
                <h6 class="alert-heading text-warning fs-6"><i class="bi bi-diagram-3"></i> Enfoque Táctico</h6>
                <p class="mb-0 small">Analizar videos de partidos propios para corregir posicionamiento sin balón. Fomentar la comunicación en el campo.</p>
            </div>
        `;
    } else if (tipo === 'psicologica') {
        html += `
            <h6 class="text-dark fw-bold">Perfil Psico-Social</h6>
            <p class="small">Nivel de motivación actual: <strong>${actual.datos.motivacion}/5</strong>.
            ${actual.datos.liderazgo >= 4 ? 'Ejerce un liderazgo positivo natural dentro del grupo.' : 'Se integra bien al grupo, aunque puede tomar más iniciativa.'}</p>
            
            <h6 class="text-dark fw-bold mt-3">Fortaleza Mental</h6>
            <p class="small">Su capacidad de resiliencia ante la adversidad es de <strong>${actual.datos.resiliencia}/5</strong>.
            ${getTendencia(actual.datos.resiliencia, anterior?.datos.resiliencia)}</p>

            <div class="alert alert-light border mt-3">
                <h6 class="alert-heading text-danger fs-6"><i class="bi bi-heart"></i> Bienestar</h6>
                <p class="mb-0 small">Continuar reforzando la autoconfianza mediante objetivos alcanzables a corto plazo.</p>
            </div>
        `;
    }

    return html;
}

// Generar todos los modales necesarios
function generarModales() {
    return `
        ${modalEvaluacionFisica()}
        ${modalEvaluacionTecnica()}
        ${modalEvaluacionTactica()}
        ${modalEvaluacionPsicologica()}
        ${modalHistorialMedico()}
        ${modalDatosAntropometricos()}
        ${modalProgreso()}
        ${modalDetalleEvaluacion()}
        ${modalDetalleGrafico()}
        ${modalLeyenda()}
    `;
}

// Continúa en el siguiente mensaje debido a limitación de caracteres...
