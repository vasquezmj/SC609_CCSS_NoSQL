// =============================================================================
// Script 01: Inicialización de Colecciones y Validadores en MongoDB
// Proyecto: Sistema de Gestión de Pacientes CCSS (SC-609 NoSQL)
// =============================================================================
db = db.getSiblingDB('ccss_gestion_pacientes');

// 1. Colección: pacientes (con validación de esquema JSON)
db.createCollection("pacientes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["cedula", "nombre_completo", "fecha_nacimiento", "hospital_base"],
      properties: {
        cedula: {
          bsonType: "string",
          pattern: "^[0-9]{9}$",
          description: "Cédula de 9 dígitos requerida"
        },
        hospital_base: {
          bsonType: "string",
          description: "Nombre del centro médico de adscripción principal"
        }
      }
    }
  }
});

// 2. Colección: expedientes_medicos
db.createCollection("expedientes_medicos");

// 3. Colección: estudios_imagenes
db.createCollection("estudios_imagenes");

print("Base de datos 'ccss_gestion_pacientes' y colecciones inicializadas exitosamente.");