const db = require('../../database')
const {id} = require('../../constants')

const getEmployee = async ( res )=>{
  const employeeList = await db.find( `select * from ${id.database.tableName.employee_basic_details};` )
  return res.json( employeeList )
}

module.exports = {
  getEmployee: getEmployee
}