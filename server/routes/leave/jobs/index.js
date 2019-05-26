const cron = require('cron').CronJob;
const db = require('../../../database')



const renewThisYearLeave = new cron('0 0 0 1 1 *', async ()=>{
  console.log('Do some action every 10th second of minute', new Date())
  try {
    const leaveTypes = await db.find( `select * from leave_options;` )
  
    for( var i in leaveTypes ) {
      switch( leaveTypes[i].type ) {
        case 'non accumulating':
          await db.run( `update available_leave set this_year=${ leaveTypes[i].max }, used=0 where type='${ leaveTypes[i].name }';` )
          break
        case 'accumulating':
          await db.run( `update available_leave set accumulated=accumulated+this_year-used, this_year=${ leaveTypes[i].max }, used=0 where type='${ leaveTypes[i].name }';` )
          break
        case 'non renewable':
          break
        default:
          break      
      }
    }
  }
  catch( err ) {
    console.log( 'leave.jobs.renewThisYearLeave', err )
  }
 
});



module.exports = {
  renewThisYearLeave
}
