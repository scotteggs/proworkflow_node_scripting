var csv = require('csv-parser');
var fastcsv = require('fast-csv');
var fs = require('fs');

var stream = csv({
	separator: '|'
})

var output = [];
var currentProject;
var currentProjectStatus;
var count = 0;

fs.createReadStream('./csvInput/pfwtasks.csv')
  .pipe(stream)
  .on('data', function(data) {
  	if(data['ROW TYPE'] === 'PROJECT') {
  		currentProject = data['JOBID'];
      currentProjectStatus = data['CATEGORY'];
  	} 
 	  else if(data['ROW TYPE'] === 'TASK' && data['TASKORDER'] === 'Active') {
      data['TASKDESCRIPTION'] = data['TASKTIMESPENT'];
      data['TASKTIMESPENT'] = data['TASKTIMEALLOCATED'];
      data['TASKTIMEALLOCATED'] = data['TASKDATECOMP'];
      data['TASKDATECOMP'] = data['TASKDATEDUE'];
      data['TASKDATEDUE'] = data['TASKDATESTART'];
      data['TASKDATESTART'] = data['TASKASSIGNEDTO'];
      data['TASKASSIGNEDTO'] = data['TASKCREATEDBY'];
      data['TASKCREATEDBY'] = data['TASKTITLE'];
      data['TASKTITLE'] = data['TASKPRIORITY'];
      data['TASKPRIORITY'] = data['TASKSTATUS'];
      data['TASKSTATUS'] = data['TASKORDER'];
      data['TASKORDER'] = data['CATEGORY'];
      data.PROJECT = currentProject;
      data.TASKID = data['PROJECT'] + " - " + data['TASKTITLE'] + " - " + data["TASKORDER"];
      delete data[''];
      delete data['JOBID'];
      delete data['CATEGORY']
      delete data['PROJECT CATEGORY'];
      delete data['JOBNUMBER'];
      output.push(data);
      count += 1;
 	  } 
  })
  .on('end', function () {
    console.log(output[1]);
    console.log(output[2]);
    console.log(output[3]);
    console.log(output[33]);
    console.log("Number of Records: " + count);
  	var outputStream = fastcsv.createWriteStream({headers: true}),
  		writableStream = fs.createWriteStream("./csvOutput/taskOutput.csv");

  	outputStream.pipe(writableStream);
    for (var row in output) {
      outputStream.write(output[row]);
    }
  })





