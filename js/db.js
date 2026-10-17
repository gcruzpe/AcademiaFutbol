// db.js - Sistema de Base de Datos IndexedDB
const DB_NAME = 'AcademiaDeportivaDB';
const DB_VERSION = 9;
let db;

// Inicializar base de datos
function initDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject('Error al abrir la base de datos');

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Base de datos inicializada correctamente');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            // Empresas
            if (!db.objectStoreNames.contains('empresas')) {
                const empresasStore = db.createObjectStore('empresas', { keyPath: 'id', autoIncrement: true });
                empresasStore.createIndex('nombre', 'nombre', { unique: true });
            }

            // Usuarios
            if (!db.objectStoreNames.contains('usuarios')) {
                const usuariosStore = db.createObjectStore('usuarios', { keyPath: 'id', autoIncrement: true });
                usuariosStore.createIndex('usuario', 'usuario', { unique: false });
                usuariosStore.createIndex('empresaId', 'empresaId', { unique: false });
            }

            // Deportes
            if (!db.objectStoreNames.contains('deportes')) {
                const deportesStore = db.createObjectStore('deportes', { keyPath: 'id', autoIncrement: true });
                deportesStore.createIndex('empresaId', 'empresaId', { unique: false });
            }

            // Membresías
            if (!db.objectStoreNames.contains('membresias')) {
                const membresiasStore = db.createObjectStore('membresias', { keyPath: 'id', autoIncrement: true });
                membresiasStore.createIndex('empresaId', 'empresaId', { unique: false });
            }

            // Categorías
            if (!db.objectStoreNames.contains('categorias')) {
                const categoriasStore = db.createObjectStore('categorias', { keyPath: 'id', autoIncrement: true });
                categoriasStore.createIndex('empresaId', 'empresaId', { unique: false });
                categoriasStore.createIndex('deporteId', 'deporteId', { unique: false });
            }

            // Profesores
            if (!db.objectStoreNames.contains('profesores')) {
                const profesoresStore = db.createObjectStore('profesores', { keyPath: 'id', autoIncrement: true });
                profesoresStore.createIndex('empresaId', 'empresaId', { unique: false });
            }

            // Horarios
            if (!db.objectStoreNames.contains('horarios')) {
                const horariosStore = db.createObjectStore('horarios', { keyPath: 'id', autoIncrement: true });
                horariosStore.createIndex('empresaId', 'empresaId', { unique: false });
            }

            // Alumnos
            if (!db.objectStoreNames.contains('alumnos')) {
                const alumnosStore = db.createObjectStore('alumnos', { keyPath: 'id', autoIncrement: true });
                alumnosStore.createIndex('empresaId', 'empresaId', { unique: false });
                alumnosStore.createIndex('dni', 'dni', { unique: false });
            }

            // Asistencias
            if (!db.objectStoreNames.contains('asistencias')) {
                const asistenciasStore = db.createObjectStore('asistencias', { keyPath: 'id', autoIncrement: true });
                asistenciasStore.createIndex('empresaId', 'empresaId', { unique: false });
                asistenciasStore.createIndex('alumnoId', 'alumnoId', { unique: false });
                asistenciasStore.createIndex('fecha', 'fecha', { unique: false });
            }

            // Productos (Inventario)
            if (!db.objectStoreNames.contains('productos')) {
                const productosStore = db.createObjectStore('productos', { keyPath: 'id', autoIncrement: true });
                productosStore.createIndex('empresaId', 'empresaId', { unique: false });
                productosStore.createIndex('sku', 'sku', { unique: false });
            }

            // Ventas
            if (!db.objectStoreNames.contains('ventas')) {
                const ventasStore = db.createObjectStore('ventas', { keyPath: 'id', autoIncrement: true });
                ventasStore.createIndex('empresaId', 'empresaId', { unique: false });
                ventasStore.createIndex('fecha', 'fecha', { unique: false });
            }

            // Pagos
            if (!db.objectStoreNames.contains('pagos')) {
                const pagosStore = db.createObjectStore('pagos', { keyPath: 'id', autoIncrement: true });
                pagosStore.createIndex('empresaId', 'empresaId', { unique: false });
                pagosStore.createIndex('alumnoId', 'alumnoId', { unique: false });
                pagosStore.createIndex('fecha', 'fecha', { unique: false });
            }

            if (!db.objectStoreNames.contains('configuracion')) {
                const configuracionStore = db.createObjectStore('configuracion', { keyPath: 'id', autoIncrement: true });
                configuracionStore.createIndex('empresaId', 'empresaId', { unique: true });
            }

            if (!db.objectStoreNames.contains('gastos')) {
                const gastosStore = db.createObjectStore('gastos', { keyPath: 'id', autoIncrement: true });
                gastosStore.createIndex('empresaId', 'empresaId', { unique: false });
                gastosStore.createIndex('fecha', 'fecha', { unique: false });
                gastosStore.createIndex('categoria', 'categoria', { unique: false });
            }

            if (!db.objectStoreNames.contains('evaluaciones')) {
                const evStore = db.createObjectStore('evaluaciones', { keyPath: 'id', autoIncrement: true });
                evStore.createIndex('empresaId', 'empresaId', { unique: false });
                evStore.createIndex('alumnoId', 'alumnoId', { unique: false });
                evStore.createIndex('fecha', 'fecha', { unique: false });
            }

            // Evaluaciones Deportivas Completas
            if (!db.objectStoreNames.contains('evaluaciones_deportivas')) {
                const evalDepStore = db.createObjectStore('evaluaciones_deportivas', { keyPath: 'id', autoIncrement: true });
                evalDepStore.createIndex('empresaId', 'empresaId', { unique: false });
                evalDepStore.createIndex('alumnoId', 'alumnoId', { unique: false });
                evalDepStore.createIndex('fecha', 'fecha', { unique: false });
                evalDepStore.createIndex('tipo', 'tipo', { unique: false });
            }

            // Datos Antropométricos
            if (!db.objectStoreNames.contains('datos_antropometricos')) {
                const antropStore = db.createObjectStore('datos_antropometricos', { keyPath: 'id', autoIncrement: true });
                antropStore.createIndex('empresaId', 'empresaId', { unique: false });
                antropStore.createIndex('alumnoId', 'alumnoId', { unique: false });
                antropStore.createIndex('fecha', 'fecha', { unique: false });
            }

            // Torneos
            if (!db.objectStoreNames.contains('torneos')) {
                const torneosStore = db.createObjectStore('torneos', { keyPath: 'id', autoIncrement: true });
                torneosStore.createIndex('empresaId', 'empresaId', { unique: false });
                torneosStore.createIndex('estado', 'estado', { unique: false });
                torneosStore.createIndex('fecha', 'fecha', { unique: false });
            }

            // Equipos de Torneo
            if (!db.objectStoreNames.contains('equipos_torneo')) {
                const equiposStore = db.createObjectStore('equipos_torneo', { keyPath: 'id', autoIncrement: true });
                equiposStore.createIndex('empresaId', 'empresaId', { unique: false });
                equiposStore.createIndex('torneoId', 'torneoId', { unique: false });
            }

            // Partidos de Torneo
            if (!db.objectStoreNames.contains('partidos_torneo')) {
                const partidosStore = db.createObjectStore('partidos_torneo', { keyPath: 'id', autoIncrement: true });
                partidosStore.createIndex('empresaId', 'empresaId', { unique: false });
                partidosStore.createIndex('torneoId', 'torneoId', { unique: false });
                partidosStore.createIndex('fecha', 'fecha', { unique: false });
                partidosStore.createIndex('estado', 'estado', { unique: false });
            }

            // Movimientos de Inventario
            if (!db.objectStoreNames.contains('movimientos_inventario')) {
                const movimientosStore = db.createObjectStore('movimientos_inventario', { keyPath: 'id', autoIncrement: true });
                movimientosStore.createIndex('empresaId', 'empresaId', { unique: false });
                movimientosStore.createIndex('productoId', 'productoId', { unique: false });
                movimientosStore.createIndex('fecha', 'fecha', { unique: false });
                movimientosStore.createIndex('tipo', 'tipo', { unique: false });
            }

            // DTs (Directores Técnicos)
            if (!db.objectStoreNames.contains('dts')) {
                const dtsStore = db.createObjectStore('dts', { keyPath: 'id', autoIncrement: true });
                dtsStore.createIndex('empresaId', 'empresaId', { unique: false });
                dtsStore.createIndex('dni', 'dni', { unique: false });
            }

            // Ejercicios Tácticos
            if (!db.objectStoreNames.contains('ejercicios_tacticos')) {
                const ejerciciosStore = db.createObjectStore('ejercicios_tacticos', { keyPath: 'id', autoIncrement: true });
                ejerciciosStore.createIndex('empresaId', 'empresaId', { unique: false });
                ejerciciosStore.createIndex('categoria', 'categoria', { unique: false });
                ejerciciosStore.createIndex('fechaCreacion', 'fechaCreacion', { unique: false });
            }
        };
    });
}

