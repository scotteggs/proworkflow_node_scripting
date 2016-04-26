"use strict";

var fs = require('fs');

fs.readFile("./csvInput/pwftimes.csv", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/"/g, '');
  fs.writeFile("./csvInput/pwftimes_noQuotes.csv", result, 'utf8', function (err,data) {
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
		var newObject;


		fs.createReadStream('./csvInput/pwftimes_noQuotes.csv')
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
		      data['TASKID'] = data['JOB_ID'] + " | " + data['JOB_NAME'] + " | " + data['JOB_TITLE'] + " | " + data['TASK_ORDER'] + " | " + data['TASK_PHASE'] + " | " + data['TASK_TITLE'];

		      //actions for adding time duration field
		      data.DURATION = moment.duration(data['TRACKERTIMESPENT']).asHours();
		      
		      //creation of newObject to re-order output
		      newObject = {};
		      newObject.KEY = data['TASKID'] + " | " + data['TRACKERUSER'];
		      newObject.USER = data['TRACKERUSER'];
		      newObject.TRANSACTION_DATE = data['TRACKERDATE'];
		      newObject.TIME_SPENT = data['TRACKERTIMESPENT'];
		      newObject.DURATION = data.DURATION;
		      newObject.NOTES = data['TRACKERNOTES'];
		      newObject.JOB_ID = currentJobID;
		      newObject.JOB_NAME = currentJobName;
		      newObject.JOB_TITLE = currentJobTitle;
		      newObject.TASK_PHASE = currentTaskPhase;
		      newObject.TASK_ORDER = currentTaskOrder;
		      newObject.TASK_TITLE = currentTaskTitle;
		      output.push(newObject);
		      count += 1;
		    }
		    // output.push(data);



		  })
		  .on('end', function () {


		    function compare(a,b) {
  				if (a.KEY < b.KEY)
    				return -1;
  			else if (a.KEY > b.KEY)
    			return 1;
  			else 
    			return 0;
				}

				output.sort(compare);

		  	for (let i = 5400; i < 5500; i++) {
		  			console.log(output[i]);
		  	}
		  	console.log(output[output.length-1]);
		    console.log("Number of Records: " + count);

		    var outputStream = fastcsv.createWriteStream({headers: true}),
		      writableStream = fs.createWriteStream("../../Google Drive/Adoptive Budget System/Budget System Data/timesOutput.csv");
		    outputStream.pipe(writableStream);
		    for (var row in output) {
		      outputStream.write(output[row]);
		    }
		  })
  });
});




