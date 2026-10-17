// limpiar-y-regenerar.js - Script para limpiar datos y regenerar

async function limpiarYRegenerarDatos() {
    console.log('🧹 Limpiando datos existentes...');

    try {
        await initDB();

        const empresa = getCurrentEmpresa();
        if (!empresa) {
            console.error('❌ No hay empresa activa');
            return;
        }

        // Eliminar todos los alumnos existentes
        const alumnosExistentes = await getDataByEmpresa('alumnos', empresa.id);
        console.log(`🗑️ Eliminando ${alumnosExistentes.length} alumnos existentes...`);

        for (const alumno of alumnosExistentes) {
            await deleteData('alumnos', alumno.id);
        }

        // Eliminar evaluaciones deportivas
        const evaluaciones = await getAllData('evaluaciones_deportivas');
        const evalEmpresa = evaluaciones.filter(e => e.empresaId === empresa.id);
        console.log(`🗑️ Eliminando ${evalEmpresa.length} evaluaciones...`);

        for (const evaluacion of evalEmpresa) {
            await deleteData('evaluaciones_deportivas', evaluacion.id);
        }

        // Eliminar datos antropométricos
        const datosAntro = await getAllData('datos_antropometricos');
        const datosEmpresa = datosAntro.filter(d => d.empresaId === empresa.id);
        console.log(`🗑️ Eliminando ${datosEmpresa.length} datos antropométricos...`);

        for (const dato of datosEmpresa) {
            await deleteData('datos_antropometricos', dato.id);
        }

        console.log('✅ Datos limpiados correctamente');
        console.log('');

        // Ahora generar datos nuevos
        await generarDatosPruebaEvaluaciones();

    } catch (error) {
        console.error('❌ Error al limpiar datos:', error);
    }
}

console.log('🧹 Script de limpieza cargado.');
console.log('💡 Para limpiar y regenerar datos, ejecuta: limpiarYRegenerarDatos()');
