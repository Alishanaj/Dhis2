let mysql = require('mysql2/promise');
const papaparse = require("papaparse");
const got = require("got");
// const { JSON } = require('mysql/lib/protocol/constants/types');

const client = got.extend({
    prefixUrl: "http://development.dhis.akdndhrc.org/api/",
    username: "admin",
    password: "district",
    responseType: 'json',
    resolveBodyOnly: true,
});  

let con = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dhis',
    multipleStatements:true
});

console.log("heelo");

(async () => {
    let [result, _r] = await con.query(`SELECT basev6, basev8,basev1,
    JSON_UNQUOtE(JSON_EXTRACT(f1.metadata, "$.dhis_id")) 
    as dhis_id FROM program_data as p1
     INNER JOIN l06_facilities as f1
    ON p1.basev1 = f1.uid` , 
    );

    let [data, _a] = await con.query(` SELECT d1.data_element,
    d2.data_set,d1.data_element_id,d2.data_set_id
    FROM data_elements as d1
    INNER JOIN datasets as d2
    ON d1.data_set = d2.data_set` , 
    );

    for (let i in result) {
        for(let j in data) {
        // console.log(result[i]);
        try {
               await client.post({
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
                            "dataElement":  data[j]["data_element_id"],
                            "categoryOptionCombo": "HllvX50cXC0",
                            "value": "15",
                            "comment": "comment1"
                        }
                        
                    ]
                }
            });
           
            
          
            // console.log(`Imported ${result[i]["basev1"]} ,
            //  ${data[j]["data_set_id"]}, ${data[j]["data_element_id"]} ` );
            
       console.log("done");
     }    
        
        catch (e) {
            if (e instanceof got.HTTPError) {
                if (e.response.statusCode == "409") {
                    console.log(`Error with ${result[i]["name"]}`);
                }
            }else{
                console.error(e);
            }
        }
    } }

   

})(); 



    // SELECT d1.data_element,d2.data_set,d1.data_element_id,d2.data_set_id
    
    //  FROM data_elements as d1
    //  INNER JOIN datasets as d2
    // ON d1.data_set = d2.data_set