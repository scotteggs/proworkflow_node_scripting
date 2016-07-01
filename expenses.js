"use strict";

var fs = require('fs');
var csv = require('csv-parser');
var fastcsv = require('fast-csv');
var moment = require('moment');

fs.readFile("./csvInput/expenses_download.csv", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  //add additional header to capture Amount data
  data = data.replace(/,Amount/g, ',Amount,Amount2');
  //cut off header from data and save to new file
  var result = data.slice(data.search("Date"));
  fs.writeFile("./csvInput/project_expenses.csv", result, 'utf8', function (err,data) {
  	if (err) return console.log(err);
  	//setup csv stream properties
		var stream = csv({
		  separator: ',',
		  headers: false
		})
		//create blank array to capture output
		var output = [];
		var count = 0; 
		var positionStart;
		var positionEnd;

		fs.createReadStream('./csvInput/project_expenses.csv')
	  .pipe(stream)
	  .on('data', function(data) {
		  var newObj = {};
			if (data['Date'] == '' && data['Client'] != '') {
				positionStart = data['Account'].indexOf(':');
				positionEnd = data['Account'].indexOf(' ',positionStart);
				data['Project'] = data['Account'].slice(positionStart+1,positionEnd);
				//create unique identifier from project number and invoice number ('Name')
				newObj['Key'] = data['Project'] + "_" + data['Name'] + data['Amount'] + data['Client'] + data['Memo/Description'];
				//create remaining fields
				newObj['Project'] = data['Project'];
				newObj['Invoice'] = data['Name'];
				newObj['Date'] = data['Client'];
				newObj['Vendor'] = data['Memo/Description'];
				newObj['Amount'] = parseFloat(data['Amount2'].replace(',',''));
				newObj['Client'] = data['Account'];
				newObj['Memo'] = data['Amount'];
				output.push(newObj);
				count ++;
			}
	  })

	  .on('end', function () {
	  	//print first and last object to console along with count
	  	console.log(output[0])
	  	console.log(output[output.length-1])
	  	console.log("count is ", count)
	  	//create output data stream using fast-csv library
	    var outputStream = fastcsv.createWriteStream({headers: true});
	    //declare path for final output file
	    var writableStream = fs.createWriteStream("../../Google Drive/Adoptive Budget System/Budget System Data/expensesOutput.csv");
	    outputStream.pipe(writableStream);
	    for (var row in output) {
	      outputStream.write(output[row]);
	    }
	  })
	})
})
