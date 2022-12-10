const express = require('express')
const exphbs = require('express-handlebars')
const fileUpload = require('express-fileupload')

const app = express();
const port = process.env.PORT || 5000;

// Default option
app.use(fileUpload());

// Templating engine
const handlebars = exphbs.create({extname: '.hbs'})

app.engine('hbs', handlebars.engine)
app.set('view engine', 'hbs')


app.get('/', (req,res) => {
    res.render('index')
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

    res.send('File Uploaded!')
   })
})

app.listen(port, () => console.log(`Listening on port ${port}`));