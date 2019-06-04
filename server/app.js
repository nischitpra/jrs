var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

const sessionMiddleware = require('./sessionMiddleware')

var indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const employeeRegistration = require('./routes/employeeRegsitration')
const employeeDetailsRouter = require('./routes/employeeDetails')
const hrRouter = require('./routes/hr')
const leaveRouter = require('./routes/leave')
const leaveOptionRouter = require('./routes/leaveOption')
const positionOptionRouter = require('./routes/positionOption')
const departmentOptionRouter = require('./routes/departmentOption')
const uploadFileRouter = require('./routes/uploadFile')

const constants = require('./constants')
const db = require('./database')



// initialize tables
const createTableLog=( status, message )=>{ console.log(`CREATE TABLE ${status}: ${message}`)}
db.createTable(constants.id.database.tableName.login, createTableLog)
db.createTable(constants.id.database.tableName.login_session, createTableLog)
db.createTable(constants.id.database.tableName.leave, createTableLog)

db.createTable(constants.id.database.tableName.leave_options, createTableLog)
db.createTable(constants.id.database.tableName.available_leave, createTableLog)
db.createTable(constants.id.database.tableName.position_options, createTableLog)
db.createTable(constants.id.database.tableName.department_options, createTableLog)

db.createTable(constants.id.database.tableName.employee_id_realtions, createTableLog)
db.createTable(constants.id.database.tableName.employee_basic_form_details, createTableLog)
db.createTable(constants.id.database.tableName.employee_citizenship_form_details, createTableLog)
db.createTable(constants.id.database.tableName.employee_address_form_details, createTableLog)
db.createTable(constants.id.database.tableName.employee_family_form_details, createTableLog)
db.createTable(constants.id.database.tableName.employee_children_form_details, createTableLog)
db.createTable(constants.id.database.tableName.employee_education_form_details, createTableLog)
db.createTable(constants.id.database.tableName.employee_previous_job_form_details, createTableLog)


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use( cors() )

app.use(['/departmentOption/edit','/departmentOption/create','/positionOption/edit','/positionOption/create',
'/leave','/leaveOption','/login/logout','/employee','/employeeForm/application','/employeeForm/approve','/employeeForm/reject','/hr'], sessionMiddleware)

app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/employeeForm', employeeRegistration)
app.use('/employee', employeeDetailsRouter )
app.use('/hr', hrRouter)

app.use('/leave', leaveRouter)
app.use('/leaveOption', leaveOptionRouter)
app.use('/positionOption', positionOptionRouter)
app.use('/departmentOption', departmentOptionRouter)
app.use('/uploadFile', uploadFileRouter)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
