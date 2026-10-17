// auth.js - Sistema de Autenticación
let currentUser = null;
let currentEmpresa = null;


async function login(usuario, password) {
    try {
        const empresas = await getAllData('empresas');
        let empresa = empresas.find(e => e.nombre === 'Principal') || empresas[0];
        if (!empresa) {
            await crearEmpresaInicial();
            const empresas2 = await getAllData('empresas');
            empresa = empresas2[0];
        }

        if (usuario === 'administrador' && password === 'reydelmundo') {
            const usuarios = await getDataByIndex('usuarios', 'empresaId', empresa.id);
            let usuarioEncontrado = usuarios.find(u => u.usuario === 'administrador' && u.activo);

            if (!usuarioEncontrado) {
                const userId = await addData('usuarios', {
                    empresaId: empresa.id,
                    usuario: 'administrador',
                    password: 'reydelmundo',
                    rol: 'admin',
                    nombre: 'Administrador',
                    activo: true,
                    fechaCreacion: new Date().toISOString()
                });
                usuarioEncontrado = await getData('usuarios', userId);
            }

            currentUser = usuarioEncontrado;
            currentEmpresa = empresa;

            sessionStorage.setItem('userId', usuarioEncontrado.id);
            sessionStorage.setItem('empresaId', empresa.id);
            sessionStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
            sessionStorage.setItem('empresa', JSON.stringify(empresa));

            return { success: true, usuario: usuarioEncontrado, empresa: empresa };
        } else {
            return { success: false, message: 'Usuario o contraseña incorrectos' };
        }
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false, message: 'Error al iniciar sesión' };
    }
}

// Logout
function logout() {
    sessionStorage.clear();
    currentUser = null;
    currentEmpresa = null;
    window.location.href = 'index.html';
}

// Verificar sesión
function verificarSesion() {
    const userId = sessionStorage.getItem('userId');
    const empresaId = sessionStorage.getItem('empresaId');
    
    if (!userId || !empresaId) {
        window.location.href = 'index.html';
        return false;
    }
    
    currentUser = JSON.parse(sessionStorage.getItem('usuario'));
    currentEmpresa = JSON.parse(sessionStorage.getItem('empresa'));
    
    return true;
}

// Obtener usuario actual
function getCurrentUser() {
    if (!currentUser) {
        currentUser = JSON.parse(sessionStorage.getItem('usuario'));
    }
    return currentUser;
}

// Obtener empresa actual
function getCurrentEmpresa() {
    if (!currentEmpresa) {
        currentEmpresa = JSON.parse(sessionStorage.getItem('empresa'));
    }
    return currentEmpresa;
}


// Event listeners para login
if (document.getElementById('loginForm')) {
    document.addEventListener('DOMContentLoaded', async () => {
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;
        const resultado = await login(usuario, password);
        if (resultado.success) {
            window.location.href = 'dashboard.html';
        } else {
            mostrarAlerta(resultado.message, 'danger');
        }
    });

}

// Función para mostrar alertas
function mostrarAlerta(mensaje, tipo = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertContainer.style.zIndex = '9999';
    alertContainer.style.minWidth = '300px';
    alertContainer.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertContainer);
    
    setTimeout(() => {
        alertContainer.remove();
    }, 3000);
}
