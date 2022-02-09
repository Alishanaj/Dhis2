const papaparse = require("papaparse");
const got = require("got");
const fs = require("fs");

const client = got.extend({
  prefixUrl: "http://development.dhis.akdndhrc.org/api/", 
  username: "admin",
  password: "district",
  responseType: 'json',
  resolveBodyOnly: true,
});

// // fs.dir

const data = fs.readFileSync("./dhis-mapping-wih-ids.csv").toString("utf8").trim();
let csv = papaparse.parse(data, { header: true})["data"];

(async () => {
    // Promise.all
    for(let i in csv){
    let x = await client(
      {
        url: 'dataSets',
        method: "get",
        query: {
          pageSize: 500
          
        },
        
      }
    ).then( x => x);
    console.log(x);
    }
  })();

            
  


// (async () => {
//   for(let i in csv){
//     try{
//       let resp = await client.post({
//         url: 'dataElements',
//         method: "post",
//         json: { 
//           "name": `${csv[i]["sub_heading"]} ${csv[i]["data_element"]}`.trim(),
//           "shortName": csv[i]["data_element"],
//           "code": csv[i]["data_element_code"],
//           "aggregationType": "SUM",
//           "domainType": "AGGREGATE",
//           "valueType": "NUMBER",
//           "zeroIsSignificant": true,
//           "categoryCombo": {
//             "id": "bjDvmb4bfuf"
//           },
//           "legendSets": [],
//           "aggregationLevels": [
//             2,
//             4,
//             7,
//             1,
//             3,
//             5,
//             6
//           ]
//         }
//       });
//       let x = resp["response"]["uid"];
//       csv[i]["data_element_id"] = x;
//       console.log(`Inserted ${csv[i]["data_element"]}`);
//     } catch(e) {
//       if(e instanceof got.HTTPError){
//         if(e.response.statusCode == "409"){
//           console.log(`Error with ${csv[i]["data_element"]}`);
//         }
//       }
//     }
//   }
//   let csv_new = papaparse.unparse(csv, {header: true});
//   fs.writeFileSync("./dhis-mapping-wih-ids.csv", csv_new.trim());
// })();
