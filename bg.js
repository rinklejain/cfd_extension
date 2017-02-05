function get_contests(){
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "http://codeforces.com/api/contest.list", true);
xmlhttp.send();
var upcoming_count = 0;
var ongoing_count = 0;
var upcoming_contests = {items: []};
var ongoing_contests = {items: []};
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
	var new_contest_count = 0;
        var contest_list = JSON.parse(this.responseText);	
	var result = contest_list;
	console.log(result[0]);
	for(var i=0; i<result.length; i++)
	{
	  var output= check_status(result[i].startTimeSeconds, result[i].startTimeSeconds+result[i].durationSeconds);
	  if(output == 1){
	    ongoing_contests.items.push({"id": result[i].id,
                                         "name": result[i].name, 
                                         "st": result[i].startTimeSeconds, 
                                         "du": result[i].durationSeconds, 
                                         "url": "http://codeforces.com/contest/"+result[i].id
                                       });
	  }
	}
        console.log(ongoing_contests);
    }
};
}

function check_status(start_time, end_time){
  var current_date = new Date();
  var current_time = current_date.getTime();
  if(current_time > end_time) {
    return 0;
  }
  else if(current_time > start_time && current_time < end_time) {
    return 1;
  }
  else if(current_time < start_time) {
    return 2; 
  }
}

//setInterval(get_contests(),1800000);

