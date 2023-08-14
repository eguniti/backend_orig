var express = require('express');
var app = express();
var uuid = require('node-uuid');
var pool = require('pg').Pool;
const conString = {
    user: process.env.DBUSER,
    database: process.env.DB,
    password: process.env.DBPASS,
    host: process.env.DBHOST,
    port: process.env.DBPORT
};
const pg = new pool(conString)

// Routes
app.get('/api/status', function(req, res) {
  console.log("request received")
  pg.connect(function(err, client, done) {
    if(err) {
      return res.status(500).send('error fetching client from pool');
    }
    //client.query('SELECT now() as time', [], function(err, result) {
     client.query('SELECT NAME as name, ID as id, AGE as age, ADDRESS as address, SALARY as salary from public.COMPANY where ID =1;', [], function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        return res.status(500).send('error running query');
      }

      return res.json({
        //time: result.rows[0].time
        name: result.rows[0].name,
        id: result.rows[0].id,
        age: result.rows[0].age,
        address: result.rows[0].address,
        salary: result.rows[0].salary

      });
    });
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
