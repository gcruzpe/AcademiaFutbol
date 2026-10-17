// modules/alumnos.js - Módulo de Alumnos (PARTE 1 de 2)
async function renderAlumnos() {
    const container = document.getElementById('contentContainer');

    container.innerHTML = `
        <div class="module-card">
            <div class="module-header">
                <h4 style="font-family:'Roboto', Arial, sans-serif;"><i class="bi bi-people"></i> Gestión de Alumnos</h4>
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="mostrarModalAlumno()">
                        <i class="bi bi-plus-circle"></i> Nuevo Alumno
                    </button>
                    <button class="btn btn-info" onclick="mostrarModalImprimirListaAlumnos()">
                        <i class="bi bi-printer"></i> Ver Lista
                    </button>
                    <button class="btn btn-warning" onclick="mostrarModalNotificacionesDeuda()">
                        <i class="bi bi-bell"></i> Notificaciones
                    </button>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-4">
                    <div class="search-box">
                        <i class="bi bi-search"></i>
                        <input type="text" class="form-control" id="buscarAlumno" placeholder="Buscar alumno...">
                    </div>
                </div>

                <div class="col-md-2">
                    <select class="form-select" id="filtroDeporte" onchange="cargarAlumnos()">
                        <option value="">Todos los deportes</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filtroCategoria" onchange="cargarAlumnos()">
                        <option value="">Todas las categorías</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filtroEstadoPago" onchange="cargarAlumnos()">
                        <option value="todos">Estado de pago: Todos</option>
                        <option value="al-dia">Al día</option>
                        <option value="proximo-vencer">Próximo a vencer</option>
                        <option value="deuda">Deuda Pendiente</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filtroEstado" onchange="cargarAlumnos()">
                        <option value="todos">Todos</option>
                        <option value="activos">Activos</option>
                        <option value="inactivos">Inactivos</option>
                    </select>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-2">
                    <select class="form-select" id="filtroEdadTipo" onchange="onFiltroEdadChanged()">
                        <option value="">Filtro por edad</option>
                        <option value="igual">Igual a</option>
                        <option value="mayor">Mayor a</option>
                        <option value="menor">Menor a</option>
                        <option value="entre">Entre</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control" id="filtroEdadValor1" placeholder="Edad" min="0" oninput="cargarAlumnos()">
                </div>
                <div class="col-md-2" id="filtroEdadValor2Wrapper" style="display:none;">
                    <input type="number" class="form-control" id="filtroEdadValor2" placeholder="Hasta" min="0" oninput="cargarAlumnos()">
                </div>
                <div class="col-md-2 ms-auto text-end">
                    <button class="btn btn-secondary" onclick="limpiarFiltrosAlumnos()"><i class="bi bi-eraser"></i> Limpiar filtros</button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-modern" id="tablaAlumnos">
                    <thead>
                        <tr>
                            <th style="background-color:#cfe8ff;">Foto</th>
                            <th style="background-color:#cfe8ff;">Alumno</th>
                            <th style="background-color:#cfe8ff;">DNI</th>
                            <th style="background-color:#cfe8ff;">Edad</th>
                            <th style="background-color:#cfe8ff;">Deporte</th>
                            <th style="background-color:#cfe8ff;">Categoría</th>
                            <th style="background-color:#cfe8ff;">Membresía</th>
                            <th style="background-color:#cfe8ff;">Estado</th>
                            <th style="background-color:#cfe8ff;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="alumnosTableBody"></tbody>
                </table>
            </div>
        </div>

        <!-- Modal Alumno -->
        <div class="modal fade" id="modalAlumno" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-person-plus"></i> Nuevo Alumno
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formAlumno">
                            <input type="hidden" id="alumnoId">
                            
                            <h6 class="text-primary mb-3"><i class="bi bi-person"></i> Datos Personales</h6>
                            <div class="row">
                                <div class="col-md-3 text-center mb-3">
                                    <img id="fotoPreview" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e9ecef' width='100' height='100'/%3E%3Ctext fill='%236c757d' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='14'%3ESin foto%3C/text%3E%3C/svg%3E" class="photo-preview">
                                    <input type="file" class="form-control mt-2" id="alumnoFoto" accept="image/*" onchange="previewFoto(this)">
                                    <input type="hidden" id="alumnoFotoBase64">
                                </div>
                                <div class="col-md-9">
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Nombres *</label>
                                            <input type="text" class="form-control" id="alumnoNombres" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Apellidos *</label>
                                            <input type="text" class="form-control" id="alumnoApellidos" required>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <label class="form-label">DNI *</label>
                                            <input type="text" class="form-control" id="alumnoDni" maxlength="8" required>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <label class="form-label">Fecha Nacimiento *</label>
                                            <input type="date" class="form-control" id="alumnoFechaNac" required>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <label class="form-label">Género *</label>
                                            <select class="form-select" id="alumnoGenero" required>
                                                <option value="M">Masculino</option>
                                                <option value="F">Femenino</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h6 class="text-primary mb-3 mt-3"><i class="bi bi-dribbble"></i> Información Académica</h6>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Fecha de Inscripción *</label>
                                    <input type="date" class="form-control" id="alumnoFechaIns" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Deporte *</label>
                                    <select class="form-select" id="alumnoDeporte" required onchange="cargarCategoriasDeporte()"></select>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Categoría *</label>
                                    <select class="form-select" id="alumnoCategoria" required></select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Membresía 1 *</label>
                                    <select class="form-select" id="alumnoMembresia1" required></select>
                                    <div id="alumnoMembresia1Info" class="alert alert-secondary mt-2 p-2" style="font-size:13px"></div>
                                    <div class="input-group input-group-sm mt-2">
                                        <span class="input-group-text">Importe inicial</span>
                                        <input type="number" step="0.01" class="form-control" id="alumnoMembresia1Importe" placeholder="0.00">
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Membresía 2</label>
                                    <select class="form-select" id="alumnoMembresia2"></select>
                                    <div id="alumnoMembresia2Info" class="alert alert-secondary mt-2 p-2" style="font-size:13px"></div>
                                    <div class="input-group input-group-sm mt-2">
                                        <span class="input-group-text">Importe inicial</span>
                                        <input type="number" step="0.01" class="form-control" id="alumnoMembresia2Importe" placeholder="0.00">
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Membresía 3</label>
                                    <select class="form-select" id="alumnoMembresia3"></select>
                                    <div id="alumnoMembresia3Info" class="alert alert-secondary mt-2 p-2" style="font-size:13px"></div>
                                    <div class="input-group input-group-sm mt-2">
                                        <span class="input-group-text">Importe inicial</span>
                                        <input type="number" step="0.01" class="form-control" id="alumnoMembresia3Importe" placeholder="0.00">
                                    </div>
                                </div>
                            </div>

                            <h6 class="text-primary mb-3 mt-3"><i class="bi bi-telephone"></i> Contacto</h6>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Teléfono *</label>
                                    <input type="tel" class="form-control" id="alumnoTelefono" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" id="alumnoEmail">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Dirección</label>
                                    <input type="text" class="form-control" id="alumnoDireccion">
                                </div>
                            </div>

                            <h6 class="text-primary mb-3 mt-3"><i class="bi bi-person-lines-fill"></i> Contacto de Emergencia</h6>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Nombre *</label>
                                    <input type="text" class="form-control" id="alumnoEmergenciaNombre" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Teléfono / WhatsApp *</label>
                                    <input type="tel" class="form-control" id="alumnoEmergenciaTel" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Relación *</label>
                                    <input type="text" class="form-control" id="alumnoEmergenciaRelacion" required>
                                </div>
                            </div>

                            <h6 class="text-primary mb-3 mt-3"><i class="bi bi-heart-pulse"></i> Datos Médicos</h6>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Alergias</label>
                                    <input type="text" class="form-control" id="alumnoAlergias">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Condiciones Médicas</label>
                                    <input type="text" class="form-control" id="alumnoCondiciones">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Medicación</label>
                                    <input type="text" class="form-control" id="alumnoMedicacion">
                                </div>
                            </div>

                            <div class="mb-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="alumnoActivo" checked>
                                    <label class="form-check-label" for="alumnoActivo">Alumno Activo</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarAlumno()">
                            <i class="bi bi-save"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Ver Alumno -->
        <div class="modal fade" id="modalVerAlumno" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content border border-4 border-primary">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="bi bi-person-circle"></i> Ficha del Alumno</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="fichaAlumnoContent"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning d-flex align-items-center" style="height:42px;" onclick="verControlPagosAlumno()">
                            <i class="bi bi-clipboard-check"></i> Control de Pagos
                        </button>
                        <button type="button" class="btn btn-info d-flex align-items-center" style="height:42px;" onclick="verHistorialPagosCompras()">
                            <i class="bi bi-clock-history"></i> Historial de Pagos y Compras
                        </button>
                        <button type="button" class="btn btn-success d-flex align-items-center" style="height:42px;" onclick="verHistorialAsistenciaAlumno()">
                            <i class="bi bi-check2-circle"></i> Historial de Asistencia
                        </button>
                        <button type="button" class="btn btn-primary d-flex align-items-center" style="height:42px;" onclick="generarCredencial()">
                            <i class="bi bi-card-heading"></i> Generar Credencial
                        </button>
                        <button type="button" class="btn btn-secondary d-flex align-items-center" style="height:42px;" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalControlPagosAlumno" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content border border-4 border-danger">
                    <div class="modal-header bg-warning">
                        <h5 class="modal-title"><i class="bi bi-clipboard-check"></i> Control de Pagos del Alumno</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="controlPagosBody"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalPagoAlumno" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content border border-4 border-primary">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Pagar Cuota</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex align-items-center mb-3">
                            <img id="pagoAlumnoFoto" class="rounded-circle me-2" style="width:48px;height:48px;object-fit:cover;">
                            <div>
                                <div><strong id="pagoAlumnoNombre"></strong></div>
                                <div class="text-muted" id="pagoAlumnoDni"></div>
                            </div>
                        </div>
                        <form id="formPagoAlumno">
                            <input type="hidden" id="pagoAlumnoId">
                            <input type="hidden" id="pagoMembresiaId">
                            <div class="mb-2">
                                <label class="form-label">Cuota programada</label>
                                <input type="date" class="form-control" id="pagoCuotaFecha" readonly disabled>
                            </div>
                            <div class="mb-2">
                                <label class="form-label">Fecha de pago</label>
                                <input type="date" class="form-control" id="pagoFechaPago" value="${getFechaActual()}" readonly disabled>
                            </div>
                            <div class="mb-2">
                                <label class="form-label">Monto</label>
                                <input type="number" step="0.01" class="form-control" id="pagoMontoAlumno" readonly disabled>
                            </div>
                            <div class="mb-2">
                                <label class="form-label">N° de cuota</label>
                                <input type="text" class="form-control" id="pagoNumeroCuota" readonly disabled>
                            </div>
                            <div class="mb-2">
                                <label class="form-label">Método de Pago</label>
                                <select class="form-select" id="pagoMetodo">
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Tarjeta">Tarjeta</option>
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Yape">Yape</option>
                                    <option value="Plin">Plin</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div class="mb-2">
                            <label class="form-label">Tipo de Comprobante</label>
                            <select class="form-select" id="pagoComprobante">
                                    <option value="Boleta">Boleta</option>
                                    <option value="Factura">Factura</option>
                                    <option value="Ticket">Ticket</option>
                                    <option value="Recibo">Recibo</option>
                                    <option value="Nota de Venta">Nota de Venta</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarPagoAlumno()">Pagar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalComprobantePagoAlumno" tabindex="-1">
            <div class="modal-dialog" style="max-width:520px">
                <div class="modal-content border border-4 border-primary">
                    <div class="modal-header bg-info text-dark">
                        <h5 class="modal-title"><i class="bi bi-receipt"></i> Comprobante de Pago</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="comprobantePagoAlumnoContent"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn" style="background-color:#cfe8ff;color:#000" onclick="imprimirComprobantePagoAlumno()"><i class="bi bi-printer"></i> Imprimir</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalNotificacionesDeuda" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content border border-4 border-danger">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title"><i class="bi bi-bell"></i> Notificaciones - Deuda Pendiente</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="notificacionesDeudaBody"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalHistorialAlumno" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content border border-4 border-success">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="bi bi-clock-history"></i> Historial de Pagos y Compras</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="historialAlumnoBody"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalHistorialAsistenciaAlumno" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content border border-4 border-success">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="bi bi-check2-circle"></i> Historial de Asistencia</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="historialAsistenciaBody"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalImprimirListaAlumnos" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="bi bi-printer"></i> Lista de Alumnos</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="imprimirListaAlumnosBody"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn" style="background-color:#cfe8ff;color:#000" onclick="imprimirListaAlumnos()"><i class="bi bi-printer"></i> Imprimir</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Evaluaciones -->
        <div class="modal fade" id="modalEvaluacionesAlumno" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content border border-4 border-info">
                    <div class="modal-header bg-info text-dark">
                        <h5 class="modal-title"><i class="bi bi-clipboard-data"></i> Evaluaciones del Alumno</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="evalAlumnoId">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">Fecha</label>
                                <input type="date" class="form-control" id="evalFecha" value="${getFechaActual()}">
                            </div>
                            <div class="col-md-9 text-end">
                                <div class="btn-group" role="group">
                                    <button class="btn btn-outline-primary" onclick="guardarEvaluacionAlumno()"><i class="bi bi-save"></i> Guardar Evaluación</button>
                                    <button class="btn btn-outline-secondary" onclick="renderChartsEvaluacion()"><i class="bi bi-bar-chart"></i> Ver Gráficos</button>
                                </div>
                            </div>
                        </div>

                        <div class="alert alert-info mt-3">
                            <div class="d-flex align-items-center mb-2"><i class="bi bi-info-circle me-2"></i><strong>Guía de evaluación</strong></div>
                            <ul class="mb-0">
                                <li>Escala 1–5: 1 Deficiente · 2 En desarrollo · 3 Aceptable · 4 Bueno · 5 Destacado.</li>
                                <li>Unidades físicas: cm, kg, s, m. Velocidad y Agilidad: menor es mejor; Cooper y Salto: mayor es mejor.</li>
                                <li>Notas: registre observaciones objetivas y metas para el próximo periodo.</li>
                            </ul>
                        </div>

                        <ul class="nav nav-tabs mt-3" role="tablist">
                            <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabFisico" type="button"><i class="bi bi-activity me-1"></i> Físico</button></li>
                            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabTecnica" type="button"><i class="bi bi-hand-index-thumb me-1"></i> Técnica</button></li>
                            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabTactica" type="button"><i class="bi bi-diagram-3 me-1"></i> Táctica</button></li>
                            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabPsico" type="button"><i class="bi bi-heart-pulse me-1"></i> Psico</button></li>
                            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabResumen" type="button"><i class="bi bi-bar-chart-line me-1"></i> Resumen</button></li>
                        </ul>

                        <div class="tab-content p-3 border border-top-0 rounded-bottom">
                            <div class="tab-pane fade show active" id="tabFisico">
                                <div class="row g-3">
                                    <div class="col-md-3"><label class="form-label">Estatura (cm)</label><input type="number" class="form-control" id="evalEstatura" placeholder="Ej: 145" title="Valor en centímetros"></div>
                                    <div class="col-md-3"><label class="form-label">Peso (kg)</label><input type="number" step="0.1" class="form-control" id="evalPeso" placeholder="Ej: 38.5" title="Valor en kilogramos"></div>
                                    <div class="col-md-3"><label class="form-label">Envergadura (cm)</label><input type="number" class="form-control" id="evalEnvergadura" placeholder="Ej: 150"></div>
                                    <div class="col-md-3"><label class="form-label">Velocidad 20m (s)</label><input type="number" step="0.01" class="form-control" id="evalVelocidad20" placeholder="Ej: 4.20" title="Segundos (menor es mejor)"></div>
                                    <div class="col-md-3"><label class="form-label">Resistencia (Cooper m)</label><input type="number" class="form-control" id="evalCooper" placeholder="Ej: 1800" title="Metros recorridos"></div>
                                    <div class="col-md-3"><label class="form-label">Salto vertical (cm)</label><input type="number" class="form-control" id="evalSaltoV" placeholder="Ej: 28" title="Centímetros (mayor es mejor)"></div>
                                    <div class="col-md-3"><label class="form-label">Agilidad (s)</label><input type="number" step="0.01" class="form-control" id="evalAgilidad" placeholder="Ej: 6.50" title="Segundos (menor es mejor)"></div>
                                    <div class="col-12"><small class="text-muted">Registre valores con sus unidades. Evite comparaciones directas entre alumnos; enfoque en la evolución individual.</small></div>
                                </div>
                            </div>

                            <div class="tab-pane fade" id="tabTecnica">
                                <div class="row g-3">
                                    <div class="col-md-3"><label class="form-label">Control</label><input type="number" min="1" max="5" class="form-control" id="tecControl" placeholder="1–5"></div>
                                    <div class="col-md-3"><label class="form-label">Pase</label><input type="number" min="1" max="5" class="form-control" id="tecPase" placeholder="1–5"></div>
                                    <div class="col-md-3"><label class="form-label">Remate/Tiro</label><input type="number" min="1" max="5" class="form-control" id="tecRemate" placeholder="1–5"></div>
                                    <div class="col-md-3"><label class="form-label">Conducción</label><input type="number" min="1" max="5" class="form-control" id="tecConduccion" placeholder="1–5"></div>
                                    <div class="col-md-3"><label class="form-label">Marcaje</label><input type="number" min="1" max="5" class="form-control" id="defMarcaje" placeholder="1–5"></div>
                                    <div class="col-md-3"><label class="form-label">Posicionamiento</label><input type="number" min="1" max="5" class="form-control" id="defPosicionamiento" placeholder="1–5"></div>
                                    <div class="col-md-3"><label class="form-label">Recuperación</label><input type="number" min="1" max="5" class="form-control" id="defRecuperacion" placeholder="1–5"></div>
                                    <div class="col-12"><small class="text-muted">Escala 1–5: 1 Deficiente · 3 Aceptable · 5 Destacado.</small></div>
                                </div>
                            </div>

                            <div class="tab-pane fade" id="tabTactica">
                                <div class="row g-3">
                                    <div class="col-md-4"><label class="form-label">Decisiones</label><input type="number" min="1" max="5" class="form-control" id="tacDecisiones" placeholder="1–5"></div>
                                    <div class="col-md-4"><label class="form-label">Visión de juego</label><input type="number" min="1" max="5" class="form-control" id="tacVision" placeholder="1–5"></div>
                                    <div class="col-md-4"><label class="form-label">Posicionamiento</label><input type="number" min="1" max="5" class="form-control" id="tacPosicionamiento" placeholder="1–5"></div>
                                    <div class="col-12"><small class="text-muted">Escala 1–5 con criterios observables: toma de decisiones, anticipación y ubicación en juego.</small></div>
                                </div>
                            </div>

                            <div class="tab-pane fade" id="tabPsico">
                                <div class="row g-3">
                                    <div class="col-md-3"><label class="form-label">Disciplina</label><input type="number" min="1" max="5" class="form-control" id="psiDisciplina" placeholder="1–5"></div>
                                    <div class="col-md-3"><label class="form-label">Compañerismo</label><input type="number" min="1" max="5" class="form-control" id="psiCompanerismo" placeholder="1–5"></div>
                                    <div class="col-md-3"><label class="form-label">Esfuerzo</label><input type="number" min="1" max="5" class="form-control" id="psiEsfuerzo" placeholder="1–5"></div>
                                    <div class="col-md-3"><label class="form-label">Respeto</label><input type="number" min="1" max="5" class="form-control" id="psiRespeto" placeholder="1–5"></div>
                                    <div class="col-md-12"><label class="form-label">Observaciones</label><textarea class="form-control" id="evalNotas" rows="3" placeholder="Ej: actitud, metas, recomendaciones"></textarea></div>
                                    <div class="col-12"><small class="text-muted">Use descriptores claros y ejemplos concretos; evite juicios personales.</small></div>
                                </div>
                            </div>

                            <div class="tab-pane fade" id="tabResumen">
                                <div class="alert alert-secondary">El gráfico Radar muestra el promedio de Técnica, Táctica y Psico. La línea de tiempo refleja la evolución de la Velocidad 20m (s) por fecha.</div>
                                <div class="row g-3">
                                    <div class="col-md-6"><div style="height:280px;"><canvas id="chartRadarEvaluacion"></canvas></div></div>
                                    <div class="col-md-6"><div style="height:280px;"><canvas id="chartTimelineVelocidad"></canvas></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    await cargarFiltros();
    await cargarAlumnos();
    buscarEnTabla('buscarAlumno', 'tablaAlumnos');
}

async function mostrarModalEvaluaciones(alumnoId) {
    const alumno = await getAlumnoById(alumnoId);
    document.getElementById('evalAlumnoId').value = alumnoId;
    const fechaEl = document.getElementById('evalFecha');
    if (fechaEl) fechaEl.value = getFechaActual();

    const evals = await getEvaluacionesByAlumno(alumnoId);
    if (evals && evals.length) {
        const last = evals[evals.length - 1];
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = (val ?? ''); };
        set('evalEstatura', last.fisico?.estatura);
        set('evalPeso', last.fisico?.peso);
        set('evalEnvergadura', last.fisico?.envergadura);
        set('evalVelocidad20', last.fisico?.velocidad20);
        set('evalCooper', last.fisico?.cooper);
        set('evalSaltoV', last.fisico?.saltoV);
        set('evalAgilidad', last.fisico?.agilidad);
        set('tecControl', last.tecnica?.control);
        set('tecPase', last.tecnica?.pase);
        set('tecRemate', last.tecnica?.remate);
        set('tecConduccion', last.tecnica?.conduccion);
        set('defMarcaje', last.tecnica?.marcaje);
        set('defPosicionamiento', last.tecnica?.posicionamiento);
        set('defRecuperacion', last.tecnica?.recuperacion);
        set('tacDecisiones', last.tactica?.decisiones);
        set('tacVision', last.tactica?.vision);
        set('tacPosicionamiento', last.tactica?.posicionamiento);
        set('psiDisciplina', last.psico?.disciplina);
        set('psiCompanerismo', last.psico?.companierismo);
        set('psiEsfuerzo', last.psico?.esfuerzo);
        set('psiRespeto', last.psico?.respeto);
        set('evalNotas', last.notas);
    }

    renderChartsEvaluacion(alumnoId);
    new bootstrap.Modal(document.getElementById('modalEvaluacionesAlumno')).show();
}

async function guardarEvaluacionAlumno() {
    const alumnoId = parseInt(document.getElementById('evalAlumnoId').value);
    const empresa = getCurrentEmpresa();
    const fecha = document.getElementById('evalFecha').value || getFechaActual();
    const num = (id) => { const v = document.getElementById(id)?.value; return v === '' ? null : Number(v); };

    const data = {
        empresaId: empresa.id,
        alumnoId,
        fecha,
        fisico: {
            estatura: num('evalEstatura'), peso: num('evalPeso'), envergadura: num('evalEnvergadura'),
            velocidad20: num('evalVelocidad20'), cooper: num('evalCooper'), saltoV: num('evalSaltoV'), agilidad: num('evalAgilidad')
        },
        tecnica: {
            control: num('tecControl'), pase: num('tecPase'), remate: num('tecRemate'), conduccion: num('tecConduccion'),
            marcaje: num('defMarcaje'), posicionamiento: num('defPosicionamiento'), recuperacion: num('defRecuperacion')
        },
        tactica: {
            decisiones: num('tacDecisiones'), vision: num('tacVision'), posicionamiento: num('tacPosicionamiento')
        },
        psico: {
            disciplina: num('psiDisciplina'), companierismo: num('psiCompanerismo'), esfuerzo: num('psiEsfuerzo'), respeto: num('psiRespeto')
        },
        notas: document.getElementById('evalNotas')?.value || ''
    };

    await addData('evaluaciones', data);
    mostrarAlerta('Evaluación guardada', 'success');
    renderChartsEvaluacion(alumnoId);
}

async function renderChartsEvaluacion(alumnoIdOpt) {
    const alumnoId = alumnoIdOpt || parseInt(document.getElementById('evalAlumnoId').value);
    if (!alumnoId) return;
    const evals = await getEvaluacionesByAlumno(alumnoId);
    const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const tecVals = evals.map(e => [e.tecnica?.control, e.tecnica?.pase, e.tecnica?.remate, e.tecnica?.conduccion, e.tecnica?.marcaje, e.tecnica?.posicionamiento, e.tecnica?.recuperacion]
        .filter(x => Number.isFinite(x))).flat();
    const tacVals = evals.map(e => [e.tactica?.decisiones, e.tactica?.vision, e.tactica?.posicionamiento]
        .filter(x => Number.isFinite(x))).flat();
    const psiVals = evals.map(e => [e.psico?.disciplina, e.psico?.companierismo, e.psico?.esfuerzo, e.psico?.respeto]
        .filter(x => Number.isFinite(x))).flat();

    const radarLabels = ['Técnica', 'Táctica', 'Psico'];
    const radarData = [avg(tecVals), avg(tacVals), avg(psiVals)];
    const radarEl = document.getElementById('chartRadarEvaluacion');
    if (radarEl) {
        const ctx = radarEl.getContext('2d');
        if (radarEl._chart) radarEl._chart.destroy();
        radarEl._chart = new Chart(ctx, {
            type: 'radar',
            data: { labels: radarLabels, datasets: [{ data: radarData, backgroundColor: 'rgba(30,86,160,0.15)', borderColor: '#1e56a0' }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { r: { beginAtZero: true, min: 0, max: 5 } }, plugins: { legend: { display: false } } }
        });
    }

    const velEls = evals.filter(e => Number.isFinite(e.fisico?.velocidad20));
    const lineEl = document.getElementById('chartTimelineVelocidad');
    if (lineEl) {
        const ctx = lineEl.getContext('2d');
        if (lineEl._chart) lineEl._chart.destroy();
        lineEl._chart = new Chart(ctx, {
            type: 'line',
            data: { labels: velEls.map(e => e.fecha), datasets: [{ label: 'Velocidad 20m (s)', data: velEls.map(e => e.fisico.velocidad20), borderColor: '#2d7dd2', fill: false }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true } } }
        });
    }
}

// Continúa en la siguiente parte...

// Continuación de alumnos.js - PARTE 2
async function cargarFiltros() {
    const empresa = getCurrentEmpresa();
    // Obtener deportes desde configuración
    const deportes = await getDeportesFromConfig();
    const categorias = await getDataByEmpresa('categorias', empresa.id);

    const filtroDeporte = document.getElementById('filtroDeporte');
    if (filtroDeporte) {
        filtroDeporte.innerHTML = '<option value="">Todos los deportes</option>' +
            deportes.map(d => `<option value="${d}">${d}</option>`).join('');
    }
    const filtroCategoria = document.getElementById('filtroCategoria');
    if (filtroCategoria) {
        filtroCategoria.innerHTML = '<option value="">Todas las categorías</option>' +
            categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
    }
}

async function cargarAlumnos() {
    const empresa = getCurrentEmpresa();
    let alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const membresias = await getDataByEmpresa('membresias', empresa.id);
    const categorias = await getDataByEmpresa('categorias', empresa.id);

    const filtroDeporte = document.getElementById('filtroDeporte')?.value || '';
    const filtroEstado = document.getElementById('filtroEstado').value;
    const filtroEstadoPago = document.getElementById('filtroEstadoPago')?.value || 'todos';
    const filtroCategoria = document.getElementById('filtroCategoria')?.value || '';
    const filtroEdadTipo = document.getElementById('filtroEdadTipo')?.value || '';
    const filtroEdadVal1 = document.getElementById('filtroEdadValor1')?.value || '';
    const filtroEdadVal2 = document.getElementById('filtroEdadValor2')?.value || '';

    if (filtroDeporte) {
        alumnos = alumnos.filter(a => (a.deporte || '') === filtroDeporte);
    }
    if (filtroCategoria) {
        alumnos = alumnos.filter(a => a.categoriaId == filtroCategoria);
    }
    if (filtroEdadTipo) {
        const v1 = parseInt(filtroEdadVal1);
        const v2 = parseInt(filtroEdadVal2);
        alumnos = alumnos.filter(a => {
            const e = a.fechaNacimiento ? calcularEdad(a.fechaNacimiento) : null;
            if (!Number.isFinite(e)) return false;
            if (filtroEdadTipo === 'igual') return Number.isFinite(v1) && e === v1;
            if (filtroEdadTipo === 'mayor') return Number.isFinite(v1) && e > v1;
            if (filtroEdadTipo === 'menor') return Number.isFinite(v1) && e < v1;
            if (filtroEdadTipo === 'entre') {
                if (!Number.isFinite(v1) || !Number.isFinite(v2)) return false;
                const min = Math.min(v1, v2);
                const max = Math.max(v1, v2);
                return e >= min && e <= max;
            }
            return true;
        });
    }

    if (filtroEstado === 'activos') {
        alumnos = alumnos.filter(a => a.activo);
    } else if (filtroEstado === 'inactivos') {
        alumnos = alumnos.filter(a => !a.activo);
    }

    const tbody = document.getElementById('alumnosTableBody');

    if (alumnos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No hay alumnos registrados</td></tr>';
        return;
    }

    const rows = await Promise.all(alumnos.map(async alumno => {
        const deporteNombre = alumno.deporte || '—';
        const membIds = Array.isArray(alumno.membresiaIds) ? alumno.membresiaIds : (alumno.membresiaId ? [alumno.membresiaId] : []);
        const membresia = membresias.find(m => m.id === (membIds[0] || -9999));
        const membNames = membIds.map(id => {
            const mm = membresias.find(m => m.id === id);
            return mm ? mm.nombre : null;
        }).filter(Boolean).join(', ');
        const categoria = categorias.find(c => c.id === alumno.categoriaId);
        const categoriaNombre = categoria ? categoria.nombre : '-';
        const edad = alumno.fechaNacimiento ? calcularEdad(alumno.fechaNacimiento) : '-';
        let estadoPago = alumno.fechaVencimiento ? verificarEstadoPagoSync(alumno.fechaVencimiento) : 'sin-membresia';
        let badgeEstado = '';
        if (estadoPago === 'al-dia') {
            badgeEstado = '<span class="badge-status badge-paid">Al día</span>';
        } else if (estadoPago === 'proximo-vencer') {
            badgeEstado = '<span class="badge-status badge-pending">Próximo a vencer</span>';
        } else if (estadoPago === 'vencido') {
            badgeEstado = '<span class="badge-status badge-overdue">Vencido</span>';
        } else {
            badgeEstado = '<span class="badge-status badge-inactive">Sin membresía</span>';
        }
        const pagosAlumno = await getPagosByAlumno(alumno.id);
        const fechaRegistro = (alumno.fechaRegistro || '').split('T')[0] || alumno.fechaRegistro;
        let esProximoVencer = false;
        const hoyStr = getFechaActual();
        const hoy = new Date(hoyStr);
        for (const mid of membIds) {
            const m = membresias.find(mm => mm.id === mid);
            if (!m) continue;
            const inicioM = (m.fechaInicio || '').split('T')[0] || m.fechaInicio || fechaRegistro;
            const items = generarCuotasConPeriodo(inicioM, m.duracion || 0, m.tipo || 'Mensual', fechaRegistro);
            const pagosMemb = pagosAlumno.filter(p => parseInt(p.membresiaId) === parseInt(m.id));
            for (const it of items) {
                const dInicio = new Date(it.inicio);
                if (dInicio <= hoy) continue;
                const pagada = pagosMemb.some(p => (p.cuotaInicio && p.cuotaInicio === it.inicio) || pagoCubrePeriodo(p.fecha, it.inicio, it.fin));
                if (pagada) continue;
                const dias = diferenciaDiasExacta(hoyStr, it.inicio);
                if (dias >= 1 && dias <= 4) { esProximoVencer = true; break; }
            }
            if (esProximoVencer) break;
        }
        try {
            const estadoCuotas = await evaluarDeudaAlumnoPorCuotas(alumno);
            if (estadoCuotas === 'deuda') {
                badgeEstado = '<span class="badge-status badge-overdue">Deuda Pendiente</span>';
                estadoPago = 'deuda';
            } else if (estadoCuotas === 'al-dia') {
                badgeEstado = '<span class="badge-status badge-paid">Al día</span>';
                estadoPago = 'al-dia';
            }
        } catch (e) { }
        if (esProximoVencer && estadoPago !== 'deuda') {
            badgeEstado = '<span class="badge-status badge-pending">Próximo a vencer</span>';
            estadoPago = 'proximo-vencer';
        }
        if (filtroEstadoPago !== 'todos' && estadoPago !== filtroEstadoPago) return '';
        const fotoSrc = alumno.foto || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23e9ecef' width='40' height='40'/%3E%3C/svg%3E";
        return `
            <tr>
                <td><img src="${fotoSrc}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;"></td>
                <td><strong>${alumno.nombres} ${alumno.apellidos}</strong></td>
                <td>${alumno.dni}</td>
                <td>${edad} años</td>
                <td>${deporteNombre}</td>
                <td>${categoriaNombre}</td>
                <td>${membNames || (membresia ? membresia.nombre : '-')}</td>
                <td>${badgeEstado}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-icon" onclick="verFichaAlumno(${alumno.id})" title="Ver Ficha">
                        <i class="bi bi-eye"></i>
                    </button>
                    <!-- <button class="btn btn-sm btn-warning btn-icon" onclick="mostrarModalEvaluaciones(${alumno.id})" title="Evaluaciones">
                        <i class="bi bi-clipboard-data"></i>
                    </button> -->
                    <button class="btn btn-sm btn-primary btn-icon" onclick="editarAlumno(${alumno.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon" onclick="eliminarAlumno(${alumno.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }));
    const finalRows = rows.filter(r => r && r.trim() !== '');
    tbody.innerHTML = finalRows.length ? finalRows.join('') : '<tr><td colspan="9" class="text-center">No hay alumnos que coincidan</td></tr>';
}

