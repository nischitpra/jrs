module.exports = {
  
  // all string constants that are to be sent as result and through mail. Any value visible to the user should be placed here
  values:{
    status: {
      ok: 'ok',
      error: 'error',
    }
  },
  database:{
    credentials:{
      host:     process.env.dbhost,
      database: process.env.dbname,
      user:     process.env.dbuser,
      password: process.env.dbpass,
      port:     process.env.dbport,
      connectionTimeoutMillis:5000,
    },
    create:{
      table:(name)=>`${name} table has been created/initialized`,
    },
  },
  // any id used in json or anywhere should be used from here
  id:{
    res:{
      status: "status",
      message: "message",
    },  
    requestRegistrationEmployee: {
      positionLevel: {
        CEO: 0,
        COO: 1,
        Manager: 2,
        Employee: 3,
      },
    },
    database: {
      tableName:{
        login: "login",
        login_session: "login_session",
        employee_basic_details: "employee_basic_details",
        employee_form_details: "employee_form_details",
        leave: "leave",
      },
      keyList:{
        login: [
          {columnName:"employee_id", type:"integer"},
          {columnName:"password", type:"varchar(120)"},
          {columnName:"timestamp", type:"bigint"},
        ],
        login_session: [
          {columnName:"employee_id", type:"integer"},
          {columnName:"token", type:"varchar(128)"},
          {columnName:"timestamp", type:"bigint"},
        ],
        employee_basic_details: [
          {columnName:"employee_id", type:"serial"},
          {columnName:"form_id", type:"integer"},
          {columnName:"immediate_boss_employee_id", type:"integer"},
          {columnName:"timestamp", type:"bigint"},
        ],
        employee_form_details: [
          {columnName:"form_id", type:"serial"},
          {columnName:"name", type:"varchar(120)"},
          {columnName:"email", type:"varchar(120)"},
          {columnName:"age", type:"integer"},
          {columnName:"sex", type:"char(1)"},//m or f
          {columnName:"department", type:"varchar(50)"},
          {columnName:"position", type:"varchar(50)"},
          {columnName:"position_level", type:"integer"},
          {columnName:"status", type:"integer"},// 1 or 0 for verified and not verified.
          {columnName:"timestamp", type:"bigint"},
        ],
        leave: [
          {columnName:"leave_id", type:"serial"},
          {columnName:"employee_id", type:"integer"},
          {columnName:"immediate_boss_employee_id", type:"integer"},
          {columnName:"senior_boss_employee_id", type:"integer"},
          {columnName:"from_date", type:"bigint"},
          {columnName:"to_date", type:"bigint"},
          {columnName:"reason", type:"varchar(250)"},
          {columnName:"approval_count", type:"integer"},
          {columnName:"timestamp", type:"bigint"},
        ],
      },
    },
  },
}
