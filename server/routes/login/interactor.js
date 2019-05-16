const verifyLogin = ( employeeId, password, res )=>{
  if( employeeId == 1 ) return res.json({ position: 'CEO' }) 
  if( employeeId == 2 ) return res.json({ position: 'HR' })

  return res.sendStatus( 400 )
}

module.exports = {
  verifyLogin: verifyLogin
}