const papaparse = require("papaparse");
const got = require("got");
const fs = require("fs");
const { URLSearchParams } = require("url");

const client = got.extend({
    prefixUrl: "http://development.dhis.akdndhrc.org/api/",
    username: "admin",
    password: "district",
    responseType: 'json',
    resolveBodyOnly: true,
});

// // fs.dir



(async () => {
    // Promise.all
    let ids = await client.get("organisationUnits", {});
    for(let id of ids["organisationUnits"]){
        try{
            console.log(id);
            let path = "29/organisationUnits/" + id["id"];
            let x = await client.delete(path);
            console.log(x); 
        } catch(e) {
            console.log(e.response.body); continue;
        }
    }
    console.log("deleted all organisation units");

})();


