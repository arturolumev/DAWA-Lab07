const mongoose = require('mongoose');
const express = require('express');
const { render } = require('ejs');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
var datos = [];
//COnfiguracion de base de datos
mongoose.connect('mongodb://0.0.0.0:27017/peliculas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado exitosamente');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});


const userSchema = new mongoose.Schema({
    nombre: String,
    fecha_estreno: String
});

const Pelicula = mongoose.model('Estreno', userSchema);
// Configurar el motor de plantillas
app.set('views', './views');

app.use(express.static('public'));
app.engine('ejs', require('ejs').renderFile);

app.get('/', (req, res) => {
    Pelicula.find().then((estrenos) => {
        res.render('index.ejs',{peliculas:estrenos});
    }).catch((error) => {
        res.render('index.ejs',{estrenos:error});
    });
    
});
app.get('/agregar', (req, res) => {
    res.render('agregar.ejs')
});

//INSERT
app.post('/insertar', (req, res) => {
    for (const x in req.body){
        datos.push(req.body[x])
    }
    const newPelicula = new Pelicula({
        nombre: datos[0],
        fecha_estreno: datos[1]
    });
    datos = []
    newPelicula.save().then(() => {
        console.log('Pelicula agregada correctamente');
    }).catch((error) => {
        console.error('Error al agregar pelicula:', error);
    });
    res.redirect('/')
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Ejecutándose en el puerto 3000');
});
