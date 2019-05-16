const getEmployee = ( shouldGetAll, res )=>{
  return res.json( global.employeeList )
}

module.exports = {
  getEmployee: getEmployee
}