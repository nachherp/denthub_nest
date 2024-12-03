const express = require('express');
const app = express();
const cors = require('cors');
const prisma = require('./prisma/client');  // Asegúrate de importar Prisma

app.use(cors());
app.use(express.json());  // Para manejar los cuerpos JSON

// Ruta para manejar el login
app.post('/api/login', async (req, res) => {
  const { username, password, userType } = req.body;

  try {
    // Buscar al usuario en la base de datos según el tipo
    let user;
    if (userType === 'user') {
      user = await prisma.paciente.findUnique({
        where: { correoElectronico: username },
      });
    } else if (userType === 'admin') {
      user = await prisma.dentista.findUnique({
        where: { correoElectronico: username },
      });
    }

    // Verificar si se encontró el usuario y si la contraseña es correcta
    if (user && user.contrasena === password) {
      return res.status(200).json({ message: 'Login exitoso' });
    } else {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
});