function onFiltroEdadChanged() {
    const tipo = document.getElementById('filtroEdadTipo')?.value || '';
    const wrap = document.getElementById('filtroEdadValor2Wrapper');
    if (wrap) wrap.style.display = (tipo === 'entre') ? '' : 'none';
    cargarAlumnos();
}

function limpiarFiltrosAlumnos() {
    const buscar = document.getElementById('buscarAlumno');
    const dep = document.getElementById('filtroDeporte');
    const cat = document.getElementById('filtroCategoria');
    const estPago = document.getElementById('filtroEstadoPago');
    const est = document.getElementById('filtroEstado');
    const edadTipo = document.getElementById('filtroEdadTipo');
    const edad1 = document.getElementById('filtroEdadValor1');
    const edad2 = document.getElementById('filtroEdadValor2');
    const wrap = document.getElementById('filtroEdadValor2Wrapper');
    if (buscar) buscar.value = '';
    if (dep) dep.value = '';
    if (cat) cat.value = '';
    if (estPago) estPago.value = 'todos';
    if (est) est.value = 'todos';
    if (edadTipo) edadTipo.value = '';
    if (edad1) edad1.value = '';
    if (edad2) edad2.value = '';
    if (wrap) wrap.style.display = 'none';
    cargarAlumnos();
}

