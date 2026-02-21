// Archivo de prueba para verificar que Codacy detecte vulnerabilidades

// ❌ NO HACER ESTO EN PRODUCCIÓN

// 1. Contraseña hardcodeada
const dbPassword = "admin123";

// 2. Uso de eval (inyección de código)
const userInput = "console.log('hack')";
eval(userInput);

// 3. SQL injection vulnerable
function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return query;
}

// 4. console.log de información sensible
const apiKey = "sk-1234567890abcdef";
console.log("API Key:", apiKey);

// 5. Comentario con secreto
// Password: super-secret-123

export { dbPassword, getUserData };
