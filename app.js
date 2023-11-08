const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require('cors');
const PORT = 3000


app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


const mensajeGuardado = [];

io.on('connection', (socket) => {
    console.log('usuario conectado', socket.id);

    // Enviar mensaje guardado en la memoria al cliente conectado
    mensajeGuardado.forEach((msg) => {
        socket.emit('chat message', msg);
    })
    
    // Recepción de mensaje nuevo
    socket.on('chat message', (msg) => {
        // Emitir mensajes a todos los clientes conectados
        io.emit('chat message', msg);
        // Guardar mensaje en memoria
        mensajeGuardado.push(msg);
        console.log(msg);
    });

    // Usuario comienza a escribir
    socket.on('start typing', (userName) => {
        socket.broadcast.emit('typing', userName);
    });

    // Cuando termina de escribir
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');
    })

    // Cuando se desconecta
    socket.on('disconnect', () => {
        console.log('usuario desconectado', socket.id);
    });

});


server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});