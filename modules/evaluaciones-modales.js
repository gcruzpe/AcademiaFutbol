// modules/evaluaciones-modales.js - Modales para Evaluaciones

function modalEvaluacionFisica() {
    return `
        <div class="modal fade" id="modalFisica" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                        <h5 class="modal-title"><i class="bi bi-activity"></i> 🏃 Evaluación Física</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formFisica">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label"><strong>Nombre de la Evaluación *</strong></label>
                                    <input type="text" class="form-control" id="nombreEvalFisica" placeholder="Ej: Evaluación Física #1" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label"><strong>Fecha *</strong></label>
                                    <input type="date" class="form-control" id="fechaEvalFisica" required>
                                </div>
                            </div>
                            
                            <h6 class="text-primary mt-3"><i class="bi bi-heart-pulse"></i> Resistencia</h6>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Test de Cooper (metros)</label>
                                    <input type="number" step="0.01" class="form-control" id="testCooper" placeholder="Distancia recorrida en 12 min">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Yo-Yo Test (nivel)</label>
                                    <input type="number" class="form-control" id="yoyoTest" placeholder="Nivel alcanzado">
                                </div>
                            </div>
                            
                            <h6 class="text-success mt-3"><i class="bi bi-lightning-charge"></i> Velocidad</h6>
                            <div class="row mb-3">
                                <div class="col-md-4">
                                    <label class="form-label">Sprint 10m (segundos)</label>
                                    <input type="number" step="0.01" class="form-control" id="sprint10m">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Sprint 20m (segundos)</label>
                                    <input type="number" step="0.01" class="form-control" id="sprint20m">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Sprint 30m (segundos)</label>
                                    <input type="number" step="0.01" class="form-control" id="sprint30m">
                                </div>
                            </div>
                            
                            <h6 class="text-warning mt-3"><i class="bi bi-shuffle"></i> Agilidad</h6>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Test Illinois (segundos)</label>
                                    <input type="number" step="0.01" class="form-control" id="testIllinois">
                                </div>
                            </div>
                            
                            <h6 class="text-danger mt-3"><i class="bi bi-arrow-up-circle"></i> Fuerza Explosiva</h6>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Salto Vertical (cm)</label>
                                    <input type="number" step="0.1" class="form-control" id="saltoVertical">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Salto Horizontal (cm)</label>
                                    <input type="number" step="0.1" class="form-control" id="saltoHorizontal">
                                </div>
                            </div>
                            
                            <h6 class="text-info mt-3"><i class="bi bi-arrows-angle-expand"></i> Flexibilidad</h6>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Sit and Reach (cm)</label>
                                    <input type="number" step="0.1" class="form-control" id="sitAndReach">
                                </div>
                            </div>
                            
                            <h6 class="text-secondary mt-3"><i class="bi bi-person"></i> Composición Corporal</h6>
                            <div class="row mb-3">
                                <div class="col-md-3">
                                    <label class="form-label">Peso (kg)</label>
                                    <input type="number" step="0.1" class="form-control" id="pesoEval">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Talla (cm)</label>
                                    <input type="number" step="0.1" class="form-control" id="tallaEval">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">IMC (calculado)</label>
                                    <input type="number" step="0.01" class="form-control" id="imcEval" readonly>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">% Grasa</label>
                                    <input type="number" step="0.1" class="form-control" id="grasaEval">
                                </div>
                            </div>
                            
                            <h6 class="mt-3"><i class="bi bi-chat-left-text"></i> Notas del Entrenador</h6>
                            <textarea class="form-control" id="notasFisica" rows="3" placeholder="Observaciones, fortalezas, áreas de mejora..."></textarea>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarEvaluacionFisica()">
                            <i class="bi bi-save"></i> Guardar Evaluación
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function modalEvaluacionTecnica() {
    return `
        <div class="modal fade" id="modalTecnica" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white;">
                        <h5 class="modal-title"><i class="bi bi-dribbble"></i> ⚽ Evaluación Técnica</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formTecnica">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label"><strong>Nombre de la Evaluación *</strong></label>
                                    <input type="text" class="form-control" id="nombreEvalTecnica" placeholder="Ej: Evaluación Técnica #1" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label"><strong>Fecha *</strong></label>
                                    <input type="date" class="form-control" id="fechaEvalTecnica" required>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Control y Conducción (tiempo en seg)</label>
                                    <input type="number" step="0.01" class="form-control" id="controlConduccion" placeholder="Tiempo en circuito con conos">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Dominio del Balón (toques consecutivos)</label>
                                    <input type="number" class="form-control" id="dominioBalon">
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Pases Corto (% aciertos)</label>
                                    <input type="number" class="form-control" id="pasesCorto" min="0" max="100" placeholder="0-100%">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Pases Largo (% aciertos)</label>
                                    <input type="number" class="form-control" id="pasesLargo" min="0" max="100" placeholder="0-100%">
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Potencia de Tiro (km/h)</label>
                                    <input type="number" step="0.1" class="form-control" id="potenciaTiro">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Precisión de Tiro (% aciertos)</label>
                                    <input type="number" class="form-control" id="precisionTiro" min="0" max="100" placeholder="0-100%">
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Recepción y Orientación (1-5)</label>
                                    <select class="form-select" id="recepcionOrientacion">
                                        <option value="">Seleccione...</option>
                                        <option value="1">1 - Muy Bajo</option>
                                        <option value="2">2 - Bajo</option>
                                        <option value="3">3 - Regular</option>
                                        <option value="4">4 - Bueno</option>
                                        <option value="5">5 - Excelente</option>
                                    </select>
                                </div>
                            </div>
                            
                            <h6 class="mt-3"><i class="bi bi-chat-left-text"></i> Notas del Entrenador</h6>
                            <textarea class="form-control" id="notasTecnica" rows="3" placeholder="Observaciones, fortalezas, áreas de mejora..."></textarea>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" onclick="guardarEvaluacionTecnica()">
                            <i class="bi bi-save"></i> Guardar Evaluación
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function modalEvaluacionTactica() {
    return `
        <div class="modal fade" id="modalTactica" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white;">
                        <h5 class="modal-title"><i class="bi bi-diagram-3"></i> 🧠 Evaluación Táctica</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formTactica">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label"><strong>Nombre de la Evaluación *</strong></label>
                                    <input type="text" class="form-control" id="nombreEvalTactica" placeholder="Ej: Evaluación Táctica #1" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label"><strong>Fecha *</strong></label>
                                    <input type="date" class="form-control" id="fechaEvalTactica" required>
                                </div>
                            </div>
                            
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i> Todas las evaluaciones tácticas se califican en escala del 1 al 5
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Toma de Decisiones (1-5)</label>
                                    <select class="form-select" id="tomaDecisiones">
                                        <option value="">Seleccione...</option>
                                        <option value="1">1 - Muy Bajo</option>
                                        <option value="2">2 - Bajo</option>
                                        <option value="3">3 - Regular</option>
                                        <option value="4">4 - Bueno</option>
                                        <option value="5">5 - Excelente</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Posicionamiento (1-5)</label>
                                    <select class="form-select" id="posicionamiento">
                                        <option value="">Seleccione...</option>
                                        <option value="1">1 - Muy Bajo</option>
                                        <option value="2">2 - Bajo</option>
                                        <option value="3">3 - Regular</option>
                                        <option value="4">4 - Bueno</option>
                                        <option value="5">5 - Excelente</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Visión de Juego (1-5)</label>
                                    <select class="form-select" id="visionJuego">
                                        <option value="">Seleccione...</option>
                                        <option value="1">1 - Muy Bajo</option>
                                        <option value="2">2 - Bajo</option>
                                        <option value="3">3 - Regular</option>
                                        <option value="4">4 - Bueno</option>
                                        <option value="5">5 - Excelente</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Trabajo en Equipo (1-5)</label>
                                    <select class="form-select" id="trabajoEquipo">
                                        <option value="">Seleccione...</option>
                                        <option value="1">1 - Muy Bajo</option>
                                        <option value="2">2 - Bajo</option>
                                        <option value="3">3 - Regular</option>
                                        <option value="4">4 - Bueno</option>
                                        <option value="5">5 - Excelente</option>
                                    </select>
                                </div>
                            </div>
                            
                            <h6 class="mt-3"><i class="bi bi-chat-left-text"></i> Notas del Entrenador</h6>
                            <textarea class="form-control" id="notasTactica" rows="3" placeholder="Observaciones sobre el desempeño táctico..."></textarea>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-warning" onclick="guardarEvaluacionTactica()">
                            <i class="bi bi-save"></i> Guardar Evaluación
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function modalEvaluacionPsicologica() {
    return `
        <div class="modal fade" id="modalPsicologica" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white;">
                        <h5 class="modal-title"><i class="bi bi-心brain"></i> 💡 Evaluación Psicológica y Social</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formPsicologica">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label"><strong>Nombre de la Evaluación *</strong></label>
                                    <input type="text" class="form-control" id="nombreEvalPsicologica" placeholder="Ej: Evaluación Psicológica #1" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label"><strong>Fecha *</strong></label>
                                    <input type="date" class="form-control" id="fechaEvalPsicologica" required>
                                </div>
                            </div>
                            
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i> Evaluaciones en escala del 1 al 5
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Motivación (1-5)</label>
                                    <select class="form-select" id="motivacion">
                                        <option value="">Seleccione...</option>
                                        <option value="1">1 - Muy Bajo</option>
                                        <option value="2">2 - Bajo</option>
                                        <option value="3">3 - Regular</option>
                                        <option value="4">4 - Bueno</option>
                                        <option value="5">5 - Excelente</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Concentración (1-5)</label>
                                    <select class="form-select" id="concentracion">
                                        <option value="">Seleccione...</option>
                                        <option value="1">1 - Muy Bajo</option>
                                        <option value="2">2 - Bajo</option>
                                        <option value="3">3 - Regular</option>
                                        <option value="4">4 - Bueno</option>
                                        <option value="5">5 - Excelente</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-4">
                                    <label class="form-label">Resiliencia (1-5)</label>
                                    <select class="form-select" id="resiliencia">
                                        <option value="">Seleccione...</option>
                                        <option value="1">1 - Muy Bajo</option>
                                        <option value="2">2 - Bajo</option>
                                        <option value="3">3 - Regular</option>
                                        <option value="4">4 - Bueno</option>
                                        <option value="5">5 - Excelente</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Liderazgo (1-5)</label>
                                    <select class="form-select" id="liderazgo">
                                        <option value="">Seleccione...</option>
                                        <option value="1">1 - Muy Bajo</option>
                                        <option value="2">2 - Bajo</option>
                                        <option value="3">3 - Regular</option>
                                        <option value="4">4 - Bueno</option>
                                        <option value="5">5 - Excelente</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Convivencia (1-5)</label>
                                    <select class="form-select" id="convivencia">
                                        <option value="">Seleccione...</option>
                                        <option value="1">1 - Muy Bajo</option>
                                        <option value="2">2 - Bajo</option>
                                        <option value="3">3 - Regular</option>
                                        <option value="4">4 - Bueno</option>
                                        <option value="5">5 - Excelente</option>
                                    </select>
                                </div>
                            </div>
                            
                            <h6 class="mt-3"><i class="bi bi-chat-left-text"></i> Notas del Entrenador</h6>
                            <textarea class="form-control" id="notasPsicologica" rows="3" placeholder="Observaciones sobre aspectos psicológicos y sociales..."></textarea>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" onclick="guardarEvaluacionPsicologica()">
                            <i class="bi bi-save"></i> Guardar Evaluación
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function modalHistorialMedico() {
    return `
        <div class="modal fade" id="modalMedica" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white;">
                        <h5 class="modal-title"><i class="bi bi-hospital"></i> 📊 Historial Médico y Salud</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formMedica">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label"><strong>Nombre del Registro *</strong></label>
                                    <input type="text" class="form-control" id="nombreEvalMedica" placeholder="Ej: Chequeo Médico Inicial" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label"><strong>Fecha *</strong></label>
                                    <input type="date" class="form-control" id="fechaEvalMedica" required>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Chequeo Médico</label>
                                <textarea class="form-control" id="chequeoMedico" rows="2" placeholder="Resultados del chequeo médico..."></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Lesiones Previas</label>
                                <textarea class="form-control" id="lesiones" rows="2" placeholder="Historial de lesiones..."></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Estado Nutricional</label>
                                <textarea class="form-control" id="estadoNutricional" rows="2" placeholder="Evaluación nutricional..."></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Observaciones Médicas</label>
                                <textarea class="form-control" id="observacionesMedicas" rows="3" placeholder="Recomendaciones, restricciones, etc..."></textarea>
                            </div>
                            
                            <h6 class="mt-3"><i class="bi bi-chat-left-text"></i> Notas del Entrenador</h6>
                            <textarea class="form-control" id="notasMedica" rows="2" placeholder="Notas adicionales..."></textarea>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarHistorialMedico()">
                            <i class="bi bi-save"></i> Guardar Registro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function modalDatosAntropometricos() {
    return `
        <div class="modal fade" id="modalAntropometricos" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title"><i class="bi bi-body-text"></i> Datos Antropométricos</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formAntropometricos">
                            <div class="mb-3">
                                <label class="form-label"><strong>Fecha *</strong></label>
                                <input type="date" class="form-control" id="fechaAntropometricos" required>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Peso (kg) *</label>
                                    <input type="number" step="0.1" class="form-control" id="pesoAntro" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Talla (cm) *</label>
                                    <input type="number" step="0.1" class="form-control" id="tallaAntro" required>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">IMC (calculado)</label>
                                    <input type="number" step="0.01" class="form-control" id="imcAntro" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">% Grasa Corporal</label>
                                    <input type="number" step="0.1" class="form-control" id="grasaAntro">
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Observaciones</label>
                                <textarea class="form-control" id="observacionesAntro" rows="2"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-info" onclick="guardarDatosAntropometricos()">
                            <i class="bi bi-save"></i> Guardar Datos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function modalProgreso() {
    return `
        <div class="modal fade" id="modalProgreso" tabindex="-1">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="bi bi-graph-up-arrow"></i> 📈 Progreso y Reportes</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6 mb-4">
                                <div class="card shadow-sm">
                                    <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">Progreso Físico</h6>
                                        <button class="btn btn-sm btn-light text-primary" onclick="verDetalleGrafico('fisica')">
                                            <i class="bi bi-search"></i> Detalles
                                        </button>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="chartFisica"></canvas>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6 mb-4">
                                <div class="card shadow-sm">
                                    <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">Progreso Técnico</h6>
                                        <button class="btn btn-sm btn-light text-success" onclick="verDetalleGrafico('tecnica')">
                                            <i class="bi bi-search"></i> Detalles
                                        </button>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="chartTecnica"></canvas>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6 mb-4">
                                <div class="card shadow-sm">
                                    <div class="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">Progreso Táctico</h6>
                                        <button class="btn btn-sm btn-dark text-warning" onclick="verDetalleGrafico('tactica')">
                                            <i class="bi bi-search"></i> Detalles
                                        </button>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="chartTactica"></canvas>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6 mb-4">
                                <div class="card shadow-sm">
                                    <div class="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">Progreso Psicológico</h6>
                                        <button class="btn btn-sm btn-light text-danger" onclick="verDetalleGrafico('psicologica')">
                                            <i class="bi bi-search"></i> Detalles
                                        </button>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="chartPsicologica"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="window.print()">
                            <i class="bi bi-printer"></i> Imprimir Reporte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function modalDetalleEvaluacion() {
    return `
        <div class="modal fade" id="modalDetalleEvaluacion" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title"><i class="bi bi-eye"></i> Detalle de Evaluación</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="contenidoDetalleEval"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function modalDetalleGrafico() {
    return `
        <div class="modal fade" id="modalDetalleGrafico" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content" style="border: 3px solid #0d6efd;">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="tituloDetalleGrafico"><i class="bi bi-bar-chart-line"></i> Análisis Detallado</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-8 mb-4">
                                <div class="card shadow-sm h-100">
                                    <div class="card-body">
                                        <canvas id="chartDetalleGrande"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="card shadow-sm h-100 border-0 bg-light">
                                    <div class="card-header bg-white border-bottom">
                                        <h5 class="mb-0 text-primary"><i class="bi bi-journal-text"></i> Informe Técnico</h5>
                                    </div>
                                    <div class="card-body" id="contenidoAnalisisGrafico" style="max-height: 500px; overflow-y: auto;">
                                        <!-- Aquí se inyectará el análisis -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="window.print()">
                            <i class="bi bi-printer"></i> Imprimir Análisis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function modalLeyenda() {
    return `
        <div class="modal fade" id="modalLeyenda" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title"><i class="bi bi-info-circle"></i> Leyenda de Evaluación</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="row g-4">
                            <!-- Columna Escala Numérica -->
                            <div class="col-md-6">
                                <h6 class="fw-bold mb-3 border-bottom pb-2">Escala Numérica (1-5)</h6>
                                <div class="d-flex flex-column gap-2">
                                    <div class="d-flex align-items-center">
                                        <span class="badge rounded-pill bg-danger me-3" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 1rem;">1</span>
                                        <span class="text-secondary fw-medium">Muy Bajo / Deficiente</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge rounded-pill bg-warning me-3" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 1rem;">2</span>
                                        <span class="text-secondary fw-medium">Bajo / Necesita Mejorar</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge rounded-pill bg-info me-3" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 1rem;">3</span>
                                        <span class="text-secondary fw-medium">Regular / Aceptable</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge rounded-pill bg-primary me-3" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 1rem;">4</span>
                                        <span class="text-secondary fw-medium">Bueno / Destacado</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge rounded-pill bg-success me-3" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 1rem;">5</span>
                                        <span class="text-secondary fw-medium">Excelente / Sobresaliente</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Columna Categorías -->
                            <div class="col-md-6">
                                <h6 class="fw-bold mb-3 border-bottom pb-2">Categorías de Evaluación</h6>
                                <div class="d-flex flex-column gap-2">
                                    <div class="d-flex align-items-center">
                                        <span class="badge rounded-pill me-3" style="width: 40px; height: 30px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">🏃</span>
                                        <div>
                                            <span class="fw-bold d-block text-dark">Física</span>
                                            <small class="text-muted">Pruebas objetivas y mediciones</small>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge rounded-pill me-3" style="width: 40px; height: 30px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">⚽</span>
                                        <div>
                                            <span class="fw-bold d-block text-dark">Técnica</span>
                                            <small class="text-muted">Habilidades con balón</small>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge rounded-pill me-3" style="width: 40px; height: 30px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">🧠</span>
                                        <div>
                                            <span class="fw-bold d-block text-dark">Táctica</span>
                                            <small class="text-muted">Inteligencia de juego</small>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge rounded-pill me-3" style="width: 40px; height: 30px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">💡</span>
                                        <div>
                                            <span class="fw-bold d-block text-dark">Psicológica</span>
                                            <small class="text-muted">Aspectos mentales</small>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="badge rounded-pill me-3" style="width: 40px; height: 30px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">📊</span>
                                        <div>
                                            <span class="fw-bold d-block text-dark">Médica</span>
                                            <small class="text-muted">Salud y prevención</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer bg-light">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
