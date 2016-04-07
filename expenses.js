"use strict";

var fs = require('fs');

fs.readFile("./csvInput/expenses_download.csv", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  data = data.replace(/,Amount/g, ',Amount,Amount2');
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
			  var newObj = {};
				if (data['Date'] == '') {
					positionStart = data['Account'].indexOf(':');
					positionEnd = data['Account'].indexOf(' ',positionStart);
					data['Project'] = data['Account'].slice(positionStart+1,positionEnd);
					//create unique identifier from project number and invoice number ('Name')
					newObj['Key'] = data['Project'] + " | " + data['Name'];
					//create remaining fields
					newObj['Project'] = data['Project'];
					newObj['Invoice'] = data['Name'];
					newObj['Vendor'] = data['Memo/Description'];
					newObj['Amount'] = parseFloat(data['Amount2'].replace(',',''));
					newObj['Client'] = data['Account'];
					newObj['Memo'] = data['Amount'];
					output.push(newObj);
					count ++;
				}
		  })

		  .on('end', function () {
		  	console.log("count is ", count)
		    var outputStream = fastcsv.createWriteStream({headers: true});
		    var writableStream = fs.createWriteStream("./csvOutput/expensesOutput.csv");
		    outputStream.pipe(writableStream);
		    for (var row in output) {
		      outputStream.write(output[row]);
		    }
		  })
		})
})