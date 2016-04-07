"use strict";

var fs = require('fs');

fs.readFile("./csvInput/expenses_download.csv", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.slice(data.search("Date"));
  fs.writeFile("./csvInput/project_expenses.csv", result, 'utf8', function (err,data) {
  	if (err) return console.log(err);
  	var csv = require('csv-parser');
		var fastcsv = require('fast-csv');
		var fs = require('fs');
		var moment = require('moment');

		var stream = csv({
		  separator: ',',
		  headers: false

		})

		var output = [];
		var count = 0; 
		var positionStart;
		var positionEnd;

		fs.createReadStream('./csvInput/project_expenses.csv')
		  .pipe(stream)
		  .on('data', function(data) {
			  
				if (data['Date'] == '') {
					positionStart = data['Account'].indexOf(':');
					positionEnd = data['Account'].indexOf(' ',positionStart);
					console.log('start: ', positionStart)
					console.log('end: ', positionEnd)
					
				}
			  
			  // 	var positionEnd = data['Client'].indexOf(' ',positionStart);
			  // 	var currentJobName = data['Client'].slice(positionStart+1,positionEnd);
			  // 	data['Project'] = currentJobName;
			  // 	data['Vendor Name'] = data.Name;
			  // 	data['Memo'] = data['Memo/Description'];
			  // 	delete data['Name'];
			  // 	delete data['Memo/Description'];
			  // 	delete data['Account'];
			  // 	if(data['Project'] != '') {
				 //  	console.log(data);
				  	output.push(data);
			  // 		count ++;
			  // 	}
			  // }
		  })

		  .on('end', function () {
		  	// console.log(output[0]);
		  	// console.log(output[1]);
		  	// console.log(output[2]);
		  	// console.log(output[3]);

		  	// console.log("count is ", count)
		    var outputStream = fastcsv.createWriteStream({headers: true});
		    var writableStream = fs.createWriteStream("./csvOutput/expensesOutput.csv");
		    outputStream.pipe(writableStream);
		    for (var row in output) {
		      outputStream.write(output[row]);
		    }
		  })
		})
})