// =============================================================================
// Script 02: Creación de Índices para Consultas de Alta Velocidad (24/7)
// Proyecto: Sistema de Gestión de Pacientes CCSS (SC-609 NoSQL)
// =============================================================================
db = db.getSiblingDB('ccss_gestion_pacientes');

// --- 1. Índices en la colección 'pacientes' ---
// Búsqueda única por número de cédula
db.pacientes.createIndex({ "cedula": 1 }, { unique: true, name: "idx_cedula_unique" });

// Índice compuesto para filtros por hospital base y estado de aseguramiento
db.pacientes.createIndex({ "hospital_base": 1, "estado_asegurado": 1 }, { name: "idx_hospital_estado" });

// --- 2. Índices en la colección 'expedientes_medicos' ---
// Búsqueda rápida de expediente por cédula del paciente
db.expedientes_medicos.createIndex({ "cedula_paciente": 1 }, { unique: true, name: "idx_expediente_cedula" });

// Índice multiclave para búsquedas de diagnósticos CIE-10 dentro del arreglo embebido
db.expedientes_medicos.createIndex({ "consultas.diagnosticos.codigo_cie10": 1 }, { name: "idx_multikey_cie10" });

// --- 3. Índices en la colección 'estudios_imagenes' ---
// Consulta de todos los estudios de imágenes de un paciente específico por fecha descendente
db.estudios_imagenes.createIndex({ "cedula_paciente": 1, "fecha_realizacion": -1 }, { name: "idx_estudios_paciente_fecha" });

// Filtro por modalidad de estudio (RX, TAC, ECG, MRI) y centro médico de origen
db.estudios_imagenes.createIndex({ "modalidad_imagen": 1, "hospital_origen": 1 }, { name: "idx_modalidad_hospital" });

print("Índices creados correctamente para optimizar latencia sub-segundo.");