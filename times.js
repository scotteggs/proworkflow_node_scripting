"use strict";
var fs = require('fs');

fs.readFile("./csvInput/pfwtimes.csv", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/"/g, '');
  fs.writeFile("./csvInput/pfwtimes_noQuotes.csv", result, 'utf8', function (err,data) {
    if (err) return console.log(err);
    var csv = require('csv-parser');
		var fastcsv = require('fast-csv');
		var fs = require('fs');
		var moment = require('moment');

		var stream = csv({
		  separator: '|'
		})

		var output = [];
		var currentJobID;
		var currentJobName;
		var currentJobTitle;
		var currentTaskPhase;
		var currentTaskTitle;
		var currentTaskOrder;
		var currentProjectActive;
		var count = 0;


		fs.createReadStream('./csvInput/pfwtimes_noQuotes.csv')
		  .pipe(stream)
		  .on('data', function(data) {
		    if(data['ROW TYPE'] === 'PROJECT') {
		    	currentTaskPhase = "None";
		      currentJobID = data['JOBID'];
		      currentJobName = data['JOBNUMBER'];
		      currentJobTitle = data['JOBTITLE'];
		      currentProjectActive = data['JOBCOMPLETE'];

		    } else if (data['ROW TYPE'] === 'TASK'){
		    	if(data['TASKASSIGNEDTO'] === "5") {
		    		currentTaskPhase = data['JOBTITLE'];
		    	} else {
		    		currentTaskTitle = data['JOBTITLE'];
		      	currentTaskOrder = data['TASKTITLE'];
		    	}

		    } else if (data['ROW TYPE'] === 'TIME RECORD' && (currentProjectActive == 'Active' || currentProject == '128')){
		      data['TRACKERNOTES'] = data['TRACKERTIMESPENT'];
		      data['TRACKERTIMESPENT'] = data['TRACKERSTARTED'];
		      data['TRACKERSTARTED'] = data['TRACKERSTOPPED'];
		      data['TRACKERSTOPPED'] = data['TRACKERDATE'];
		      data['TRACKERDATE'] = data['TRACKERUSER'];
		      data['TRACKERUSER'] = data['TASKPRIORITY'];
		      data.JOB_ID = currentJobID;
		      data.JOB_NAME = currentJobName;
		      data.JOB_TITLE = currentJobTitle;
		      data.TASK_PHASE = currentTaskPhase;
		      data.TASK_ORDER = currentTaskOrder;
		      data.TASK_TITLE = currentTaskTitle;
		      data.TASKID = data['JOB_ID'] + " | " + data['JOB_NAME'] + " | " + data['JOB_TITLE'] + " | " + data['TASK_ORDER'] + " | " + data['TASK_PHASE'] + " | " + data['TASK_TITLE'];
		      delete data['PROJECT CATEGORY'];
		      delete data['JOBNUMBER'];
		      delete data['JOBID'];
		      delete data['JOBCOMPLETE'];
		      delete data[''];
		      delete data['ACTIVE  COMPLETED'];
		      delete data['TASKORDER'];
		      delete data['TASKTITLE'];
		      delete data['ROW TYPE'];
		      //actions for adding time duration field
		      data.DURATION = moment.duration(data['TRACKERTIMESPENT']).asHours();
		      output.push(data);
		      count += 1;
		      output.push(data);
		    }
		    // output.push(data);



		  })
		  .on('end', function () {
		  	for (let i = 5000; i < 5500; i++) {
		  			console.log(output[i]);
		  	}
		  	console.log(output[output.length-1]);
		    console.log("Number of Records: " + count);
		    var outputStream = fastcsv.createWriteStream({headers: true}),
		      writableStream = fs.createWriteStream("./csvOutput/timesOutput.csv");

		    outputStream.pipe(writableStream);
		    for (var row in output) {
		      outputStream.write(output[row]);
		    }
		  })
  });
});



