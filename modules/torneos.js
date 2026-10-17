// Módulo de Torneos
const TorneosModule = {
    torneos: [],
    equipos: [],
    partidos: [],
    torneoActual: null,

    init() {
        this.loadData();
    },

    async loadData() {
        const empresaId = parseInt(sessionStorage.getItem('empresaId'));
        this.torneos = await getDataByEmpresa('torneos', empresaId);
        this.equipos = await getDataByEmpresa('equipos_torneo', empresaId);
        this.partidos = await getDataByEmpresa('partidos_torneo', empresaId);
    },

    // Función para determinar si usar texto blanco o negro según el color de fondo
    getContrastColor(hexColor) {
        // Convertir hex a RGB
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Calcular brillo usando la fórmula de luminancia
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // Retornar blanco para fondos oscuros, negro para fondos claros
        return brightness > 128 ? '#000000' : '#ffffff';
    },

    render() {
        return `
            <div class="torneos-container">
                <div class="module-header">
                    <h2 style="font-weight: normal; font-family: 'Roboto', sans-serif;"><i class="bi bi-trophy"></i> Gestión de Torneos</h2>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="TorneosModule.mostrarModalEquipo()">
                            <i class="bi bi-people-fill"></i> Nuevo Equipo
                        </button>
                        <button class="btn btn-success" onclick="TorneosModule.mostrarModalTorneo()">
                            <i class="bi bi-trophy-fill"></i> Nuevo Torneo
                        </button>
                    </div>
                </div>

                <div class="torneos-tabs">
                    <ul class="nav nav-tabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" data-bs-toggle="tab" href="#tab-equipos">
                                <i class="bi bi-people"></i> Equipos
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="tab" href="#tab-torneos">
                                <i class="bi bi-trophy"></i> Torneos
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="tab" href="#tab-partidos">
                                <i class="bi bi-calendar-event"></i> Partidos
                            </a>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <div id="tab-equipos" class="tab-pane fade show active">
                            <div id="listaEquipos" class="equipos-grid"></div>
                        </div>
                        <div id="tab-torneos" class="tab-pane fade">
                            <div id="listaTorneos" class="torneos-grid"></div>
                        </div>
                        <div id="tab-partidos" class="tab-pane fade">
                            <div id="listaPartidos" class="partidos-list"></div>
                        </div>
                    </div>
                </div>
            </div>

            ${this.renderModales()}
        `;
    },

    renderModales() {
        return `
            <!-- Modal Nuevo Equipo -->
            <div class="modal fade" id="modalEquipo" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title"><i class="bi bi-people-fill"></i> Gestión de Equipo</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formEquipo">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Nombre del Equipo *</label>
                                        <input type="text" class="form-control" id="equipoNombre" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Categoría *</label>
                                        <select class="form-select" id="equipoCategoria" onchange="TorneosModule.cargarJugadoresCategoria()" required>
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Color del Equipo</label>
                                    <input type="color" class="form-control form-control-color" id="equipoColor" value="#0d6efd">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Responsable *</label>
                                    <div id="containerResponsableSelect">
                                        <select class="form-select" id="equipoResponsableSelect">
                                            <option value="">Seleccionar Profesor...</option>
                                        </select>
                                    </div>
                                    <div id="containerResponsableInput" class="d-none">
                                        <input type="text" class="form-control" id="equipoResponsableInput" placeholder="Nombre del responsable">
                                    </div>
                                </div>
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="esEquipoInvitado" onchange="TorneosModule.toggleTipoEquipo()">
                                    <label class="form-check-label" for="esEquipoInvitado">Equipo invitado (Jugadores externos)</label>
                                </div>
                                <div class="mb-3" id="seccionJugadoresAcademia">
                                    <label class="form-label">Jugadores Disponibles (Alumnos)</label>
                                    <div id="jugadoresDisponibles" class="jugadores-list"></div>
                                </div>
                                <div class="mb-3 d-none" id="seccionJugadoresInvitados">
                                    <label class="form-label">Registrar Jugador Invitado</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="nombreJugadorInvitado" placeholder="Nombre completo del jugador">
                                        <button class="btn btn-outline-secondary" type="button" onclick="TorneosModule.agregarJugadorInvitado()">
                                            <i class="bi bi-plus-lg"></i> Agregar
                                        </button>
                                    </div>
                                    <div class="form-text">Agregue los jugadores invitados uno por uno.</div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Jugadores Seleccionados (<span id="countJugadores">0</span>)</label>
                                    <div id="jugadoresSeleccionados" class="jugadores-selected"></div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="TorneosModule.guardarEquipo()">
                                <i class="bi bi-save"></i> Guardar Equipo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Nuevo Torneo -->
            <div class="modal fade" id="modalTorneo" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title"><i class="bi bi-trophy-fill"></i> Crear Torneo</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formTorneo">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Nombre del Torneo *</label>
                                        <input type="text" class="form-control" id="torneoNombre" required>
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label class="form-label">Fecha Inicio *</label>
                                        <input type="date" class="form-control" id="torneoFechaInicio" required>
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label class="form-label">Fecha Fin</label>
                                        <input type="date" class="form-control" id="torneoFechaFin">
                                    </div>
                                    <div class="col-md-3 mb-3" id="containerTorneoEstado" style="display: none;">
                                        <label class="form-label">Estado</label>
                                        <select class="form-select" id="torneoEstado">
                                            <option value="activo">Activo</option>
                                            <option value="finalizado">Finalizado</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Tipo de Torneo *</label>
                                        <select class="form-select" id="torneoTipo" required>
                                            <option value="">Seleccionar...</option>
                                            <option value="todos-contra-todos">Todos contra Todos</option>
                                            <option value="grupos">Por Grupos</option>
                                            <option value="eliminacion-simple">Eliminación Simple</option>
                                            <option value="eliminacion-doble">Eliminación Doble</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Categoría</label>
                                        <select class="form-select" id="torneoCategoria">
                                            <option value="">Todas las categorías</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3" id="containerTorneoResponsable" style="display: none;">
                                        <label class="form-label">Responsable / Profesor</label>
                                        <select class="form-select" id="torneoResponsable">
                                            <option value="">Seleccionar...</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Equipos Participantes *</label>
                                    <div id="equiposDisponiblesTorneo" class="equipos-selection"></div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-success" id="btnGuardarTorneo" onclick="TorneosModule.guardarTorneo()">
                                <i class="bi bi-trophy"></i> Crear Torneo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Partido -->
            <div class="modal fade" id="modalPartido" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title"><i class="bi bi-calendar-event"></i> Registrar Resultado</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="partidoInfo" class="mb-4"></div>
                            <form id="formPartido">
                                <input type="hidden" id="partidoId">
                                <div class="row mb-4">
                                    <div class="col-md-5">
                                        <h4 id="equipoLocal" class="fw-bold mb-2"></h4>
                                        <div class="mb-3">
                                            <label class="form-label">Goles</label>
                                            <input type="number" class="form-control" id="golesLocal" min="0" value="0">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Tarjetas Amarillas</label>
                                            <input type="number" class="form-control" id="amarillasLocal" min="0" value="0">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Tarjetas Rojas</label>
                                            <input type="number" class="form-control" id="rojasLocal" min="0" value="0">
                                        </div>
                                    </div>
                                    <div class="col-md-2 text-center d-flex align-items-center justify-content-center">
                                        <h3>VS</h3>
                                    </div>
                                    <div class="col-md-5">
                                        <h4 id="equipoVisitante" class="fw-bold mb-2"></h4>
                                        <div class="mb-3">
                                            <label class="form-label">Goles</label>
                                            <input type="number" class="form-control" id="golesVisitante" min="0" value="0">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Tarjetas Amarillas</label>
                                            <input type="number" class="form-control" id="amarillasVisitante" min="0" value="0">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Tarjetas Rojas</label>
                                            <input type="number" class="form-control" id="rojasVisitante" min="0" value="0">
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Acciones (opcional)</label>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <div class="card card-body p-3">
                                                <h6 class="mb-2">Equipo Local</h6>
                                                <div class="row g-2 align-items-end">
                                                    <div class="col-6">
                                                        <label class="form-label">Jugador</label>
                                                        <select class="form-select" id="selJugadorLocal"></select>
                                                    </div>
                                                    <div class="col-4">
                                                        <label class="form-label">Acción</label>
                                                        <select class="form-select" id="selAccionLocal">
                                                            <option value="Gol">Gol</option>
                                                            <option value="Tarjeta Amarilla">Tarjeta Amarilla</option>
                                                            <option value="Tarjeta Roja">Tarjeta Roja</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-2">
                                                        <label class="form-label">Min</label>
                                                        <input type="number" class="form-control" id="minutoLocal" min="0" max="120" value="0">
                                                    </div>
                                                    <div class="col-12">
                                                        <button type="button" class="btn btn-primary btn-sm" onclick="agregarAccionEquipo('local')">
                                                            <i class="bi bi-plus-circle"></i> Agregar
                                                        </button>
                                                    </div>
                                                </div>
                                                <div id="accionesLocalList" class="mt-3"></div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="card card-body p-3">
                                                <h6 class="mb-2">Equipo Visitante</h6>
                                                <div class="row g-2 align-items-end">
                                                    <div class="col-6">
                                                        <label class="form-label">Jugador</label>
                                                        <select class="form-select" id="selJugadorVisitante"></select>
                                                    </div>
                                                    <div class="col-4">
                                                        <label class="form-label">Acción</label>
                                                        <select class="form-select" id="selAccionVisitante">
                                                            <option value="Gol">Gol</option>
                                                            <option value="Tarjeta Amarilla">Tarjeta Amarilla</option>
                                                            <option value="Tarjeta Roja">Tarjeta Roja</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-2">
                                                        <label class="form-label">Min</label>
                                                        <input type="number" class="form-control" id="minutoVisitante" min="0" max="120" value="0">
                                                    </div>
                                                    <div class="col-12">
                                                        <button type="button" class="btn btn-primary btn-sm" onclick="agregarAccionEquipo('visitante')">
                                                            <i class="bi bi-plus-circle"></i> Agregar
                                                        </button>
                                                    </div>
                                                </div>
                                                <div id="accionesVisitanteList" class="mt-3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Observaciones</label>
                                    <textarea class="form-control" id="observaciones" rows="2"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-info text-white" onclick="TorneosModule.guardarResultado()">
                                <i class="bi bi-save"></i> Guardar Resultado
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Tabla de Posiciones -->
            <div class="modal fade" id="modalTablaPosiciones" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-warning">
                            <h5 class="modal-title text-dark"><i class="bi bi-list-ol"></i> Tabla de Posiciones</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="tablaPosiciones"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-danger" onclick="TorneosModule.exportarTablaPosicionesPDF()">
                                <i class="bi bi-file-pdf"></i> Exportar PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Estadísticas -->
            <div class="modal fade" id="modalEstadisticas" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-danger text-white">
                            <h5 class="modal-title"><i class="bi bi-graph-up"></i> Estadísticas del Torneo</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6>Tabla de Goleadores</h6>
                                    <div id="tablaGoleadores"></div>
                                </div>
                                <div class="col-md-6">
                                    <h6>Jugadores Sancionados</h6>
                                    <div id="tablaSancionados"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Ver Equipos del Torneo -->
            <div class="modal fade" id="modalVerEquiposTorneo" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header text-white" style="background: linear-gradient(135deg, #4267B2 0%, #5B7EC8 100%);">
                            <h5 class="modal-title"><i class="bi bi-people-fill"></i> Equipos del Torneo</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" style="background-color: #f8f9fa;">
                            <div class="mb-3">
                                <select class="form-select" id="filtroEquiposTorneo" onchange="TorneosModule.filtrarEquiposTorneo()">
                                    <option value="">📋 Todos los equipos</option>
                                </select>
                            </div>
                            <div id="listaEquiposTorneo"></div>
                        </div>
                        <div class="modal-footer bg-white">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Informe Técnico -->
            <div class="modal fade" id="modalInformeTorneo" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content border-0 shadow-lg">
                        <div class="modal-header text-white" style="background: linear-gradient(90deg, #1a237e 0%, #283593 100%); border-bottom: 4px solid #ffd700;">
                            <h5 class="modal-title d-flex align-items-center">
                                <i class="bi bi-file-earmark-text-fill me-2"></i> 
                                INFORME TÉCNICO FINAL
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-0" style="background-color: #f4f6f9;">
                            <div id="contenidoInformeTorneo"></div>
                        </div>
                        <div class="modal-footer bg-white border-top-0">
                            <button type="button" class="btn btn-primary" onclick="window.print()">
                                <i class="bi bi-printer"></i> Imprimir Informe
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Cambiar Partidos -->
            <div class="modal fade" id="modalCambiarPartidos" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-dark">
                            <h5 class="modal-title"><i class="bi bi-arrow-left-right"></i> Modificar Encuentros</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i> Seleccione la jornada y reasigne los equipos para los partidos.
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Seleccionar Jornada/Ronda:</label>
                                <select class="form-select" id="filtroRondaCambio" onchange="TorneosModule.cargarPartidosParaCambio()">
                                </select>
                            </div>
                            <div id="listaPartidosCambio" class="mt-3">
                                <!-- Contenido dinámico -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="TorneosModule.guardarCambiosPartidos()">
                                <i class="bi bi-save"></i> Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    async mostrarModalEquipo() {
        await this.cargarCategorias();
        await this.cargarProfesores();
        const modal = new bootstrap.Modal(document.getElementById('modalEquipo'));
        document.getElementById('formEquipo').reset();
        delete document.getElementById('formEquipo').dataset.id; // Limpiar ID de edición
        document.getElementById('jugadoresDisponibles').innerHTML = '';
        document.getElementById('jugadoresSeleccionados').innerHTML = '';
        document.getElementById('countJugadores').textContent = '0';

        // Resetear estado de invitado
        document.getElementById('esEquipoInvitado').checked = false;
        this.toggleTipoEquipo();

        modal.show();
    },

    toggleTipoEquipo() {
        const esInvitado = document.getElementById('esEquipoInvitado').checked;
        const seccionAcademia = document.getElementById('seccionJugadoresAcademia');
        const seccionInvitados = document.getElementById('seccionJugadoresInvitados');
        const containerSelect = document.getElementById('containerResponsableSelect');
        const containerInput = document.getElementById('containerResponsableInput');

        if (esInvitado) {
            seccionAcademia.classList.add('d-none');
            seccionInvitados.classList.remove('d-none');
            containerSelect.classList.add('d-none');
            containerInput.classList.remove('d-none');
        } else {
            seccionAcademia.classList.remove('d-none');
            seccionInvitados.classList.add('d-none');
            containerSelect.classList.remove('d-none');
            containerInput.classList.add('d-none');
            this.cargarJugadoresCategoria();
        }
    },

    async cargarProfesores() {
        const empresaId = parseInt(sessionStorage.getItem('empresaId'));
        const profesores = await getDataByEmpresa('profesores', empresaId);

        const select = document.getElementById('equipoResponsableSelect');
        let html = '<option value="">Seleccionar Profesor...</option>';
        if (profesores && profesores.length > 0) {
            profesores.forEach(p => {
                html += `<option value="${p.nombre}">${p.nombre}</option>`;
            });
        }
        select.innerHTML = html;
    },

    agregarJugadorInvitado() {
        const input = document.getElementById('nombreJugadorInvitado');
        const nombre = input.value.trim();

        if (!nombre) return;

        // Generar un ID temporal único para invitados (negativo o string para diferenciar)
        // Usaremos timestamp para unicidad simple en este contexto
        const id = -(Date.now() + Math.floor(Math.random() * 1000));

        this.agregarJugadorVisual(id, nombre + ' (Invitado)');
        input.value = '';
        input.focus();
    },

    async cargarCategorias() {
        const empresaId = parseInt(sessionStorage.getItem('empresaId'));
        const categorias = await getDataByEmpresa('categorias', empresaId);

        const selectEquipo = document.getElementById('equipoCategoria');
        const selectTorneo = document.getElementById('torneoCategoria');

        let options = '<option value="">Seleccionar...</option>';
        categorias.forEach(cat => {
            options += `<option value="${cat.id}">${cat.nombre}</option>`;
        });

        if (selectEquipo) selectEquipo.innerHTML = options;
        if (selectTorneo) selectTorneo.innerHTML = '<option value="">Todas las categorías</option>' + options;
    },

    async cargarJugadoresCategoria() {
        const categoriaId = parseInt(document.getElementById('equipoCategoria').value);
        if (!categoriaId) {
            document.getElementById('jugadoresDisponibles').innerHTML = '';
            return;
        }

        const empresaId = parseInt(sessionStorage.getItem('empresaId'));
        const alumnos = await getDataByEmpresa('alumnos', empresaId);

        // Obtener todos los equipos existentes
        await this.loadData();

        // ID del equipo actual si estamos editando
        const equipoActualId = document.getElementById('formEquipo').dataset.id ? parseInt(document.getElementById('formEquipo').dataset.id) : null;

        // Crear un Set con los IDs de jugadores ya asignados a OTROS equipos
        const jugadoresAsignadosOtros = new Set();
        this.equipos.forEach(equipo => {
            if (equipo.id !== equipoActualId) {
                equipo.jugadores.forEach(jugador => {
                    jugadoresAsignadosOtros.add(jugador.id);
                });
            }
        });

        // IDs de jugadores ya seleccionados en el formulario actual
        const seleccionadosActuales = new Set(
            Array.from(document.getElementById('jugadoresSeleccionados').children)
                .map(el => parseInt(el.getAttribute('data-jugador-id')))
        );

        // Filtrar jugadores
        const jugadores = alumnos.filter(a =>
            a.categoriaId === categoriaId &&
            !jugadoresAsignadosOtros.has(a.id) &&
            !seleccionadosActuales.has(a.id)
        );

        let html = '<div class="list-group">';
        jugadores.forEach(j => {
            const nombre = j.nombres || j.nombre || '';
            const apellido = j.apellidos || j.apellido || '';
            const nombreCompleto = j.nombreCompleto || `${nombre} ${apellido}`.trim() || 'Sin nombre';

            html += `
                <div class="list-group-item list-group-item-action" onclick="TorneosModule.agregarJugador(${j.id}, '${nombreCompleto.replace(/'/g, "\\'")}')">
                    <i class="bi bi-person-plus"></i> ${nombreCompleto}
                </div>
            `;
        });


        if (jugadores.length === 0) {
            html = '<div class="alert alert-info">No hay jugadores disponibles para agregar</div>';
        }

        document.getElementById('jugadoresDisponibles').innerHTML = html;
    },

    agregarJugador(id, nombre) {
        this.agregarJugadorVisual(id, nombre);
        this.cargarJugadoresCategoria(); // Recargar lista de disponibles
    },

    agregarJugadorVisual(id, nombre) {
        const container = document.getElementById('jugadoresSeleccionados');
        const existing = container.querySelector(`[data-jugador-id="${id}"]`);

        if (existing) return;

        const badge = document.createElement('span');
        badge.className = 'badge bg-primary me-2 mb-2 p-2';
        badge.setAttribute('data-jugador-id', id);
        badge.innerHTML = `
            ${nombre}
            <i class="bi bi-x-circle ms-2" onclick="this.parentElement.remove(); TorneosModule.actualizarContador(); TorneosModule.cargarJugadoresCategoria()" style="cursor:pointer"></i>
        `;

        container.appendChild(badge);
        this.actualizarContador();
    },

    actualizarContador() {
        const count = document.getElementById('jugadoresSeleccionados').children.length;
        document.getElementById('countJugadores').textContent = count;
    },

    async guardarEquipo() {
        const form = document.getElementById('formEquipo');
        const id = form.dataset.id ? parseInt(form.dataset.id) : null;

        const nombre = document.getElementById('equipoNombre').value.trim();
        const categoriaId = parseInt(document.getElementById('equipoCategoria').value);
        const color = document.getElementById('equipoColor').value;
        const esInvitado = document.getElementById('esEquipoInvitado').checked;

        let responsable = '';
        if (esInvitado) {
            responsable = document.getElementById('equipoResponsableInput').value.trim();
        } else {
            responsable = document.getElementById('equipoResponsableSelect').value;
        }

        if (!nombre || !categoriaId || !responsable) {
            alert('Complete los campos obligatorios, incluyendo el Responsable.');
            return;
        }

        const jugadoresElements = document.getElementById('jugadoresSeleccionados').children;
        const jugadores = Array.from(jugadoresElements).map(el => ({
            id: parseInt(el.getAttribute('data-jugador-id')),
            nombre: el.textContent.trim()
        }));

        if (jugadores.length === 0) {
            alert('Debe seleccionar al menos un jugador');
            return;
        }

        const empresaId = parseInt(sessionStorage.getItem('empresaId'));
        const equipo = {
            empresaId,
            nombre,
            categoriaId,
            color,
            responsable,
            jugadores,
            esInvitado,
            fechaCreacion: new Date().toISOString()
        };

        if (id) {
            equipo.id = id;
            await updateData('equipos_torneo', equipo);
            alert('Equipo actualizado exitosamente');
        } else {
            await addData('equipos_torneo', equipo);
            alert('Equipo creado exitosamente');
        }

        bootstrap.Modal.getInstance(document.getElementById('modalEquipo')).hide();
        await this.loadData();
        this.renderEquipos();
    },

    async cargarProfesoresTorneo() {
        const empresaId = parseInt(sessionStorage.getItem('empresaId'));
        const profesores = await getDataByEmpresa('profesores', empresaId);
        const select = document.getElementById('torneoResponsable');
        select.innerHTML = '<option value="">Seleccionar...</option>';
        if (profesores) {
            profesores.forEach(p => {
                select.innerHTML += `<option value="${p.id}">${p.nombre} ${p.apellido}</option>`;
            });
        }
    },

    async mostrarModalTorneo(id = null) {
        await this.cargarCategorias();
        await this.cargarProfesoresTorneo();
        await this.cargarEquiposDisponibles();

        const form = document.getElementById('formTorneo');
        form.reset();
        delete form.dataset.id;
        const btnGuardar = document.getElementById('btnGuardarTorneo');
        if (btnGuardar) btnGuardar.innerHTML = '<i class="bi bi-trophy"></i> Crear Torneo';

        // Ocultar responsable por defecto
        const containerResponsable = document.getElementById('containerTorneoResponsable');
        if (containerResponsable) containerResponsable.style.display = 'none';

        if (id) {
            const torneo = this.torneos.find(t => t.id === id);
            if (torneo) {
                form.dataset.id = id;
                document.getElementById('torneoNombre').value = torneo.nombre;
                document.getElementById('torneoFechaInicio').value = torneo.fechaInicio;
                document.getElementById('torneoFechaFin').value = torneo.fechaFin;
                document.getElementById('torneoTipo').value = torneo.tipo;
                document.getElementById('torneoCategoria').value = torneo.categoriaId || '';

                // Mostrar y setear estado
                document.getElementById('containerTorneoEstado').style.display = 'block';
                document.getElementById('torneoEstado').value = (torneo.estado || 'activo').toLowerCase();

                // Mostrar y llenar responsable
                if (containerResponsable) {
                    containerResponsable.style.display = 'block';
                    document.getElementById('torneoResponsable').value = torneo.responsableId || '';
                }

                // Marcar equipos
                if (torneo.equiposIds) {
                    torneo.equiposIds.forEach(eqId => {
                        const check = document.getElementById(`equipo${eqId}`);
                        if (check) check.checked = true;
                    });
                }

                if (btnGuardar) btnGuardar.innerHTML = '<i class="bi bi-save"></i> Guardar Cambios';
            }
        }

        const modal = new bootstrap.Modal(document.getElementById('modalTorneo'));
        modal.show();
    },

    async cargarEquiposDisponibles() {
        await this.loadData();
        const container = document.getElementById('equiposDisponiblesTorneo');

        let html = '';
        this.equipos.forEach(equipo => {
            html += `
                <div class="col-md-4 mb-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${equipo.id}" id="equipo${equipo.id}">
                        <label class="form-check-label" for="equipo${equipo.id}">
                            <span class="badge" style="background-color: ${equipo.color}">${equipo.nombre}</span>
                            <small class="text-muted">(${equipo.jugadores ? equipo.jugadores.length : 0} jugadores)</small>
                        </label>
                    </div>
                </div>
            `;
        });

        container.innerHTML = `<div class="row">${html}</div>`;
    },

    async guardarTorneo() {
        const form = document.getElementById('formTorneo');
        const id = form.dataset.id ? parseInt(form.dataset.id) : null;

        const nombre = document.getElementById('torneoNombre').value.trim();
        const fechaInicio = document.getElementById('torneoFechaInicio').value;
        const fechaFin = document.getElementById('torneoFechaFin').value;
        const tipo = document.getElementById('torneoTipo').value;
        const categoriaId = document.getElementById('torneoCategoria').value;
        const responsableId = document.getElementById('torneoResponsable').value;
        const estado = document.getElementById('torneoEstado').value;
        console.log('Guardando torneo. ID:', id, 'Estado capturado:', estado);

        if (!nombre || !fechaInicio || !tipo) {
            alert('Complete los campos obligatorios');
            return;
        }

        const equiposSeleccionados = Array.from(document.querySelectorAll('#equiposDisponiblesTorneo input:checked'))
            .map(cb => parseInt(cb.value));

        if (equiposSeleccionados.length < 2) {
            alert('Debe seleccionar al menos 2 equipos');
            return;
        }

        const empresaId = parseInt(sessionStorage.getItem('empresaId'));
        const torneo = {
            empresaId,
            nombre,
            fechaInicio,
            fechaFin,
            tipo,
            categoriaId: categoriaId ? parseInt(categoriaId) : null,
            responsableId: responsableId ? parseInt(responsableId) : null,
            equiposIds: equiposSeleccionados,
            responsableId: responsableId ? parseInt(responsableId) : null,
            equiposIds: equiposSeleccionados,
            estado: id ? estado : 'activo'
        };

        if (id) {
            torneo.id = id;
            console.log('Objeto torneo a actualizar:', torneo);
            await updateData('torneos', torneo);
            alert('Torneo actualizado exitosamente');
        } else {
            const torneoId = await addData('torneos', { ...torneo, fechaCreacion: new Date().toISOString() });
            await this.generarPartidos(torneoId, tipo, equiposSeleccionados);
            alert('Torneo creado y partidos generados exitosamente');
        }

        bootstrap.Modal.getInstance(document.getElementById('modalTorneo')).hide();
        await this.loadData();
        this.renderTorneos();
    },

    async generarPartidos(torneoId, tipo, equiposIds) {
        const empresaId = parseInt(sessionStorage.getItem('empresaId'));
        let partidos = [];

        switch (tipo) {
            case 'todos-contra-todos':
                partidos = this.generarTodosContraTodos(equiposIds);
                break;
            case 'eliminacion-simple':
                partidos = this.generarEliminacionSimple(equiposIds);
                break;
            case 'eliminacion-doble':
                partidos = this.generarEliminacionDoble(equiposIds);
                break;
            case 'grupos':
                partidos = this.generarPorGrupos(equiposIds);
                break;
        }

        for (let partido of partidos) {
            await addData('partidos_torneo', {
                empresaId,
                torneoId,
                ...partido,
                estado: 'pendiente',
                fechaCreacion: new Date().toISOString()
            });
        }
    },

    generarTodosContraTodos(equiposIds) {
        const partidos = [];
        for (let i = 0; i < equiposIds.length; i++) {
            for (let j = i + 1; j < equiposIds.length; j++) {
                partidos.push({
                    equipoLocalId: equiposIds[i],
                    equipoVisitanteId: equiposIds[j],
                    jornada: partidos.length + 1
                });
            }
        }
        return partidos;
    },

    generarEliminacionSimple(equiposIds) {
        const partidos = [];
        // Solo generar la primera ronda. Las siguientes se generan dinámicamente.
        for (let i = 0; i < equiposIds.length; i += 2) {
            if (equiposIds[i + 1]) {
                partidos.push({
                    equipoLocalId: equiposIds[i],
                    equipoVisitanteId: equiposIds[i + 1],
                    ronda: 1,
                    fase: this.obtenerNombreFase(equiposIds.length)
                });
            } else {
                // Caso impar: El equipo pasa directo (Bye). 
            }
        }
        return partidos;
    },

    generarEliminacionDoble(equiposIds) {
        // Para la primera ronda es igual a eliminación simple
        const partidos = this.generarEliminacionSimple(equiposIds);
        partidos.forEach(p => p.llave = 'ganadores');
        return partidos;
    },

    generarPorGrupos(equiposIds) {
        const numGrupos = Math.ceil(equiposIds.length / 4);
        const grupos = Array.from({ length: numGrupos }, () => []);

        equiposIds.forEach((id, index) => {
            grupos[index % numGrupos].push(id);
        });

        const partidos = [];
        grupos.forEach((grupo, gIndex) => {
            for (let i = 0; i < grupo.length; i++) {
                for (let j = i + 1; j < grupo.length; j++) {
                    partidos.push({
                        equipoLocalId: grupo[i],
                        equipoVisitanteId: grupo[j],
                        grupo: String.fromCharCode(65 + gIndex),
                        jornada: partidos.length + 1
                    });
                }
            }
        });
        return partidos;
    },

    obtenerNombreFase(numEquipos) {
        if (numEquipos === 2) return 'Final';
        if (numEquipos === 4) return 'Semifinal';
        html += '</div>';
        container.innerHTML = html;
    },

    async eliminarTorneo(id) {
        if (!confirm('¿Está seguro de eliminar este torneo? Se borrarán todos sus partidos y estadísticas.')) return;

        // Eliminar partidos asociados
        const partidosTorneo = this.partidos.filter(p => p.torneoId === id);
        for (let p of partidosTorneo) {
            await deleteData('partidos_torneo', p.id);
        }

        // Eliminar torneo
        await deleteData('torneos', id);

        await this.loadData();
        this.renderTorneos();
        // Si estábamos viendo los partidos de este torneo, volver a la lista
        if (this.torneoActual === id) {
            this.torneoActual = null;
            document.getElementById('listaPartidos').innerHTML = '';
        }
    },

    formatTipoTorneo(tipo) {
        const tipos = {
            'todos-contra-todos': 'Todos contra Todos',
            'grupos': 'Por Grupos',
            'eliminacion-simple': 'Eliminación Simple',
            'eliminacion-doble': 'Eliminación Doble'
        };
        return tipos[tipo] || tipo;
    },

    async renderTorneos() {
        await this.loadData();
        const container = document.getElementById('listaTorneos');
        if (!container) return;
        if (!Array.isArray(this.torneos) || this.torneos.length === 0) {
            container.innerHTML = '<div class="alert alert-info">No hay torneos creados</div>';
            return;
        }

        let html = '';
        for (const t of this.torneos) {
            const equiposCount = Array.isArray(t.equiposIds) ? t.equiposIds.length : 0;
            const inicioStr = t.fechaInicio ? (typeof formatearFecha === 'function' ? formatearFecha(t.fechaInicio) : t.fechaInicio) : '-';
            const finStr = t.fechaFin ? (typeof formatearFecha === 'function' ? formatearFecha(t.fechaFin) : t.fechaFin) : '';

            // Obtener categoría
            const empresaId = parseInt(sessionStorage.getItem('empresaId'));
            const categorias = await getDataByEmpresa('categorias', empresaId);
            const categoria = t.categoriaId ? categorias.find(c => c.id === t.categoriaId) : null;

            // Calcular campeón y subcampeón
            let campeon = null;
            let subcampeon = null;

            // Lógica robusta para determinar estado y campeón
            const partidoFinal = this.partidos.find(p => p.torneoId == t.id && p.fase === 'Final' && p.estado === 'finalizado');
            const partidosTorneo = this.partidos.filter(p => p.torneoId == t.id);
            const todosJugados = partidosTorneo.length > 0 && partidosTorneo.every(p => p.estado === 'finalizado');

            let torneoFinalizado = false;
            if (t.estado && t.estado.toLowerCase() === 'finalizado') {
                torneoFinalizado = true;
            }

            const mostrarCampeon = torneoFinalizado || partidoFinal || (t.tipo === 'todos-contra-todos' && todosJugados && partidosTorneo.length >= (t.equiposIds.length * (t.equiposIds.length - 1) / 2));

            if (mostrarCampeon) {
                const tabla = {};
                t.equiposIds.forEach(equipoId => {
                    const equipo = this.equipos.find(e => e.id === equipoId);
                    if (equipo) {
                        tabla[equipoId] = {
                            nombre: equipo.nombre,
                            color: equipo.color,
                            logo: equipo.logo,
                            pj: 0, pg: 0, pe: 0, pp: 0,
                            gf: 0, gc: 0, dif: 0, pts: 0
                        };
                    }
                });

                const partidosFinalizados = partidosTorneo.filter(p => p.estado === 'finalizado');
                partidosFinalizados.forEach(p => {
                    if (tabla[p.equipoLocalId] && tabla[p.equipoVisitanteId]) {
                        const local = tabla[p.equipoLocalId];
                        const visitante = tabla[p.equipoVisitanteId];
                        local.pj++; visitante.pj++;
                        local.gf += p.golesLocal || 0; local.gc += p.golesVisitante || 0;
                        visitante.gf += p.golesVisitante || 0; visitante.gc += p.golesLocal || 0;

                        if (p.golesLocal > p.golesVisitante) {
                            local.pg++; local.pts += 3;
                            visitante.pp++;
                        } else if (p.golesLocal < p.golesVisitante) {
                            visitante.pg++; visitante.pts += 3;
                            local.pp++;
                        } else {
                            local.pe++; visitante.pe++;
                            local.pts++; visitante.pts++;
                        }
                        local.dif = local.gf - local.gc;
                        visitante.dif = visitante.gf - visitante.gc;
                    }
                });

                if (partidoFinal) {
                    const ganadorId = partidoFinal.golesLocal > partidoFinal.golesVisitante ? partidoFinal.equipoLocalId : partidoFinal.equipoVisitanteId;
                    const perdedorId = partidoFinal.golesLocal > partidoFinal.golesVisitante ? partidoFinal.equipoVisitanteId : partidoFinal.equipoLocalId;
                    campeon = tabla[ganadorId];
                    subcampeon = tabla[perdedorId];
                } else {
                    const posiciones = Object.values(tabla).sort((a, b) => b.pts - a.pts || b.dif - a.dif);
                    if (posiciones.length > 0) campeon = posiciones[0];
                    if (posiciones.length > 1) subcampeon = posiciones[1];
                }
            }

            html += `
                <div class="card mb-4 shadow-sm" style="border-radius: 12px; overflow: hidden; max-width: 400px; border: 3px solid #2563eb;">
                    <!-- Header azul -->
                    <div class="p-3 text-white position-relative" style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);">
                        <div class="d-flex justify-content-between align-items-start">
                            <h3 class="mb-2 fw-bold">${t.nombre}</h3>
                            ${categoria ? `<span class="badge bg-white text-primary px-3 py-2">${categoria.nombre}</span>` : ''}
                        </div>
                        ${t.descripcion ? `<p class="mb-0 small" style="opacity: 0.95;">${t.descripcion}</p>` : ''}
                    </div>
                    
                    <!-- Cuerpo del card -->
                    <div class="card-body p-3" style="background-color: #f8f9fa;">
                        <!-- Información con iconos -->
                        <div class="mb-3">
                            <div class="d-flex align-items-center mb-2 text-muted small">
                                <i class="bi bi-calendar3 me-2"></i>
                                <span>${inicioStr}${finStr ? ' - ' + finStr : ''}</span>
                            </div>
                            <div class="d-flex align-items-center mb-2 text-muted small">
                                <i class="bi bi-geo-alt me-2"></i>
                                <span>${t.ubicacion || 'Sin ubicación'}</span>
                            </div>
                            <div class="d-flex align-items-center text-muted small">
                                <i class="bi bi-diagram-3 me-2"></i>
                                <span>${TorneosModule.formatTipoTorneo(t.tipo)}</span>
                            </div>
                        </div>
                        
                        <!-- Badges de estado y equipos -->
                        <div class="d-flex gap-2 mb-3">
                            <span class="badge ${torneoFinalizado ? 'bg-secondary' : 'bg-success'} px-3 py-2">${torneoFinalizado ? 'Finalizado' : 'Activo'}</span>
                            <span class="badge bg-info px-3 py-2">${equiposCount} equipos</span>
                        </div>
                        
                        <!-- Campeón y Subcampeón (solo si está finalizado) -->
                        ${campeon ? `
                        <div class="mb-3">
                            <div class="d-flex align-items-center mb-2">
                                <span class="badge bg-warning text-dark px-3 py-2 me-2" style="font-size: 0.9rem;">Campeón</span>
                                ${campeon.logo ? `<img src="${campeon.logo}" alt="${campeon.nombre}" style="width: 24px; height: 24px; object-fit: contain; margin-right: 8px;">` : `<i class="bi bi-trophy-fill text-warning me-2"></i>`}
                                <strong style="font-size: 1.1rem;">${campeon.nombre}</strong>
                            </div>
                            ${subcampeon ? `
                            <div class="d-flex align-items-center">
                                <span class="badge bg-secondary px-3 py-2 me-2" style="font-size: 0.9rem;">Subcampeón</span>
                                ${subcampeon.logo ? `<img src="${subcampeon.logo}" alt="${subcampeon.nombre}" style="width: 24px; height: 24px; object-fit: contain; margin-right: 8px;">` : `<i class="bi bi-award-fill text-secondary me-2"></i>`}
                                <span style="font-size: 1.1rem;">${subcampeon.nombre}</span>
                            </div>
                            ` : ''}
                        </div>
                        ` : ''}
                        
                        <!-- Botones de acción -->
                        <div class="d-flex gap-2 mb-2 flex-wrap">
                            <button class="btn btn-primary btn-sm" onclick="TorneosModule.mostrarModalTorneo(${t.id})" style="border-radius: 8px;">
                                <i class="bi bi-pencil-fill me-1"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="TorneosModule.eliminarTorneo(${t.id})" style="border-radius: 8px;">
                                <i class="bi bi-trash-fill"></i>
                            </button>
                            <button class="btn btn-success btn-sm" onclick="TorneosModule.verPartidosTorneo(${t.id})" style="border-radius: 8px;">
                                <i class="bi bi-lightning-charge-fill me-1"></i> Generar Partidos
                            </button>
                        </div>
                        <div class="d-flex gap-2 mb-3 flex-wrap">
                            <button class="btn btn-warning btn-sm text-dark" onclick="TorneosModule.verTablaPosiciones(${t.id})" style="border-radius: 8px;">
                                <i class="bi bi-list-ol me-1"></i> Tabla de Posiciones
                            </button>
                            <button class="btn btn-info btn-sm text-white" onclick="TorneosModule.verEstadisticas(${t.id})" style="border-radius: 8px;">
                                <i class="bi bi-graph-up me-1"></i> Estadísticas
                            </button>
                        </div>
                        
                        <!-- Link Ver equipos -->
                        <div class="text-center">
                            <a href="javascript:void(0)" onclick="TorneosModule.verEquiposTorneo(${t.id})" class="text-muted text-decoration-none small">
                                <i class="bi bi-people-fill me-1"></i> Ver equipos
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    },

    async renderEquipos() {
        await this.loadData();
        const container = document.getElementById('listaEquipos');

        if (this.equipos.length === 0) {
            container.innerHTML = '<div class="alert alert-info">No hay equipos creados</div>';
            return;
        }

        // Función auxiliar para convertir hex a rgba
        const hexToRgba = (hex, alpha) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        let html = '<div class="equipos-grid">';
        this.equipos.forEach(equipo => {
            const colorFondo = hexToRgba(equipo.color, 0.1); // 10% de opacidad
            html += `
                <div class="card equipo-card" style="border-color: ${equipo.color}; border-width: 2px;">
                    <div class="card-header" style="background-color: ${equipo.color}; color: white;">
                        <h5 class="mb-0" style="font-size: 1.5rem; font-weight: bold;"><i class="bi bi-shield-fill"></i> ${equipo.nombre}</h5>
                    </div>
                    <div class="card-body" style="background-color: ${colorFondo};">
                        <p><strong>Responsable:</strong> ${equipo.responsable || '-'}</p>
                        <p><strong>Jugadores:</strong> ${equipo.jugadores.length}</p>
                        <ol class="jugadores-list-enumerada">
                            ${equipo.jugadores.map(j => `<li>${j.nombre}</li>`).join('')}
                        </ol>
                    </div>
                    <div class="card-footer bg-white border-top-0 d-flex justify-content-end gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="TorneosModule.editarEquipo(${equipo.id})">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="TorneosModule.eliminarEquipo(${equipo.id})">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    async editarEquipo(id) {
        const equipo = this.equipos.find(e => e.id === id);
        if (!equipo) return;

        await this.cargarCategorias();
        await this.cargarProfesores();

        document.getElementById('equipoNombre').value = equipo.nombre;
        document.getElementById('equipoCategoria').value = equipo.categoriaId;
        document.getElementById('equipoColor').value = equipo.color;

        // Manejar tipo de equipo y responsable
        const esInvitado = equipo.esInvitado || false;
        document.getElementById('esEquipoInvitado').checked = esInvitado;
        this.toggleTipoEquipo();

        if (esInvitado) {
            document.getElementById('equipoResponsableInput').value = equipo.responsable;
        } else {
            // Asegurarse de que el valor coincida con una opción del select
            const select = document.getElementById('equipoResponsableSelect');
            select.value = equipo.responsable;
        }

        document.getElementById('formEquipo').dataset.id = id;

        const container = document.getElementById('jugadoresSeleccionados');
        container.innerHTML = '';
        if (equipo.jugadores) {
            equipo.jugadores.forEach(j => {
                this.agregarJugadorVisual(j.id, j.nombre);
            });
        }

        await this.cargarJugadoresCategoria();

        const modal = new bootstrap.Modal(document.getElementById('modalEquipo'));
        modal.show();
    },

    async eliminarEquipo(id) {
        if (!confirm('¿Está seguro de eliminar este equipo?')) return;

        const enTorneo = this.torneos.some(t => t.equiposIds.includes(id));
        if (enTorneo) {
            alert('No se puede eliminar el equipo porque está participando en un torneo.');
            return;
        }

        await deleteData('equipos_torneo', id);
        await this.loadData();
        this.renderEquipos();
    },

    async verPartidosTorneo(torneoId) {
        this.torneoActual = torneoId;
        const tab = new bootstrap.Tab(document.querySelector('[href="#tab-partidos"]'));
        tab.show();
        await this.renderPartidos(torneoId);
    },

    async renderPartidos(torneoId = null) {
        await this.loadData();
        const container = document.getElementById('listaPartidos');
        let partidos = torneoId ? this.partidos.filter(p => p.torneoId === torneoId) : this.partidos;

        if (partidos.length === 0) {
            container.innerHTML = '<div class="alert alert-info">No hay partidos programados</div>';
            return;
        }

        let html = '';

        // Botones de acción del torneo
        if (torneoId) {
            const torneo = this.torneos.find(t => t.id === torneoId);
            html += '<div class="mb-4 d-flex justify-content-end gap-2">';

            // Botón para modificar encuentros (disponible para todos)
            html += `
                <button class="btn btn-secondary shadow-sm" onclick="TorneosModule.mostrarModalCambiarPartidos(${torneoId})">
                    <i class="bi bi-arrow-left-right"></i> Modificar Encuentros
                </button>
            `;

            // Botón para generar siguiente ronda (solo eliminación simple)
            if (torneo && torneo.tipo === 'eliminacion-simple') {
                html += `
                    <button class="btn btn-warning shadow-sm" onclick="TorneosModule.generarSiguienteRonda(${torneoId})">
                        <i class="bi bi-diagram-3-fill"></i> Generar Siguiente Ronda
                    </button>
                `;
            }
            html += '</div>';
        }

        html += '<div class="partidos-grid">';

        // Ordenar por ronda y fecha
        partidos.sort((a, b) => (a.ronda || 0) - (b.ronda || 0));

        for (let partido of partidos) {
            const equipoLocal = this.equipos.find(e => e.id === partido.equipoLocalId);
            const equipoVisitante = this.equipos.find(e => e.id === partido.equipoVisitanteId);
            const torneo = this.torneos.find(t => t.id === partido.torneoId);

            // Formatear fecha
            const fechaObj = new Date(partido.fecha);
            const fechaFormat = partido.fecha ? fechaObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Fecha por definir';
            const horaFormat = partido.hora || '15:00';

            const colorLocal = equipoLocal?.color || '#999';
            const colorVisitante = equipoVisitante?.color || '#999';
            const inicialLocal = equipoLocal ? equipoLocal.nombre.charAt(0).toUpperCase() : '?';
            const inicialVisitante = equipoVisitante ? equipoVisitante.nombre.charAt(0).toUpperCase() : '?';
            const textColorLocal = TorneosModule.getContrastColor(colorLocal);
            const textColorVisitante = TorneosModule.getContrastColor(colorVisitante);
            const isBye = !partido.equipoVisitanteId || partido.bye === true;

            html += `
                <div class="partido-card">
                    <div class="partido-header text-center">
                        <div class="partido-torneo"><i class="bi bi-trophy"></i> ${torneo ? torneo.nombre : 'Torneo'}</div>
                        <div class="partido-meta"><i class="bi bi-calendar-event"></i> ${fechaFormat} - ${horaFormat}</div>
                        <div class="partido-fase">${partido.fase || 'Ronda ' + (partido.ronda || 1)}</div>
                    </div>

                    <div class="partido-body">
                        <div class="team-block">
                            <div class="team-logo-box" style="background-color: ${colorLocal}; color: ${textColorLocal}">${inicialLocal}</div>
                            <div class="team-name">${equipoLocal?.nombre || 'Local'}</div>
                            <div class="team-score">${partido.golesLocal !== undefined ? partido.golesLocal : '-'}</div>
                        </div>
                        <div class="team-block">
                            ${isBye ? `
                                <div class="team-logo-box team-bye">BYE</div>
                                <div class="team-name">Libre</div>
                                <div class="team-score">-</div>
                            ` : `
                                <div class="team-logo-box" style="background-color: ${colorVisitante}; color: ${textColorVisitante}">${inicialVisitante}</div>
                                <div class="team-name">${equipoVisitante?.nombre || 'Visitante'}</div>
                                <div class="team-score">${partido.golesVisitante !== undefined ? partido.golesVisitante : '-'}</div>
                            `}
                        </div>
                    </div>

                    <div class="partido-lugar"><i class="bi bi-geo-alt"></i> ${partido.lugar || 'Lugar por definir'}</div>

                    <div class="partido-footer">
                        <button class="btn-partido-action btn-partido-edit" onclick="TorneosModule.editarPartido(${partido.id})">
                            <i class="bi bi-pencil-fill"></i> Editar
                        </button>
                        <button class="btn-partido-action btn-partido-delete" onclick="TorneosModule.eliminarPartido(${partido.id})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </div>
                </div>
            `;
        }
        html += '</div>';
        container.innerHTML = html;
    },

    async generarSiguienteRonda(torneoId) {
        await this.loadData();
        const partidos = this.partidos.filter(p => p.torneoId === torneoId);

        if (partidos.length === 0) return;

        // Determinar ronda actual máxima
        const rondaActual = Math.max(...partidos.map(p => p.ronda || 1));
        const partidosRondaActual = partidos.filter(p => p.ronda === rondaActual);

        // Verificar si todos finalizaron
        const pendientes = partidosRondaActual.filter(p => p.estado !== 'finalizado');
        if (pendientes.length > 0) {
            alert('Aún hay partidos pendientes en la ronda actual. Finalícelos para avanzar.');
            return;
        }

        // Obtener ganadores
        const ganadores = [];
        let huboEmpate = false;

        partidosRondaActual.forEach(p => {
            if (p.golesLocal > p.golesVisitante) {
                ganadores.push(p.equipoLocalId);
            } else if (p.golesVisitante > p.golesLocal) {
                ganadores.push(p.equipoVisitanteId);
            } else {
                huboEmpate = true;
            }
        });

        if (huboEmpate) {
            alert('Hay partidos empatados. En eliminación directa debe haber un ganador. Edite los resultados.');
            return;
        }

        if (ganadores.length < 2) {
            alert('¡Torneo finalizado! Tenemos un campeón.');
            return;
        }

        // Generar nuevos partidos
        const nuevosPartidos = [];
        const empresaId = parseInt(sessionStorage.getItem('empresaId'));
        const nuevaRonda = rondaActual + 1;
        const nombreFase = this.obtenerNombreFase(ganadores.length);

        for (let i = 0; i < ganadores.length; i += 2) {
            if (ganadores[i + 1]) {
                nuevosPartidos.push({
                    equipoLocalId: ganadores[i],
                    equipoVisitanteId: ganadores[i + 1],
                    ronda: nuevaRonda,
                    fase: nombreFase
                });
            } else {
                await addData('partidos_torneo', {
                    empresaId,
                    torneoId,
                    equipoLocalId: ganadores[i],
                    equipoVisitanteId: null,
                    ronda: nuevaRonda,
                    fase: nombreFase,
                    bye: true,
                    golesLocal: 1,
                    golesVisitante: 0,
                    estado: 'finalizado',
                    fechaCreacion: new Date().toISOString()
                });
            }
        }

        for (let p of nuevosPartidos) {
            await addData('partidos_torneo', {
                empresaId,
                torneoId,
                ...p,
                estado: 'pendiente',
                fechaCreacion: new Date().toISOString()
            });
        }

        await this.loadData();
        this.renderPartidos(torneoId);
        alert(`Se han generado ${nuevosPartidos.length} partidos para la siguiente ronda.`);
    },

    async eliminarPartido(id) {
        if (!confirm('¿Está seguro de eliminar este partido?')) return;
        await deleteData('partidos_torneo', id);
        await this.loadData();
        this.renderPartidos(this.torneoActual);
    },

    async editarPartido(partidoId) {
        const partido = this.partidos.find(p => p.id === partidoId);
        const equipoLocal = this.equipos.find(e => e.id === partido.equipoLocalId);
        const equipoVisitante = this.equipos.find(e => e.id === partido.equipoVisitanteId);

        document.getElementById('partidoId').value = partidoId;
        document.getElementById('equipoLocal').textContent = equipoLocal.nombre;
        document.getElementById('equipoVisitante').textContent = equipoVisitante.nombre;
        document.getElementById('golesLocal').value = partido.golesLocal || 0;
        document.getElementById('golesVisitante').value = partido.golesVisitante || 0;
        document.getElementById('amarillasLocal').value = partido.amarillasLocal || 0;
        document.getElementById('rojasLocal').value = partido.rojasLocal || 0;
        document.getElementById('amarillasVisitante').value = partido.amarillasVisitante || 0;
        document.getElementById('rojasVisitante').value = partido.rojasVisitante || 0;
        document.getElementById('observaciones').value = partido.observaciones || '';

        const selLocal = document.getElementById('selJugadorLocal');
        const selVisit = document.getElementById('selJugadorVisitante');
        selLocal.innerHTML = '<option value="">Seleccionar jugador...</option>' + (equipoLocal?.jugadores || []).map(j => `<option value="${j.id}">${j.nombre}</option>`).join('');
        selVisit.innerHTML = '<option value="">Seleccionar jugador...</option>' + (equipoVisitante?.jugadores || []).map(j => `<option value="${j.id}">${j.nombre}</option>`).join('');

        TorneosModule._accionesLocal = Array.isArray(partido.accionesLocal) ? [...partido.accionesLocal] : [];
        TorneosModule._accionesVisitante = Array.isArray(partido.accionesVisitante) ? [...partido.accionesVisitante] : [];
        renderAccionesEquipo('local');
        renderAccionesEquipo('visitante');

        const modal = new bootstrap.Modal(document.getElementById('modalPartido'));
        modal.show();
    },

    async guardarResultado() {
        const partidoId = parseInt(document.getElementById('partidoId').value);
        const partido = this.partidos.find(p => p.id === partidoId);

        partido.golesLocal = parseInt(document.getElementById('golesLocal').value);
        partido.golesVisitante = parseInt(document.getElementById('golesVisitante').value);
        partido.amarillasLocal = parseInt(document.getElementById('amarillasLocal').value);
        partido.rojasLocal = parseInt(document.getElementById('rojasLocal').value);
        partido.amarillasVisitante = parseInt(document.getElementById('amarillasVisitante').value);
        partido.rojasVisitante = parseInt(document.getElementById('rojasVisitante').value);
        partido.observaciones = document.getElementById('observaciones').value;
        partido.accionesLocal = Array.isArray(TorneosModule._accionesLocal) ? TorneosModule._accionesLocal : [];
        partido.accionesVisitante = Array.isArray(TorneosModule._accionesVisitante) ? TorneosModule._accionesVisitante : [];
        const golesAcc = [...(partido.accionesLocal || []), ...(partido.accionesVisitante || [])].filter(a => a.tipo === 'Gol');
        const conteo = {};
        golesAcc.forEach(a => { conteo[a.nombre] = (conteo[a.nombre] || 0) + 1; });
        partido.goleadores = Object.entries(conteo).map(([n, c]) => `${n} (${c})`).join(', ');
        partido.estado = 'finalizado';
        partido.fecha = new Date().toISOString().split('T')[0];

        await updateData('partidos_torneo', partido);

        // Verificar si es la final para finalizar el torneo
        // Verificar si es la final para mostrar mensaje de campeón
        if (partido.fase === 'Final') {
            alert('¡Se ha registrado al campeón del torneo!');
        }

        bootstrap.Modal.getInstance(document.getElementById('modalPartido')).hide();
        await this.loadData();
        this.renderPartidos(this.torneoActual);
        if (partido.fase !== 'Final') {
            alert('Resultado guardado exitosamente');
        }
    },

    async verTablaPosiciones(torneoId) {
        const torneo = this.torneos.find(t => t.id === torneoId);
        const partidos = this.partidos.filter(p => p.torneoId === torneoId && p.estado === 'finalizado');

        const tabla = {};
        torneo.equiposIds.forEach(equipoId => {
            const equipo = this.equipos.find(e => e.id === equipoId);
            tabla[equipoId] = {
                nombre: equipo.nombre,
                color: equipo.color,
                pj: 0, pg: 0, pe: 0, pp: 0,
                gf: 0, gc: 0, dif: 0, pts: 0
            };
        });

        partidos.forEach(p => {
            const local = tabla[p.equipoLocalId];
            const visitante = tabla[p.equipoVisitanteId];

            local.pj++; visitante.pj++;
            local.gf += p.golesLocal; local.gc += p.golesVisitante;
            visitante.gf += p.golesVisitante; visitante.gc += p.golesLocal;

            if (p.golesLocal > p.golesVisitante) {
                local.pg++; local.pts += 3;
                visitante.pp++;
            } else if (p.golesLocal < p.golesVisitante) {
                visitante.pg++; visitante.pts += 3;
                local.pp++;
            } else {
                local.pe++; visitante.pe++;
                local.pts++; visitante.pts++;
            }

            local.dif = local.gf - local.gc;
            visitante.dif = visitante.gf - visitante.gc;
        });

        const posiciones = Object.values(tabla).sort((a, b) => b.pts - a.pts || b.dif - a.dif);

        let html = '<table class="table table-striped"><thead><tr>';
        html += '<th style="background-color: #cfe8ff;">Pos</th><th style="background-color: #cfe8ff;">Equipo</th><th style="background-color: #cfe8ff;">PJ</th><th style="background-color: #cfe8ff;">PG</th><th style="background-color: #cfe8ff;">PE</th><th style="background-color: #cfe8ff;">PP</th><th style="background-color: #cfe8ff;">GF</th><th style="background-color: #cfe8ff;">GC</th><th style="background-color: #cfe8ff;">DIF</th><th style="background-color: #cfe8ff;">PTS</th>';
        html += '</tr></thead><tbody>';

        posiciones.forEach((eq, index) => {
            html += `
                <tr>
                    <td><strong>${index + 1}</strong></td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div style="width: 20px; height: 20px; background-color: ${eq.color}; border-radius: 3px; margin-right: 10px;"></div>
                            <span style="font-size: 1.1rem; color: #000; font-weight: 500;">${eq.nombre}</span>
                        </div>
                    </td>
                    <td>${eq.pj}</td><td>${eq.pg}</td><td>${eq.pe}</td><td>${eq.pp}</td>
                    <td>${eq.gf}</td><td>${eq.gc}</td><td>${eq.dif}</td>
                    <td><strong>${eq.pts}</strong></td>
                </tr>
            `;
        });
        html += '</tbody></table>';

        document.getElementById('tablaPosiciones').innerHTML = html;

        // Guardar el torneoId para la exportación PDF
        window.torneoSeleccionadoId = torneoId;

        const modal = new bootstrap.Modal(document.getElementById('modalTablaPosiciones'));
        modal.show();
    },

    async exportarTablaPosicionesPDF() {
        if (!window.torneoSeleccionadoId) {
            alert('No hay torneo seleccionado');
            return;
        }

        const torneo = this.torneos.find(t => t.id === window.torneoSeleccionadoId);
        if (!torneo) return;

        const partidos = this.partidos.filter(p => p.torneoId === torneo.id && p.estado === 'finalizado');
        const tabla = {};

        torneo.equiposIds.forEach(eqId => {
            const equipo = this.equipos.find(e => e.id === eqId);
            if (equipo) {
                tabla[eqId] = {
                    nombre: equipo.nombre,
                    color: equipo.color,
                    pj: 0, pg: 0, pe: 0, pp: 0,
                    gf: 0, gc: 0, dif: 0, pts: 0
                };
            }
        });

        partidos.forEach(p => {
            const local = tabla[p.equipoLocalId];
            const visitante = tabla[p.equipoVisitanteId];

            local.pj++; visitante.pj++;
            local.gf += p.golesLocal; local.gc += p.golesVisitante;
            visitante.gf += p.golesVisitante; visitante.gc += p.golesLocal;

            if (p.golesLocal > p.golesVisitante) {
                local.pg++; local.pts += 3;
                visitante.pp++;
            } else if (p.golesLocal < p.golesVisitante) {
                visitante.pg++; visitante.pts += 3;
                local.pp++;
            } else {
                local.pe++; visitante.pe++;
                local.pts++; visitante.pts++;
            }

            local.dif = local.gf - local.gc;
            visitante.dif = visitante.gf - visitante.gc;
        });

        const posiciones = Object.values(tabla).sort((a, b) => b.pts - a.pts || b.dif - a.dif);

        // Crear el contenido del PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Título
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('Tabla de Posiciones', 105, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont(undefined, 'normal');
        doc.text(torneo.nombre, 105, 30, { align: 'center' });

        // Preparar datos para la tabla
        const headers = [['Pos', 'Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DIF', 'PTS']];
        const data = posiciones.map((eq, index) => [
            (index + 1).toString(),
            eq.nombre,
            eq.pj.toString(),
            eq.pg.toString(),
            eq.pe.toString(),
            eq.pp.toString(),
            eq.gf.toString(),
            eq.gc.toString(),
            eq.dif.toString(),
            eq.pts.toString()
        ]);

        // Generar tabla con autoTable
        doc.autoTable({
            head: headers,
            body: data,
            startY: 40,
            theme: 'grid',
            margin: { left: 10, right: 10 },
            headStyles: {
                fillColor: [255, 193, 7],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                fontSize: 9
            },
            styles: {
                fontSize: 9,
                cellPadding: 2
            },
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'left' },
                2: { halign: 'center' },
                3: { halign: 'center' },
                4: { halign: 'center' },
                5: { halign: 'center' },
                6: { halign: 'center' },
                7: { halign: 'center' },
                8: { halign: 'center' },
                9: { halign: 'center', fontStyle: 'bold' }
            },
            didDrawCell: function (data) {
                // Dibujar cuadrado de color para la columna de equipo
                if (data.column.index === 1 && data.section === 'body') {
                    const eq = posiciones[data.row.index];
                    if (eq && eq.color) {
                        const hexColor = eq.color;
                        const r = parseInt(hexColor.substr(1, 2), 16);
                        const g = parseInt(hexColor.substr(3, 2), 16);
                        const b = parseInt(hexColor.substr(5, 2), 16);

                        doc.setFillColor(r, g, b);
                        doc.rect(data.cell.x + 2, data.cell.y + 2, 4, 4, 'F');
                    }
                }
            }
        });

        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        const fecha = new Date().toLocaleDateString('es-PE');
        doc.text(`Generado el ${fecha} `, 105, doc.internal.pageSize.height - 10, { align: 'center' });

        // Guardar PDF
        doc.save(`Tabla_Posiciones_${torneo.nombre.replace(/\s+/g, '_')}.pdf`);
    },

    async verEstadisticas(torneoId) {
        const partidos = this.partidos.filter(p => p.torneoId === torneoId && p.estado === 'finalizado');
        const empresaId = parseInt(sessionStorage.getItem('empresaId'));
        const alumnos = await getDataByEmpresa('alumnos', empresaId);

        const goleadores = {};
        const sancionadosJugadores = {};

        partidos.forEach(p => {
            if (Array.isArray(p.accionesLocal)) {
                p.accionesLocal.forEach(a => {
                    if (a.tipo === 'Gol') {
                        if (!goleadores[a.nombre]) {
                            const alumno = alumnos.find(al => al.id === a.jugadorId);
                            goleadores[a.nombre] = {
                                nombre: a.nombre,
                                goles: 0,
                                foto: alumno?.foto || null
                            };
                        }
                        goleadores[a.nombre].goles++;
                    } else if (a.tipo === 'Tarjeta Amarilla' || a.tipo === 'Tarjeta Roja') {
                        const equipo = this.equipos.find(e => e.id === p.equipoLocalId);
                        const key = `${a.nombre}| ${equipo.nombre} `;
                        if (!sancionadosJugadores[key]) {
                            const alumno = alumnos.find(al => al.id === a.jugadorId);
                            sancionadosJugadores[key] = {
                                jugador: a.nombre,
                                equipo: equipo.nombre,
                                equipoColor: equipo.color,
                                foto: alumno?.foto || null,
                                amarillas: 0,
                                rojas: 0
                            };
                        }
                        if (a.tipo === 'Tarjeta Amarilla') sancionadosJugadores[key].amarillas++;
                        if (a.tipo === 'Tarjeta Roja') sancionadosJugadores[key].rojas++;
                    }
                });
            }
            if (Array.isArray(p.accionesVisitante)) {
                p.accionesVisitante.forEach(a => {
                    if (a.tipo === 'Gol') {
                        if (!goleadores[a.nombre]) {
                            const alumno = alumnos.find(al => al.id === a.jugadorId);
                            goleadores[a.nombre] = {
                                nombre: a.nombre,
                                goles: 0,
                                foto: alumno?.foto || null
                            };
                        }
                        goleadores[a.nombre].goles++;
                    } else if (a.tipo === 'Tarjeta Amarilla' || a.tipo === 'Tarjeta Roja') {
                        const equipo = this.equipos.find(e => e.id === p.equipoVisitanteId);
                        const key = `${a.nombre}| ${equipo.nombre} `;
                        if (!sancionadosJugadores[key]) {
                            const alumno = alumnos.find(al => al.id === a.jugadorId);
                            sancionadosJugadores[key] = {
                                jugador: a.nombre,
                                equipo: equipo.nombre,
                                equipoColor: equipo.color,
                                foto: alumno?.foto || null,
                                amarillas: 0,
                                rojas: 0
                            };
                        }
                        if (a.tipo === 'Tarjeta Amarilla') sancionadosJugadores[key].amarillas++;
                        if (a.tipo === 'Tarjeta Roja') sancionadosJugadores[key].rojas++;
                    }
                });
            }
            if (p.goleadores) {
                const regex = /([^(]+)\((\d+)\)/g;
                let match;
                while ((match = regex.exec(p.goleadores)) !== null) {
                    const nombre = match[1].trim();
                    const goles = parseInt(match[2]);
                    if (!goleadores[nombre]) {
                        goleadores[nombre] = {
                            nombre: nombre,
                            goles: 0,
                            foto: null
                        };
                    }
                    goleadores[nombre].goles += goles;
                }
            }
        });

        // Tabla de goleadores
        let htmlGoleadores = '<table class="table table-sm table-hover"><thead style="background-color: #cfe8ff;"><tr><th>Pos</th><th>Jugador</th><th class="text-center">Goles</th></tr></thead><tbody>';
        const goleadoresOrdenados = Object.values(goleadores).sort((a, b) => b.goles - a.goles);
        goleadoresOrdenados.forEach((jugador, index) => {
            const medalla = index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : ''));
            const fotoSrc = jugador.foto || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect fill='%23e9ecef' width='32' height='32'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='14'%3E" + (jugador.nombre.charAt(0)) + "%3C/text%3E%3C/svg%3E";
            htmlGoleadores += `<tr>
                <td style="background-color: #e3f2fd;"><strong>${index + 1}</strong></td>
                <td style="background-color: #e3f2fd;">
                    <div class="d-flex align-items-center">
                        <img src="${fotoSrc}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; margin-right: 10px;" alt="${jugador.nombre}">
                        <span>${medalla} ${jugador.nombre}</span>
                    </div>
                </td>
                <td class="text-center"><span class="badge bg-success">${jugador.goles}</span></td>
            </tr>`;
        });
        if (goleadoresOrdenados.length === 0) {
            htmlGoleadores += '<tr><td colspan="3" class="text-center text-muted">No hay goles registrados</td></tr>';
        }
        htmlGoleadores += '</tbody></table>';

        // Tabla de jugadores sancionados
        let htmlSancionados = '<table class="table table-sm table-hover"><thead style="background-color: #cfe8ff;"><tr><th>Jugador</th><th>Equipo</th><th class="text-center"><i class="bi bi-square-fill text-warning"></i> Amarillas</th><th class="text-center"><i class="bi bi-square-fill text-danger"></i> Rojas</th><th class="text-center">Total</th></tr></thead><tbody>';
        const sancionadosOrdenados = Object.values(sancionadosJugadores).sort((a, b) => {
            const totalA = a.amarillas + (a.rojas * 2);
            const totalB = b.amarillas + (b.rojas * 2);
            return totalB - totalA;
        });

        sancionadosOrdenados.forEach(s => {
            const total = s.amarillas + s.rojas;
            const fotoSrc = s.foto || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect fill='%23e9ecef' width='32' height='32'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='14'%3E" + (s.jugador.charAt(0)) + "%3C/text%3E%3C/svg%3E";
            htmlSancionados += `<tr>
                <td style="background-color: #e3f2fd;">
                    <div class="d-flex align-items-center">
                        <img src="${fotoSrc}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; margin-right: 10px;" alt="${s.jugador}">
                        <strong>${s.jugador}</strong>
                    </div>
                </td>
                <td>
                    <span>${s.equipo}</span>
                </td>
                <td class="text-center">${s.amarillas > 0 ? `<span class="badge bg-warning text-dark">${s.amarillas}</span>` : '-'}</td>
                <td class="text-center">${s.rojas > 0 ? `<span class="badge bg-danger">${s.rojas}</span>` : '-'}</td>
                <td class="text-center"><strong>${total}</strong></td>
            </tr>`;
        });

        if (sancionadosOrdenados.length === 0) {
            htmlSancionados += '<tr><td colspan="5" class="text-center text-muted">No hay tarjetas registradas</td></tr>';
        }
        htmlSancionados += '</tbody></table>';

        document.getElementById('tablaGoleadores').innerHTML = htmlGoleadores;
        document.getElementById('tablaSancionados').innerHTML = htmlSancionados;

        const modal = new bootstrap.Modal(document.getElementById('modalEstadisticas'));
        modal.show();
    },

    async verEquiposTorneo(torneoId) {
        const torneo = this.torneos.find(t => t.id === torneoId);
        if (!torneo) return;

        const empresaId = parseInt(sessionStorage.getItem('empresaId'));
        const alumnos = await getDataByEmpresa('alumnos', empresaId);
        const profesores = await getDataByEmpresa('profesores', empresaId);
        const categorias = await getDataByEmpresa('categorias', empresaId);

        // Llenar el selector de filtro con los equipos
        let optionsHtml = '<option value="">📋 Todos los equipos</option>';
        for (let equipoId of torneo.equiposIds) {
            const equipo = this.equipos.find(e => e.id === equipoId);
            if (equipo) {
                optionsHtml += `<option value="${equipo.id}">${equipo.nombre}</option>`;
            }
        }

        let html = '<div class="row g-3">';

        for (let equipoId of torneo.equiposIds) {
            const equipo = this.equipos.find(e => e.id === equipoId);
            if (!equipo) continue;

            // Obtener jugadores del equipo de manera robusta
            let jugadoresEquipo = [];

            if (equipo.jugadores && Array.isArray(equipo.jugadores)) {
                // Si es un array de objetos {id, nombre} (formato actual)
                jugadoresEquipo = equipo.jugadores.map(j => {
                    const alumnoCompleto = alumnos.find(a => a.id == j.id);
                    if (alumnoCompleto) {
                        return {
                            id: alumnoCompleto.id,
                            nombre: alumnoCompleto.nombres || alumnoCompleto.nombre || '',
                            apellido: alumnoCompleto.apellidos || alumnoCompleto.apellido || '',
                            foto: alumnoCompleto.foto || null,
                            categoriaId: alumnoCompleto.categoriaId
                        };
                    } else {
                        // Si no se encuentra el alumno, usar los datos del equipo
                        const nombreParts = (j.nombre || '').split(' ');
                        return {
                            id: j.id,
                            nombre: nombreParts[0] || 'Sin nombre',
                            apellido: nombreParts.slice(1).join(' ') || '',
                            foto: null,
                            categoriaId: null
                        };
                    }
                });
            } else if (equipo.jugadoresIds && Array.isArray(equipo.jugadoresIds)) {
                // Si es un array de IDs (formato alternativo)
                jugadoresEquipo = equipo.jugadoresIds.map(jId => {
                    const alumno = alumnos.find(a => a.id == jId);
                    if (alumno) {
                        return {
                            id: alumno.id,
                            nombre: alumno.nombres || alumno.nombre || '',
                            apellido: alumno.apellidos || alumno.apellido || '',
                            foto: alumno.foto || null,
                            categoriaId: alumno.categoriaId
                        };
                    }
                    return null;
                }).filter(Boolean);
            }

            // Obtener responsable/profesor
            let responsable = 'Sin asignar';
            if (equipo.responsableId) {
                const profesor = profesores.find(p => p.id === equipo.responsableId);
                if (profesor) {
                    responsable = `${profesor.nombre} ${profesor.apellido} `;
                }
            } else if (equipo.responsable) {
                responsable = equipo.responsable;
            }

            html += `
                <div class="col-12">
                    <div class="card shadow-sm" style="border-radius: 10px; border-left: 5px solid ${equipo.color}; overflow: hidden;">
                        <div class="card-body" style="padding: 20px;">
                            <div class="row align-items-center">
                                <!-- Información del equipo -->
                                <div class="col-md-4">
                                    <div class="d-flex align-items-center mb-3">
                                        <div style="width: 50px; height: 50px; background-color: ${equipo.color}; border-radius: 8px; margin-right: 15px; display: flex; align-items: center; justify-content: center;">
                                            <i class="bi bi-shield-fill text-white" style="font-size: 1.5rem;"></i>
                                        </div>
                                        <div>
                                            <h5 class="mb-0" style="font-weight: 600;">${equipo.nombre}</h5>
                                            <small class="text-muted">${equipo.esInvitado ? 'Equipo Invitado' : 'Equipo de la Academia'}</small>
                                        </div>
                                    </div>
                                    <div class="mb-2">
                                        <small class="text-muted d-flex align-items-center">
                                            <i class="bi bi-person-badge me-2"></i>
                                            <strong>Responsable:</strong>&nbsp;${responsable}
                                        </small>
                                    </div>
                                    <div>
                                        <span class="badge bg-primary" style="font-size: 0.75rem;">
                                            <i class="bi bi-people-fill"></i> ${jugadoresEquipo.length} jugadores
                                        </span>
                                    </div>
                                </div>

                                <!-- Lista de jugadores -->
                                <div class="col-md-8">
                                    <h6 class="mb-3" style="color: #666; font-size: 0.9rem; font-weight: 600;">
                                        <i class="bi bi-list-ul"></i> PLANTILLA DE JUGADORES
                                    </h6>
                                    ${jugadoresEquipo.length > 0 ? `
                                        <div class="row g-2">
                                            ${jugadoresEquipo.map((jugador, index) => {
                const fotoSrc = jugador.foto || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23e9ecef' width='40' height='40'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='16'%3E" + (jugador.nombre.charAt(0)) + "%3C/text%3E%3C/svg%3E";
                const categoria = jugador.categoriaId ? categorias.find(c => c.id === jugador.categoriaId) : null;
                const categoriaNombre = categoria ? categoria.nombre : 'Sin categoría';
                return `
                                                <div class="col-md-6">
                                                    <div class="d-flex align-items-center p-2" style="background-color: #f8f9fa; border-radius: 6px;">
                                                        <img src="${fotoSrc}" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; margin-right: 10px; border: 2px solid ${equipo.color};" alt="${jugador.nombre}">
                                                        <div style="flex: 1; min-width: 0;">
                                                            <div style="font-size: 0.85rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                                                ${jugador.nombre} ${jugador.apellido || ''}
                                                            </div>
                                                            <small class="text-muted" style="font-size: 0.75rem;">
                                                                ${categoriaNombre}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            `;
            }).join('')}
                                        </div>
                                    ` : `
                                        <div class="alert alert-warning mb-0" style="font-size: 0.85rem;">
                                            <i class="bi bi-exclamation-triangle"></i> No hay jugadores asignados a este equipo
                                        </div>
                                    `}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        html += '</div>';

        document.getElementById('listaEquiposTorneo').innerHTML = html;
        document.getElementById('filtroEquiposTorneo').innerHTML = optionsHtml;

        const modal = new bootstrap.Modal(document.getElementById('modalVerEquiposTorneo'));
        modal.show();
    },

    filtrarEquiposTorneo() {
        const equipoIdSeleccionado = document.getElementById('filtroEquiposTorneo').value;
        const equiposCards = document.querySelectorAll('#listaEquiposTorneo .col-12');

        if (equipoIdSeleccionado === '') {
            // Mostrar todos los equipos
            equiposCards.forEach(card => card.style.display = '');
        } else {
            // Filtrar por equipo seleccionado
            const equipoSeleccionado = this.equipos.find(e => e.id == equipoIdSeleccionado);
            if (equipoSeleccionado) {
                equiposCards.forEach(card => {
                    const nombreEquipo = card.querySelector('h5')?.textContent || '';
                    if (nombreEquipo.includes(equipoSeleccionado.nombre)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        }
    },

    // ==================== FUNCIONALIDAD MODIFICAR ENCUENTROS ====================

    async mostrarModalCambiarPartidos(torneoId) {
        this.torneoActualCambio = torneoId;
        await this.loadData();

        const torneo = this.torneos.find(t => t.id === torneoId);
        if (!torneo) {
            alert('Torneo no encontrado');
            return;
        }

        const partidos = this.partidos.filter(p => p.torneoId === torneoId);

        // Obtener todas las jornadas/rondas únicas
        const rondasSet = new Set();
        partidos.forEach(p => {
            if (p.jornada) rondasSet.add(p.jornada);
            if (p.ronda) rondasSet.add(p.ronda);
        });

        const rondas = Array.from(rondasSet).sort((a, b) => a - b);

        // Llenar el selector de rondas
        const selectRonda = document.getElementById('filtroRondaCambio');
        let optionsHtml = '<option value="">Seleccionar jornada/ronda...</option>';

        if (torneo.tipo === 'todos-contra-todos' || torneo.tipo === 'grupos') {
            rondas.forEach(j => {
                optionsHtml += `<option value="${j}">Jornada ${j}</option>`;
            });
        } else {
            rondas.forEach(r => {
                const partidosRonda = partidos.filter(p => (p.ronda || p.jornada) === r);
                const fase = partidosRonda.length > 0 ? partidosRonda[0].fase : '';
                optionsHtml += `<option value="${r}">Ronda ${r}${fase ? ' - ' + fase : ''}</option>`;
            });
        }

        selectRonda.innerHTML = optionsHtml;

        // Limpiar la lista de partidos
        document.getElementById('listaPartidosCambio').innerHTML = '';

        const modal = new bootstrap.Modal(document.getElementById('modalCambiarPartidos'));
        modal.show();
    },

    async cargarPartidosParaCambio() {
        const rondaSeleccionada = document.getElementById('filtroRondaCambio').value;
        const container = document.getElementById('listaPartidosCambio');

        if (!rondaSeleccionada) {
            container.innerHTML = '<div class="alert alert-warning">Seleccione una jornada/ronda</div>';
            return;
        }

        await this.loadData();
        const torneoId = this.torneoActualCambio;
        const torneo = this.torneos.find(t => t.id === torneoId);

        // Filtrar partidos de la ronda seleccionada
        const partidos = this.partidos.filter(p =>
            p.torneoId === torneoId &&
            ((p.jornada && p.jornada == rondaSeleccionada) || (p.ronda && p.ronda == rondaSeleccionada))
        );

        if (partidos.length === 0) {
            container.innerHTML = '<div class="alert alert-info">No hay partidos en esta jornada/ronda</div>';
            return;
        }

        // Obtener todos los equipos del torneo
        const equiposTorneo = this.equipos.filter(e => torneo.equiposIds.includes(e.id));

        let html = '<div class="row g-3">';

        partidos.forEach((partido, index) => {
            const equipoLocal = this.equipos.find(e => e.id === partido.equipoLocalId);
            const equipoVisitante = this.equipos.find(e => e.id === partido.equipoVisitanteId);

            html += `
                <div class="col-12">
                    <div class="card shadow-sm">
                        <div class="card-header bg-light">
                            <h6 class="mb-0"><i class="bi bi-calendar-event"></i> Partido ${index + 1}</h6>
                        </div>
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-5">
                                    <label class="form-label fw-bold">Equipo Local</label>
                                    <select class="form-select" id="equipoLocal_${partido.id}" data-partido-id="${partido.id}">
                                        ${equiposTorneo.map(eq => `
                                            <option value="${eq.id}" ${eq.id === partido.equipoLocalId ? 'selected' : ''}>
                                                ${eq.nombre}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div class="col-md-2 text-center">
                                    <h4 class="text-muted mb-0">VS</h4>
                                </div>
                                <div class="col-md-5">
                                    <label class="form-label fw-bold">Equipo Visitante</label>
                                    <select class="form-select" id="equipoVisitante_${partido.id}" data-partido-id="${partido.id}">
                                        ${equiposTorneo.map(eq => `
                                            <option value="${eq.id}" ${eq.id === partido.equipoVisitanteId ? 'selected' : ''}>
                                                ${eq.nombre}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                            </div>
                            ${partido.estado === 'finalizado' ? `
                                <div class="alert alert-warning mt-3 mb-0">
                                    <i class="bi bi-exclamation-triangle"></i> Este partido ya fue jugado. Los cambios afectarán las estadísticas.
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    },

    async guardarCambiosPartidos() {
        const container = document.getElementById('listaPartidosCambio');
        const selects = container.querySelectorAll('select[data-partido-id]');

        if (selects.length === 0) {
            alert('No hay partidos para modificar');
            return;
        }

        // Validar que no haya equipos duplicados en el mismo partido
        const cambios = [];
        const partidosIds = new Set();

        selects.forEach(select => {
            const partidoId = parseInt(select.dataset.partidoId);
            partidosIds.add(partidoId);
        });

        for (let partidoId of partidosIds) {
            const selectLocal = document.getElementById(`equipoLocal_${partidoId}`);
            const selectVisitante = document.getElementById(`equipoVisitante_${partidoId}`);

            if (!selectLocal || !selectVisitante) continue;

            const equipoLocalId = parseInt(selectLocal.value);
            const equipoVisitanteId = parseInt(selectVisitante.value);

            // Validar que no sea el mismo equipo
            if (equipoLocalId === equipoVisitanteId) {
                alert('Un equipo no puede jugar contra sí mismo. Revise los partidos.');
                return;
            }

            cambios.push({
                partidoId,
                equipoLocalId,
                equipoVisitanteId
            });
        }

        // Validar que no haya equipos jugando más de una vez en la misma jornada
        const equiposUsados = new Map();
        for (let cambio of cambios) {
            if (equiposUsados.has(cambio.equipoLocalId)) {
                const equipo = this.equipos.find(e => e.id === cambio.equipoLocalId);
                alert(`El equipo "${equipo?.nombre}" está asignado a más de un partido en esta jornada. Cada equipo solo puede jugar una vez por jornada.`);
                return;
            }
            if (equiposUsados.has(cambio.equipoVisitanteId)) {
                const equipo = this.equipos.find(e => e.id === cambio.equipoVisitanteId);
                alert(`El equipo "${equipo?.nombre}" está asignado a más de un partido en esta jornada. Cada equipo solo puede jugar una vez por jornada.`);
                return;
            }
            equiposUsados.set(cambio.equipoLocalId, true);
            equiposUsados.set(cambio.equipoVisitanteId, true);
        }

        // Confirmar cambios
        if (!confirm('¿Está seguro de guardar estos cambios? Se modificarán los encuentros seleccionados.')) {
            return;
        }

        // Aplicar cambios
        for (let cambio of cambios) {
            const partido = this.partidos.find(p => p.id === cambio.partidoId);
            if (partido) {
                partido.equipoLocalId = cambio.equipoLocalId;
                partido.equipoVisitanteId = cambio.equipoVisitanteId;

                // Si el partido ya fue jugado, limpiar estadísticas para evitar inconsistencias
                if (partido.estado === 'finalizado') {
                    partido.golesLocal = 0;
                    partido.golesVisitante = 0;
                    partido.amarillasLocal = 0;
                    partido.rojasLocal = 0;
                    partido.amarillasVisitante = 0;
                    partido.rojasVisitante = 0;
                    partido.accionesLocal = [];
                    partido.accionesVisitante = [];
                    partido.goleadores = '';
                    partido.estado = 'pendiente';
                }

                await updateData('partidos_torneo', partido);
            }
        }

        alert('Cambios guardados exitosamente');

        // Cerrar modal
        bootstrap.Modal.getInstance(document.getElementById('modalCambiarPartidos')).hide();

        // Recargar datos y actualizar vista
        await this.loadData();
        await this.renderPartidos(this.torneoActualCambio);
    }
};

// Inicializar cuando se carga el módulo
if (typeof window !== 'undefined') {
    window.TorneosModule = TorneosModule;
}

function agregarAccionEquipo(side) {
    const jugadorSel = document.getElementById(side === 'local' ? 'selJugadorLocal' : 'selJugadorVisitante');
    const accionSel = document.getElementById(side === 'local' ? 'selAccionLocal' : 'selAccionVisitante');
    const minutoInp = document.getElementById(side === 'local' ? 'minutoLocal' : 'minutoVisitante');
    const jugadorId = parseInt(jugadorSel.value);
    const nombre = jugadorSel.options[jugadorSel.selectedIndex]?.text || '';
    const tipo = accionSel.value;
    const minuto = parseInt(minutoInp.value) || 0;
    if (!jugadorId || !tipo) { alert('Seleccione jugador y acción'); return; }
    const arrName = side === 'local' ? '_accionesLocal' : '_accionesVisitante';
    TorneosModule[arrName] = TorneosModule[arrName] || [];
    TorneosModule[arrName].push({ jugadorId, nombre, tipo, minuto });
    if (tipo === 'Gol') {
        const id = side === 'local' ? 'golesLocal' : 'golesVisitante';
        document.getElementById(id).value = parseInt(document.getElementById(id).value || 0) + 1;
    } else if (tipo === 'Tarjeta Amarilla') {
        const id = side === 'local' ? 'amarillasLocal' : 'amarillasVisitante';
        document.getElementById(id).value = parseInt(document.getElementById(id).value || 0) + 1;
    } else if (tipo === 'Tarjeta Roja') {
        const id = side === 'local' ? 'rojasLocal' : 'rojasVisitante';
        document.getElementById(id).value = parseInt(document.getElementById(id).value || 0) + 1;
    }
    renderAccionesEquipo(side);
}

function renderAccionesEquipo(side) {
    const listEl = document.getElementById(side === 'local' ? 'accionesLocalList' : 'accionesVisitanteList');
    const arr = TorneosModule[side === 'local' ? '_accionesLocal' : '_accionesVisitante'] || [];
    if (arr.length === 0) { listEl.innerHTML = '<div class="text-muted">Sin acciones registradas</div>'; return; }
    let html = '<ul class="list-group">';
    arr.forEach((a, idx) => {
        const badge = a.tipo === 'Gol' ? 'primary' : (a.tipo === 'Tarjeta Amarilla' ? 'warning' : 'danger');
        html += `<li class="list-group-item d-flex justify-content-between align-items-center">
            <span><span class="badge bg-${badge} me-2">${a.tipo}</span> ${a.nombre} <small class="text-muted">(${a.minuto}') </small></span>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarAccionEquipo('${side}', ${idx})"><i class="bi bi-x-lg"></i></button>
        </li>`;
    });
    html += '</ul>';
    listEl.innerHTML = html;
}

function eliminarAccionEquipo(side, index) {
    const arrName = side === 'local' ? '_accionesLocal' : '_accionesVisitante';
    const arr = TorneosModule[arrName] || [];
    const a = arr[index];
    if (!a) return;
    if (a.tipo === 'Gol') {
        const id = side === 'local' ? 'golesLocal' : 'golesVisitante';
        document.getElementById(id).value = Math.max(0, parseInt(document.getElementById(id).value || 0) - 1);
    } else if (a.tipo === 'Tarjeta Amarilla') {
        const id = side === 'local' ? 'amarillasLocal' : 'amarillasVisitante';
        document.getElementById(id).value = Math.max(0, parseInt(document.getElementById(id).value || 0) - 1);
    } else if (a.tipo === 'Tarjeta Roja') {
        const id = side === 'local' ? 'rojasLocal' : 'rojasVisitante';
        document.getElementById(id).value = Math.max(0, parseInt(document.getElementById(id).value || 0) - 1);
    }
    arr.splice(index, 1);
    TorneosModule[arrName] = arr;
    renderAccionesEquipo(side);
}

// Función principal de renderizado
async function renderTorneos() {
    const contentContainer = document.getElementById('contentContainer');
    contentContainer.innerHTML = TorneosModule.render();

    await TorneosModule.init();
    await TorneosModule.renderTorneos();
    await TorneosModule.renderEquipos();
}
