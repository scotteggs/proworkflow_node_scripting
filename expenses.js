"use strict";

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

fs.createReadStream('./csvInput/project_expenses.csv')
  .pipe(stream)
  .on('data', function(data) {

	  
	  if (data['Date'] != '') {
	  	delete data['']; 
	  	var positionStart = data['Client'].indexOf(':');
	  	var positionEnd = data['Client'].indexOf(' ',positionStart);
	  	var currentJobName = data['Client'].slice(positionStart+1,positionEnd)
	  	data['Project'] = currentJobName;
	  	data['Vendor Name'] = data.Name;
	  	data['Memo'] = data['Memo/Description'];
	  	delete data['Name'];
	  	delete data['Memo/Description'];
	  	delete data['Account'];
	  	if(data['Project'] != '') {
		  	console.log(data);
		  	output.push(data);
	  		count ++;
	  	}
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




