const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');

const app = express();

dotenv.config();
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log("Connected to MongoDB!"))
   .catch(err => console.log(err));

app.use(expressLayouts);
app.use("/assets", express.static('./assets'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(
   session({
         secret: 'secret',
         resave: true,
         saveUninitialized: true
   })
);
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server is running at port  ${PORT}`));