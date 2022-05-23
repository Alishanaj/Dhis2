// const got = require('got');

// (async () => {
// 	try {
// 		const response = await got( "http://development.dhis.akdndhrc.org/api/");
// 		console.log(response.body);
// 		//=> '<!doctype html> ...'
// 	} catch (error) {
// 		console.log(error.response.body);
// 		//=> 'Internal server error ...'
// 	}
// })();

// const got = require('got');

// (async () => {
// 	const {body} = await got.post("http://development.dhis.akdndhrc.org/api/", {
// 		json: {

// 			hello: 'world'
// 		},
// 		responseType: 'json'
// 	});

// 	console.log(body.data);
// 	//=> {hello: 'world'}
// })();

const stream = require('stream');
const {promisify} = require('util');
const fs = require('fs');
const got = require('got');

const pipeline = promisify(stream.pipeline);

(async () => {
	await pipeline(
		got.stream("http://development.dhis.akdndhrc.org/api/"),
		fs.createWriteStream('DHIS Mappings demoo - Sheet1.csv')
	);

	// For POST, PUT, PATCH, and DELETE methods, `got.stream` returns a `stream.Writable`.
	await pipeline(
		fs.createReadStream('DHIS Mappings demoo - Sheet1.csv'),
		got.stream.post("http://development.dhis.akdndhrc.org/api/")
	);
})();