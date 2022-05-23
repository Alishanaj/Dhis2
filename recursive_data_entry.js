let mysql = require("mysql2/promise");
const papaparse = require("papaparse");
let moment = require("moment");
const got = require("got");
require('dotenv').config();

const client = got.extend({
 prefixUrl: process.env["PREFIX_URL"],
 username: process.env["API_USERNAME"],
 password: process.env["API_PASSWORD"],
 responseType: "json",
 resolveBodyOnly: true,
});


let con = mysql.createPool({
 host: process.env["DB_HOST"],
 user: process.env["DB_USER"],
 password: process.env["DB_PASSWORD"],
 database: process.env["DB_DATABASE"],
 port: process.env["DB_PORT"],
 multipleStatements: true,
});

(async () => {
 let [result, _r] = await con.query(`SELECT basev6,basev2,basev3,basev11, basev8,basev1,
    JSON_UNQUOtE(JSON_EXTRACT(f1.metadata, "$.dhis_id")) 
    as dhis_id FROM program_data as p1
     INNER JOIN l06_facilities as f1
    ON p1.basev1 = f1.uid`);

 let [data, _a] = await con.query(` SELECT d1.data_element,
    d2.data_set,d1.data_element_id,d2.data_set_id
    FROM data_elements as d1
    INNER JOIN datasets as d2
    ON d1.data_set = d2.data_set`);


    //insert query of duplicate

 for (let i in result) {
  for (let j in data) {
   try {
      // console.log("data_set_id",data[j]["data_set_id"]);
      // console.log("basev3",result[i]["basev3"]);
      // console.log("basev1",result[i]["basev1"]);
      // console.log("data_element_id",data[j]["data_element_id"]);
    let res=await client.post({
     url: "33/dataValueSets",
     method: "post",
     json: {
      "dataSet": data[j]["data_set_id"],
      "completeDate": "2021-01-12",
      "period": result[i]["basev3"],
      "orgUnit": result[i]["basev1"],
      "attributeOptionCombo": "",
      "dataValues": [
       {
        "dataElement": data[j]["data_element_id"],
        "categoryOptionCombo": "HllvX50cXC0",
        "value": "15",
        "comment": "comment1", 
       },
      ],
     },
    });
    console.log(res);
    if(res["conflicts"] !==undefined){
       let temp_obj={
         "description":res["description"],
         "importCount":res["importCount"],
         "conflicts":res["conflicts"]
       }
       
   await con.query(
         `INSERT INTO tracking set 
         basev6=?,basev2=?,basev3=?,basev11=?,basev1=?,
         conflict=?,added_on=?`,[result[i]["basev6"],result[i]["basev2"],
         result[i]["basev3"],result[i]["basev11"],result[i]["basev1"],JSON.stringify(temp_obj) ,moment().unix()] 
     );
    }
    else{
      let tempp_obj={
         "description":res["description"],
         "importCount":res["importCount"],
         
       }

      await con.query(
         `INSERT INTO tracking set 
         basev6=?,basev2=?,basev3=?,basev11=?,basev1=?,
         entered_data=?,added_on=?`,[result[i]["basev6"],result[i]["basev2"],
         result[i]["basev3"],result[i]["basev11"],result[i]["basev1"],JSON.stringify(tempp_obj) ,moment().unix()] 
     );
       
      //  console.log(res);
    }
    console.log("END--------------------");

   } catch (e) {
    if (e instanceof got.HTTPError) {
     if (e.response.statusCode == "409") {
      console.log(`Error with ${result[i]["name"]}`);
     }
    } else {
     console.error(e);
    }
   }
  }
 }
})();

