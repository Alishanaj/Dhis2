'use strict';

require('dotenv').config();
let mysql = require("mysql2/promise");
const papaparse = require("papaparse");
const got = require("got");

const client = got.extend({
 prefixUrl: process.env["PREFIX_URL"],
 username: process.env["API_USERNAME"],
 password: process.env["API_PASSWORD"],
 responseType: "json",
 resolveBodyOnly: true,
});

let con = mysql.createPool({
 host: process.env["DB_HOST"],
 user:  process.env["DB_USER"],
 password:  process.env["DB_PASSWORD"],
 database:  process.env["DB_DATABASE"],
});

(async () => {
 let [result, _r] = await con.query(`SELECT * FROM l01_countries 
        WHERE disabled = 0 AND JSON_EXtRACT(metadata, "$.dhis_id") IS NULL`);
 for (let i in result) {
  console.log(result[i]);
  try {
   let resp = await client.post({
    url: "29/organisationUnits",
    method: "post",
    json: {
     name: JSON.parse(result[i]["name"])["en"],
     openingDate: "1947-01-01T00:00:00.000",
     shortName: JSON.parse(result[i]["name"])["en"],
     displayName: JSON.parse(result[i]["name"])["en"],
     address: "",
     aggregationType: "AVERAGE",
     attributeValues: [],
     closedDate: "",
     code: result[i]["uid"],
     comment: "",
     created: "2017-08-18T16:27:10.247",
     description: JSON.parse(result[i]["name"])["en"],
     dimensionItem: "",
     dimensionItemType: "ORGANISATION_UNIT",
     displayDescription: "",
     displayShortName: JSON.parse(result[i]["name"])["en"],
     leaf: true,
     level: 2,
     parent: {
      id: "S3FgphKZ9WY",
     },
    },
   });

   let dhis_id = resp["response"]["uid"];
   await con.query(
    `update l01_countries set metadata = JSON_SET(metadata, "$.dhis_id", ?) where id = ?`,
    [dhis_id, result[i]["id"]]
   );
   console.log(`Created ${result[i]["name"]}`);
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

 let [data, _n] = await con.query(` SELECT  a0.id, 
    JSON_UNQUOtE(JSON_EXTRACT(a1.metadata, "$.dhis_id")) 
    as dhis_id, a0.name
    FROM l02_provinces as a0
    INNER JOIN l01_countries as a1 
    ON a1.id=a0.country_id
    WHERE a0.disabled = 0 AND a1.disabled = 0 AND JSON_EXtRACT(a0.metadata, "$.dhis_id") IS NULL
    `);

 for (let j in data) {
  console.log(result[j]);
  try {
   let resp = await client.post({
    url: "29/organisationUnits",
    method: "post",
    json: {
     name: JSON.parse(data[j]["name"])["en"],
     openingDate: "1947-01-01T00:00:00.000",
     shortName: JSON.parse(data[j]["name"])["en"],
     displayName: JSON.parse(data[j]["name"])["en"],
     address: "",
     aggregationType: "AVERAGE",
     attributeValues: [],
     closedDate: "",
     code: data[j]["uid"],
     comment: "",
     created: "2017-08-18T16:27:10.247",
     description: JSON.parse(data[j]["name"])["en"],
     dimensionItem: "",
     dimensionItemType: "ORGANISATION_UNIT",
     displayDescription: "",
     displayShortName: JSON.parse(data[j]["name"])["en"],
     leaf: true,
     level: 2,
     parent: {
      id: data[j]["dhis_id"],
     },
    },
   });

   let dhis_id = resp["response"]["uid"];
   await con.query(
    `update l02_provinces set metadata = JSON_SET(metadata, "$.dhis_id", ?) where id = ?`,
    [dhis_id, data[j]["id"]]
   );
   console.log(`Created ${data[j]["name"]}`);
  } catch (e) {
   if (e instanceof got.HTTPError) {
    if (e.response.statusCode == "409") {
     console.log(`Error with ${data[j]["name"]}`);
    }
   } else {
    console.error(e);
   }
  }
 }

 let [result_3, _m] = await con.query(` SELECT  a0.id, 
    JSON_UNQUOtE(JSON_EXTRACT(a1.metadata, "$.dhis_id")) 
    as dhis_id, a0.name
    FROM l03_districts as a0
    INNER JOIN l02_provinces as a1    
    ON a0.province_id=a1.id
    WHERE a1.disabled = 0 AND a0.disabled = 0 AND a0.country_id IN 
    (SELECt id FROM l01_countries WHERE disabled = 0) AND JSON_EXtRACT(a0.metadata, "$.dhis_id") IS NULL
    `);

 for (let k in result_3) {
  console.log(result[k]);
  try {
   let resp = await client.post({
    url: "29/organisationUnits",
    method: "post",
    json: {
     name: JSON.parse(result_3[k]["name"])["en"],
     openingDate: "1947-01-01T00:00:00.000",
     shortName: JSON.parse(result_3[k]["name"])["en"],
     displayName: JSON.parse(result_3[k]["name"])["en"],
     address: "",
     aggregationType: "AVERAGE",
     attributeValues: [],
     closedDate: "",
     code: result_3[k]["uid"],
     comment: "",
     created: "2017-08-18T16:27:10.247",
     description: JSON.parse(result_3[k]["name"])["en"],
     dimensionItem: "",
     dimensionItemType: "ORGANISATION_UNIT",
     displayDescription: "",
     displayShortName: JSON.parse(result_3[k]["name"])["en"],
     leaf: true,
     level: 2,
     parent: {
      id: result_3[k]["dhis_id"],
     },
    },
   });

   let dhis_id = resp["response"]["uid"];

   await con.query(
    `update l03_districts set metadata = JSON_SET(metadata, "$.dhis_id", ?) where id = ?`,
    [dhis_id, result_3[k]["id"]]
   );
   console.log(`Created ${result_3[k]["name"]}`);
  } catch (e) {
   if (e instanceof got.HTTPError) {
    if (e.response.statusCode == "409") {
     console.log(`Error with ${result_3[k]["name"]}`);
    }
   } else {
    console.error(e);
   }
  }
 }

 let [result_4, _s] = await con.query(`SELECT  a0.id, 
    JSON_UNQUOtE(JSON_EXTRACT(a1.metadata, "$.dhis_id")) 
    as dhis_id, a0.name
    FROM l04_tehsils as a0
    INNER JOIN l03_districts as a1    
    ON a0.district_id=a1.id
    WHERE a1.disabled = 0 AND a0.disabled = 0 AND a0.province_id IN 
    (SELECt id FROM l02_provinces WHERE disabled = 0) AND a0.country_id IN 
    (SELECt id FROM l01_countries WHERE disabled = 0)  AND JSON_EXtRACT(a0.metadata, "$.dhis_id") IS NULL
    `);

 for (let h in result_4) {
  console.log(result[h]);
  try {
   let resp = await client.post({
    url: "29/organisationUnits",
    method: "post",
    json: {
     name: JSON.parse(result_4[h]["name"])["en"],
     openingDate: "1947-01-01T00:00:00.000",
     shortName: JSON.parse(result_4[h]["name"])["en"],
     displayName: JSON.parse(result_4[h]["name"])["en"],
     address: "",
     aggregationType: "AVERAGE",
     attributeValues: [],
     closedDate: "",
     code: result_4[h]["uid"],
     comment: "",
     created: "2017-08-18T16:27:10.247",
     description: JSON.parse(result_4[h]["name"])["en"],
     dimensionItem: "",
     dimensionItemType: "ORGANISATION_UNIT",
     displayDescription: "",
     displayShortName: JSON.parse(result_4[h]["name"])["en"],
     leaf: true,
     level: 2,
     parent: {
      id: result_4[h]["dhis_id"],
     },
    },
   });

   let dhis_id = resp["response"]["uid"];
   await con.query(
    `update l04_tehsils set metadata = JSON_SET(metadata, "$.dhis_id", ?) where id = ?`,
    [dhis_id, result_4[h]["id"]]
   );
   console.log(`Created ${result_4[h]["name"]}`);
  } catch (e) {
   if (e instanceof got.HTTPError) {
    if (e.response.statusCode == "409") {
     console.log(`Error with ${result_4[h]["name"]}`);
    }
   } else {
    console.error(e);
   }
  }
 }

 let [result_5, _w] = await con.query(`SELECT  a0.id, 
    JSON_UNQUOtE(JSON_EXTRACT(a1.metadata, "$.dhis_id")) 
    as dhis_id, a0.name
    FROM l05_ucs as a0
    INNER JOIN l04_tehsils as a1    
    ON a0.tehsil_id=a1.id
    WHERE a1.disabled = 0 AND a0.disabled = 0 AND a0.province_id IN 
    (SELECt id FROM l02_provinces WHERE disabled = 0) AND a0.country_id IN 
    (SELECt id FROM l01_countries WHERE disabled = 0) AND  a0.district_id IN 
    (SELECt id FROM l03_districts WHERE disabled = 0)
    AND JSON_EXtRACT(a0.metadata, "$.dhis_id") IS NULL`);

 for (let n in result_5) {
  console.log(result[n]);
  try {
   let resp = await client.post({
    url: "29/organisationUnits",
    method: "post",
    json: {
     name: JSON.parse(result_5[n]["name"])["en"],
     openingDate: "1947-01-01T00:00:00.000",
     shortName: JSON.parse(result_5[n]["name"])["en"],
     displayName: JSON.parse(result_5[n]["name"])["en"],
     address: "",
     aggregationType: "AVERAGE",
     attributeValues: [],
     closedDate: "",
     code: result_5[n]["uid"],
     comment: "",
     created: "2017-08-18T16:27:10.247",
     description: JSON.parse(result_5[n]["name"])["en"],
     dimensionItem: "",
     dimensionItemType: "ORGANISATION_UNIT",
     displayDescription: "",
     displayShortName: JSON.parse(result_5[n]["name"])["en"],
     leaf: true,
     level: 2,
     parent: {
      id: result_5[n]["dhis_id"],
     },
    },
   });

   let dhis_id = resp["response"]["uid"];
   await con.query(
    `update l05_ucs set metadata = JSON_SET(metadata, "$.dhis_id", ?) where id = ?`,
    [dhis_id, result_5[n]["id"]]
   );
   console.log(`Created ${result_5[n]["name"]}`);
  } catch (e) {
   if (e instanceof got.HTTPError) {
    if (e.response.statusCode == "409") {
     console.log(`Error with ${result_5[n]["name"]}`);
    }
   } else {
    console.error(e);
   }
  }
 }

 let [result_6, _y] = await con.query(`SELECT  a0.id, 
   JSON_UNQUOtE(JSON_EXTRACT(a1.metadata, "$.dhis_id")) 
   as dhis_id, a0.name
   FROM l06_facilities as a0
   INNER JOIN l05_ucs as a1    
   ON a0.uc_id=a1.id
   WHERE a1.disabled = 0 AND a0.disabled = 0 AND a0.province_id IN 
   (SELECt id FROM l02_provinces WHERE disabled = 0) AND a0.country_id IN 
   (SELECt id FROM l01_countries WHERE disabled = 0) AND  a0.district_id IN 
   (SELECt id FROM l03_districts WHERE disabled = 0) AND  a0.tehsil_id IN 
   (SELECt id FROM l04_tehsils WHERE disabled = 0)
   AND JSON_EXtRACT(a0.metadata, "$.dhis_id") IS NULL`);

 for (let b in result_6) {
  try {
   let resp = await client.post({
    url: "29/organisationUnits",
    method: "post",
    json: {
     name: JSON.parse(result_6[b]["name"])["en"],
     openingDate: "1947-01-01T00:00:00.000",
     shortName: JSON.parse(result_6[b]["name"])["en"],
     displayName: JSON.parse(result_6[b]["name"])["en"],
     address: "",
     aggregationType: "AVERAGE",
     attributeValues: [],
     closedDate: "",
     code: result_6[b]["uid"],
     comment: "",
     created: "2017-08-18T16:27:10.247",
     description: JSON.parse(result_6[b]["name"])["en"],
     dimensionItem: "",
     dimensionItemType: "ORGANISATION_UNIT",
     displayDescription: "",
     displayShortName: JSON.parse(result_6[b]["name"])["en"],
     leaf: true,
     level: 2,
     parent: {
      id: result_6[b]["dhis_id"],
     },
    },
   });

   let dhis_id = resp["response"]["uid"];
   await con.query(
    `update  l06_facilities set metadata = JSON_SET(metadata, "$.dhis_id", ?) where id = ?`,
    [dhis_id, result_6[b]["id"]]
   );
   console.log(`Created ${result_6[b]["name"]}`);
  } catch (e) {
   if (e instanceof got.HTTPError) {
    if (e.response.statusCode == "409") {
     console.log(`Error with ${result_6[b]["name"]}`);
    }
   } else {
    console.error(e);
   }
  }
 }

 let [result_7, _x] = await con.query(`SELECT  a0.id, 
   JSON_UNQUOtE(JSON_EXTRACT(a1.metadata, "$.dhis_id")) 
   as dhis_id, a0.name
   FROM l06_villages as a0
   INNER JOIN l05_ucs as a1    
   ON a0.uc_id=a1.id
   WHERE a1.disabled = 0 AND a0.disabled = 0 AND a0.province_id IN 
   (SELECt id FROM l02_provinces WHERE disabled = 0) AND a0.country_id IN 
   (SELECt id FROM l01_countries WHERE disabled = 0) AND  a0.district_id IN 
   (SELECt id FROM l03_districts WHERE disabled = 0) AND  a0.tehsil_id IN 
   (SELECt id FROM l04_tehsils WHERE disabled = 0)
   AND JSON_EXtRACT(a0.metadata, "$.dhis_id") IS NULL`);

 for (let c in result_7) {
  try {
   let resp = await client.post({
    url: "29/organisationUnits",
    method: "post",
    json: {
     name: JSON.parse(result_7[c]["name"])["en"],
     openingDate: "1947-01-01T00:00:00.000",
     shortName: JSON.parse(result_7[c]["name"])["en"],
     displayName: JSON.parse(result_7[c]["name"])["en"],
     address: "",
     aggregationType: "AVERAGE",
     attributeValues: [],
     closedDate: "",
     code: result_7[c]["uid"],
     comment: "",
     created: "2017-08-18T16:27:10.247",
     description: JSON.parse(result_7[c]["name"])["en"],
     dimensionItem: "",
     dimensionItemType: "ORGANISATION_UNIT",
     displayDescription: "",
     displayShortName: JSON.parse(result_7[c]["name"])["en"],
     leaf: true,
     level: 2,
     parent: {
      id: result_7[c]["dhis_id"], //uc id
     },
    },
   });

   let dhis_id = resp["response"]["uid"];
   await con.query(
    `update  l06_villages   set metadata = JSON_SET(metadata, "$.dhis_id", ?) where id = ?`,
    [dhis_id, result_7[c]["id"]]
   );
   console.log(`Created ${result_7[c]["name"]}`);
  } catch (e) {
   if (e instanceof got.HTTPError) {
    if (e.response.statusCode == "409") {
     console.log(`Error with ${result_7[c]["name"]}`);
    }
   } else {
    console.error(e);
   }
  }
 }
 require('./dep_data_element.js')
}  )();
