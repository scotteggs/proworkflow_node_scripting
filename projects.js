 var csv = require('csv-parser');
var fastcsv = require('fast-csv');
var fs = require('fs');

var stream = csv({
	separator: '|'
})

var output = [];
var currentProject;
var count = 0;

fs.createReadStream('./csvInput/pwfprojects.csv')
  .pipe(stream)
  .on('data', function(data) {
  	if(data['ROW TYPE'] === 'PROJECT') {
      delete data['PROJECT FILTER'];
      delete data['JOBDATESTART'];
      delete data['JOBDATEDUE'];
      delete data['JOBDATECOMP'];
      delete data['QUOTEDAMOUNT'];
      delete data['INVOICEDAMOUNT'];
      delete data['EXPENSESAMOUNT'];
      delete data['TIMEALLOCATED'];
      delete data['PROJECTTASKALLOCATEDTIME'];
      delete data['INVOICED'];
      delete data['PAID'];
      delete data['ACCFOR'];
      delete data['CONTRACTORS'];
      delete data['JOBDESCRIPTION'];
      delete data['JOBNOTES'];
      delete data['JOBPRIORITY'];
      delete data['JOBCOMPLETE'];
      delete data[''];
      output.push(data);
      count += 1;
  	} 
  })
  .on('end', function () {
    console.log(output[10]);
    console.log("Number of Records: " + count);
  	var outputStream = fastcsv.createWriteStream({headers: true}),
  		writableStream = fs.createWriteStream("./csvOutput/projectOutput.csv");

  	outputStream.pipe(writableStream);
    for (var row in output) {
      outputStream.write(output[row]);
    }
  })
