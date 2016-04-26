var csv = require('csv-parser');
var fastcsv = require('fast-csv');
var fs = require('fs');

var stream = csv({
	separator: '|'
})


var output = [];
var newObj = {};
var jobID;
var jobNumber;
var jobTitle;
var jobStatus;
var jobPhase;
var count = 0;

fs.createReadStream('./csvInput/pwftasks.csv')
  .pipe(stream)
  .on('data', function(data) {
    jobPhase = 'None';
  	newObj = {};
    if(data['ROW TYPE'] === 'PROJECT') {
  		jobID = data['JOBID'];
      jobNumber = data['JOBNUMBER']
      jobTitle = data['JOBTITLE']
      jobStatus = data['JOBCOMPLETE'];
  	} 
    else if(data['ROW TYPE'] == 'TASK' && data['TASKSTATUS'] == 1) {
      jobPhase = data['TASKPRIORITY']
    }
 	  else if(data['ROW TYPE'] === 'TASK' && data['TASKSTATUS'] != 1) {
      //create new object with properties from each entry
      //first entry is unique id in form: "175 | YAM15014 | Yale Calendar Server | 2 | Discovery | Research"
      newObj['KEY'] = jobID+" | "+jobNumber+" | "+jobTitle+" | "+data['JOBCOMPLETE']+" | "+jobPhase+" | "+data['TASKPRIORITY']
      newObj['JOBSTATUS'] = jobStatus
      newObj['JOBID'] = jobID
      newObj['JOBTITLE'] = jobTitle
      newObj['JOBPHASE'] = jobPhase
      newObj['TASKORDER'] = data['JOBCOMPLETE']
      newObj['TASKSTATUS'] = data['TASKORDER']
      newObj['TASKPRIORITY'] = data['TASKSTATUS']
      newObj['TASKTITLE'] = data['TASKPRIORITY']
      output.push(newObj);
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
  		writableStream = fs.createWriteStream("../../Google Drive/Adoptive Budget System/Budget System Data/taskOutput.csv");
  	outputStream.pipe(writableStream);
    for (var row in output) {
      outputStream.write(output[row]);
    }
  })





