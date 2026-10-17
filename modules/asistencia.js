// modules/asistencia.js - Módulo de Asistencia
async function renderAsistencia() {
    const container = document.getElementById('contentContainer');
    const fechaHoy = getFechaActual();

    container.innerHTML = `
        <div class="module-card">
            <div class="module-header">
                <h4><i class="bi bi-check2-circle"></i> Control de Asistencia</h4>
                <input type="date" class="form-control" id="fechaAsistencia" value="${fechaHoy}" onchange="cargarAsistencias()" style="width:200px;">
            </div>

            <div class="row mb-3">
                <div class="col-md-3">
                    <div class="search-box">
                        <i class="bi bi-search"></i>
                        <input type="text" class="form-control" id="buscarAsistencia" placeholder="Buscar alumno..." oninput="filtrarAlumnos()">
                    </div>
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="filtroDeporteAsistencia" onchange="cargarAsistencias()">
                        <option value="">Todos los deportes</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="filtroCategoriaAsistencia" onchange="cargarAsistencias()">
                        <option value="">Todas las categorías</option>
                    </select>
                </div>
                <div class="col-md-3 text-end">
                    <button class="btn btn-success" onclick="marcarTodos()">
                        <i class="bi bi-check-all"></i> Marcar Todos
                    </button>
                </div>
            </div>

            <div class="attendance-grid" id="asistenciaGrid"></div>
        </div>
    `;

    await cargarFiltrosAsistencia();
    await cargarAsistencias();
}

async function cargarFiltrosAsistencia() {
    const empresa = getCurrentEmpresa();
    const categorias = await getDataByEmpresa('categorias', empresa.id);
    // Obtener deportes desde configuración
    const deportes = await getDeportesFromConfig();

    document.getElementById('filtroDeporteAsistencia').innerHTML = '<option value="">Todos los deportes</option>' +
        deportes.map(d => `<option value="${d}">${d}</option>`).join('');

    document.getElementById('filtroCategoriaAsistencia').innerHTML = '<option value="">Todas las categorías</option>' +
        categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
}

async function cargarAsistencias() {
    const empresa = getCurrentEmpresa();
    const fecha = document.getElementById('fechaAsistencia').value;
    const filtroCategoria = document.getElementById('filtroCategoriaAsistencia') ? document.getElementById('filtroCategoriaAsistencia').value : '';
    const filtroDeporte = document.getElementById('filtroDeporteAsistencia') ? document.getElementById('filtroDeporteAsistencia').value : '';

    let alumnos = await getDataByEmpresa('alumnos', empresa.id);
    alumnos = alumnos.filter(a => a.activo);

    if (filtroDeporte) {
        alumnos = alumnos.filter(a => (a.deporte || '') === filtroDeporte);
    }

    if (filtroCategoria) {
        alumnos = alumnos.filter(a => a.categoriaId == filtroCategoria);
    }

    const asistencias = await getAsistenciasByFecha(empresa.id, fecha);
    const asistenciaMap = {};
    asistencias.forEach(a => asistenciaMap[a.alumnoId] = true);

    const grid = document.getElementById('asistenciaGrid');

    if (alumnos.length === 0) {
        grid.innerHTML = '<p class="text-center text-muted">No hay alumnos para mostrar</p>';
        return;
    }

    grid.innerHTML = alumnos.map(alumno => {
        const checked = asistenciaMap[alumno.id] ? 'checked' : '';
        const estadoPago = verificarEstadoPagoSync(alumno.fechaVencimiento);
        let borderColor = '#28a745';

        if (estadoPago === 'vencido') borderColor = '#dc3545';
        else if (estadoPago === 'proximo-vencer') borderColor = '#ffc107';

        const fotoSrc = alumno.foto || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23e9ecef' width='80' height='80'/%3E%3C/svg%3E";

        return `
            <div class="attendance-item ${checked ? 'checked' : ''}" id="att-${alumno.id}" onclick="toggleAsistencia(${alumno.id})" style="border: 3px solid ${borderColor};">
                <img src="${fotoSrc}" alt="${alumno.nombres}">
                <div><strong>${alumno.nombres}</strong></div>
                <div><small>${alumno.apellidos}</small></div>
                <div class="mt-2">
                    ${checked ? '<i class="bi bi-check-circle-fill text-success" style="font-size:24px;"></i>' : '<i class="bi bi-circle" style="font-size:24px;opacity:0.3;"></i>'}
                </div>
            </div>
        `;
    }).join('');

    window.alumnosAsistencia = alumnos;
}



async function toggleAsistencia(alumnoId) {
    const empresa = getCurrentEmpresa();
    const fecha = document.getElementById('fechaAsistencia').value;
    const hora = getHoraActual();

    const asistencias = await getAsistenciasByFecha(empresa.id, fecha);
    const asistenciaExistente = asistencias.find(a => a.alumnoId === alumnoId);

    const item = document.getElementById(`att-${alumnoId}`);

    if (asistenciaExistente) {
        await deleteData('asistencias', asistenciaExistente.id);
        item.classList.remove('checked');
        item.querySelector('i').className = 'bi bi-circle';
        item.querySelector('i').style.fontSize = '24px';
        item.querySelector('i').style.opacity = '0.3';
        mostrarAlerta('Asistencia eliminada', 'info');
    } else {
        const alumno = await getData('alumnos', alumnoId);
        const estadoPago = await verificarEstadoPago(alumnoId);

        if (estadoPago === 'vencido') {
            const confirmar = await confirmarAccion('El alumno tiene pagos vencidos. ¿Desea registrar la asistencia de todos modos?');
            if (!confirmar) return;
        }

        await addData('asistencias', {
            empresaId: empresa.id,
            alumnoId: alumnoId,
            fecha: fecha,
            hora: hora,
            estadoPago: estadoPago,
            fechaRegistro: new Date().toISOString()
        });

        item.classList.add('checked');
        item.querySelector('i').className = 'bi bi-check-circle-fill text-success';
        item.querySelector('i').style.fontSize = '24px';
        mostrarAlerta('Asistencia registrada correctamente', 'success');
    }
}

async function marcarTodos() {
    const confirmar = await confirmarAccion('¿Está seguro de marcar asistencia a todos los alumnos?');
    if (!confirmar) return;

    const alumnos = window.alumnosAsistencia || [];
    const empresa = getCurrentEmpresa();
    const fecha = document.getElementById('fechaAsistencia').value;
    const hora = getHoraActual();

    for (const alumno of alumnos) {
        const asistencias = await getAsistenciasByFecha(empresa.id, fecha);
        const yaRegistrado = asistencias.find(a => a.alumnoId === alumno.id);

        if (!yaRegistrado) {
            await addData('asistencias', {
                empresaId: empresa.id,
                alumnoId: alumno.id,
                fecha: fecha,
                hora: hora,
                estadoPago: await verificarEstadoPago(alumno.id),
                fechaRegistro: new Date().toISOString()
            });
        }
    }

    mostrarAlerta('Asistencias registradas correctamente', 'success');
    await cargarAsistencias();
}

function filtrarAlumnos() {
    const filtro = document.getElementById('buscarAsistencia').value.toLowerCase();
    const items = document.querySelectorAll('.attendance-item');

    items.forEach(item => {
        const texto = item.textContent.toLowerCase();
        item.style.display = texto.includes(filtro) ? '' : 'none';
    });
}
