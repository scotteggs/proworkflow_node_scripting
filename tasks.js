"use strict";

var fs = require('fs');
var csv = require('csv-parser');
var fastcsv = require('fast-csv');
//read file into memory for quote removal
fs.readFile('./csvInput/pwftasks.csv', 'utf8', function (err,data) {
  if (err) return console.log(err);
  //remove all double quotes from file
  var result = data.replace(/"/g, '');
  //save new version of file
  fs.writeFile('./csvInput/pwftasks_noQuotes.csv', result, 'utf8', function (err, data) {
    if (err) return console.log(err);

    var stream = csv({
    	separator: '|'
    });
    var output = [];
    var newObj = {};
    var jobID;
    var jobNumber;
    var jobTitle;
    var jobStatus;
    var jobPhase;
    var count = 0;

    fs.createReadStream('./csvInput/pwftasks_noQuotes.csv')
      .pipe(stream)
      .on('data', function(data) {
        
        newObj = {};
        if(data['ROW TYPE'] === 'PROJECT') {
          jobID = data['JOBID'];
          jobNumber = data['JOBNUMBER']
          jobTitle = data['JOBTITLE'].trim();
          jobStatus = data['JOBCOMPLETE'];
          jobPhase = 'None';
        } 
        else if(data['ROW TYPE'] == 'TASK' && data['TASKSTATUS'] == 5) {
          jobPhase = data['TASKPRIORITY'].trim()
        }
        else if(data['ROW TYPE'] === 'TASK' && data['TASKSTATUS'] != 5) {
          //create new object with properties from each entry
          //first entry is unique id in form: "175 | YAM15014 | Yale Calendar Server | 2 | Discovery | Research"
          newObj['KEY'] = jobID+" | "+jobNumber+" | "+jobTitle+" | "+data['JOBCOMPLETE']+" | "+jobPhase+" | "+data['TASKPRIORITY'];
          newObj['JOBSTATUS'] = jobStatus;
          newObj['JOBID'] = jobID;
          newObj['JOBTITLE'] = "'" + jobTitle;
          newObj['JOBPHASE'] = jobPhase;
          newObj['TASKORDER'] = data['JOBCOMPLETE'];
          newObj['TASKSTATUS'] = data['TASKORDER'];
          newObj['TASKPRIORITY'] = data['TASKSTATUS'];
          newObj['TASKTITLE'] = "'" + data['TASKPRIORITY'].trim();
          output.push(newObj);
          count += 1;
        }
      })
      .on('end', function () {
        console.log(output[1]);
        console.log(output[234]);
        console.log(output[235]);
        console.log(output[236]);
        console.log("Number of Records: " + count);
        var outputStream = fastcsv.createWriteStream({headers: true}),
          writableStream = fs.createWriteStream("../../Google Drive/Adoptive Budget System/Budget System Data/taskOutput.csv");
        outputStream.pipe(writableStream);
        for (var row in output) {
          outputStream.write(output[row]);
        }
      })
      fs.unlink('./csvInput/pwftasks_noQuotes.csv');


  })
});