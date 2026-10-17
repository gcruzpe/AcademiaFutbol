// generar-datos-carlos.js - Datos de evaluación progresiva para Carlos Manrique

async function generarDatosCarlos() {
    console.log('⚽ Generando evaluaciones progresivas para Carlos Manrique...');

    try {
        await initDB();

        const empresa = getCurrentEmpresa();
        if (!empresa) {
            console.error('❌ No hay empresa activa');
            return;
        }

        // Buscar a Carlos Manrique
        const alumnos = await getDataByEmpresa('alumnos', empresa.id);
        const carlos = alumnos.find(a => {
            const nombre = (a.nombre || a.nombres || '').toLowerCase();
            const apellido = (a.apellido || a.apellidos || '').toLowerCase();
            const nombreCompleto = `${nombre} ${apellido}`.toLowerCase();

            return nombreCompleto.includes('carlos') && nombreCompleto.includes('manrique');
        });

        if (!carlos) {
            console.error('❌ No se encontró al alumno "Carlos Manrique"');
            console.log('💡 Alumnos disponibles:', alumnos.map(a => `${a.nombre || a.nombres} ${a.apellido || a.apellidos}`));
            return;
        }

        console.log(`✅ Alumno encontrado: ${carlos.nombre || carlos.nombres} ${carlos.apellido || carlos.apellidos} (ID: ${carlos.id})`);

        // Fechas de las evaluaciones (últimos 3 meses)
        const fechas = [
            new Date(2025, 8, 5),   // Septiembre (Inicio - Nivel Bajo)
            new Date(2025, 9, 10),  // Octubre (Medio - Nivel Medio)
            new Date(2025, 10, 15)  // Noviembre (Actual - Nivel Mejorado)
        ];

        // 1. DATOS ANTROPOMÉTRICOS (Mejora en composición corporal)
        console.log('📏 Generando datos antropométricos...');
        const datosAntropometricos = [
            { peso: 78.0, talla: 175, porcentajeGrasa: 18.5 }, // Inicio: Ligero sobrepeso
            { peso: 76.5, talla: 175, porcentajeGrasa: 16.0 }, // Medio: Mejorando
            { peso: 75.0, talla: 175, porcentajeGrasa: 13.5 }  // Final: Atlético
        ];

        for (let i = 0; i < 3; i++) {
            const datos = datosAntropometricos[i];
            const imc = (datos.peso / Math.pow(datos.talla / 100, 2)).toFixed(2);

            await addData('datos_antropometricos', {
                empresaId: empresa.id,
                alumnoId: carlos.id,
                fecha: fechas[i].toISOString().split('T')[0],
                peso: datos.peso,
                talla: datos.talla,
                imc: parseFloat(imc),
                porcentajeGrasa: datos.porcentajeGrasa,
                observaciones: `Medición ${i + 1} - ${i === 0 ? 'Inicio de temporada' : i === 1 ? 'Control mensual' : 'Objetivo alcanzado'}`,
                fechaCreacion: new Date().toISOString()
            });
        }

        // 2. EVALUACIONES FÍSICAS (Bajo -> Medio -> Alto)
        console.log('🏃 Generando evaluaciones físicas...');
        const evaluacionesFisicas = [
            // Nivel Bajo
            {
                testCooper: 1800,      // Bajo
                yoyoTest: 12,          // Bajo
                sprint30m: 5.2,        // Lento
                saltoVertical: 35,     // Bajo
                testIllinois: 18.5,    // Lento
                sitAndReach: 15        // Rígido
            },
            // Nivel Medio
            {
                testCooper: 2200,      // Medio
                yoyoTest: 15,          // Medio
                sprint30m: 4.8,        // Mejorando
                saltoVertical: 45,     // Medio
                testIllinois: 17.0,    // Mejorando
                sitAndReach: 22        // Mejorando
            },
            // Nivel Mejorado
            {
                testCooper: 2600,      // Bueno
                yoyoTest: 18,          // Bueno
                sprint30m: 4.4,        // Rápido
                saltoVertical: 55,     // Bueno
                testIllinois: 15.8,    // Ágil
                sitAndReach: 30        // Flexible
            }
        ];

        const notasFisicas = [
            'Inicio de temporada. Condición física baja. Necesita trabajo base aeróbico urgente.',
            'Mejora notable en resistencia. La velocidad sigue siendo un punto a trabajar.',
            'Excelente progresión. Ha alcanzado los objetivos físicos de la temporada.'
        ];

        for (let i = 0; i < 3; i++) {
            await addData('evaluaciones_deportivas', {
                empresaId: empresa.id,
                alumnoId: carlos.id,
                tipo: 'fisica',
                nombre: `Evaluación Física - Fase ${i + 1}`,
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

        // 3. EVALUACIONES TÉCNICAS (Bajo -> Medio -> Alto)
        console.log('⚽ Generando evaluaciones técnicas...');
        const evaluacionesTecnicas = [
            // Nivel Bajo
            {
                controlConduccion: 12.5, // Lento
                pasesCorto: 60,          // Impreciso
                pasesLargo: 45,          // Malo
                dominioBalon: 25,        // Pocos toques
                potenciaTiro: 65,        // Débil
                precisionTiro: 50,       // Desviado
                recepcionOrientacion: 2  // Mala
            },
            // Nivel Medio
            {
                controlConduccion: 10.5, // Mejorando
                pasesCorto: 75,          // Aceptable
                pasesLargo: 60,          // Mejorando
                dominioBalon: 50,        // Medio
                potenciaTiro: 75,        // Medio
                precisionTiro: 65,       // Aceptable
                recepcionOrientacion: 3  // Regular
            },
            // Nivel Mejorado
            {
                controlConduccion: 9.0,  // Bueno
                pasesCorto: 88,          // Preciso
                pasesLargo: 78,          // Bueno
                dominioBalon: 90,        // Bueno
                potenciaTiro: 88,        // Potente
                precisionTiro: 80,       // Preciso
                recepcionOrientacion: 4  // Buena
            }
        ];

        const notasTecnicas = [
            'Dificultades en el control del balón y precisión de pases. Técnica básica deficiente.',
            'Se nota mayor confianza con el balón. Mejoró la precisión en pases cortos.',
            'Gran evolución técnica. Control orientado efectivo y buen golpeo de balón.'
        ];

        for (let i = 0; i < 3; i++) {
            await addData('evaluaciones_deportivas', {
                empresaId: empresa.id,
                alumnoId: carlos.id,
                tipo: 'tecnica',
                nombre: `Evaluación Técnica - Fase ${i + 1}`,
                fecha: fechas[i].toISOString().split('T')[0],
                datos: evaluacionesTecnicas[i],
                notasEntrenador: notasTecnicas[i],
                fechaCreacion: new Date().toISOString()
            });
        }

        // 4. EVALUACIONES TÁCTICAS (Bajo -> Medio -> Alto)
        console.log('🧠 Generando evaluaciones tácticas...');
        const evaluacionesTacticas = [
            // Nivel Bajo
            { tomaDecisiones: 2, posicionamiento: 2, visionJuego: 2, trabajoEquipo: 3 },
            // Nivel Medio
            { tomaDecisiones: 3, posicionamiento: 3, visionJuego: 3, trabajoEquipo: 4 },
            // Nivel Mejorado
            { tomaDecisiones: 4, posicionamiento: 4, visionJuego: 4, trabajoEquipo: 5 }
        ];

        const notasTacticas = [
            'Se pierde frecuentemente en el campo. Poca participación en el juego colectivo.',
            'Mejor ubicación en el campo. Empieza a entender las transiciones.',
            'Lectura de juego muy mejorada. Participa activamente y apoya a los compañeros.'
        ];

        for (let i = 0; i < 3; i++) {
            await addData('evaluaciones_deportivas', {
                empresaId: empresa.id,
                alumnoId: carlos.id,
                tipo: 'tactica',
                nombre: `Evaluación Táctica - Fase ${i + 1}`,
                fecha: fechas[i].toISOString().split('T')[0],
                datos: evaluacionesTacticas[i],
                notasEntrenador: notasTacticas[i],
                fechaCreacion: new Date().toISOString()
            });
        }

        // 5. EVALUACIONES PSICOLÓGICAS (Bajo -> Medio -> Alto)
        console.log('💡 Generando evaluaciones psicológicas...');
        const evaluacionesPsicologicas = [
            // Nivel Bajo
            { motivacion: 3, concentracion: 2, resiliencia: 2, liderazgo: 1, convivencia: 3 },
            // Nivel Medio
            { motivacion: 4, concentracion: 3, resiliencia: 3, liderazgo: 2, convivencia: 4 },
            // Nivel Mejorado
            { motivacion: 5, concentracion: 4, resiliencia: 4, liderazgo: 3, convivencia: 5 }
        ];

        const notasPsicologicas = [
            'Baja confianza en sí mismo. Se frustra rápido ante el error.',
            'Actitud más positiva. Mayor tolerancia a la frustración.',
            'Mentalidad fuerte y positiva. Gran compañero y ejemplo de superación.'
        ];

        for (let i = 0; i < 3; i++) {
            await addData('evaluaciones_deportivas', {
                empresaId: empresa.id,
                alumnoId: carlos.id,
                tipo: 'psicologica',
                nombre: `Evaluación Psicológica - Fase ${i + 1}`,
                fecha: fechas[i].toISOString().split('T')[0],
                datos: evaluacionesPsicologicas[i],
                notasEntrenador: notasPsicologicas[i],
                fechaCreacion: new Date().toISOString()
            });
        }

        console.log('');
        console.log('🎉 ¡EVALUACIONES DE CARLOS MANRIQUE GENERADAS!');
        console.log('✅ Progreso registrado: Nivel Bajo ➡️ Medio ➡️ Mejorado');

        if (typeof mostrarAlerta === 'function') {
            mostrarAlerta('Evaluaciones progresivas de Carlos generadas exitosamente!', 'success');
        }

    } catch (error) {
        console.error('❌ Error al generar datos:', error);
    }
}

console.log('⚽ Script de evaluaciones para Carlos Manrique cargado.');
console.log('💡 Para generar sus evaluaciones, ejecuta: generarDatosCarlos()');
