const fs = require('fs');
const papaparse = require('papaparse');
const got = require('got');

const file = fs.readFileSync('DHIS Mappings demoo - Sheet1.csv').toString("utf8").trim();
const csvData = papaparse.parse(file, {
  header: true,
})["data"];

csvData.map((x) => {
  x["dataset"] = x["dataset"].trim().toUpperCase();
  x["sub_heading"] = x["sub_heading"].trim();
  x["data_element"] = x["data_element"].trim();
  x["data_element_code"] = x["data_element_code"].trim();
  return x;
});

//  console.log(csvData);

const client = got.extend({
  prefixUrl: "http://development.dhis.akdndhrc.org/api/", 
  username: "admin",
  password: "district",
  responseType: 'json',
  resolveBodyOnly: true,
});

// (async () => {
//   // Promise.all
//   let x = await client(
//     {
//       url: 'dataElements',
//       method: "get",
//       query: {
//         pageSize: 500
//       },
      
//     }
//   ).then( x => x);
//   console.log(x);
// })();

(async () => {
  // Promise.all
  // csvData
  try {
    
    let y = await client(
      {
        url: 'dataElements',
        method: "post",
        query: {
          pageSize: 50
        },
        json: { 
          "name":  ["data_set"],
          "shortName":"children at minor risk",
          "code": "sec90",
          "aggregationType": "SUM",
          "domainType": "AGGREGATE",
          "valueType": "NUMBER",
          "zeroIsSignificant": true,
          "categoryCombo": {
            "id": "bjDvmb4bfuf"
          },
          "legendSets": [],
          "aggregationLevels": [
            2,
            4,
            7,
            1,
            3,
            5,
            6
          ]
        }
      }
    )
    
    console.log(y);
  } catch (error) {
    console.log("no response");
  }
})();





// let {headers} = await got(
// 	{
// 		url: 'https://httpbin.org/anything',
// 		headers: {
			
//       data: 'hello'
// 		}
// 	}
// ).json();