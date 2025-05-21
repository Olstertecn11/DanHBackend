const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('../Login_2back/routes/useroutes');
const logsRoutes = require('../Login_2back/routes/logsroutes')
const bodyParser = require('body-parser');
const authRoutes = require('../Login_2back/routes/authroutes');
const CORS = require('cors');
const session = require('express-session');

const app = express()


const PORT = process.env.PORT || 3000
app.use(CORS());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));


mongoose.connect('mongodb+srv://dhernandezs13:12345678d@clustercolmov.d5cjn.mongodb.net/col_mov_user?retryWrites=true&w=majority&appName=clustercolmov',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> {
    console.log('Conectado a la base de datos')
}).catch(error => {console.error("Error al conectarse a la base de datos...",error)})

app.use('/api', userRoutes);
app.use('/api', logsRoutes);
app.use(authRoutes);

app.get("/", (req,res)=> {
    res.json({message: "API funcionando..."})
})

app.listen(PORT, () => {console.log("Escuchando en el puerto 3000...")})



