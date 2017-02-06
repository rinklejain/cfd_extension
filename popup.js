var ongoing_contests , upcoming_contests;

function get_contests(){

  var xmlhttp = new XMLHttpRequest();
  var upcoming_count = 0;
  var ongoing_count = 0;
  var upcoming_contests = {items: []};
  var ongoing_contests = {items: []};
//console.log("rinkle ka infinite swag");
  xmlhttp.onreadystatechange = function() {
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
      //document.getElementById("aa").innerHTML= contest_list.result[0].id;
      //console.log(contest_list.result.length);
      for(var i=0; i<100; i++)
      {
        var start_time = contest_list.result[i].startTimeSeconds * 1000;
        var end_time = Date.now() - contest_list.result[i].relativeTimeSeconds*1000;
        var output = check_status(start_time,end_time);
        //console.log(i+"+"+output);
        if(output == 1){
          ongoing_contests.items.push({"id": contest_list.result[i].id,
            "name": contest_list.result[i].name, 
            "st": contest_list.result[i].startTimeSeconds-offset*60000, 
            "du": contest_list.result[i].durationSeconds, 
            "url": "http://codeforces.com/contest/"+contest_list.result[i].id
          });
        }
        if(output == 2){
          upcoming_contests.items.push({"id": contest_list.result[i].id,
            "name": contest_list.result[i].name, 
            "st": contest_list.result[i].startTimeSeconds-offset*60000, 
            "du": contest_list.result[i].durationSeconds, 
            "url": "http://codeforces.com/ctontest/"+contest_list.result[i].id
          });
        }
    
      }
  }
//console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
console.dir(upcoming_contests);
};


xmlhttp.open("GET", "http://codeforces.com/api/contest.list", true);
xmlhttp.send();
}


function check_status(start_time, end_time){
  var current_time = Date.now();
  //console.log(current_time);
  //console.log(end_time);
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

function putdata()
{ 
  // removes the previous contest entries.
  $("#upcoming").empty();
  $("#ongoing").empty();
  $("hr").remove();

  var FetchedContestURLs = {};
  var notifierTag = true;

  var localStorageData = localStorage.getItem("FetchedContestURLs");
  if((localStorageData === null) || (localStorageData.length === 0)){ localStorageData = "{}";}
  var prevFetchContestURLs = JSON.parse(localStorageData);

  curTime  = new Date();

  $jQuery.each(ongoing_contests.items , function(i,post){ 
    e = new Date((post.st+du)*1000);


    if(e>curTime){
      Time_dif = e-curTime;

      $("#ongoing").append(
        '<a  href="'+post.url+'">'+
        '<li><br><h3>'+post.name+'</h3>'+
        '<h4>End: '+e.toString() +' ( ' + (Time_dif/3600000) + ' hrs ' + ((Time_dif%3600000)/60000) + ' min  )</h4><br>'+
        '</li><hr></a>');
    }
    
  });

  $jQuery.each(upcoming_contests.items , function(i,post){ 
    e = new Date((post.st+du)*1000);

    FetchedContestURLs[post.url] = 1;
    Time_dif = e-curTime;
    console.log(post.url);
    //unreadTag = '<div class="unread">new</div>';

    $("#upcoming").append('<div class="unread-bg">' + '<a  href='+'"'+post.url+'"'+'>\
      <li><br><h3>'+post.name+'</h3>\
      <h4>Start: '+e.toString()+' ( ' +  + Time_dif/(24*3600000) + ' days ' + (Time_dif%(24*3600000))/3600000 + ' hrs)</h4><br>\
      <h4>Duration: '+post.du+'</h4><br>\
      </li><hr></a></div>');

    
  });


  //saving into local storage
  localStorage.setItem("FetchedContestURLs",JSON.stringify(FetchedContestURLs));
  if(notifierTag){document.getElementById('scroll-info').style.display = "inline";}
  chrome.browserAction.setBadgeText({text: ""}); // We have 0 unread items.
  setTimeout(function(){$("#scroll-info").fadeOut(700);},5000);
}
putdata();
