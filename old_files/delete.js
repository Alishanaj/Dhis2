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

const data = fs.readFileSync("./dhis-mapping-wih-ids.csv").toString("utf8").trim();
let csv = papaparse.parse(data, { header: true })["data"];

(async () => {
    // Promise.all
    let ids = await client.get("dataElements", {});

    // console.log(ids["dataElements"]);
    // for (const data in  ids["dataElements"]) {
    //      const searchparams=new URLSearchParams([['id',data["id"]]])
    //     data["id"]
    //     let x = await client.delete(`dataElements`,{searchparams:{'id':data["id"]}});
    //         console.log(x);
    //         // console.log(ids["id"]);
    // };
    for(let id of ids["dataElements"]){
        try{
            console.log(id);
            let path = "29/dataElements/" + id["id"];
            let x = await client.delete(path);
            console.log(x); 
        } catch(e) {
            console.log(e.response.body); continue;
        }
    }
    console.log("deleted all data elements");
    // // console.log(x);
    // // console.log(error.responseType)
    // }


})();


