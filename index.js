const express   = require('express');
const axios     = require('axios');
const morgan    = require('morgan');

const app       = express();
const PORT      = process.env.PORT || 3001;

app.use(express.json());

// Middleware para permitir solicitudes CORS desde cualquier origen //
app.use((req, res, next) => {
    // Permitir solicitudes desde cualquier origen
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Métodos permitidos
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Encabezados permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Configurar morgan para registrar solicitudes en la terminal
app.use(morgan('dev'));

// Endpoint para manejar las solicitudes del frontend
app.post('/api/proxy', async (req, res) => {
    try {
        const { url, method, body, headers } = req.body;

        // Log de la solicitud en la terminal
        console.log(`Proxying ${method} request to ${url}`);

        // Realizar solicitud al servidor externo utilizando Axios
        const response = await axios.request({
            url,
            method,
            data: body,
            headers
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
