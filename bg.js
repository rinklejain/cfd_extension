function get_contests(){
  var xmlhttp = new XMLHttpRequest();
  var upcoming_count = 0;
  var ongoing_count = 0;
  var upcoming_contests = {items: []};
  var ongoing_contests = {items: []};
  //console.log("rinkle ka infinite swag");
  xmlhttp.onreadystatechange = function() {
  //console.dir(this);
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("aa").innerHTML = contest_list.result[];
      var contest_list = JSON.parse(this.responseText);	    
      var x = new Date();
      var offset = x.getTimezoneOffset();
      var count = 0;
      var localStorageData = localStorage.getItem("FetchedContestURLs");
      if((localStorageData === null) || (localStorageData.length === 0))
        { localStorageData = "{}";}
      var prevFetchContestURLs = JSON.parse(localStorageData);
      //console.log(offset);
      //console.dir(contest_list.result);
      //document.getElementById("aa").innerHTML= contest_list.result[0].id;
	    //console.log(contest_list.result.length);
	for(var i=0; i<contest_list.result.length; i++)
	{
	  var start_time = contest_list.result[i].startTimeSeconds * 1000;
    var end_time = Date.now() - contest_list.result[i].relativeTimeSeconds*1000;
    var output = check_status(start_time,end_time);
        //console.log(i+"+"+output);
	  if(output == 1){
	    ongoing_contests.items.push({"id": contest_list.result[i].id,
                                         "name": contest_list.result[i].name, 
                                         "st": contest_list.result[i].startTimeSeconds-offset*60000, 
                                         "du": contest_list.result[i].durationSeconds,, 
                                         "url": "http://codeforces.com/contests/"+contest_list.result[i].id
                                       });
      console.log("http://codeforces.com/contest/"+contest_list.result[i].id);
      console.log("aaaaaaa");
	  }
    if(output == 2){
      upcoming_contests.items.push({"id": contest_list.result[i].id,
                                         "name": contest_list.result[i].name, 
                                         "st": contest_list.result[i].startTimeSeconds-offset*60000, 
                                         "du": contest_list.result[i].durationSeconds, 
                                         "url": "http://codeforces.com/contests/"+contest_list.result[i].id
                                       });
    }
    if("http://codeforces.com/contest/"+contest_list.result[i].id in prevFetchContestURLs)
      {continue;}
    count++;

	}
        if(count>0){ 
          chrome.browserAction.setBadgeText({text:count.toString()});
          chrome.browserAction.setBadgeBackgroundColor({ color: "#4c9bff"});
    }
        //console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        //console.dir(upcoming_contests);
  }
};
xmlhttp.open("GET", "http://codeforces.com/api/contest.list", true);
xmlhttp.send();
return [ongoing_contests , upcoming_contests];
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

//get_contests();
setInterval(get_contests(),1800000);