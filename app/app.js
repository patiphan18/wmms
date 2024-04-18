const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use('/static', express.static('public'));
app.use('/uploads', express.static('./uploads/'))
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use('/', require('./routes/home'));
app.use('/', require('./routes/login'));
app.use('/bin', require('./routes/bin'));
app.use('/garbage', require('./routes/garbage'));
app.use('/collect', require('./routes/collect'));
app.use('/report', require('./routes/report'));
app.use('/user', require('./routes/user'));

app.listen(9079, () => {
	console.log('Server has start with port 9079');
});