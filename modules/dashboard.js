// modules/dashboard.js - Módulo Dashboard
async function renderDashboard() {
    const container = document.getElementById('contentContainer');
    const empresa = getCurrentEmpresa();

    // Obtener datos
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const categorias = await getDataByEmpresa('categorias', empresa.id);
    const evaluaciones = await getDataByEmpresa('evaluaciones', empresa.id);
    const alumnosConEvaluacion = new Set(evaluaciones.map(e => e.alumnoId)).size;
    const alumnosActivos = alumnos.filter(a => a.activo).length;
    const alumnosVencidos = await contarAlumnosVencidos();

    container.innerHTML = `
        <div class="row g-4 mb-4">
            <div class="col-6 col-md-3">
                <div class="stat-card blue" style="background:linear-gradient(135deg, #1fb7ff, #42c2ff); color:#fff; box-shadow: 0 8px 16px rgba(31, 183, 255, 0.3);">
                    <div class="stat-icon" style="color:rgba(255,255,255,0.85)">
                        <i class="bi bi-people-fill"></i>
                    </div>
                    <h6 style="color:#fff; font-size:18px; font-weight:600;">Total Alumnos</h6>
                    <h3 style="color:#fff">${alumnosActivos}</h3>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="stat-card cyan" style="background:linear-gradient(135deg, #ff7eb3, #ff758c); color:#fff; box-shadow: 0 8px 16px rgba(255, 126, 179, 0.3);">
                    <div class="stat-icon" style="color:rgba(255,255,255,0.85)">
                        <i class="bi bi-tags"></i>
                    </div>
                    <h6 style="color:#fff; font-size:18px; font-weight:600;">Categorías</h6>
                    <h3 style="color:#fff">${categorias.length}</h3>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="stat-card success" style="background:linear-gradient(135deg, #00c1a9, #3ad1bf); color:#fff; box-shadow: 0 8px 16px rgba(0, 193, 169, 0.3);">
                    <div class="stat-icon" style="color:rgba(255,255,255,0.85)">
                        <i class="bi bi-clipboard-check"></i>
                    </div>
                    <h6 style="color:#fff; font-size:18px; font-weight:600;">Alumnos Evaluados</h6>
                    <h3 style="color:#fff">${alumnosConEvaluacion}</h3>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="stat-card warning" style="background:linear-gradient(135deg, #6a5acd, #7b68ee); color:#fff; box-shadow: 0 8px 16px rgba(106, 90, 205, 0.3);">
                    <div class="stat-icon" style="color:rgba(255,255,255,0.85)">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <h6 style="color:#fff; font-size:18px; font-weight:600;">Pagos Vencidos</h6>
                    <h3 style="color:#fff">${alumnosVencidos}</h3>
                </div>
            </div>
        </div>

        <div class="row g-4 mb-4">
            <div class="col-md-6">
                <div class="module-card">
                    <div class="module-header">
                        <h4><i class="bi bi-tags"></i> Alumnos por Categoría</h4>
                    </div>
                    <div id="alumnosPorCategoria" style="height: 300px; padding: 15px;">
                        <canvas id="chartAlumnosPorCategoria"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="module-card">
                    <div class="module-header">
                        <h4><i class="bi bi-graph-up"></i> Ingresos Últimos 7 Días</h4>
                    </div>
                    <div id="ingresosChart" style="height: 300px;">
                        <canvas id="chartIngresos"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-md-12">
                <div class="module-card">
                    <div class="module-header">
                        <h4><i class="bi bi-calendar-event"></i> Próximos Vencimientos</h4>
                    </div>
                    <div id="proximosVencimientos"></div>
                </div>
            </div>
        </div>
    `;

    // Renderizar gráficos
    await renderAlumnosPorCategoria();
    await renderGraficoIngresos();
    await renderProximosVencimientos();
}

async function obtenerVentasHoy() {
    const empresa = getCurrentEmpresa();
    const hoy = new Date().toISOString().split('T')[0];
    const ventas = await getDataByEmpresa('ventas', empresa.id);
    return ventas
        .filter(v => v.fecha.split('T')[0] === hoy)
        .reduce((sum, v) => sum + (v.total || 0), 0);
}

async function obtenerPagosHoy() {
    const empresa = getCurrentEmpresa();
    const hoy = new Date().toISOString().split('T')[0];
    const pagos = await getDataByEmpresa('pagos', empresa.id);
    return pagos
        .filter(p => p.fecha.split('T')[0] === hoy)
        .reduce((sum, p) => sum + (p.monto || 0), 0);
}

async function obtenerIngresosHoy() {
    const [pHoy, vHoy] = await Promise.all([obtenerPagosHoy(), obtenerVentasHoy()]);
    return pHoy + vHoy;
}

async function obtenerAsistenciasHoy() {
    const empresa = getCurrentEmpresa();
    const hoy = new Date().toISOString().split('T')[0];
    const asistencias = await getAsistenciasByFecha(empresa.id, hoy);
    return asistencias.length;
}