async function mostrarModalImprimirListaAlumnos() {
    const empresa = getCurrentEmpresa();
    window.alumnosParaWhatsApp = [];
    const cfgRows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    const razonEmpresa = (cfgRows && cfgRows[0] && cfgRows[0].empresaRazonSocial) ? cfgRows[0].empresaRazonSocial : (empresa?.nombre || '');
    let alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const deportes = await getDataByEmpresa('deportes', empresa.id);
    const membresias = await getDataByEmpresa('membresias', empresa.id);
    const categorias = await getDataByEmpresa('categorias', empresa.id);
    const filtroDeporte = document.getElementById('filtroDeporte')?.value || '';
    const filtroEstado = document.getElementById('filtroEstado').value;
    const filtroEstadoPago = document.getElementById('filtroEstadoPago')?.value || 'todos';
    const filtroCategoria = document.getElementById('filtroCategoria')?.value || '';
    const filtroEdadTipo = document.getElementById('filtroEdadTipo')?.value || '';
    const filtroEdadVal1 = document.getElementById('filtroEdadValor1')?.value || '';
    const filtroEdadVal2 = document.getElementById('filtroEdadValor2')?.value || '';
    const buscar = document.getElementById('buscarAlumno')?.value?.toLowerCase() || '';
    if (filtroDeporte) alumnos = alumnos.filter(a => (a.deporte || '') === filtroDeporte);
    if (filtroCategoria) alumnos = alumnos.filter(a => a.categoriaId == filtroCategoria);
    if (filtroEdadTipo) {
        const v1 = parseInt(filtroEdadVal1);
        const v2 = parseInt(filtroEdadVal2);
        alumnos = alumnos.filter(a => {
            const e = a.fechaNacimiento ? calcularEdad(a.fechaNacimiento) : null;
            if (!Number.isFinite(e)) return false;
            if (filtroEdadTipo === 'igual') return Number.isFinite(v1) && e === v1;
            if (filtroEdadTipo === 'mayor') return Number.isFinite(v1) && e > v1;
            if (filtroEdadTipo === 'menor') return Number.isFinite(v1) && e < v1;
            if (filtroEdadTipo === 'entre') {
                if (!Number.isFinite(v1) || !Number.isFinite(v2)) return false;
                const min = Math.min(v1, v2);
                const max = Math.max(v1, v2);
                return e >= min && e <= max;
            }
            return true;
        });
    }
    if (filtroEstado === 'activos') alumnos = alumnos.filter(a => a.activo);
    else if (filtroEstado === 'inactivos') alumnos = alumnos.filter(a => !a.activo);
    if (buscar) {
        alumnos = alumnos.filter(a => {
            const t = `${a.nombres || ''} ${a.apellidos || ''} ${a.dni || ''}`.toLowerCase();
            return t.includes(buscar);
        });
    }
    const hoyStr = getFechaActual();
    const rows = await Promise.all(alumnos.map(async alumno => {
        const deporte = deportes.find(d => d.id === alumno.deporteId);
        const membIds = Array.isArray(alumno.membresiaIds) ? alumno.membresiaIds : (alumno.membresiaId ? [alumno.membresiaId] : []);
        const membresia = membresias.find(m => m.id === (membIds[0] || -9999));
        const membNames = membIds.map(id => {
            const mm = membresias.find(m => m.id === id);
            return mm ? mm.nombre : null;
        }).filter(Boolean).join(', ');
        const categoria = categorias.find(c => c.id === alumno.categoriaId);
        const categoriaNombre = categoria ? categoria.nombre : '-';
        const edadVal = alumno.fechaNacimiento ? calcularEdad(alumno.fechaNacimiento) : null;
        let estadoPago = alumno.fechaVencimiento ? verificarEstadoPagoSync(alumno.fechaVencimiento) : 'sin-membresia';
        let esProximoVencer = false;
        const hoy = new Date(hoyStr);
        const pagosAlumno = await getPagosByAlumno(alumno.id);
        const fechaRegistro = (alumno.fechaRegistro || '').split('T')[0] || alumno.fechaRegistro;
        for (const mid of membIds) {
            const m = membresias.find(mm => mm.id === mid);
            if (!m) continue;
            const inicioM = (m.fechaInicio || '').split('T')[0] || m.fechaInicio || fechaRegistro;
            const items = generarCuotasConPeriodo(inicioM, m.duracion || 0, m.tipo || 'Mensual', fechaRegistro);
            const pagosMemb = pagosAlumno.filter(p => parseInt(p.membresiaId) === parseInt(m.id));
            for (const it of items) {
                const dInicio = new Date(it.inicio);
                if (dInicio <= hoy) continue;
                const pagada = pagosMemb.some(p => (p.cuotaInicio && p.cuotaInicio === it.inicio) || pagoCubrePeriodo(p.fecha, it.inicio, it.fin));
                if (pagada) continue;
                const dias = diferenciaDiasExacta(hoyStr, it.inicio);
                if (dias >= 1 && dias <= 4) { esProximoVencer = true; break; }
            }
            if (esProximoVencer) break;
        }
        try {
            const estadoCuotas = await evaluarDeudaAlumnoPorCuotas(alumno);
            if (estadoCuotas === 'deuda') estadoPago = 'deuda';
            else if (estadoCuotas === 'al-dia') estadoPago = 'al-dia';
        } catch (e) { }
        if (esProximoVencer && estadoPago !== 'deuda') estadoPago = 'proximo-vencer';
        if (filtroEstadoPago !== 'todos' && estadoPago !== filtroEstadoPago) return '';
        const estadoTxt = estadoPago === 'al-dia' ? 'Al día' : (estadoPago === 'proximo-vencer' ? 'Próximo a vencer' : (estadoPago === 'deuda' ? 'Deuda Pendiente' : 'Sin membresía'));
        const apoderado = alumno.emergenciaNombre || '-';
        const tel = alumno.emergenciaTel || '';
        const telClean = String(tel).replace(/\D+/g, '');
        const relacion = (alumno.emergenciaRelacion || '').toLowerCase();
        let tratamiento = 'Sr.';
        if (relacion.includes('madre') || relacion.includes('tía') || relacion.includes('tia') || relacion.includes('abuela') || relacion.includes('hermana') || relacion.includes('prima')) tratamiento = 'Sra.';
        else if (relacion.includes('padre') || relacion.includes('tío') || relacion.includes('tio') || relacion.includes('abuelo') || relacion.includes('hermano') || relacion.includes('primo')) tratamiento = 'Sr.';
        else if (alumno.genero === 'F') tratamiento = 'Sra.';
        const apoderadoFull = `${tratamiento} ${apoderado}`;
        const waLink = telClean ? `<a href="#" onclick="enviarMensajeWhatsApp('${telClean}', '${apoderadoFull.replace(/'/g, "\\'")}', '${razonEmpresa.replace(/'/g, "\\'")}'); return false;" class="text-decoration-none"><i class="bi bi-whatsapp text-success"></i> ${tel}</a>` : (tel || '-');

        if (telClean) {
            window.alumnosParaWhatsApp.push({
                telefono: telClean,
                apoderado: apoderadoFull,
                razonSocial: razonEmpresa
            });
        }

        return `
            <tr>
                <td><strong>${alumno.nombres} ${alumno.apellidos}</strong></td>
                <td>${alumno.dni || '-'}</td>
                <td>${categoriaNombre}</td>
                <td>${membNames || (membresia ? membresia.nombre : '-')}</td>
                <td>${apoderado}</td>
                <td>${waLink}</td>
            </tr>
        `;
    }));
    const finalRows = rows.filter(r => r && r.trim() !== '');
    const bodyEl = document.getElementById('imprimirListaAlumnosBody');
    bodyEl.innerHTML = `
        <div class="mb-3">
            <label for="mensajeGlobalWhatsApp" class="form-label text-primary"><i class="bi bi-whatsapp"></i> Mensaje predeterminado para WhatsApp</label>
            <div class="input-group">
                <textarea class="form-control" id="mensajeGlobalWhatsApp" rows="2" placeholder="Escribe un mensaje aquí para que se cargue automáticamente al hacer clic en el número de WhatsApp..."></textarea>
                <button class="btn btn-success" type="button" onclick="enviarMasivoWhatsApp()"><i class="bi bi-whatsapp"></i> Enviar Masivo</button>
            </div>
            <div class="form-text text-muted">Nota: Asegúrese de permitir ventanas emergentes para el envío masivo.</div>
        </div>
        <div class="table-responsive">
            <table class="table table-modern">
                <thead style="background:#fff3cd;color:#000;">
                    <tr>
                        <th style="background-color:#fff3cd;">Alumno</th>
                        <th style="background-color:#fff3cd;">DNI</th>
                        <th style="background-color:#fff3cd;">Categoría</th>
                        <th style="background-color:#fff3cd;">Membresía</th>
                        <th style="background-color:#fff3cd;">Apoderado</th>
                        <th style="background-color:#fff3cd;">WhatsApp</th>
                    </tr>
                </thead>
                <tbody>
                    ${finalRows.length ? finalRows.join('') : '<tr><td colspan="7" class="text-center">No hay alumnos que coincidan</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
    const modal = new bootstrap.Modal(document.getElementById('modalImprimirListaAlumnos'));
    modal.show();
}

function imprimirListaAlumnos() {
    const bodyEl = document.getElementById('imprimirListaAlumnosBody');
    if (!bodyEl) return;
    const content = bodyEl.innerHTML;
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return;
    w.document.open();
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Lista de Alumnos</title><style>body{font-family:Arial,Helvetica,sans-serif;margin:20px;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;font-size:14px;} th{background:#f0f4ff;text-align:left;} h1{font-size:18px;margin-bottom:12px;}</style></head><body><h1>Lista de Alumnos</h1>${content}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
}

window.enviarMensajeWhatsApp = function (telefono, apoderado, razonSocial) {
    const mensajeInput = document.getElementById('mensajeGlobalWhatsApp');
    const mensaje = mensajeInput ? mensajeInput.value : '';
    const empresa = getCurrentEmpresa();
    const razonFinal = razonSocial || empresa.nombre || 'Academia';

    // Formato: Apoderado + "Mensaje" + Razon Social
    // Ejemplo: "Sr. Mario Quispe, para indicarle que hemos cambiado el horario 4:00 pm. Soccer Perú"
    // Asumimos que el usuario escribe ", para indicarle..." en el textarea si quiere esa conexión, o nosotros agregamos un espacio.

    const textoFinal = `${apoderado}, ${mensaje} ${razonFinal}`;
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(textoFinal)}`;
    window.open(url, '_blank');
};

