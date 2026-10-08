// =============================================================================
// Script 03: Consultas y Pipelines de Agregación para Reportería Médica
// Proyecto: Sistema de Gestión de Pacientes CCSS (SC-609 NoSQL)
// =============================================================================
db = db.getSiblingDB('ccss_gestion_pacientes');

// --- Consulta 1: Obtener el expediente completo de un paciente por Cédula ---
print("\n--- CONSULTA 1: Expediente Clínico Digital ---");
db.expedientes_medicos.find(
  { "cedula_paciente": "108760543" },
  {
    "alergias": 1,
    "enfermedades_cronicas": 1,
    "consultas": { $slice: -5 } // Últimas 5 consultas
  }
).pretty();

// --- Consulta 2: Pipeline de Agregación - Total de diagnósticos por CIE-10 (Epidemiología CCSS) ---
print("\n--- CONSULTA 2: Agregación Epidemiológica por Diagnóstico CIE-10 ---");
db.expedientes_medicos.aggregate([
  { $unwind: "$consultas" },
  { $unwind: "$consultas.diagnosticos" },
  {
    $group: {
      _id: "$consultas.diagnosticos.codigo_cie10",
      descripcion: { $first: "$consultas.diagnosticos.descripcion" },
      total_casos: { $sum: 1 }
    }
  },
  { $sort: { total_casos: -1 } },
  { $limit: 10 }
]);

// --- Consulta 3: Unir Metadatos de Radiografía con Datos del Paciente ($lookup) ---
print("\n--- CONSULTA 3: Unificación de Estudios de Imagen con Paciente ($lookup) ---");
db.estudios_imagenes.aggregate([
  { $match: { "cedula_paciente": "108760543" } },
  {
    $lookup: {
      from: "pacientes",
      localField: "cedula_paciente",
      foreignField: "cedula",
      as: "datos_demograficos"
    }
  },
  { $unwind: "$datos_demograficos" },
  {
    $project: {
      estudio_id: 1,
      nombre_estudio: 1,
      fecha_realizacion: 1,
      "datos_demograficos.nombre_completo": 1,
      "datos_demograficos.hospital_base": 1,
      "archivo_dicom.uri_storage": 1
    }
  }
]);