async function contarAlumnosVencidos() {
    const empresa = getCurrentEmpresa();
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const hoy = new Date();

    return alumnos.filter(a => {
        if (!a.fechaVencimiento || !a.activo) return false;
        return new Date(a.fechaVencimiento) < hoy;
    }).length;
}

async function renderGraficoAsistencias() {
    const empresa = getCurrentEmpresa();
    const hoy = new Date().toISOString().split('T')[0];
    const asistencias = await getAsistenciasByFecha(empresa.id, hoy);
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const activos = alumnos.filter(a => a.activo).length;
    const asistieron = asistencias.length;
    const noAsistieron = Math.max(0, activos - asistieron);

    const canvas = document.getElementById('chartAsistencias');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Asistieron', 'No Asistieron'],
            datasets: [{
                data: [asistieron, noAsistieron],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

async function renderGraficoIngresos() {
    const empresa = getCurrentEmpresa();
    const pagos = await getDataByEmpresa('pagos', empresa.id);
    const ventas = await getDataByEmpresa('ventas', empresa.id);

    // Últimos 7 días
    const labels = [];
    const datos = [];

    for (let i = 6; i >= 0; i--) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - i);
        const fechaStr = fecha.toISOString().split('T')[0];

        labels.push(fecha.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' }));

        const ingresosPagosDia = pagos
            .filter(p => p.fecha.split('T')[0] === fechaStr)
            .reduce((sum, p) => sum + (p.monto || 0), 0);
        const ingresosVentasDia = ventas
            .filter(v => v.fecha.split('T')[0] === fechaStr)
            .reduce((sum, v) => sum + (v.total || 0), 0);
        const ingresosDia = ingresosPagosDia + ingresosVentasDia;

        datos.push(ingresosDia);
    }

    const canvas = document.getElementById('chartIngresos');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ingresos (S/)',
                data: datos,
                borderColor: '#1e56a0',
                backgroundColor: 'rgba(30, 86, 160, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

async function renderAlumnosPorCategoria() {
    const empresa = getCurrentEmpresa();
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const categorias = await getDataByEmpresa('categorias', empresa.id);

    const canvas = document.getElementById('chartAlumnosPorCategoria');
    if (!canvas) return;

    if (categorias.length === 0) {
        const container = document.getElementById('alumnosPorCategoria');
        container.innerHTML = '<p class="text-muted text-center pt-5">No hay categorías registradas</p>';
        return;
    }

    // Paleta de colores vibrantes y modernos
    const coloresPaleta = [
        '#FF6B6B', // Rojo coral
        '#4ECDC4', // Turquesa
        '#45B7D1', // Azul cielo
        '#FFA07A', // Salmón
        '#98D8C8', // Verde menta
        '#F7DC6F', // Amarillo dorado
        '#BB8FCE', // Púrpura suave
        '#85C1E2', // Azul claro
        '#F8B739', // Naranja dorado
        '#52B788', // Verde esmeralda
        '#E76F51', // Terracota
        '#2A9D8F', // Verde azulado
        '#E9C46A', // Mostaza
        '#F4A261', // Naranja melocotón
        '#264653', // Azul oscuro
    ];

    // Preparar datos
    const labels = [];
    const datos = [];
    const colores = [];

    categorias.forEach((categoria, index) => {
        const count = alumnos.filter(a => a.categoriaId === categoria.id && a.activo).length;
        labels.push(categoria.nombre);
        datos.push(count);
        // Asignar color de la paleta (ciclar si hay más categorías que colores)
        colores.push(coloresPaleta[index % coloresPaleta.length]);
    });

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad de Alumnos',
                data: datos,
                backgroundColor: colores,
                borderColor: colores.map(color => color),
                borderWidth: 2,
                borderRadius: 12,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function (context) {
                            return 'Alumnos: ' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#333'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

async function renderProximosVencimientos() {
    const empresa = getCurrentEmpresa();
    const alumnos = await getDataByEmpresa('alumnos', empresa.id);
    const hoy = new Date();
    const tresDias = new Date();
    tresDias.setDate(tresDias.getDate() + 3);

    const proximosVencer = alumnos.filter(a => {
        if (!a.fechaVencimiento || !a.activo) return false;
        const venc = new Date(a.fechaVencimiento);
        return venc >= hoy && venc <= tresDias;
    }).sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));

    const container = document.getElementById('proximosVencimientos');
    if (!container) return;

    if (proximosVencer.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay vencimientos próximos</p>';
        return;
    }

    let html = '<div class="list-group">';

    proximosVencer.slice(0, 5).forEach(alumno => {
        const diasRestantes = Math.ceil((new Date(alumno.fechaVencimiento) - hoy) / (1000 * 60 * 60 * 24));

        html += `
            <div class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${alumno.nombres} ${alumno.apellidos}</strong>
                        <br>
                        <small class="text-muted">Vence: ${formatearFecha(alumno.fechaVencimiento)}</small>
                    </div>
                    <span class="badge bg-warning">${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}</span>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}
