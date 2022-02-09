console.log("heelo world");

// const csv = require('csv-parser')
// const fs = require('fs')

// const results=[];

// fs.createReadStream('DHIS Mappings demoo - Sheet1.csv')
// .pipe(csv({}))
// .on('data',(data) => results.push(data))
// .on('end',()=>{
//     console.log(results);
// })

const csv = require('csv-parser');
const fs = require('fs');

fs. createReadStream('DHIS Mappings demoo - Sheet1.csv')
. pipe(csv())
. on('data', (row) => {
console. log(row);
})