window.enviarMasivoWhatsApp = async function () {
    const lista = window.alumnosParaWhatsApp || [];
    if (lista.length === 0) {
        mostrarAlerta('No hay alumnos con número de WhatsApp en la lista actual.', 'warning');
        return;
    }

    const confirmar = await confirmarAccion(`Se abrirán ${lista.length} pestañas de WhatsApp. ¿Desea continuar? Asegúrese de permitir ventanas emergentes en su navegador.`);
    if (!confirmar) return;

    const mensajeInput = document.getElementById('mensajeGlobalWhatsApp');
    const mensaje = mensajeInput ? mensajeInput.value : '';

    lista.forEach((item, index) => {
        setTimeout(() => {
            const textoFinal = `${item.apoderado}, ${mensaje} ${item.razonSocial}`;
            const url = `https://wa.me/${item.telefono}?text=${encodeURIComponent(textoFinal)}`;
            window.open(url, '_blank');
        }, index * 800);
    });
};

async function mostrarModalNotificacionesDeuda() {
    const empresa = getCurrentEmpresa();
    window.deudoresParaWhatsApp = [];
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const membresias = await getDataByEmpresa('membresias', empresa.id);
    const hoy = new Date(getFechaActual());
    const cfgRows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    const razonEmpresa = (cfgRows && cfgRows[0] && cfgRows[0].empresaRazonSocial) ? cfgRows[0].empresaRazonSocial : (empresa?.nombre || '');
    const rows = [];

    for (const alumno of alumnos) {
        const membIds = Array.isArray(alumno.membresiaIds) ? alumno.membresiaIds : (alumno.membresiaId ? [alumno.membresiaId] : []);
        if (!membIds.length) continue;

        const pagosAlumno = await getPagosByAlumno(alumno.id);
        const fechaRegistro = (alumno.fechaRegistro || '').split('T')[0] || alumno.fechaRegistro;

        for (const mid of membIds) {
            const m = membresias.find(mm => mm.id === mid);
            if (!m) continue;

            const inicioM = (m.fechaInicio || '').split('T')[0] || m.fechaInicio || fechaRegistro;
            const items = generarCuotasConPeriodo(inicioM, m.duracion || 0, m.tipo || 'Mensual', fechaRegistro);
            const pagosMemb = pagosAlumno.filter(p => parseInt(p.membresiaId) === parseInt(m.id));
            const precioFinal = (m.precio || 0) - ((m.precio || 0) * (m.descuento || 0) / 100);

            // Iterar sobre todas las cuotas y mostrar las que están "No cancelada"
            items.forEach((it, idx) => {
                const pagada = pagosMemb.some(p => (p.cuotaInicio && p.cuotaInicio === it.inicio) || pagoCubrePeriodo(p.fecha, it.inicio, it.fin));
                const esPasada = new Date(it.inicio) <= hoy;

                // Solo mostrar cuotas "No cancelada" (no pagadas y ya pasadas)
                if (!pagada && esPasada) {
                    const numeroCuota = idx + 1;
                    const fechaStr = typeof formatearFecha === 'function' ? formatearFecha(it.inicio) : (new Date(it.inicio)).toLocaleDateString('es-PE');
                    const telefono = alumno.emergenciaTel || '';
                    const telClean = String(telefono).replace(/\D+/g, '');
                    const apoderado = alumno.emergenciaNombre || `${alumno.nombres} ${alumno.apellidos}`;
                    const relacion = (alumno.emergenciaRelacion || '').toLowerCase();
                    let tratamiento = 'Sr.';
                    if (relacion.includes('madre') || relacion.includes('tía') || relacion.includes('tia') || relacion.includes('abuela') || relacion.includes('hermana') || relacion.includes('prima')) tratamiento = 'Sra.';
                    else if (relacion.includes('padre') || relacion.includes('tío') || relacion.includes('tio') || relacion.includes('abuelo') || relacion.includes('hermano') || relacion.includes('primo')) tratamiento = 'Sr.';
                    else if (alumno.genero === 'F') tratamiento = 'Sra.';

                    const montoTxt = `S/.${String(Math.trunc(precioFinal))}`;
                    const mensajeWA = `${tratamiento} ${apoderado}, le recordamos que tiene una cuota pendiente por el importe de ${montoTxt} con fecha de vencimiento : ${fechaStr}.  ${razonEmpresa}.`;
                    const waLink = telClean ? `https://wa.me/${telClean}?text=${encodeURIComponent(mensajeWA)}` : '';

                    if (telClean) {
                        window.deudoresParaWhatsApp.push({
                            telefono: telClean,
                            mensaje: mensajeWA
                        });
                    }

                    rows.push(`
                        <tr>
                            <td><strong>${alumno.nombres} ${alumno.apellidos}</strong></td>
                            <td>${numeroCuota}</td>
                            <td>${fechaStr}</td>
                            <td>${m.nombre || '-'}</td>
                            <td class="text-end">${formatearMoneda(precioFinal)}</td>
                            <td>${alumno.emergenciaNombre || '-'}</td>
                            <td>${telefono ? `<a href="${waLink}" target="_blank" rel="noopener">${telefono}</a>` : '-'}</td>
                        </tr>
                    `);
                }
            });
        }
    }
    const body = document.getElementById('notificacionesDeudaBody');
    if (body) {
        body.innerHTML = `
            <div class="mb-3 text-end">
                <button class="btn btn-success" type="button" onclick="enviarMasivoDeudaWhatsApp()"><i class="bi bi-whatsapp"></i> Enviar Masivo</button>
                <div class="form-text text-muted">Nota: Asegúrese de permitir ventanas emergentes para el envío masivo.</div>
            </div>
            <div class="table-responsive">
                <table class="table table-modern">
                    <thead>
                        <tr>
                            <th style="background-color:#fff3cd;">Alumno</th>
                            <th style="background-color:#fff3cd;">#</th>
                            <th style="background-color:#fff3cd;">Fecha</th>
                            <th style="background-color:#fff3cd;">Membresía</th>
                            <th style="background-color:#fff3cd;" class="text-end">Importe</th>
                            <th style="background-color:#fff3cd;">Apoderado</th>
                            <th style="background-color:#fff3cd;">WhatsApp</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.length ? rows.join('') : '<tr><td colspan="7" class="text-center text-muted">No hay alumnos con deuda pendiente</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    }
    new bootstrap.Modal(document.getElementById('modalNotificacionesDeuda')).show();
}

window.enviarMasivoDeudaWhatsApp = async function () {
    const lista = window.deudoresParaWhatsApp || [];
    if (lista.length === 0) {
        mostrarAlerta('No hay deudores con número de WhatsApp en la lista actual.', 'warning');
        return;
    }

    const confirmar = await confirmarAccion(`Se abrirán ${lista.length} pestañas de WhatsApp. ¿Desea continuar? Asegúrese de permitir ventanas emergentes en su navegador.`);
    if (!confirmar) return;

    lista.forEach((item, index) => {
        setTimeout(() => {
            const url = `https://wa.me/${item.telefono}?text=${encodeURIComponent(item.mensaje)}`;
            window.open(url, '_blank');
        }, index * 800);
    });
};

function verificarEstadoPagoSync(fechaVencimiento) {
    if (!fechaVencimiento) return 'sin-membresia';

    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferenciaDias = Math.floor((vencimiento - hoy) / (1000 * 60 * 60 * 24));

    if (diferenciaDias < 0) return 'vencido';
    else if (diferenciaDias <= 3) return 'proximo-vencer';
    else return 'al-dia';
}

async function mostrarModalAlumno() {
    document.getElementById('formAlumno').reset();
    document.getElementById('alumnoId').value = '';
    document.getElementById('fotoPreview').src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e9ecef' width='100' height='100'/%3E%3Ctext fill='%236c757d' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='14'%3ESin foto%3C/text%3E%3C/svg%3E";
    document.getElementById('alumnoFotoBase64').value = '';

    const empresa = getCurrentEmpresa();
    // Obtener deportes desde configuración
    const deportes = await getDeportesFromConfig();
    const membresias = await getDataByEmpresa('membresias', empresa.id);
    const categorias = await getDataByEmpresa('categorias', empresa.id);

    // Configurar selector de deporte
    const selectDeporte = document.getElementById('alumnoDeporte');
    selectDeporte.innerHTML = '<option value="">Seleccione un deporte</option>' +
        deportes.map(d => `<option value="${d}">${d}</option>`).join('');

    // Seleccionar "Futbol" por defecto si existe
    const futbol = deportes.find(d => d.toLowerCase() === 'futbol' || d.toLowerCase() === 'fútbol');
    if (futbol) {
        selectDeporte.value = futbol;
    }

    // Asegurar que el selector esté habilitado
    selectDeporte.disabled = false;
    selectDeporte.style.backgroundColor = '';
    selectDeporte.style.cursor = '';

    const optionsM = '<option value="">Seleccione una membresía</option>' + membresias.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');
    const m1 = document.getElementById('alumnoMembresia1');
    const m2 = document.getElementById('alumnoMembresia2');
    const m3 = document.getElementById('alumnoMembresia3');
    if (m1) m1.innerHTML = optionsM;
    if (m2) m2.innerHTML = optionsM;
    if (m3) m3.innerHTML = optionsM;

    document.getElementById('alumnoCategoria').innerHTML = '<option value="">Seleccione una categoría</option>' +
        categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');

    const fechaInsEl = document.getElementById('alumnoFechaIns');
    if (fechaInsEl) fechaInsEl.value = getFechaActual();

    if (m1) m1.addEventListener('change', actualizarInfoMembresiasSeleccionadas);
    if (m2) m2.addEventListener('change', actualizarInfoMembresiasSeleccionadas);
    if (m3) m3.addEventListener('change', actualizarInfoMembresiasSeleccionadas);
    if (fechaInsEl) fechaInsEl.addEventListener('change', actualizarInfoMembresiasSeleccionadas);

    await actualizarInfoMembresiasSeleccionadas();

    const modal = new bootstrap.Modal(document.getElementById('modalAlumno'));
    modal.show();
}

async function cargarCategoriasDeporte() {
    const deporteValue = document.getElementById('alumnoDeporte').value;
    const empresa = getCurrentEmpresa();
    const categorias = await getDataByEmpresa('categorias', empresa.id);

    // Filtrar categorías por el nombre del deporte (string)
    // Nota: Las categorías ahora guardan el deporte como string en el campo 'deporte'
    // Si la categoría es antigua y tiene deporteId, intentamos compatibilidad o asumimos que se actualizarán
    const list = !deporteValue ? categorias : categorias.filter(c => {
        if (c.deporte) return c.deporte === deporteValue;
        // Fallback para categorías antiguas con deporteId (si fuera necesario, pero idealmente ya se migraron o se usan strings)
        return false;
    });

    document.getElementById('alumnoCategoria').innerHTML = '<option value="">Seleccione una categoría</option>' +
        list.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
}

function previewFoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('fotoPreview').src = e.target.result;
            document.getElementById('alumnoFotoBase64').value = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

async function guardarAlumno() {
    const id = document.getElementById('alumnoId').value;
    const nombres = document.getElementById('alumnoNombres').value.trim();
    const apellidos = document.getElementById('alumnoApellidos').value.trim();
    const dni = document.getElementById('alumnoDni').value.trim();
    const fechaNacimiento = document.getElementById('alumnoFechaNac').value;
    const genero = document.getElementById('alumnoGenero').value;
    const telefono = document.getElementById('alumnoTelefono').value.trim();
    const email = document.getElementById('alumnoEmail').value.trim();
    const direccion = document.getElementById('alumnoDireccion').value.trim();
    const alergias = document.getElementById('alumnoAlergias').value.trim();
    const condiciones = document.getElementById('alumnoCondiciones').value.trim();
    const medicacion = document.getElementById('alumnoMedicacion').value.trim();
    const emergenciaNombre = document.getElementById('alumnoEmergenciaNombre').value.trim();
    const emergenciaTel = document.getElementById('alumnoEmergenciaTel').value.trim();
    const emergenciaRelacion = document.getElementById('alumnoEmergenciaRelacion').value.trim();
    const fechaRegistro = document.getElementById('alumnoFechaIns').value;
    const deporte = document.getElementById('alumnoDeporte').value; // Ahora es string
    const categoriaId = parseInt(document.getElementById('alumnoCategoria').value);
    const m1Val = parseInt(document.getElementById('alumnoMembresia1').value);
    const m2Input = document.getElementById('alumnoMembresia2');
    const m3Input = document.getElementById('alumnoMembresia3');
    const m2Val = m2Input && m2Input.value ? parseInt(m2Input.value) : NaN;
    const m3Val = m3Input && m3Input.value ? parseInt(m3Input.value) : NaN;
    const imp1 = parseFloat(document.getElementById('alumnoMembresia1Importe').value) || 0;
    const imp2El = document.getElementById('alumnoMembresia2Importe');
    const imp3El = document.getElementById('alumnoMembresia3Importe');
    const imp2 = imp2El && imp2El.value ? parseFloat(imp2El.value) : 0;
    const imp3 = imp3El && imp3El.value ? parseFloat(imp3El.value) : 0;
    const activo = document.getElementById('alumnoActivo').checked;
    const foto = document.getElementById('alumnoFotoBase64').value;

    const membresiaIds = [m1Val, m2Val, m3Val].filter(v => Number.isInteger(v));
    const importesIniciales = [];
    if (Number.isInteger(m1Val)) importesIniciales.push({ membresiaId: m1Val, importe: imp1 });
    if (Number.isInteger(m2Val)) importesIniciales.push({ membresiaId: m2Val, importe: imp2 });
    if (Number.isInteger(m3Val)) importesIniciales.push({ membresiaId: m3Val, importe: imp3 });
    if (!nombres || !apellidos || !dni || !fechaNacimiento || !telefono || !emergenciaNombre || !emergenciaTel || !emergenciaRelacion || !deporte || !categoriaId || membresiaIds.length < 1 || !fechaRegistro) {
        mostrarAlerta('Complete todos los campos obligatorios', 'warning');
        return;
    }

    const empresa = getCurrentEmpresa();
    const baseData = {
        empresaId: empresa.id,
        nombres,
        apellidos,
        dni,
        fechaNacimiento,
        genero,
        telefono,
        email,
        direccion,
        alergias,
        condiciones,
        medicacion,
        emergenciaNombre,
        emergenciaTel,
        emergenciaRelacion,
        deporte, // Guardar como string
        categoriaId,
        membresiaId: membresiaIds[0],
        membresiaIds,
        activo,
        foto,
        fechaRegistro,
        importesIniciales
    };

    try {
        if (id) {
            const existing = await getData('alumnos', parseInt(id));
            const merged = {
                ...existing,
                ...baseData,
                id: existing.id,
                codigoAlumno: existing.codigoAlumno,
                fechaVencimiento: existing.fechaVencimiento
            };
            await updateData('alumnos', merged);
            mostrarAlerta('Alumno actualizado correctamente', 'success');
        } else {
            const alumnoData = {
                ...baseData,
                codigoAlumno: generarCodigo('ALU')
            };
            const membresia = await getData('membresias', membresiaIds[0]);
            if (membresia && membresia.duracion) {
                alumnoData.fechaVencimiento = calcularFechaVencimiento(membresia.duracion);
            }
            const alumnoId = await addData('alumnos', alumnoData);
            mostrarAlerta('Alumno registrado correctamente', 'success');
        }

        const modalEl = document.getElementById('modalAlumno');
        const modal = bootstrap.Modal.getInstance(modalEl);
        document.activeElement.blur();
        modalEl.addEventListener('hidden.bs.modal', async () => {
            await cargarAlumnos();
        }, { once: true });
        modal.hide();
    } catch (error) {
        console.error('Error al guardar alumno:', error);
        mostrarAlerta('Error al guardar el alumno', 'danger');
    }
}

async function editarAlumno(id) {
    const alumno = await getData('alumnos', id);

    await mostrarModalAlumno();

    document.getElementById('alumnoId').value = alumno.id;
    document.getElementById('alumnoNombres').value = alumno.nombres;
    document.getElementById('alumnoApellidos').value = alumno.apellidos;
    document.getElementById('alumnoDni').value = alumno.dni;
    document.getElementById('alumnoFechaNac').value = alumno.fechaNacimiento;
    document.getElementById('alumnoGenero').value = alumno.genero;
    document.getElementById('alumnoTelefono').value = alumno.telefono;
    document.getElementById('alumnoEmail').value = alumno.email || '';
    document.getElementById('alumnoDireccion').value = alumno.direccion || '';
    document.getElementById('alumnoAlergias').value = alumno.alergias || '';
    document.getElementById('alumnoCondiciones').value = alumno.condiciones || '';
    document.getElementById('alumnoMedicacion').value = alumno.medicacion || '';
    document.getElementById('alumnoEmergenciaNombre').value = alumno.emergenciaNombre;
    document.getElementById('alumnoEmergenciaTel').value = alumno.emergenciaTel;
    document.getElementById('alumnoEmergenciaRelacion').value = alumno.emergenciaRelacion;
    document.getElementById('alumnoActivo').checked = alumno.activo;
    const fechaIns = (alumno.fechaRegistro || '').split('T')[0] || '';
    const fechaInsEl = document.getElementById('alumnoFechaIns');
    if (fechaInsEl) fechaInsEl.value = fechaIns || getFechaActual();

    if (alumno.foto) {
        document.getElementById('fotoPreview').src = alumno.foto;
        document.getElementById('alumnoFotoBase64').value = alumno.foto;
    }

    document.getElementById('alumnoDeporte').value = alumno.deporte || 'Futbol'; // Ahora es string
    await cargarCategoriasDeporte();
    document.getElementById('alumnoCategoria').value = alumno.categoriaId;
    const m1 = document.getElementById('alumnoMembresia1');
    const m2 = document.getElementById('alumnoMembresia2');
    const m3 = document.getElementById('alumnoMembresia3');
    const ids = Array.isArray(alumno.membresiaIds) ? alumno.membresiaIds : (alumno.membresiaId ? [alumno.membresiaId] : []);
    if (m1) m1.value = ids[0] || '';
    if (m2) m2.value = ids[1] || '';
    if (m3) m3.value = ids[2] || '';
    const importes = Array.isArray(alumno.importesIniciales) ? alumno.importesIniciales : [];
    const impMap = new Map(importes.map(x => [x.membresiaId, x.importe]));
    const imp1El = document.getElementById('alumnoMembresia1Importe');
    const imp2El = document.getElementById('alumnoMembresia2Importe');
    const imp3El = document.getElementById('alumnoMembresia3Importe');
    if (imp1El && ids[0]) imp1El.value = impMap.get(ids[0]) ?? imp1El.value;
    if (imp2El && ids[1]) imp2El.value = impMap.get(ids[1]) ?? imp2El.value;
    if (imp3El && ids[2]) imp3El.value = impMap.get(ids[2]) ?? imp3El.value;

    await actualizarInfoMembresiasSeleccionadas();
}

async function eliminarAlumno(id) {
    const confirmar = await confirmarAccion('¿Está seguro de eliminar este alumno?');
    if (!confirmar) return;

    try {
        await deleteData('alumnos', id);
        mostrarAlerta('Alumno eliminado correctamente', 'success');
        await cargarAlumnos();
    } catch (error) {
        console.error('Error al eliminar alumno:', error);
        mostrarAlerta('Error al eliminar el alumno', 'danger');
    }
}

