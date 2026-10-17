// generar-datos-cristiano.js - Datos de evaluación para Cristiano Ronaldo

async function generarDatosCristiano() {
    console.log('⚽ Generando evaluaciones para Cristiano Ronaldo...');

    try {
        await initDB();

        const empresa = getCurrentEmpresa();
        if (!empresa) {
            console.error('❌ No hay empresa activa');
            return;
        }

        console.log('✅ Empresa activa:', empresa.nombre);

        // Buscar a Cristiano Ronaldo
        const alumnos = await getDataByEmpresa('alumnos', empresa.id);
        console.log(`📚 Total de alumnos encontrados: ${alumnos.length}`);

        // Mostrar todos los alumnos disponibles
        console.log('👥 Alumnos disponibles:');
        alumnos.forEach((a, index) => {
            const nombreCompleto = `${a.nombre || a.nombres || ''} ${a.apellido || a.apellidos || ''}`.trim();
            console.log(`   ${index + 1}. ${nombreCompleto} (ID: ${a.id})`);
        });

        // Buscar a Cristiano de manera más flexible
        const cristiano = alumnos.find(a => {
            const nombre = (a.nombre || a.nombres || '').toLowerCase();
            const apellido = (a.apellido || a.apellidos || '').toLowerCase();
            const nombreCompleto = `${nombre} ${apellido}`.toLowerCase();

            return nombreCompleto.includes('cristiano') ||
                nombre.includes('cristiano') ||
                nombreCompleto.includes('ronaldo') ||
                apellido.includes('ronaldo');
        });

        if (!cristiano) {
            console.error('❌ No se encontró a Cristiano Ronaldo en los alumnos');
            console.log('💡 Asegúrate de que existe un alumno con "Cristiano" o "Ronaldo" en su nombre');
            console.log('💡 Puedes crear el alumno manualmente en el módulo de Alumnos');
            return;
        }

        const nombreCristiano = `${cristiano.nombre || cristiano.nombres} ${cristiano.apellido || cristiano.apellidos}`;
        console.log(`✅ Alumno encontrado: ${nombreCristiano} (ID: ${cristiano.id})`);
        console.log('');

        // Fechas de las evaluaciones (últimos 3 meses)
        const fechas = [
            new Date(2025, 8, 10),  // Septiembre 2025
            new Date(2025, 9, 15),  // Octubre 2025
            new Date(2025, 10, 20)  // Noviembre 2025
        ];

        // 1. DATOS ANTROPOMÉTRICOS (3 mediciones)
        console.log('📏 Generando datos antropométricos...');
        const datosAntropometricos = [
            { peso: 83.5, talla: 187, porcentajeGrasa: 7.2 },
            { peso: 83.8, talla: 187, porcentajeGrasa: 7.0 },
            { peso: 84.0, talla: 187, porcentajeGrasa: 6.8 }
        ];

        for (let i = 0; i < 3; i++) {
            const datos = datosAntropometricos[i];
            const imc = (datos.peso / Math.pow(datos.talla / 100, 2)).toFixed(2);

            await addData('datos_antropometricos', {
                empresaId: empresa.id,
                alumnoId: cristiano.id,
                fecha: fechas[i].toISOString().split('T')[0],
                peso: datos.peso,
                talla: datos.talla,
                imc: parseFloat(imc),
                porcentajeGrasa: datos.porcentajeGrasa,
                observaciones: `Medición ${i + 1} - Condición física óptima`,
                fechaCreacion: new Date().toISOString()
            });
        }
        console.log('✅ Datos antropométricos generados');

        // 2. EVALUACIONES FÍSICAS (3 evaluaciones)
        console.log('🏃 Generando evaluaciones físicas...');
        const evaluacionesFisicas = [
            {
                testCooper: 3200,
                yoyoTest: 21,
                sprint10m: 1.65,
                sprint20m: 2.85,
                sprint30m: 3.95,
                testIllinois: 14.2,
                saltoVertical: 78,
                saltoHorizontal: 285,
                sitAndReach: 32
            },
            {
                testCooper: 3250,
                yoyoTest: 21,
                sprint10m: 1.62,
                sprint20m: 2.82,
                sprint30m: 3.90,
                testIllinois: 14.0,
                saltoVertical: 79,
                saltoHorizontal: 288,
                sitAndReach: 33
            },
            {
                testCooper: 3300,
                yoyoTest: 22,
                sprint10m: 1.60,
                sprint20m: 2.80,
                sprint30m: 3.88,
                testIllinois: 13.8,
                saltoVertical: 80,
                saltoHorizontal: 290,
                sitAndReach: 34
            }
        ];

        const notasFisicas = [
            'Excelente condición física inicial. Destaca en velocidad y potencia explosiva.',
            'Mejora notable en resistencia aeróbica. Mantiene alto nivel en velocidad.',
            'Rendimiento sobresaliente en todas las pruebas. Progreso constante y consistente.'
        ];

        for (let i = 0; i < 3; i++) {
            await addData('evaluaciones_deportivas', {
                empresaId: empresa.id,
                alumnoId: cristiano.id,
                tipo: 'fisica',
                nombre: `Evaluación Física #${i + 1}`,
                fecha: fechas[i].toISOString().split('T')[0],
                datos: {
                    ...evaluacionesFisicas[i],
                    peso: datosAntropometricos[i].peso,
                    talla: datosAntropometricos[i].talla,
                    imc: parseFloat((datosAntropometricos[i].peso / Math.pow(datosAntropometricos[i].talla / 100, 2)).toFixed(2)),
                    porcentajeGrasa: datosAntropometricos[i].porcentajeGrasa
                },
                notasEntrenador: notasFisicas[i],
                fechaCreacion: new Date().toISOString()
            });
        }
        console.log('✅ Evaluaciones físicas generadas');

        // 3. EVALUACIONES TÉCNICAS (3 evaluaciones)
        console.log('⚽ Generando evaluaciones técnicas...');
        const evaluacionesTecnicas = [
            {
                controlConduccion: 8.5,
                pasesCorto: 92,
                pasesLargo: 85,
                dominioBalon: 150,
                potenciaTiro: 105,
                precisionTiro: 88,
                recepcionOrientacion: 5
            },
            {
                controlConduccion: 8.2,
                pasesCorto: 94,
                pasesLargo: 87,
                dominioBalon: 165,
                potenciaTiro: 108,
                precisionTiro: 90,
                recepcionOrientacion: 5
            },
            {
                controlConduccion: 8.0,
                pasesCorto: 95,
                pasesLargo: 89,
                dominioBalon: 180,
                potenciaTiro: 110,
                precisionTiro: 92,
                recepcionOrientacion: 5
            }
        ];

        const notasTecnicas = [
            'Técnica excepcional. Dominio del balón sobresaliente. Potencia de tiro impresionante.',
            'Mejora en precisión de pases largos. Excelente control en espacios reducidos.',
            'Nivel técnico de élite. Consistencia en todas las habilidades técnicas evaluadas.'
        ];

        for (let i = 0; i < 3; i++) {
            await addData('evaluaciones_deportivas', {
                empresaId: empresa.id,
                alumnoId: cristiano.id,
                tipo: 'tecnica',
                nombre: `Evaluación Técnica #${i + 1}`,
                fecha: fechas[i].toISOString().split('T')[0],
                datos: evaluacionesTecnicas[i],
                notasEntrenador: notasTecnicas[i],
                fechaCreacion: new Date().toISOString()
            });
        }
        console.log('✅ Evaluaciones técnicas generadas');

        // 4. EVALUACIONES TÁCTICAS (3 evaluaciones)
        console.log('🧠 Generando evaluaciones tácticas...');
        const evaluacionesTacticas = [
            {
                tomaDecisiones: 5,
                posicionamiento: 5,
                visionJuego: 5,
                trabajoEquipo: 4
            },
            {
                tomaDecisiones: 5,
                posicionamiento: 5,
                visionJuego: 5,
                trabajoEquipo: 5
            },
            {
                tomaDecisiones: 5,
                posicionamiento: 5,
                visionJuego: 5,
                trabajoEquipo: 5
            }
        ];

        const notasTacticas = [
            'Inteligencia táctica superior. Excelente lectura del juego. Trabajo en equipo en desarrollo.',
            'Mejora significativa en trabajo colectivo. Mantiene alto nivel en aspectos individuales.',
            'Rendimiento táctico excepcional en todos los aspectos. Líder natural en el campo.'
        ];

        for (let i = 0; i < 3; i++) {
            await addData('evaluaciones_deportivas', {
                empresaId: empresa.id,
                alumnoId: cristiano.id,
                tipo: 'tactica',
                nombre: `Evaluación Táctica #${i + 1}`,
                fecha: fechas[i].toISOString().split('T')[0],
                datos: evaluacionesTacticas[i],
                notasEntrenador: notasTacticas[i],
                fechaCreacion: new Date().toISOString()
            });
        }
        console.log('✅ Evaluaciones tácticas generadas');

        // 5. EVALUACIONES PSICOLÓGICAS (3 evaluaciones)
        console.log('💡 Generando evaluaciones psicológicas...');
        const evaluacionesPsicologicas = [
            {
                motivacion: 5,
                concentracion: 5,
                resiliencia: 5,
                liderazgo: 4,
                convivencia: 4
            },
            {
                motivacion: 5,
                concentracion: 5,
                resiliencia: 5,
                liderazgo: 5,
                convivencia: 4
            },
            {
                motivacion: 5,
                concentracion: 5,
                resiliencia: 5,
                liderazgo: 5,
                convivencia: 5
            }
        ];

        const notasPsicologicas = [
            'Mentalidad ganadora excepcional. Alta motivación y concentración. Liderazgo en desarrollo.',
            'Evolución positiva en liderazgo. Mantiene excelente actitud y determinación.',
            'Perfil psicológico de campeón. Líder inspirador con excelente convivencia grupal.'
        ];

        for (let i = 0; i < 3; i++) {
            await addData('evaluaciones_deportivas', {
                empresaId: empresa.id,
                alumnoId: cristiano.id,
                tipo: 'psicologica',
                nombre: `Evaluación Psicológica #${i + 1}`,
                fecha: fechas[i].toISOString().split('T')[0],
                datos: evaluacionesPsicologicas[i],
                notasEntrenador: notasPsicologicas[i],
                fechaCreacion: new Date().toISOString()
            });
        }
        console.log('✅ Evaluaciones psicológicas generadas');

        // 6. HISTORIAL MÉDICO
        console.log('📊 Generando historial médico...');
        await addData('evaluaciones_deportivas', {
            empresaId: empresa.id,
            alumnoId: cristiano.id,
            tipo: 'medica',
            nombre: 'Chequeo Médico Deportivo',
            fecha: fechas[0].toISOString().split('T')[0],
            datos: {
                chequeoMedico: 'Apto para competición de alto rendimiento. Excelente condición cardiovascular y muscular.',
                lesiones: 'Sin lesiones actuales. Historial de lesión menor en rodilla (recuperada completamente).',
                estadoNutricional: 'Óptimo. Dieta balanceada y controlada. Hidratación adecuada.',
                observaciones: 'Atleta de élite con excelente estado de salud general. Continuar con programa de prevención de lesiones.'
            },
            notasEntrenador: 'Condición física excepcional. Apto para entrenamientos de alta intensidad.',
            fechaCreacion: new Date().toISOString()
        });
        console.log('✅ Historial médico generado');

        console.log('');
        console.log('🎉 ¡EVALUACIONES DE CRISTIANO RONALDO GENERADAS!');
        console.log('');
        console.log('📊 Resumen:');
        console.log(`   ⚽ Alumno: ${nombreCristiano}`);
        console.log('   📏 3 mediciones antropométricas');
        console.log('   🏃 3 evaluaciones físicas (nivel élite)');
        console.log('   ⚽ 3 evaluaciones técnicas (nivel sobresaliente)');
        console.log('   🧠 3 evaluaciones tácticas (nivel excepcional)');
        console.log('   💡 3 evaluaciones psicológicas (mentalidad ganadora)');
        console.log('   📊 1 historial médico completo');
        console.log('');
        console.log('✅ Ve al módulo de Evaluaciones y selecciona a Cristiano Ronaldo para ver su progreso!');

        if (typeof mostrarAlerta === 'function') {
            mostrarAlerta('Evaluaciones de Cristiano Ronaldo generadas exitosamente!', 'success');
        }

    } catch (error) {
        console.error('❌ Error al generar datos:', error);
        if (typeof mostrarAlerta === 'function') {
            mostrarAlerta('Error al generar evaluaciones', 'danger');
        }
    }
}

console.log('⚽ Script de evaluaciones para Cristiano Ronaldo cargado.');
console.log('💡 Para generar sus evaluaciones, ejecuta: generarDatosCristiano()');
