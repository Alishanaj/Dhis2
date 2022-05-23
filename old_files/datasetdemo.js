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
let csv = papaparse.parse(data, { header: true })["data"];
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

(async () => {
  // Map
  //   Sets
  // array.filter
  const datasets = new Set(); 

  csv.map((x) => {
    x["dataset"] = x["dataset"].trim().toUpperCase();
    x["sub_heading"] = x["sub_heading"].trim();
    x["data_element"] = x["data_element"].trim();
    x["data_element_code"] = x["data_element_code"].trim();
    datasets.add(x["dataset"])
    return x;
  });
  // function checkSection(d){
  //   d=="displayName";

  // }
  for (let i of datasets.keys()) {
    // mySet.add({ csv })

    const elements = csv.filter( (d) => {
      return i === d["dataset"]
    });

    //  console.log(elements); 
    
    
    try {
      
      let resp = await client.post({
        url: 'dataSets',
        method: "post",
        
        json: {

          "aggregationType": "AVERAGE",
          "attributeValues": [
            {}
          ],
          "categoryCombo": {
            "id": "NJnhOzjaLYk.qNCMOhkoQju"
          },
          "code": "string",
          "compulsoryDataElementOperands": [
            {}
          ],
          "compulsoryFieldsCompleteOnly": true,
          "created": "2022-01-05T18:36:20Z",
          "dataElementDecoration": true,
          "dataEntryForm": {
            "id": "NJnhOzjaLYk.qNCMOhkoQju"
          },
          "dataInputPeriods": [
            {}
          ],
          "dataSetElements": [
            {
              "dataSet": {
                "id": "UID API" //klwVscyJr2b
              },
              "id": datasets[i.elements]["data_element_id"],
              "dataElement": {
                "id":datasets[i.elements]["data_element_id"]
              }
            }
          ],
          "description": "string",
          "dimensionItemType": "REPORTING_RATE",
          "displayDescription": "string",
          "displayName":datasets[i.elements]["dataset"],
          "displayShortName": datasets[i.elements]["dataset"] ,
          "expiryDays": 0,
          "externalAccess": true,
          "favorite": true,
          "favorites": [
            true
          ],
          "fieldCombinationRequired": true,
          "formName": "myformName",
          "id": "NJnhOzjaLYk.qNCMOhkoQju",
          "indicators": [
            {}
          ],
          "interpretations": [
            {}
          ],
          "lastUpdated": "2022-01-05T18:36:20Z",
          "lastUpdatedBy": {
            "id": "NJnhOzjaLYk.qNCMOhkoQju"
          },
          "legendSets": [
            {}
          ],
          "mobile": true,
          "name": "string",
          "noValueRequiresComment": true,
          "notificationRecipients": {
            "id": "NJnhOzjaLYk.qNCMOhkoQju"
          },
          "notifyCompletingUser": true,
          "openFuturePeriods": 0,
          "organisationUnits": [
            {
              "id": "S3FgphKZ9WY"
            },
            {
              "id": "kLhX1ohGWCc"
            },
            {
              "id": "cgBtIlnCqbo"
            },
            {
              "id": "kHrnZGyOVYn"
            },
            {
              "id": "h2WBoa2RP30"
            },
            {
              "id": "ekDWJyIAXx1"
            },
            {
              "id": "xIfyWp9oqzM"
            },
            {
              "id": "VohfkDaJeZi"
            }
          ],
          "id": "FROM UID API", // klwVscyJr2b
          "periodType": "mype",
          "publicAccess": "stringst",
          "renderAsTabs": true,
          "renderHorizontally": true,
          "sections": [
            {}
          ],
          "shortName": "string",
          "skipOffline": true,
          "style": {},
          "timelyDays": 0,
          "translations": [
            {}
          ],
          "user": {
            "id": "NJnhOzjaLYk.qNCMOhkoQju"
          },
          "userAccesses": [
            {}
          ],
          "userGroupAccesses": [
            {}
          ],
          "validCompleteOnly": true,
          "version": 22,
          "workflow": {
            "id": "NJnhOzjaLYk.qNCMOhkoQju"
          }
        }

      });
      let x = resp["response"]["uid"];
      datasets[i.elements]["dataset_id"] = x;
      console.log(`Entered ${datasets[i.elements]["dataset"]}`);
    } catch (e) {
      if (e instanceof got.HTTPError) {
        if (e.response.statusCode == "409") {
          console.log(`Error with ${datasets[i.elements]["dataset"]}`);
        }
      }
    }
  }

  

  let csv_new = papaparse.unparse(csv, { header: true });
  fs.writeFileSync("./dhis-mapping-with-updated-ids.csv", csv_new.trim());
})();