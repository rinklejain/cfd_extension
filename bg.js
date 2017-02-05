function get_contests(){
var xmlhttp = new XMLHttpRequest();
var upcoming_count = 0;
var ongoing_count = 0;
var upcoming_contests = {items: []};
var ongoing_contests = {items: []};
console.log("rinkle ka infinite swag");
xmlhttp.onreadystatechange = function() {
  console.dir(this);
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("aa").innerHTML = contest_list[];
      var contest_list = JSON.parse(this.responseText);	
      document.getElementById("aa").innerHTML = contest_list[0].id
	    console.log(contest_list[0]);
	for(var i=0; i<contest_list.length; i++)
	{
	  var output= check_status(contest_list[i].startTimeSeconds, contest_list[i].startTimeSeconds+contest_list[i].durationSeconds);
	  if(output == 1){
	    ongoing_contests.items.push({"id": contest_list[i].id,
                                         "name": contest_list[i].name, 
                                         "st": contest_list[i].startTimeSeconds, 
                                         "du": contest_list[i].durationSeconds, 
                                         "url": "http://codeforces.com/contest/"+contest_list[i].id
                                       });
	  }
    if(output == 2){
      upcoming_contests.items.push({"id": contest_list[i].id,
                                         "name": contest_list[i].name, 
                                         "st": contest_list[i].startTimeSeconds, 
                                         "du": contest_list[i].durationSeconds, 
                                         "url": "http://codeforces.com/contest/"+contest_list[i].id
                                       });
    }
	}
        console.log(upcoming_contests[0].id);
  }
};
xmlhttp.open("GET", "http://codeforces.com/api/contest.list", true);
xmlhttp.send();

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

get_contests();
//setInterval(get_contests(),1800000);

