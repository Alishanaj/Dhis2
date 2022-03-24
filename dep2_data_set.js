const papaparse = require("papaparse");
const got = require("got");
const fs = require("fs");
require('dotenv').config()

const client = got.extend({
 prefixUrl: process.env["PREFIX_URL"],
 username: process.env["USERNAME"],
 password: process.env["PASSWORD"],
 responseType: "json",
 resolveBodyOnly: true,
});

const data = fs.readFileSync("../dhis-mapping-wih-ids.csv").toString("utf8").trim();
let csv = papaparse.parse(data, { header: true })["data"];




(async () => {
 const datasets = new Set();
 csv.map((x) => {
  x["dataset"] = x["dataset"].trim().toUpperCase();
  x["sub_heading"] = x["sub_heading"].trim();
  x["data_element"] = x["data_element"].trim();
  x["data_element_code"] = x["data_element_code"].trim();
  datasets.add(x["dataset"]);
  return x;
 });

 for (let i of datasets.keys()) {
  const elements = csv.filter((d) => {
   return i === d["dataset"];
  });

  try {
   let resp = await client.post({
    url: "dataSets",
    method: "post",

    json: {
     aggregationType: "AVERAGE",
     attributeValues: [{}],
     categoryCombo: {
      id: "NJnhOzjaLYk.qNCMOhkoQju",
     },
     code: "string",
     compulsoryDataElementOperands: [{}],
     compulsoryFieldsCompleteOnly: true,
     created: "2022-01-05T18:36:20Z",
     dataElementDecoration: true,
     dataEntryForm: {
      id: "NJnhOzjaLYk.qNCMOhkoQju",
     },
     dataInputPeriods: [{}],
     dataSetElements: [
      {
       dataSet: {
        id: "UID API",
       },
       id: datasets[i.elements]["data_element_id"],
       dataElement: {
        id: datasets[i.elements]["data_element_id"],
       },
      },
     ],
     description: "string",
     dimensionItemType: "REPORTING_RATE",
     displayDescription: "string",
     displayName: datasets[i.elements]["dataset"],
     displayShortName: datasets[i.elements]["dataset"],
     expiryDays: 0,
     externalAccess: true,
     favorite: true,
     favorites: [true],
     fieldCombinationRequired: true,
     formName: "myformName",
     id: "NJnhOzjaLYk.qNCMOhkoQju",
     indicators: [{}],
     interpretations: [{}],
     lastUpdated: "2022-01-05T18:36:20Z",
     lastUpdatedBy: {
      id: "NJnhOzjaLYk.qNCMOhkoQju",
     },
     legendSets: [{}],
     mobile: true,
     name: "string",
     noValueRequiresComment: true,
     notificationRecipients: {
      id: "NJnhOzjaLYk.qNCMOhkoQju",
     },
     notifyCompletingUser: true,
     openFuturePeriods: 0,
     organisationUnits: [
      {
       id: "S3FgphKZ9WY",
      },
      {
       id: "kLhX1ohGWCc",
      },
      {
       id: "cgBtIlnCqbo",
      },
      {
       id: "kHrnZGyOVYn",
      },
      {
       id: "h2WBoa2RP30",
      },
      {
       id: "ekDWJyIAXx1",
      },
      {
       id: "xIfyWp9oqzM",
      },
      {
       id: "VohfkDaJeZi",
      },
     ],
     id: "FROM UID API", // klwVscyJr2b
     periodType: "mype",
     publicAccess: "stringst",
     renderAsTabs: true,
     renderHorizontally: true,
     sections: [{}],
     shortName: "string",
     skipOffline: true,
     style: {},
     timelyDays: 0,
     translations: [{}],
     user: {
      id: "NJnhOzjaLYk.qNCMOhkoQju",
     },
     userAccesses: [{}],
     userGroupAccesses: [{}],
     validCompleteOnly: true,
     version: 22,
     workflow: {
      id: "NJnhOzjaLYk.qNCMOhkoQju",
     },
    },
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
 fs.writeFileSync("../dhis-mapping-with-updated-ids.csv", csv_new.trim());
})();
