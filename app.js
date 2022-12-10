const express = require('express')
const exphbs = require('express-handlebars')

const app = express();
const port = process.env.PORT || 5000;

// Templating engine
const handlebars = exphbs.create({extname: '.hbs'})

app.engine('hbs', handlebars.engine)
app.set('view engine', 'hbs')


app.get('/', (req,res) => {
    res.render('index')
})


app.listen(port, () => console.log(`Listening on port ${port}`));