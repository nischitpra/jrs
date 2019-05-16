const {id, values} = require('../constants/constants')
const pg = require('pg')
const pool = new pg.Pool(values.database.credentials)



module.exports = {
  
  runQuery(_query, callback){
    pool.connect((err,client,done)=>{
      if(err){
        done()
        return callback(values.status.error, err)
      }
      client.query(_query,(err,res)=>{
        done()
        if(err){
          return callback(values.status.error, err)
        }
        return callback(values.status.ok, res)
      })
    })
  },

  insert(tableName,keys,usedColumns,_values,callback){
//    const pg = require('pg')
//    const pool = new pg.Pool(values.database.credentials)
   
    pool.connect((err, client, done)=>{
      if(err){
         done()
         return callback(values.status.error,err)
      }
      var columnName=``
      for(var i in usedColumns){
          columnName+=`${keys[usedColumns[i]].columnName},`
      }
      columnName=columnName.slice(0,-1)// remove last comma
      columnName=`(${columnName})`
  
      var valueString=``
      for(var j in _values){
          var insertString=``
          for(var i in usedColumns){
              insertString+=`'${_values[j][keys[usedColumns[i]].columnName]}',`
          }
          insertString=insertString.substring(0,insertString.length-1)// remove last comma
          insertString=`(${insertString}),`
          valueString+=insertString
      }
      valueString=valueString.substring(0,valueString.length-1) // remove last comma
  
      const finalQ=`insert into ${tableName} ${columnName} values ${valueString};`
      const query = client.query(finalQ,(err, res) => {
         done()
         if(err){
              return callback(values.status.error,err)
          }
          return callback(values.status.ok,"rows inserted: "+_values.length)
      })
    })
  },
  
  insertForm(formData, callback){
//    const pg = require('pg')
//    const pool = new pg.Pool(values.database.credentials)
   
    pool.connect((err, client, done)=>{
      if(err){
        done()
        console.log("insert form error: "+ err)
        return callback(values.status.error, err)
      }
      let columnName=""
      let _values=""
      const tableName = formData.formName
      const formStructure=id.database.keyList[tableName]
      for(let i in formStructure){
        const column = formStructure[i].columnName
        columnName += column + ", " 
        const d = !formData[column]? "-1" : `'${formData[column]}'`
        _values += d + ", "
      }
      columnName = columnName.slice(0, -2)
      _values = _values.slice(0, -2)
      const fq = `insert into ${tableName} (${columnName}) values (${_values});`
      const query = client.query(fq, (err, res)=>{
        done()
        if(err){
          console.log("insert form error: "+ err)
          return callback( values.status.error, err )
        }
        return callback( values.status.ok, "form inserted:" + tableName )
      })
    })
  },

  find(_query,callback){
//    const pg = require('pg')
//    const pool = new pg.Pool(values.database.credentials)
  
    pool.connect((err, client, done)=>{
      if(err){
         console.log( `${_query} => ${err}`)
         done()
         return callback(values.status.error,err)
      }
      const query = client.query(_query,(err, res) => {
             done()
             if(err){
               console.log("find::"+err)
               return callback(values.status.error,err)
              }
              return callback(values.status.ok,res.rows)
          })
    })
  },

  createTable(tableName, callback){
//   const pg = require('pg')
//   const pool = new pg.Pool(values.database.credentials)
 
   pool.connect((err, client, done)=>{
      if(err){
         done()
         return callback(values.status.error, `${tableName} => ${err}`)
      }
      const formStructure = id.database.keyList[tableName]
      let _query=""
      for(let i in formStructure){
        _query += formStructure[i].columnName + " " + formStructure[i].type + ", "
      }
      _query = _query.slice(0,-2)
      const fq= `create table if not exists ${tableName} (${_query});`
      const query = client.query(fq,(err, res) => {
             done()
             if(err){
                  console.log(fq)
                  return callback(values.status.error,`${tableName} => ${err}`)
              }
             return callback(values.status.ok, `${tableName} => ok `)
          })
    })
    
  },
}
