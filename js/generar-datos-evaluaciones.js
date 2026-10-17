// generar-datos-evaluaciones.js - Script para generar datos de prueba

async function generarDatosPruebaEvaluaciones() {
    console.log('🚀 Generando datos de prueba para evaluaciones...');

    try {
        // Esperar a que la BD esté lista
        await initDB();

        const empresa = getCurrentEmpresa();
        if (!empresa) {
            console.error('❌ No hay empresa activa');
            return;
        }

        // Obtener alumnos existentes
        let alumnos = await getDataByEmpresa('alumnos', empresa.id);

        // Si no hay alumnos, crear algunos de prueba
        if (alumnos.length === 0) {
            console.log('📝 Creando alumnos de prueba...');

            const alumnosPrueba = [
                {
                    empresaId: empresa.id,
                    nombre: 'Carlos',
                    apellido: 'Rodríguez',
                    dni: '12345678',
                    fechaNacimiento: '2010-05-15',
                    genero: 'Masculino',
                    telefono: '987654321',
                    email: 'carlos@email.com',
                    direccion: 'Av. Principal 123',
                    foto: '',
                    activo: true,
                    fechaRegistro: new Date().toISOString()
                },
                {
                    empresaId: empresa.id,
                    nombre: 'María',
                    apellido: 'González',
                    dni: '87654321',
                    fechaNacimiento: '2011-08-22',
                    genero: 'Femenino',
                    telefono: '987654322',
                    email: 'maria@email.com',
                    direccion: 'Calle Secundaria 456',
                    foto: '',
                    activo: true,
                    fechaRegistro: new Date().toISOString()
                },
                {
                    empresaId: empresa.id,
                    nombre: 'Luis',
                    apellido: 'Martínez',
                    dni: '45678912',
                    fechaNacimiento: '2012-03-10',
                    genero: 'Masculino',
                    telefono: '987654323',
                    email: 'luis@email.com',
                    direccion: 'Jr. Tercero 789',
                    foto: '',
                    activo: true,
                    fechaRegistro: new Date().toISOString()
                }
            ];

            for (const alumno of alumnosPrueba) {
                const id = await addData('alumnos', alumno);
                console.log(`✅ Alumno creado: ${alumno.nombre} ${alumno.apellido} (ID: ${id})`);
            }

            // Recargar alumnos
            alumnos = await getDataByEmpresa('alumnos', empresa.id);
        }

        console.log(`📚 Trabajando con ${alumnos.length} alumnos`);

        // Generar datos antropométricos para cada alumno
        console.log('📏 Generando datos antropométricos...');
        for (const alumno of alumnos) {
            // Generar 3 mediciones en diferentes fechas
            const fechasBase = [
                new Date(2025, 8, 1),  // Septiembre 2025
                new Date(2025, 9, 15), // Octubre 2025
                new Date(2025, 10, 1)  // Noviembre 2025
            ];

            let pesoBase = 45 + Math.random() * 15;
            let tallaBase = 150 + Math.random() * 20;

            for (let i = 0; i < 3; i++) {
                const peso = pesoBase + i * 0.5 + Math.random() * 0.5;
                const talla = tallaBase + i * 1 + Math.random() * 0.5;
                const imc = (peso / Math.pow(talla / 100, 2)).toFixed(2);

                await addData('datos_antropometricos', {
                    empresaId: empresa.id,
                    alumnoId: alumno.id,
                    fecha: fechasBase[i].toISOString().split('T')[0],
                    peso: parseFloat(peso.toFixed(1)),
                    talla: parseFloat(talla.toFixed(1)),
                    imc: parseFloat(imc),
                    porcentajeGrasa: parseFloat((12 + Math.random() * 8).toFixed(1)),
                    observaciones: `Medición ${i + 1}`,
                    fechaCreacion: new Date().toISOString()
                });
            }
            console.log(`✅ Datos antropométricos generados para ${alumno.nombre}`);
        }

        // Generar evaluaciones físicas
        console.log('🏃 Generando evaluaciones físicas...');
        for (const alumno of alumnos) {
            const fechasEval = [
                new Date(2025, 8, 5),
                new Date(2025, 9, 20),
                new Date(2025, 10, 5)
            ];

            for (let i = 0; i < 3; i++) {
                const progreso = i * 0.1; // Mejora progresiva

                await addData('evaluaciones_deportivas', {
                    empresaId: empresa.id,
                    alumnoId: alumno.id,
                    tipo: 'fisica',
                    nombre: `Evaluación Física #${i + 1}`,
                    fecha: fechasEval[i].toISOString().split('T')[0],
                    datos: {
                        testCooper: parseFloat((2000 + Math.random() * 500 + i * 100).toFixed(0)),
                        yoyoTest: Math.floor(10 + Math.random() * 5 + i),
                        sprint10m: parseFloat((1.8 - progreso + Math.random() * 0.2).toFixed(2)),
                        sprint20m: parseFloat((3.2 - progreso + Math.random() * 0.2).toFixed(2)),
                        sprint30m: parseFloat((4.5 - progreso + Math.random() * 0.2).toFixed(2)),
                        testIllinois: parseFloat((16 - progreso + Math.random() * 0.5).toFixed(2)),
                        saltoVertical: parseFloat((35 + Math.random() * 10 + i * 2).toFixed(1)),
                        saltoHorizontal: parseFloat((180 + Math.random() * 20 + i * 5).toFixed(1)),
                        sitAndReach: parseFloat((20 + Math.random() * 10 + i).toFixed(1)),
                        peso: parseFloat((45 + Math.random() * 15).toFixed(1)),
                        talla: parseFloat((150 + Math.random() * 20).toFixed(1)),
                        imc: parseFloat((19 + Math.random() * 3).toFixed(2)),
                        porcentajeGrasa: parseFloat((12 + Math.random() * 8).toFixed(1))
                    },
                    notasEntrenador: `Evaluación ${i + 1}: ${i === 0 ? 'Rendimiento inicial bueno' : i === 1 ? 'Mejoría notable en resistencia' : 'Excelente progreso en todas las áreas'}`,
                    fechaCreacion: new Date().toISOString()
                });
            }
            console.log(`✅ Evaluaciones físicas generadas para ${alumno.nombre}`);
        }

        // Generar evaluaciones técnicas
        console.log('⚽ Generando evaluaciones técnicas...');
        for (const alumno of alumnos) {
            const fechasEval = [
                new Date(2025, 8, 8),
                new Date(2025, 9, 22),
                new Date(2025, 10, 8)
            ];

            for (let i = 0; i < 3; i++) {
                await addData('evaluaciones_deportivas', {
                    empresaId: empresa.id,
                    alumnoId: alumno.id,
                    tipo: 'tecnica',
                    nombre: `Evaluación Técnica #${i + 1}`,
                    fecha: fechasEval[i].toISOString().split('T')[0],
                    datos: {
                        controlConduccion: parseFloat((12 - i * 0.5 + Math.random()).toFixed(2)),
                        pasesCorto: Math.floor(70 + Math.random() * 20 + i * 5),
                        pasesLargo: Math.floor(50 + Math.random() * 20 + i * 5),
                        dominioBalon: Math.floor(20 + Math.random() * 30 + i * 10),
                        potenciaTiro: parseFloat((60 + Math.random() * 20 + i * 3).toFixed(1)),
                        precisionTiro: Math.floor(60 + Math.random() * 20 + i * 5),
                        recepcionOrientacion: Math.min(5, Math.floor(3 + Math.random() * 2 + i * 0.5))
                    },
                    notasEntrenador: `Control del balón ${i === 0 ? 'aceptable' : i === 1 ? 'bueno' : 'excelente'}. ${i === 2 ? 'Gran evolución técnica.' : ''}`,
                    fechaCreacion: new Date().toISOString()
                });
            }
            console.log(`✅ Evaluaciones técnicas generadas para ${alumno.nombre}`);
        }

        // Generar evaluaciones tácticas
        console.log('🧠 Generando evaluaciones tácticas...');
        for (const alumno of alumnos) {
            const fechasEval = [
                new Date(2025, 8, 12),
                new Date(2025, 9, 25),
                new Date(2025, 10, 12)
            ];

            for (let i = 0; i < 3; i++) {
                await addData('evaluaciones_deportivas', {
                    empresaId: empresa.id,
                    alumnoId: alumno.id,
                    tipo: 'tactica',
                    nombre: `Evaluación Táctica #${i + 1}`,
                    fecha: fechasEval[i].toISOString().split('T')[0],
                    datos: {
                        tomaDecisiones: Math.min(5, Math.floor(2 + Math.random() * 2 + i)),
                        posicionamiento: Math.min(5, Math.floor(2 + Math.random() * 2 + i)),
                        visionJuego: Math.min(5, Math.floor(2 + Math.random() * 2 + i)),
                        trabajoEquipo: Math.min(5, Math.floor(3 + Math.random() * 2 + i * 0.5))
                    },
                    notasEntrenador: `Inteligencia táctica ${i === 0 ? 'en desarrollo' : i === 1 ? 'mejorando' : 'muy buena'}. Decisiones cada vez más acertadas.`,
                    fechaCreacion: new Date().toISOString()
                });
            }
            console.log(`✅ Evaluaciones tácticas generadas para ${alumno.nombre}`);
        }

        // Generar evaluaciones psicológicas
        console.log('💡 Generando evaluaciones psicológicas...');
        for (const alumno of alumnos) {
            const fechasEval = [
                new Date(2025, 8, 15),
                new Date(2025, 9, 28),
                new Date(2025, 10, 15)
            ];

            for (let i = 0; i < 3; i++) {
                await addData('evaluaciones_deportivas', {
                    empresaId: empresa.id,
                    alumnoId: alumno.id,
                    tipo: 'psicologica',
                    nombre: `Evaluación Psicológica #${i + 1}`,
                    fecha: fechasEval[i].toISOString().split('T')[0],
                    datos: {
                        motivacion: Math.min(5, Math.floor(3 + Math.random() * 2 + i * 0.3)),
                        concentracion: Math.min(5, Math.floor(2 + Math.random() * 2 + i * 0.5)),
                        resiliencia: Math.min(5, Math.floor(3 + Math.random() * 2 + i * 0.3)),
                        liderazgo: Math.min(5, Math.floor(2 + Math.random() * 2 + i * 0.5)),
                        convivencia: Math.min(5, Math.floor(3 + Math.random() * 2 + i * 0.2))
                    },
                    notasEntrenador: `Actitud ${i === 0 ? 'positiva' : i === 1 ? 'muy buena' : 'excelente'}. ${i === 2 ? 'Muestra gran madurez y liderazgo.' : ''}`,
                    fechaCreacion: new Date().toISOString()
                });
            }
            console.log(`✅ Evaluaciones psicológicas generadas para ${alumno.nombre}`);
        }

        // Generar historiales médicos
        console.log('📊 Generando historiales médicos...');
        for (const alumno of alumnos) {
            await addData('evaluaciones_deportivas', {
                empresaId: empresa.id,
                alumnoId: alumno.id,
                tipo: 'medica',
                nombre: 'Chequeo Médico Inicial',
                fecha: new Date(2025, 8, 1).toISOString().split('T')[0],
                datos: {
                    chequeoMedico: 'Apto para actividad física. No presenta contraindicaciones.',
                    lesiones: 'Sin lesiones previas significativas.',
                    estadoNutricional: 'Adecuado. Mantener dieta balanceada.',
                    observaciones: 'Control médico cada 6 meses recomendado.'
                },
                notasEntrenador: 'Alumno en condiciones óptimas para entrenar.',
                fechaCreacion: new Date().toISOString()
            });
            console.log(`✅ Historial médico generado para ${alumno.nombre}`);
        }

        console.log('');
        console.log('🎉 ¡DATOS DE PRUEBA GENERADOS EXITOSAMENTE!');
        console.log('');
        console.log('📊 Resumen:');
        console.log(`   - ${alumnos.length} alumnos`);
        console.log(`   - ${alumnos.length * 3} mediciones antropométricas`);
        console.log(`   - ${alumnos.length * 3} evaluaciones físicas`);
        console.log(`   - ${alumnos.length * 3} evaluaciones técnicas`);
        console.log(`   - ${alumnos.length * 3} evaluaciones tácticas`);
        console.log(`   - ${alumnos.length * 3} evaluaciones psicológicas`);
        console.log(`   - ${alumnos.length} historiales médicos`);
        console.log('');
        console.log('✅ Puedes navegar al módulo de Evaluaciones y seleccionar un alumno para ver todos los datos y gráficos.');

        // Mostrar alerta en la interfaz si existe
        if (typeof mostrarAlerta === 'function') {
            mostrarAlerta('Datos de prueba generados exitosamente. Revisa la consola para más detalles.', 'success');
        }

    } catch (error) {
        console.error('❌ Error al generar datos:', error);
        if (typeof mostrarAlerta === 'function') {
            mostrarAlerta('Error al generar datos de prueba', 'danger');
        }
    }
}

// Ejecutar automáticamente al cargar el script
console.log('📋 Script de generación de datos cargado.');
console.log('💡 Para generar datos de prueba, ejecuta: generarDatosPruebaEvaluaciones()');
