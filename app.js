const express = require('express');
const app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));


var indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(process.env.PORT || 3000, function () {
    console.log('app listening at port %s', process.env.PORT || 3000);
});