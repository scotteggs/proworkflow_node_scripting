var csv = require('csv-parser');
var fastcsv = require('fast-csv');
var fs = require('fs');
var moment = require('moment');

var stream = csv({
  separator: '|'
})

var output = [];
var currentProject;
var currentTask;
var currentTaskOrder;
var currentProjectActive;
var count = 0;


fs.createReadStream('./csvInput/pfwtimes.csv')
  .pipe(stream)
  .on('data', function(data) {
    if(data['ROW TYPE'] === 'PROJECT') {
      currentProject = data['JOBID'];
      currentProjectActive = data['JOBCOMPLETE'];
    } else if (data['ROW TYPE'] === 'TASK'){
      currentTask = data['JOBCOMPLETE'];
      currentTaskOrder = data['TASKTITLE']
    } else if (data['ROW TYPE'] === 'TIME RECORD' && currentProjectActive === 'Active'){
      data['TRACKERNOTES'] = data['TRACKERTIMESPENT'];
      data['TRACKERTIMESPENT'] = data['TRACKERSTARTED'];
      data['TRACKERSTARTED'] = data['TRACKERSTOPPED'];
      data['TRACKERSTOPPED'] = data['TRACKERDATE'];
      data['TRACKERDATE'] = data['TRACKERUSER'];
      data['TRACKERUSER'] = data['TASKORDER'];
      data['TASKTITLE'] = currentTask;
      data['TASKORDER'] = currentTaskOrder;
      data.PROJECT = currentProject;
      data.TASKID = data['PROJECT'] + " - " + data['TASKTITLE'] + " - " + data['TASKORDER'];
      delete data['PROJECT CATEGORY'];
      delete data['JOBNUMBER'];
      delete data['JOBID'];
      delete data['JOBCOMPLETE'];
      delete data[''];
      delete data['ACTIVE  COMPLETED'];
      //actions for adding time duration field
      data.DURATION = moment.duration(data['TRACKERTIMESPENT']).asHours();
      output.push(data);
      count += 1;
    }
    // output.push(data);
  })
  .on('end', function () {
    console.log(output[0]);
    console.log(output[1]);
    console.log(output[2]);
    console.log(output[3]);

    
    console.log(output[output.length-1]);
    console.log("Number of Records: " + count);
    var outputStream = fastcsv.createWriteStream({headers: true}),
      writableStream = fs.createWriteStream("./csvOutput/timesOutput.csv");

    outputStream.pipe(writableStream);
    for (var row in output) {
      outputStream.write(output[row]);
    }
  })