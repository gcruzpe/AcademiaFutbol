// app.js - Aplicación Principal
let currentModule = 'dashboard';

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar sesión
    if (!verificarSesion()) {
        return;
    }

    // Cargar información del usuario
    const usuario = getCurrentUser();
    const empresa = getCurrentEmpresa();

    document.getElementById('empresaNombre').textContent = empresa.nombre;
    document.getElementById('usuarioNombre').textContent = usuario.nombre || usuario.usuario;
    document.getElementById('userAvatar').textContent = (usuario.nombre || usuario.usuario).charAt(0).toUpperCase();

    // Navegar a dashboard por defecto
    await navigateToModule('dashboard');

    // Event listeners para navegación
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            const module = item.dataset.module;

            // Actualizar menú activo
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            item.classList.add('active');

            // Cerrar menú móvil si está abierto
            const hamburgerBtn = document.getElementById('hamburgerBtn');
            const topMenu = document.getElementById('topMenu');
            const menuOverlay = document.getElementById('menuOverlay');

            if (hamburgerBtn && topMenu && menuOverlay) {
                hamburgerBtn.classList.remove('active');
                topMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
            }

            // Navegar al módulo
            await navigateToModule(module);
        });
    });

    // Menú hamburguesa para móvil
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const topMenu = document.getElementById('topMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    if (hamburgerBtn && topMenu && menuOverlay) {
        // Toggle menú al hacer clic en el botón hamburguesa
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            topMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en el overlay
        menuOverlay.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            topMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }

    document.addEventListener('hide.bs.modal', (e) => {
        const modalEl = e.target;
        const active = document.activeElement;
        if (modalEl && active && modalEl.contains(active)) {
            active.blur();
        }
    });

    document.addEventListener('hidden.bs.modal', (e) => {
        const modalEl = e.target;
        const active = document.activeElement;
        if (modalEl && active && modalEl.contains(active)) {
            active.blur();
        }
    });
});

// Función para navegar entre módulos
async function navigateToModule(moduleName) {
    currentModule = moduleName;
    const contentContainer = document.getElementById('contentContainer');

    // Títulos de módulos
    const titles = {
        dashboard: 'Dashboard',
        deportes: 'Gestión de Deportes',
        membresias: 'Gestión de Membresías',
        categorias: 'Gestión de Categorías',
        evaluaciones: 'Gestión de Evaluaciones',
        alumnos: 'Gestión de Alumnos',
        asistencia: 'Control de Asistencia',
        inventario: 'Gestión de Inventario',
        ventas: 'Punto de Venta',
        pagos: 'Control de Pagos',
        gastos: 'Gestión de Gastos',
        reportes: 'Reportes y Estadísticas',
        torneos: 'Gestión de Torneos',
        usuarios: 'Gestión de Usuarios',
        configuracion: 'Configuración',

    };

    const moduleTitleEl = document.getElementById('moduleTitle');
    if (moduleTitleEl) moduleTitleEl.textContent = titles[moduleName] || moduleName;

    // Mostrar loading
    contentContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3">Cargando módulo...</p>
        </div>
    `;

    // Simular carga y renderizar módulo
    setTimeout(() => {
        switch (moduleName) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'deportes':
                renderDeportes();
                break;
            case 'membresias':
                renderMembresias();
                break;
            case 'categorias':
                renderCategorias();
                break;
            case 'evaluaciones':
                renderEvaluaciones();
                break;
            case 'alumnos':
                renderAlumnos();
                break;
            case 'asistencia':
                renderAsistencia();
                break;
            case 'inventario':
                renderInventario();
                break;
            case 'ventas':
                renderVentas();
                break;
            case 'pagos':
                renderPagos();
                break;
            case 'gastos':
                renderGastos();
                break;
            case 'reportes':
                renderReportes();
                break;
            case 'torneos':
                renderTorneos();
                break;
            case 'usuarios':
                renderUsuarios();
                break;
            case 'configuracion':
                renderConfiguracion();
                break;

            default:
                contentContainer.innerHTML = '<div class="alert alert-warning">Módulo no encontrado</div>';
        }
    }, 300);
}

// Función para recargar módulo actual
async function reloadCurrentModule() {
    await navigateToModule(currentModule);
}

// Función para formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return '-';
    let date = fecha;
    if (typeof fecha === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            date = new Date(fecha + 'T00:00:00');
        } else {
            date = new Date(fecha);
        }
    } else if (!(fecha instanceof Date)) {
        date = new Date(fecha);
    }
    return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Función para formatear moneda
function formatearMoneda(monto) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    }).format(monto);
}

// Función para calcular edad
function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    return edad;
}

// Función para generar código único
function generarCodigo(prefijo = '') {
    const fecha = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefijo}${fecha}${random}`.toUpperCase();
}

// Función para validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Función para confirmar acción
function confirmarAccion(mensaje) {
    return new Promise((resolve) => {
        if (confirm(mensaje)) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

// Función para exportar a CSV
function exportarCSV(datos, nombreArchivo) {
    if (datos.length === 0) {
        mostrarAlerta('No hay datos para exportar', 'warning');
        return;
    }

    // Obtener headers
    const headers = Object.keys(datos[0]);

    // Crear CSV
    let csv = headers.join(',') + '\n';

    datos.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            return `"${value}"`;
        });
        csv += values.join(',') + '\n';
    });

    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${nombreArchivo}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarAlerta('Archivo exportado correctamente', 'success');
}

// Función para imprimir
function imprimirContenido(contenido) {
    const ventana = window.open('', '_blank');
    ventana.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Imprimir</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,900&display=swap" rel="stylesheet">
                <style>
                body { padding: 20px; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                @media print {
                    .no-print { display: none; }
                }
                </style>
            </head>
            <body>
                ${contenido}
                <div class="no-print text-center mt-4">
                <button class="btn btn-primary" onclick="window.print()">Imprimir</button>
                <button class="btn btn-secondary" onclick="window.close()">Cerrar</button>
            </div>
        </body>
        </html>
    `);
    ventana.document.close();
}

// Función para buscar en tabla
function buscarEnTabla(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);

    if (!input || !table) return;

    input.addEventListener('keyup', function () {
        const filter = this.value.toLowerCase();
        const rows = table.getElementsByTagName('tr');

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.getElementsByTagName('td');
            let found = false;

            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                if (cell) {
                    const textValue = cell.textContent || cell.innerText;
                    if (textValue.toLowerCase().indexOf(filter) > -1) {
                        found = true;
                        break;
                    }
                }
            }

            row.style.display = found ? '' : 'none';
        }
    });
}

// Función para obtener fecha actual en formato input
function getFechaActual() {
    return new Date().toISOString().split('T')[0];
}

// Función para obtener hora actual en formato input
function getHoraActual() {
    return new Date().toTimeString().slice(0, 5);
}

// Función helper para crear elemento
function createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
}

// Cargar imagen como base64
function cargarImagenBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Función para obtener la lista de deportes desde configuración
async function getDeportesFromConfig() {
    const empresa = getCurrentEmpresa();
    const rows = await getDataByIndex('configuracion', 'empresaId', empresa.id);
    if (rows && rows[0] && Array.isArray(rows[0].deportes) && rows[0].deportes.length > 0) {
        return rows[0].deportes;
    }
    // Valores por defecto si no existen en configuración
    return ['Futbol', 'Voley'];
}
