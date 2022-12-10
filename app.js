const express = require('express')
const exphbs = require('express-handlebars')
const fileUpload = require('express-fileupload')
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;

// Default option
app.use(fileUpload());

// Static files
app.use(express.static('public'))
app.use(express.static('upload'))

// Templating engine
const handlebars = exphbs.create({extname: '.hbs'})

app.engine('hbs', handlebars.engine)
app.set('view engine', 'hbs')

// Connection Pool
const pool = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'',
    database:'userprofile'
})

pool.getConnection((err,connection) => {
    if(err) throw err; // not connected
    console.log('Connected!')
})

app.get('/', (req,res) => {
    

    pool.getConnection((err,connection) => {
        if(err) throw err; // not connected
        console.log('Connected!')
        connection.query('select * from user where id = "1"', (err, rows) => {
            // Once done, release connection
            connection.release();
            if(!err){
                res.render('index', {rows});
            }
        })
    })
})


app.post('/', (req,res) => {
   let sampleFile;
   let uploadPath;

   if(!req.files || Object.keys(req.files).length === 0){
    return res.status(400).send('No files were uploaded.')
   }

   // Name of the input is sampleFile
   sampleFile = req.files.sampleFile
   uploadPath = __dirname + '/upload/' + sampleFile.name
   
   console.log(sampleFile);

   // Use mv() to place file on the server
   sampleFile.mv(uploadPath, function(err){
    if(err) return res.status(500).send(err);

    // res.send('File Uploaded!')

    pool.getConnection((err,connection) => {
        if(err) throw err; // not connected
        console.log('Connected!')
        connection.query('update user SET profile_image = ? WHERE id = "1"', [sampleFile.name], (err, rows) => {
            // Once done, release connection
            connection.release();
            if(!err){
                res.redirect('/');
            } else {
                console.log(err)
            }
        })
    })

   })
})

app.listen(port, () => console.log(`Listening on port ${port}`));