async function verFichaAlumno(id) {
    try {
        const alumno = await getData('alumnos', id);
        if (!alumno) {
            console.error('Alumno no encontrado con ID:', id);
            mostrarAlerta('No se pudo cargar la información del alumno.', 'error');
            return;
        }

        const empresa = getCurrentEmpresa();

        // Manejo robusto de Deporte
        let deporteNombre = alumno.deporte || '-';
        if (!alumno.deporte && alumno.deporteId) {
            try {
                const d = await getData('deportes', alumno.deporteId);
                if (d && d.nombre) deporteNombre = d.nombre;
            } catch (e) { console.warn('Error cargando deporte:', e); }
        }

        // Manejo robusto de Categoría
        let categoriaNombre = '-';
        if (alumno.categoriaId) {
            try {
                const c = await getData('categorias', alumno.categoriaId);
                if (c && c.nombre) categoriaNombre = c.nombre;
            } catch (e) { console.warn('Error cargando categoría:', e); }
        }

        // Manejo robusto de Membresías
        let membresiasTexto = '-';
        const membIds = Array.isArray(alumno.membresiaIds) ? alumno.membresiaIds : (alumno.membresiaId ? [alumno.membresiaId] : []);
        if (membIds.length > 0) {
            try {
                const proms = membIds.map(mid => getData('membresias', mid).catch(() => null));
                const membs = await Promise.all(proms);
                membresiasTexto = membs.filter(m => m && m.nombre).map(m => m.nombre).join(', ') || '-';
            } catch (e) { console.warn('Error cargando membresías:', e); }
        }

        // Manejo robusto de Pagos y Asistencias
        let pagos = [];
        try { pagos = await getPagosByAlumno(id); } catch (e) { console.warn('Error cargando pagos:', e); }

        let asistencias = [];
        try { asistencias = await getAsistenciasByAlumno(id); } catch (e) { console.warn('Error cargando asistencias:', e); }

        const edad = alumno.fechaNacimiento ? calcularEdad(alumno.fechaNacimiento) : '-';

        let estadoPago = 'sin-membresia';
        if (alumno.fechaVencimiento) {
            estadoPago = verificarEstadoPagoSync(alumno.fechaVencimiento);
        }

        try {
            const estadoCuotas = await evaluarDeudaAlumnoPorCuotas(alumno);
            if (estadoCuotas === 'deuda') estadoPago = 'deuda';
            else if (estadoCuotas === 'al-dia') estadoPago = 'al-dia';
        } catch (e) { }

        let badgeEstado = '<span class="badge-status badge-inactive">Sin membresía</span>';
        if (estadoPago === 'al-dia') badgeEstado = '<span class="badge-status badge-paid">Al día</span>';
        else if (estadoPago === 'proximo-vencer') badgeEstado = '<span class="badge-status badge-pending">Próximo a vencer</span>';
        else if (estadoPago === 'vencido') badgeEstado = '<span class="badge-status badge-overdue">Vencido</span>';
        else if (estadoPago === 'deuda') badgeEstado = '<span class="badge-status badge-overdue">Deuda Pendiente</span>';

        const content = document.getElementById('fichaAlumnoContent');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-3 text-center">
                    <div style="position:relative;width:150px;height:150px;border-radius:50%;overflow:hidden;border:4px solid #1e56a0;margin:0 auto;">
                        <img src="${alumno.foto || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e9ecef' width='150' height='150'/%3E%3Ctext fill='%236c757d' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='16'%3ESin foto%3C/text%3E%3C/svg%3E"}" 
                             style="width:100%;height:100%;object-fit:cover;">
                    </div>
                    <h5 class="mt-3">${alumno.nombres} ${alumno.apellidos}</h5>
                    <p class="text-muted" style="font-size:20px;font-weight:600;">${alumno.dni || '-'}</p>
                </div>
                <div class="col-md-9">
                    <h6 class="text-primary mb-3">Información Personal</h6>
                    <div class="row mb-2">
                        <div class="col-6"><strong>DNI:</strong> ${alumno.dni || '-'}</div>
                        <div class="col-6"><strong>Edad:</strong> ${edad} años</div>
                        <div class="col-6"><strong>Género:</strong> ${alumno.genero === 'M' ? 'Masculino' : (alumno.genero === 'F' ? 'Femenino' : '-')}</div>
                        <div class="col-6"><strong>Teléfono:</strong> ${alumno.telefono || '-'}</div>
                    </div>
                    
                    <h6 class="text-primary mb-3 mt-4">Información Académica</h6>
                    <div class="row mb-2">
                        <div class="col-6"><strong>Deporte:</strong> ${deporteNombre}</div>
                        <div class="col-6"><strong>Categoría:</strong> ${categoriaNombre}</div>
                        <div class="col-6"><strong>Membresía(s):</strong> ${membresiasTexto}</div>
                        <div class="col-6"><strong>Estado:</strong> ${badgeEstado}</div>
                    </div>
                    
                    <h6 class="text-primary mb-3 mt-4">Estadísticas</h6>
                    <div class="row">
                        <div class="col-6"><strong>Total Pagos:</strong> ${pagos.length}</div>
                        <div class="col-6"><strong>Total Asistencias:</strong> ${asistencias.length}</div>
                    </div>
                </div>
            </div>
        `;

        window.alumnoSeleccionado = alumno;

        const modalEl = document.getElementById('modalVerAlumno');
        if (modalEl) {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        } else {
            console.error('Modal modalVerAlumno no encontrado en el DOM');
        }

    } catch (error) {
        console.error('Error crítico en verFichaAlumno:', error);
        mostrarAlerta('Ocurrió un error al cargar la ficha.', 'error');
    }
}

async function verHistorialPagosCompras() {
    if (!window.alumnoSeleccionado) return;
    const alumno = window.alumnoSeleccionado;
    const empresa = getCurrentEmpresa();
    const pagos = await getPagosByAlumno(alumno.id);
    const ventasEmpresa = await getDataByEmpresa('ventas', empresa.id);
    const ventasAlumno = ventasEmpresa.filter(v => v.clienteId && parseInt(v.clienteId) === alumno.id);
    const membresias = await getDataByEmpresa('membresias', empresa.id);
    const membresiasMap = new Map(membresias.map(m => [m.id, m]));
    const fechaRegistro = (alumno.fechaRegistro || '').split('T')[0] || alumno.fechaRegistro;
    const pagosTable = pagos.length ? `
        <div class="module-card">
            <div class="module-header"><h5><i class="bi bi-cash-coin"></i> Pagos</h5></div>
            <div class="table-responsive">
                <table class="table table-modern">
                    <thead><tr><th style="background-color:#cfe8ff;">N° de cuota</th><th style="background-color:#cfe8ff;">Fecha programada</th><th style="background-color:#cfe8ff;">Fecha pago</th><th style="background-color:#cfe8ff;">Membresía</th><th style="background-color:#cfe8ff;" class="text-end">Monto</th></tr></thead>
                    <tbody>
                        ${pagos.map(p => {
        const memb = membresiasMap.get(p.membresiaId);
        let numeroCuota = '-';
        let fechaProg = '-';
        if (memb) {
            const inicioM = (memb.fechaInicio || '').split('T')[0] || memb.fechaInicio || fechaRegistro;
            const items = generarCuotasConPeriodo(inicioM, memb.duracion || 0, memb.tipo || 'Mensual', fechaRegistro);
            const idx = items.findIndex(x => x.inicio === p.cuotaInicio);
            if (idx >= 0) {
                numeroCuota = idx + 1;
                fechaProg = items[idx].inicio;
            } else {
                const itemF = items.find(it => pagoCubrePeriodo(p.fecha, it.inicio, it.fin));
                if (itemF) {
                    numeroCuota = items.findIndex(it => it.inicio === itemF.inicio) + 1;
                    fechaProg = itemF.inicio;
                }
            }
        }
        const fechaPagoStr = typeof formatearFecha === 'function' ? formatearFecha(p.fecha) : (new Date(p.fecha)).toLocaleDateString('es-PE');
        const fechaProgStr = fechaProg !== '-' ? (typeof formatearFecha === 'function' ? formatearFecha(fechaProg) : (new Date(fechaProg)).toLocaleDateString('es-PE')) : '-';
        return `
                                <tr>
                                    <td>${numeroCuota}</td>
                                    <td>${fechaProgStr}</td>
                                    <td>${fechaPagoStr}</td>
                                    <td>${memb?.nombre || '-'}</td>
                                    <td class="text-end">${formatearMoneda(p.monto || 0)}</td>
                                </tr>
                            `;
    }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    ` : '<div class="text-muted">Sin pagos registrados</div>';
    const ventasTable = ventasAlumno.length ? `
        <div class="module-card mt-3">
            <div class="module-header"><h5><i class="bi bi-cart-check"></i> Compras</h5></div>
            <div class="table-responsive">
                <table class="table table-modern">
                    <thead><tr><th style="background-color:#cfe8ff;">Fecha</th><th style="background-color:#cfe8ff;">Comprobante</th><th style="background-color:#cfe8ff;" class="text-end">Total</th></tr></thead>
                    <tbody>
                        ${ventasAlumno.map(v => `
                            <tr>
                                <td>${typeof formatearFecha === 'function' ? formatearFecha(v.fecha) : (new Date(v.fecha)).toLocaleDateString('es-PE')}</td>
                                <td>${v.tipoComprobante} ${v.numeroComprobante || ''}</td>
                                <td class="text-end">${formatearMoneda(v.total || 0)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    ` : '<div class="text-muted mt-2">Sin compras registradas</div>';
    const body = document.getElementById('historialAlumnoBody');
    if (body) body.innerHTML = pagosTable + ventasTable;
    const el = document.getElementById('modalHistorialAlumno');
    if (el) {
        el.style.zIndex = '2050';
        new bootstrap.Modal(el).show();
    }
}

async function verHistorialAsistenciaAlumno() {
    if (!window.alumnoSeleccionado) return;
    const alumno = window.alumnoSeleccionado;
    const empresa = getCurrentEmpresa();
    const asistencias = await getAsistenciasByAlumno(alumno.id);
    const asistenciasSet = new Set(asistencias.map(a => ((a.fecha || '').split('T')[0] || a.fecha)));
    const membIds = Array.isArray(alumno.membresiaIds) ? alumno.membresiaIds : (alumno.membresiaId ? [alumno.membresiaId] : []);
    const membresias = await Promise.all(membIds.map(id => getData('membresias', id)));
    const fechaRegistro = (alumno.fechaRegistro || '').split('T')[0] || alumno.fechaRegistro;
    const hoy = getFechaActual();
    const diaMap = { 'Domingo': 0, 'Lunes': 1, 'Martes': 2, 'Miercoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sabado': 6 };
    const items = [];
    for (const m of membresias.filter(Boolean)) {
        const inicioM = ((m.fechaInicio || '').split('T')[0]) || m.fechaInicio || getFechaActual();
        const finM = m.fechaFin || sumarDiasLocal(inicioM, Math.max((m.duracion || 0) - 1, 0));
        const startDate = fechaRegistro && new Date(fechaRegistro) > new Date(inicioM) ? fechaRegistro : inicioM;
        const diasSel = Array.isArray(m.dias) ? m.dias : [];
        const diasNums = diasSel.map(d => diaMap[d]).filter(n => n !== undefined);
        if (diasNums.length === 0) {
            const cuotas = generarProgramacionCuotas(inicioM, m.duracion || 0, m.tipo || 'Mensual');
            for (const d of cuotas) {
                if (new Date(d) > new Date(hoy) || new Date(d) < new Date(startDate) || new Date(d) > new Date(finM)) continue;
                items.push({ fecha: d, nombresMemb: [m.nombre] });
            }
            continue;
        }
        let actual = startDate;
        while (actual && new Date(actual) <= new Date(finM) && new Date(actual) <= new Date(hoy)) {
            const dow = new Date(actual + 'T00:00:00').getDay();
            if (diasNums.includes(dow)) {
                items.push({ fecha: actual, nombresMemb: [m.nombre] });
            }
            actual = sumarDiasLocal(actual, 1);
        }
    }
    const merged = new Map();
    for (const it of items) {
        const e = merged.get(it.fecha);
        if (e) {
            e.nombresMemb = Array.from(new Set([...e.nombresMemb, ...it.nombresMemb]));
        } else {
            merged.set(it.fecha, { fecha: it.fecha, nombresMemb: it.nombresMemb });
        }
    }
    const fechas = Array.from(merged.values()).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const totalEsperadas = fechas.length;
    const totalAsistidas = fechas.filter(f => asistenciasSet.has(f.fecha)).length;
    const totalFaltas = totalEsperadas - totalAsistidas;
    const cobertura = totalEsperadas ? Math.round((totalAsistidas / totalEsperadas) * 100) : 0;
    const rowsHtml = fechas.length ? fechas.map(f => {
        const asistio = asistenciasSet.has(f.fecha);
        const estadoBadge = asistio ? '<span class="badge bg-success">Asistió</span>' : '<span class="badge bg-danger">Falta</span>';
        const membNames = f.nombresMemb.join(', ');
        const fechaStr = typeof formatearFecha === 'function' ? formatearFecha(f.fecha) : f.fecha;
        return `<tr><td>${fechaStr}</td><td>${membNames}</td><td>${estadoBadge}</td></tr>`;
    }).join('') : '<tr><td colspan="3" class="text-center text-muted">Sin fechas programadas</td></tr>';
    const body = document.getElementById('historialAsistenciaBody');
    if (body) {
        body.innerHTML = `
            <div class="row g-3">
                <div class="col-md-4"><div class="text-muted">Asistencias</div><div style="font-size:20px;font-weight:700;color:#198754;">${totalAsistidas}</div></div>
                <div class="col-md-4"><div class="text-muted">Faltas</div><div style="font-size:20px;font-weight:700;color:#dc3545;">${totalFaltas}</div></div>
                <div class="col-md-4"><div class="text-muted">Cobertura</div><div style="font-size:20px;font-weight:700;color:#0d6efd;">${cobertura}%</div></div>
            </div>
            <div class="table-responsive mt-2">
                <table class="table table-modern"><thead><tr><th style="background-color:#cfe8ff;">Fecha</th><th style="background-color:#cfe8ff;">Membresía</th><th style="background-color:#cfe8ff;">Estado</th></tr></thead><tbody>${rowsHtml}</tbody></table>
            </div>
        `;
    }
    const el = document.getElementById('modalHistorialAsistenciaAlumno');
    if (el) {
        el.style.zIndex = '2050';
        new bootstrap.Modal(el).show();
    }
}

function diasPorTipoMembresia(tipo) {
    const t = (tipo || '').toLowerCase();
    if (t.startsWith('mensual')) return 30;
    if (t.startsWith('quincenal')) return 15;
    if (t.startsWith('semanal')) return 7;
    if (t.startsWith('diario') || t.startsWith('dia')) return 1;
    return 30;
}

function sumarDiasLocal(fechaStr, dias) {
    if (!fechaStr) return '';
    const d = new Date(fechaStr + 'T00:00:00');
    d.setDate(d.getDate() + dias);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
}

function diferenciaDiasExacta(inicioStr, finStr) {
    if (!inicioStr || !finStr) return 0;
    const i = new Date(inicioStr + 'T00:00:00');
    const f = new Date(finStr + 'T00:00:00');
    const ms = f.getTime() - i.getTime();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function generarProgramacionCuotas(fechaInicio, duracionDias, tipo) {
    if (!fechaInicio || !duracionDias) return [];
    const intervalo = diasPorTipoMembresia(tipo);
    const fin = sumarDiasLocal(fechaInicio, Math.max(duracionDias - 1, 0));
    const fechas = [];
    let actual = fechaInicio;
    while (actual && new Date(actual) <= new Date(fin)) {
        fechas.push(actual);
        actual = sumarDiasLocal(actual, intervalo);
    }
    return fechas;
}

function pagoCubreCuota(pagoFecha, cuotaFecha, intervaloDias) {
    const p = new Date((pagoFecha || '').split('T')[0] || pagoFecha);
    const c = new Date((cuotaFecha || '').split('T')[0] || cuotaFecha);
    const cFin = new Date(c);
    cFin.setDate(cFin.getDate() + intervaloDias - 1);
    return p >= c && p <= cFin;
}

function pagoCubrePeriodo(pagoFecha, inicioStr, finStr) {
    const p = new Date((pagoFecha || '').split('T')[0] || pagoFecha);
    const i = new Date(inicioStr);
    const f = new Date(finStr);
    return p >= i && p <= f;
}

function generarCuotasConPeriodo(inicioM, duracionDias, tipo, fechaRegistro) {
    if (!inicioM || !duracionDias) return [];
    const finM = sumarDiasLocal(inicioM, Math.max(duracionDias - 1, 0));
    const todas = generarProgramacionCuotas(inicioM, duracionDias, tipo);
    let vigentes;
    if (fechaRegistro && new Date(fechaRegistro) > new Date(inicioM)) {
        const afterReg = todas.filter(d => new Date(d) >= new Date(fechaRegistro));
        const seq = (afterReg.length && afterReg[0] === fechaRegistro) ? afterReg : [fechaRegistro, ...afterReg];
        vigentes = seq.filter(d => new Date(d) <= new Date(finM));
    } else {
        vigentes = todas.filter(d => new Date(d) <= new Date(finM));
    }
    const items = [];
    for (let i = 0; i < vigentes.length; i++) {
        const inicio = vigentes[i];
        const next = vigentes[i + 1];
        let finPeriodo = finM;
        if (next) {
            const nd = new Date(next);
            nd.setDate(nd.getDate() - 1);
            const y = nd.getFullYear();
            const m = String(nd.getMonth() + 1).padStart(2, '0');
            const d = String(nd.getDate()).padStart(2, '0');
            const prev = `${y}-${m}-${d}`;
            finPeriodo = new Date(prev) < new Date(finM) ? prev : finM;
        }
        const esInicialRegistro = !!(fechaRegistro && i === 0 && inicio === fechaRegistro && new Date(fechaRegistro) > new Date(inicioM));
        items.push({ inicio, fin: finPeriodo, esInicialRegistro });
    }
    return items;
}

async function actualizarInfoMembresiasSeleccionadas() {
    const fechaReg = document.getElementById('alumnoFechaIns')?.value || '';
    await actualizarInfoMembresia('alumnoMembresia1', 'alumnoMembresia1Info', fechaReg);
    await actualizarInfoMembresia('alumnoMembresia2', 'alumnoMembresia2Info', fechaReg);
    await actualizarInfoMembresia('alumnoMembresia3', 'alumnoMembresia3Info', fechaReg);
}

async function actualizarInfoMembresia(selectId, infoId, fechaReg) {
    const sel = document.getElementById(selectId);
    const info = document.getElementById(infoId);
    if (!sel || !info) return;
    const val = parseInt(sel.value);
    if (!val) { info.innerHTML = ''; return; }
    const m = await getData('membresias', val);
    if (!m) { info.innerHTML = ''; return; }
    const inicioM = (m.fechaInicio || '').split('T')[0] || getFechaActual();
    const finM = m.fechaFin || sumarDiasLocal(inicioM, Math.max((m.duracion || 0) - 1, 0));
    const todas = generarProgramacionCuotas(inicioM, m.duracion || 0, m.tipo || 'Mensual');
    const esIgualACuota = !!(fechaReg && todas.some(d => d === fechaReg));
    let vigente;
    if (fechaReg && new Date(fechaReg) > new Date(inicioM)) {
        const afterReg = todas.filter(d => new Date(d) >= new Date(fechaReg));
        vigente = (afterReg.length && afterReg[0] === fechaReg) ? afterReg : [fechaReg, ...afterReg];
        vigente = vigente.filter(d => new Date(d) <= new Date(finM));
    } else {
        vigente = todas.filter(d => new Date(d) <= new Date(finM));
    }
    const proxima = vigente[0] || '';
    const cuotasTotales = todas.length;
    const cuotasRestantes = vigente.length;
    const precioFinal = (m.precio || 0) - ((m.precio || 0) * (m.descuento || 0) / 100);
    const totalRestante = precioFinal * cuotasRestantes;
    const importeElId = selectId === 'alumnoMembresia1' ? 'alumnoMembresia1Importe' : (selectId === 'alumnoMembresia2' ? 'alumnoMembresia2Importe' : 'alumnoMembresia3Importe');
    const importeEl = document.getElementById(importeElId);
    const intervalo = diasPorTipoMembresia(m.tipo || 'Mensual');
    let importeInicial = 0;
    if (esIgualACuota) {
        importeInicial = precioFinal;
    } else if (fechaReg && new Date(fechaReg) > new Date(inicioM)) {
        const nextProg = vigente.length > 1 ? vigente[1] : finM;
        const dias = diferenciaDiasExacta(fechaReg, nextProg);
        importeInicial = precioFinal * (Math.min(dias, intervalo) / intervalo);
    } else {
        importeInicial = precioFinal;
    }
    if (importeEl) importeEl.value = Number.isFinite(importeInicial) ? Math.max(0, parseFloat(importeInicial.toFixed(2))) : 0;
    info.innerHTML = `
        <div><strong>Inicio:</strong> ${formatearFecha(inicioM)} · <strong>Fin:</strong> ${formatearFecha(finM)}</div>
        <div class="mt-1"><strong>Próxima fecha de pago:</strong> ${proxima ? formatearFecha(proxima) : '—'}</div>
        <div class="mt-1"><strong>Cuotas:</strong> ${cuotasRestantes} / ${cuotasTotales}</div>
        <div class="mt-1"><strong>Monto por cuota:</strong> ${formatearMoneda(precioFinal)} · <strong>Total restante:</strong> ${formatearMoneda(totalRestante)}</div>
        <div class="mt-2" style="max-height:120px; overflow:auto;">${vigente.map(f => `<div><i class=\"bi bi-dot\"></i> ${formatearFecha(f)}</div>`).join('') || '<div class="text-muted">Sin cuotas vigentes</div>'}</div>
    `;
}

async function evaluarDeudaAlumnoPorCuotas(alumno) {
    const membIds = Array.isArray(alumno.membresiaIds) ? alumno.membresiaIds : (alumno.membresiaId ? [alumno.membresiaId] : []);
    if (!membIds.length) return 'sin-datos';
    const fechaRegistro = (alumno.fechaRegistro || '').split('T')[0] || alumno.fechaRegistro;
    const pagos = await getPagosByAlumno(alumno.id);
    const hoy = new Date(getFechaActual());
    for (const mid of membIds) {
        const m = await getData('membresias', mid);
        if (!m) continue;
        const inicioM = (m.fechaInicio || '').split('T')[0] || m.fechaInicio || fechaRegistro;
        const items = generarCuotasConPeriodo(inicioM, m.duracion, m.tipo, fechaRegistro);
        const pagosMemb = pagos.filter(p => parseInt(p.membresiaId) === parseInt(m.id));
        for (const it of items) {
            const cDate = new Date(it.inicio);
            if (cDate > hoy) continue;
            const pagada = pagosMemb.some(p => (p.cuotaInicio && p.cuotaInicio === it.inicio) || pagoCubrePeriodo(p.fecha, it.inicio, it.fin));
            if (!pagada) return 'deuda';
        }
    }
    return 'al-dia';
}

async function verControlPagosAlumno() {
    try {
        if (!window.alumnoSeleccionado) return;
        const alumno = window.alumnoSeleccionado;
        const membIds = (Array.isArray(alumno.membresiaIds) ? alumno.membresiaIds : (alumno.membresiaId ? [alumno.membresiaId] : [])).filter(id => id);

        let pagos = [];
        try {
            if (alumno.id) pagos = await getPagosByAlumno(alumno.id);
        } catch (e) { console.warn('Error obteniendo pagos:', e); }

        const fechaRegistro = (alumno.fechaRegistro || '').split('T')[0] || alumno.fechaRegistro;
        const hoy = new Date(getFechaActual());
        const allRows = [];
        for (const mid of membIds) {
            if (!mid) continue;
            const m = await getData('membresias', mid);
            if (!m) continue;
            const inicioM = (m.fechaInicio || '').split('T')[0] || m.fechaInicio || fechaRegistro;
            const finM = m.fechaFin || sumarDiasLocal(inicioM, Math.max((m.duracion || 0) - 1, 0));
            const items = generarCuotasConPeriodo(inicioM, m.duracion || 0, m.tipo || 'Mensual', fechaRegistro);
            const pagosMemb = pagos.filter(p => parseInt(p.membresiaId) === parseInt(m.id));
            const todas = generarProgramacionCuotas(inicioM, m.duracion || 0, m.tipo || 'Mensual');
            const intervalo = diasPorTipoMembresia(m.tipo || 'Mensual');
            const precioFinal = (m.precio || 0) - ((m.precio || 0) * (m.descuento || 0) / 100);
            items.forEach((it, idx) => {
                const pagada = pagosMemb.some(p => (p.cuotaInicio && p.cuotaInicio === it.inicio) || pagoCubrePeriodo(p.fecha, it.inicio, it.fin));
                const esPasada = new Date(it.inicio) <= hoy;
                const badge = pagada ? '<span class="badge-status badge-paid">Pagada</span>' : (esPasada ? '<span class="badge-status badge-overdue">No cancelada</span>' : '<span class="badge-status badge-pending">Programada</span>');
                const etiqueta = it.esInicialRegistro ? '<span class=\"badge bg-light text-dark ms-2\">Inicial (Registro)</span>' : '';
                const esIgualCuota = todas.some(d => d === it.inicio);
                let monto = precioFinal;
                if (it.esInicialRegistro && !esIgualCuota) {
                    const nextProg = items[idx + 1]?.inicio || finM;
                    const dias = diferenciaDiasExacta(it.inicio, nextProg);
                    monto = precioFinal * (Math.min(dias, intervalo) / intervalo);
                }
                const accion = pagada
                    ? `<button class=\"btn btn-sm\" style=\"background-color:#cfe8ff;color:#000\" onclick=\"mostrarComprobantePagoAlumno(${alumno.id}, '${it.inicio}', ${m.id}, ${idx + 1})\"><i class=\"bi bi-printer\"></i> Imprimir</button>`
                    : `<button class=\"btn btn-sm btn-primary\" onclick=\"mostrarModalPagoAlumno(${alumno.id}, '${it.inicio}', ${m.id}, ${Number.isFinite(monto) ? parseFloat(monto.toFixed(2)) : 0}, ${idx + 1})\"><i class=\"bi bi-cash\"></i> Pagar</button>`;
                allRows.push(`
                <tr>
                    <td>${idx + 1}</td>
                    <td>${formatearFecha(it.inicio)} ${etiqueta}</td>
                    <td>${m.nombre || '-'}</td>
                    <td class="text-end">${formatearMoneda(monto)}</td>
                    <td>${badge}</td>
                    <td class="text-end">${accion}</td>
                </tr>
            `);
            });
        }
        let estadoGeneral = 'sin-datos';
        try {
            estadoGeneral = await evaluarDeudaAlumnoPorCuotas(alumno);
        } catch (e) { console.warn('Error evaluando deuda:', e); }
        const resumenEstado = estadoGeneral === 'deuda' ? '<span class="badge-status badge-overdue">Deuda Pendiente</span>' : (estadoGeneral === 'al-dia' ? '<span class="badge-status badge-paid">Al día</span>' : '<span class="badge-status badge-secondary">Desconocido</span>');
        const body = document.getElementById('controlPagosBody');
        if (body) {
            const fotoSrc = alumno.foto || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect fill='%23e9ecef' width='56' height='56'/%3E%3C/svg%3E";
            const deporteNombre = alumno.deporteId ? ((await getData('deportes', alumno.deporteId))?.nombre || '-') : '-';
            const membNombre = (await Promise.all(membIds.map(id => id ? getData('membresias', id) : null))).filter(Boolean).map(x => x.nombre).join(', ') || '-';

            body.innerHTML = `
            <div class="module-card">
                <div class="module-header d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <img src="${fotoSrc}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;" class="me-3">
                        <div>
                            <h5 class="mb-0">${alumno.nombres} ${alumno.apellidos}</h5>
                            <div class="text-muted">DNI: ${alumno.dni}</div>
                        </div>
                    </div>
                    <div><strong>Estado General:</strong> ${resumenEstado}</div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-4"><div class="text-muted">DNI</div><div>${alumno.dni}</div></div>
                    <div class="col-md-4"><div class="text-muted">Deporte</div><div>${deporteNombre}</div></div>
                    <div class="col-md-4"><div class="text-muted">Membresía(s)</div><div>${membNombre}</div></div>
                </div>
                <div class="table-responsive">
                    <table class="table table-modern">
                        <thead><tr><th style="background-color:#fff8e1;">#</th><th style="background-color:#fff8e1;">Fecha</th><th style="background-color:#fff8e1;">Membresía</th><th style="background-color:#fff8e1;" class="text-end">Importe</th><th style="background-color:#fff8e1;">Estado</th><th style="background-color:#fff8e1;" class="text-end">Acción</th></tr></thead>
                        <tbody>${(allRows.join('')) || '<tr><td colspan="6" class="text-center">Sin cuotas</td></tr>'}</tbody>
                    </table>
                </div>
            </div>
        `;
        }
        const el = document.getElementById('modalControlPagosAlumno');
        if (el) {
            el.style.zIndex = '2050';
            const modal = new bootstrap.Modal(el);
            modal.show();
        }
    } catch (error) {
        console.error('Error crítico en verControlPagosAlumno:', error);
        mostrarAlerta('Error al abrir el control de pagos. Intente nuevamente.', 'error');
    }
}

async function mostrarModalPagoAlumno(alumnoId, cuotaFecha, membresiaId, montoCuota, numeroCuota) {
    const alumno = await getData('alumnos', alumnoId);
    const membresia = await getData('membresias', membresiaId);
    document.getElementById('pagoAlumnoId').value = alumnoId;
    document.getElementById('pagoMembresiaId').value = membresiaId;
    document.getElementById('pagoCuotaFecha').value = cuotaFecha;
    document.getElementById('pagoFechaPago').value = getFechaActual();
    const precioFinal = (membresia?.precio || 0) - ((membresia?.precio || 0) * (membresia?.descuento || 0) / 100);
    document.getElementById('pagoMontoAlumno').value = Number.isFinite(montoCuota) ? montoCuota : precioFinal;
    const numEl = document.getElementById('pagoNumeroCuota');
    if (numEl) numEl.value = numeroCuota || '';
    const metodoEl = document.getElementById('pagoMetodo');
    const compEl = document.getElementById('pagoComprobante');
    if (compEl) {
        await actualizarOpcionesComprobantePago(compEl);
        let hasTicket = false;
        for (let i = 0; i < compEl.options.length; i++) {
            if (compEl.options[i].value === 'Ticket') { hasTicket = true; break; }
        }
        compEl.value = hasTicket ? 'Ticket' : (compEl.options.length ? compEl.options[0].value : '');
    }
    if (metodoEl) metodoEl.value = 'Efectivo';
    const fotoSrc = alumno.foto || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23e9ecef' width='48' height='48'/%3E%3C/svg%3E";
    const fotoEl = document.getElementById('pagoAlumnoFoto');
    const nombreEl = document.getElementById('pagoAlumnoNombre');
    const dniEl = document.getElementById('pagoAlumnoDni');
    if (fotoEl) fotoEl.src = fotoSrc;
    if (nombreEl) nombreEl.textContent = `${alumno.nombres} ${alumno.apellidos}`;
    if (dniEl) dniEl.textContent = `DNI: ${alumno.dni}`;
    const el = document.getElementById('modalPagoAlumno');
    if (el) {
        el.style.zIndex = '2060';
        new bootstrap.Modal(el).show();
    }
}

async function actualizarOpcionesComprobantePago(selectEl) {
    const tipos = ['Boleta', 'Factura', 'Ticket', 'Recibo', 'Nota de Venta'];
    selectEl.innerHTML = tipos.map(t => `<option value="${t}">${t}</option>`).join('');
}

async function guardarPagoAlumno() {
    const alumnoId = parseInt(document.getElementById('pagoAlumnoId').value);
    const membresiaId = parseInt(document.getElementById('pagoMembresiaId').value);
    const monto = parseFloat(document.getElementById('pagoMontoAlumno').value) || 0;
    const fechaPago = document.getElementById('pagoFechaPago').value;
    const metodoPago = document.getElementById('pagoMetodo')?.value || 'Efectivo';
    const tipoComprobante = document.getElementById('pagoComprobante')?.value || 'Sin Comprobante';
    const empresaId = getCurrentEmpresa().id;
    if (!alumnoId || !membresiaId || !fechaPago || monto <= 0) { mostrarAlerta('Complete los datos del pago', 'warning'); return; }
    try {
        const cuotaInicio = document.getElementById('pagoCuotaFecha').value;
        let serieComprobante = '';
        let numeroComprobante = '';
        if (tipoComprobante && tipoComprobante !== 'Sin Comprobante') {
            const rows = await getDataByIndex('configuracion', 'empresaId', empresaId);
            const cfg = rows && rows[0] ? rows[0] : null;
            if (cfg) {
                if (tipoComprobante === 'Boleta') {
                    const n = cfg.numeroBoleta || 0;
                    serieComprobante = cfg.serieBoleta || '';
                    numeroComprobante = String(n).padStart(8, '0');
                    cfg.numeroBoleta = n + 1;
                } else if (tipoComprobante === 'Factura') {
                    const n = cfg.numeroFactura || 0;
                    serieComprobante = cfg.serieFactura || '';
                    numeroComprobante = String(n).padStart(8, '0');
                    cfg.numeroFactura = n + 1;
                } else if (tipoComprobante === 'Ticket') {
                    const n = cfg.numeroTicket || 0;
                    serieComprobante = cfg.serieTicket || '';
                    numeroComprobante = String(n).padStart(8, '0');
                    cfg.numeroTicket = n + 1;
                } else if (tipoComprobante === 'Recibo') {
                    const n = cfg.numeroRecibo || 0;
                    serieComprobante = cfg.serieRecibo || '';
                    numeroComprobante = String(n).padStart(8, '0');
                    cfg.numeroRecibo = n + 1;
                } else if (tipoComprobante === 'Nota de Venta') {
                    const n = cfg.numeroNotaVenta || 0;
                    serieComprobante = cfg.serieNotaVenta || '';
                    numeroComprobante = String(n).padStart(8, '0');
                    cfg.numeroNotaVenta = n + 1;
                }
                await updateData('configuracion', cfg);
            }
        }
        await addData('pagos', { empresaId, alumnoId, membresiaId, monto, fecha: fechaPago, metodoPago, tipoComprobante, cuotaInicio, serieComprobante, numeroComprobante });
        const membresia = await getData('membresias', membresiaId);
        const alumno = await getData('alumnos', alumnoId);
        alumno.fechaVencimiento = calcularFechaVencimiento(membresia?.duracion || 30);
        await updateData('alumnos', alumno);
        const modalEl = document.getElementById('modalPagoAlumno');
        const modal = bootstrap.Modal.getInstance(modalEl);
        document.activeElement.blur();
        mostrarAlerta('El pago se realizó correctamente', 'success');
        modalEl.addEventListener('hidden.bs.modal', async () => {
            await verControlPagosAlumno();
            await cargarAlumnos();
            const backs = document.querySelectorAll('.modal-backdrop');
            backs.forEach(b => b.remove());
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('padding-right');
        }, { once: true });
        modal.hide();
    } catch (err) {
        console.error(err);
        mostrarAlerta('Error al registrar el pago', 'danger');
    }
}

async function mostrarComprobantePagoAlumno(alumnoId, cuotaInicioStr, membresiaId, numeroCuota) {
    const alumno = await getData('alumnos', alumnoId);
    const membresia = await getData('membresias', membresiaId);
    const empresa = getCurrentEmpresa();
    const cfgRows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    const cfg = cfgRows && cfgRows[0] ? cfgRows[0] : {};
    const fechaRegistro = (alumno.fechaRegistro || '').split('T')[0] || alumno.fechaRegistro;
    const inicioM = (membresia.fechaInicio || '').split('T')[0] || membresia.fechaInicio || fechaRegistro;
    const finM = membresia.fechaFin || sumarDiasLocal(inicioM, Math.max((membresia.duracion || 0) - 1, 0));
    const items = generarCuotasConPeriodo(inicioM, membresia.duracion || 0, membresia.tipo || 'Mensual', fechaRegistro);
    const item = items.find(x => x.inicio === cuotaInicioStr);
    const pagos = await getPagosByAlumno(alumnoId);
    const pagosMemb = pagos.filter(p => parseInt(p.membresiaId) === parseInt(membresiaId));
    const pago = item ? (pagosMemb.find(p => p.cuotaInicio && p.cuotaInicio === item.inicio) || pagosMemb.find(p => pagoCubrePeriodo(p.fecha, item.inicio, item.fin))) : null;
    const monto = pago ? pago.monto : 0;
    const metodo = pago ? pago.metodoPago : '-';
    const tipoComp = pago ? (pago.tipoComprobante || 'Sin Comprobante') : 'Sin Comprobante';
    const serie = (pago && pago.serieComprobante) ? pago.serieComprobante : (tipoComp === 'Boleta' ? (cfg.serieBoleta || '') : (tipoComp === 'Factura' ? (cfg.serieFactura || '') : (tipoComp === 'Ticket' ? (cfg.serieTicket || '') : (tipoComp === 'Recibo' ? (cfg.serieRecibo || '') : (tipoComp === 'Nota de Venta' ? (cfg.serieNotaVenta || '') : '')))));
    const numeroStr = (pago && pago.numeroComprobante) ? pago.numeroComprobante : '';
    const razonSocial = cfg.empresaRazonSocial || empresa.nombre;
    const ruc = cfg.empresaRuc || '';
    const direccion = cfg.empresaDireccion || '';
    const telefono = cfg.empresaTelefono || '';
    const logoBase64 = cfg.empresaLogo || '';
    const periodoTexto = item ? `${formatearFecha(item.inicio)} a ${formatearFecha(item.fin)}` : '-';
    const descripcionItem = `Cuota ${numeroCuota || ''} - ${membresia.nombre} (${periodoTexto})`;
    const igvPorc = 0.18;
    const igv = Math.round((monto * igvPorc) * 100) / 100;
    const subtotal = Math.round((monto - igv) * 100) / 100;
    const cont = document.getElementById('comprobantePagoAlumnoContent');
    if (cont) {
        cont.innerHTML = `
            <div style="max-width:520px;margin:0 auto;">
                <div style="text-align:center;margin-bottom:10px;">
                    ${logoBase64 ? `<img src="${logoBase64}" style="width:80px;height:80px;object-fit:contain;border-radius:8px;"/>` : ''}
                </div>
                <div style="text-align:center;font-weight:700;font-size:20px;">${razonSocial}</div>
                ${ruc ? `<div style="text-align:center">RUC: ${ruc}</div>` : ''}
                ${direccion ? `<div style="text-align:center">${direccion}</div>` : ''}
                ${telefono ? `<div style="text-align:center">${telefono}</div>` : ''}
                <hr>
                <div style="text-align:center;font-weight:700;">${tipoComp || 'Comprobante'}</div>
                ${serie || numeroStr ? `<div style="text-align:center;color:#666">${serie}${serie && numeroStr ? '-' : ''}${numeroStr}</div>` : ''}
                <hr>
                <div style="font-size:14px;line-height:1.6;">
                    <div><strong>Fecha:</strong> ${formatearFecha(pago?.fecha || getFechaActual())}</div>
                    <div><strong>Cliente:</strong> ${alumno.nombres} ${alumno.apellidos}</div>
                    <div><strong>DNI:</strong> ${alumno.dni || '-'}</div>
                    <div><strong>Membresía:</strong> ${membresia.nombre}</div>
                    <div><strong>Periodo:</strong> ${periodoTexto}</div>
                    <div><strong>Forma de pago:</strong> ${metodo}</div>
                </div>
                <hr>
                <table style="width:100%;font-size:14px;border-collapse:collapse;">
                    <thead>
                        <tr>
                            <th style="text-align:left;border-bottom:1px solid #ddd;padding-bottom:6px;width:60px;">Cant.</th>
                            <th style="text-align:left;border-bottom:1px solid #ddd;padding-bottom:6px;">Descripción</th>
                            <th style="text-align:right;border-bottom:1px solid #ddd;padding-bottom:6px;width:100px;">P.U.</th>
                            <th style="text-align:right;border-bottom:1px solid #ddd;padding-bottom:6px;width:100px;">Importe</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1.00</td>
                            <td>${descripcionItem}</td>
                            <td style="text-align:right;">${formatearMoneda(monto)}</td>
                            <td style="text-align:right;">${formatearMoneda(monto)}</td>
                        </tr>
                    </tbody>
                </table>
                <hr>
                <div style="margin-top:10px;text-align:right;">
                    <div>Subtotal: ${formatearMoneda(subtotal)}</div>
                    <div>IGV (18%): ${formatearMoneda(igv)}</div>
                    <div style="font-size:18px;font-weight:700;">TOTAL: ${formatearMoneda(monto)}</div>
                </div>
                
            </div>
        `;
    }
    new bootstrap.Modal(document.getElementById('modalComprobantePagoAlumno')).show();
}

async function generarCredencial() {
    if (!window.alumnoSeleccionado) return;
    const alumno = window.alumnoSeleccionado;
    const empresa = getCurrentEmpresa();
    const categoria = await getData('categorias', alumno.categoriaId);
    const cfgRows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    const cfg = cfgRows && cfgRows[0] ? cfgRows[0] : {};
    const fondo = cfg.credencialFondo || '';
    const clubNombre = (cfg.clubNombre || empresa.nombre).toUpperCase();
    const clubTitulo1 = (cfg.clubTitulo1 || '').toUpperCase();
    const clubTitulo2 = (cfg.clubTitulo2 || '').toUpperCase();
    const clubTitulo1Color = cfg.clubTitulo1Color || '#1e56a0';
    const clubTitulo2Color = cfg.clubTitulo2Color || '#2d7dd2';
    const clubDireccion = cfg.clubDireccion || '';
    const clubLogo = cfg.clubLogo || '';

    const nombreCompleto = `${alumno.nombres} ${alumno.apellidos}`.toUpperCase();
    const categoriaNombre = categoria ? (categoria.nombre || '').toUpperCase() : '';
    const correlativo = (alumno.id && Number.isInteger(alumno.id)) ? String(alumno.id).padStart(5, '0') : '00000';

    const hasTitles = !!(clubTitulo1 || clubTitulo2);
    const logoSize = clubLogo ? 100 : 0;
    const defaultBarTop = hasTitles ? 66 : 46;
    const barTop = clubLogo ? Math.max(defaultBarTop, 10 + logoSize + 4) : defaultBarTop;
    const photoTop = barTop + 30;
    const alumnoLabelTop = photoTop + 15;
    const alumnoBlockTop = alumnoLabelTop + 25;
    const categoriaLabelTop = alumnoBlockTop + 65;
    const categoriaBlockTop = categoriaLabelTop + 25;

    const credencial = `
        <div style="width:800px;height:500px;margin:20px auto;position:relative;background:${fondo ? `url('${fondo}') center/cover no-repeat` : '#f5f5f5'};border:1px solid #ddd;border-radius:8px;overflow:hidden;">
            <div style="position:absolute;top:12px;left:12px;background:#fff;color:#111;padding:4px 10px;border:1px solid #cfcfcf;border-radius:4px;font-family:'Roboto', Arial, sans-serif;font-weight:600;letter-spacing:1px;font-size:20px;">${correlativo}</div>
            ${clubTitulo1 || clubTitulo2 ? `
                <div style=\"position:absolute;top:12px;left:0;right:0;text-align:center;\">
                    <span style=\"display:inline-block;background:${clubTitulo1Color};color:#fff;padding:4px 12px;border-radius:6px;font-family:'Roboto', Arial, sans-serif;font-weight:500;letter-spacing:1px;font-size:24px;\">${clubTitulo1}</span>
                </div>
                <div style=\"position:absolute;top:60px;left:0;right:0;text-align:center;\">
                    <span style=\"display:inline-block;background:${clubTitulo2Color};color:#fff;padding:4px 12px;border-radius:6px;font-family:'Roboto', Arial, sans-serif;font-weight:500;letter-spacing:1px;font-size:24px;\">${clubTitulo2}</span>
                </div>
            ` : `
                <div style=\"position:absolute;top:20px;left:12px;right:12px;text-align:center;font-family:'Roboto', Arial, sans-serif;font-weight:500;letter-spacing:1px;color:#1e1e1e;font-size:28px;\">${clubNombre}</div>
            `}
            ${clubLogo ? `<div style=\"position:absolute;top:10px;right:16px;width:${logoSize}px;height:${logoSize}px;background:url('${clubLogo}') center/contain no-repeat;\"></div>` : ''}
            <div style="position:absolute;top:${photoTop}px;left:40px;width:220px;height:240px;background:#fff;border:4px solid #1e56a0;border-radius:6px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                <img src="${alumno.foto || ''}" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div style="position:absolute;top:${photoTop + 250}px;left:40px;width:220px;text-align:center;color:#d61c1c;font-family:'Roboto', Arial, sans-serif;font-weight:500;font-size:20px;">${alumno.dni || ''}</div>
            <div style="position:absolute;top:${alumnoLabelTop}px;left:320px;font-size:16px;color:#333;background:#fff7cc;padding:4px 10px;border-radius:4px;">Alumno :</div>
            <div style="position:absolute;top:${alumnoBlockTop}px;left:320px;width:430px;background:#fff;color:#1e56a0;border:1px solid #d9d9d9;font-family:'Roboto', Arial, sans-serif;font-weight:900;font-style:italic;font-size:24px;padding:10px 12px;border-radius:4px;">${nombreCompleto}</div>
            <div style="position:absolute;top:${categoriaLabelTop}px;left:320px;font-size:16px;color:#333;background:#fff7cc;padding:4px 10px;border-radius:4px;">Categoría :</div>
            <div style="position:absolute;top:${categoriaBlockTop}px;left:320px;width:430px;background:#fff;color:#1e56a0;border:1px solid #d9d9d9;font-family:'Roboto', Arial, sans-serif;font-weight:900;font-style:italic;font-size:24px;padding:10px 12px;border-radius:4px;">${categoriaNombre}</div>
            <div style="position:absolute;bottom:20px;left:20px;width:280px;background:#111;color:#fff;padding:10px;border-radius:4px;font-size:14px;text-align:center;">${clubDireccion || empresa.nombre}</div>
            <div style="position:absolute;bottom:20px;left:320px;width:460px;height:80px;border:1px solid #cfcfcf;background:#fff;display:flex;align-items:center;justify-content:center;padding:5px;">
                <svg id="credCodigoBarras" style="width:440px;height:70px"></svg>
            </div>
            <script>
                (function(){
                    function gen(){
                        var el = document.getElementById('credCodigoBarras');
                        if (window.JsBarcode && el){
                            JsBarcode(el, "${alumno.codigoAlumno || ''}", {format:'CODE128', height:70, width:2, margin:0, displayValue:false});
                        }
                    }
                    if (document.readyState === 'complete' || document.readyState === 'interactive') gen();
                    else document.addEventListener('DOMContentLoaded', gen);
                })();
            </script>
        </div>
    `;

    imprimirContenido(credencial);
}
function imprimirComprobantePagoAlumno() {
    const cont = document.getElementById('comprobantePagoAlumnoContent');
    if (!cont) return;
    const html = cont.innerHTML;
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return;
    w.document.open();
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Comprobante de Pago</title><style>body{font-family:Arial,Helvetica,sans-serif;margin:20px;} hr{border:none;border-top:1px dashed #bbb;margin:10px 0;} table{width:100%;border-collapse:collapse;} th,td{padding:6px;font-size:14px;} th{background:#f8f9fa;} .total{font-size:18px;font-weight:700;}</style></head><body>${html}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
}
