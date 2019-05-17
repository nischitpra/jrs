const getBasicDetails = ( token, res )=>{
  
  return res.json( global.employeeList )
}

module.exports = {
  getBasicDetails: getBasicDetails
}