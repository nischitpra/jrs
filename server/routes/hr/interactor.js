const db = require('../../database')
const {id} = require('../../constants')

const getEmployee = async ( res )=>{
  const employeeList = await db.find( `select * from employee_id_realtions;` )
  return res.json( employeeList )
}

module.exports = {
  getEmployee: getEmployee
}