// Funciones CRUD genéricas
function addData(storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function getData(storeName, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function getAllData(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function updateData(storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function deleteData(storeName, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function getDataByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(value);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Funciones específicas para empresas
async function crearEmpresaInicial() {
    try {
        const empresas = await getAllData('empresas');
        if (empresas.length === 0) {
            // Crear empresa principal por defecto
            const empresaId = await addData('empresas', {
                nombre: 'Principal',
                fechaCreacion: new Date().toISOString(),
                activa: true
            });

            // Crear usuario administrador por defecto
            await addData('usuarios', {
                empresaId: empresaId,
                usuario: 'administrador',
                password: 'reydelmundo',
                rol: 'admin',
                nombre: 'Administrador',
                activo: true,
                fechaCreacion: new Date().toISOString()
            });

            console.log('Empresa y usuario inicial creados');
        }
    } catch (error) {
        console.error('Error al crear empresa inicial:', error);
    }
}

// Funciones de filtrado por empresa
async function getDataByEmpresa(storeName, empresaId) {
    try {
        const allData = await getAllData(storeName);
        return allData.filter(item => item.empresaId === empresaId);
    } catch (error) {
        console.error('Error al obtener datos por empresa:', error);
        return [];
    }
}

// Funciones específicas del negocio
async function getAlumnoById(id) {
    return await getData('alumnos', id);
}

async function getAlumnosByEmpresa(empresaId) {
    return await getDataByEmpresa('alumnos', empresaId);
}

async function getProductosByEmpresa(empresaId) {
    return await getDataByEmpresa('productos', empresaId);
}

async function getPagosByAlumno(alumnoId) {
    return await getDataByIndex('pagos', 'alumnoId', alumnoId);
}

async function getAsistenciasByAlumno(alumnoId) {
    return await getDataByIndex('asistencias', 'alumnoId', alumnoId);
}

async function getAsistenciasByFecha(empresaId, fecha) {
    const asistencias = await getDataByIndex('asistencias', 'fecha', fecha);
    return asistencias.filter(a => a.empresaId === empresaId);
}

async function getEvaluacionesByAlumno(alumnoId) {
    return await getDataByIndex('evaluaciones', 'alumnoId', alumnoId);
}

// Función para verificar estado de pago del alumno
async function verificarEstadoPago(alumnoId) {
    try {
        const alumno = await getAlumnoById(alumnoId);
        if (!alumno || !alumno.fechaVencimiento) {
            return 'sin-membresia';
        }

        const hoy = new Date();
        const vencimiento = new Date(alumno.fechaVencimiento);
        const diferenciaDias = Math.floor((vencimiento - hoy) / (1000 * 60 * 60 * 24));

        if (diferenciaDias < 0) {
            return 'vencido';
        } else if (diferenciaDias <= 3) {
            return 'proximo-vencer';
        } else {
            return 'al-dia';
        }
    } catch (error) {
        console.error('Error al verificar estado de pago:', error);
        return 'error';
    }
}

// Función para actualizar stock de producto
async function actualizarStock(productoId, cantidad) {
    try {
        const producto = await getData('productos', productoId);
        if (producto) {
            producto.stock -= cantidad;
            await updateData('productos', producto);
        }
    } catch (error) {
        console.error('Error al actualizar stock:', error);
    }
}

// Función para calcular fecha de vencimiento
function calcularFechaVencimiento(dias) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().split('T')[0];
}

// Generar ID único
function generarIdUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Inicializar DB cuando se carga el script
if (typeof window !== 'undefined') {
    initDB().then(() => {
        crearEmpresaInicial();
    }).catch(error => {
        console.error('Error al inicializar DB:', error);
    });
}
