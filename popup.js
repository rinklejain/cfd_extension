var upcoming_contests = {items: []};
var ongoing_contests = {items: []};
var x = new Date();
var offset = x.getTimezoneOffset();

function get_contests(){
  var xmlhttp = new XMLHttpRequest();
  var upcoming_count = 0;
  var ongoing_count = 0;
//console.log("rinkle ka infinite swag");
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("aa").innerHTML = contest_list.result[];
      var contest_list = JSON.parse(this.responseText);
      var count = 0;
      var localStorageData = localStorage.getItem("FetchedContestURLs");
      if((localStorageData === null) || (localStorageData.length === 0))
        { localStorageData = "{}";}
      var prevFetchContestURLs = JSON.parse(localStorageData);
      //document.getElementById("aa").innerHTML= contest_list.result[0].id;
      //console.log(contest_list.result.length);
      for(var i=0; i<100; i++)
      {
        var start_time = new Date(contest_list.result[i].startTimeSeconds * 1000);
        var end_time = Date.now() - contest_list.result[i].relativeTimeSeconds*1000;
        var output = check_status(start_time,end_time);
        
        if(output == 1){
          ongoing_contests.items.push({"id": contest_list.result[i].id,
            "name": contest_list.result[i].name, 
            "st": contest_list.result[i].startTimeSeconds-offset*60, 
            "du": contest_list.result[i].durationSeconds, 
            "url": "http://codeforces.com/contests/"+contest_list.result[i].id
          });

        }
        if(output == 2){
          upcoming_contests.items.push({"id": contest_list.result[i].id,
            "name": contest_list.result[i].name, 
            "st": contest_list.result[i].startTimeSeconds-offset*60, 
            "du": contest_list.result[i].durationSeconds, 
            "url": "http://codeforces.com/contests/"+contest_list.result[i].id
          });
          console.log(x.toDateString());
          console.log(x);
          console.log(new Date(contest_list.result[i].startTimeSeconds*1000-offset*60000));
          
        }   
      }

      console.log('putdata called');
      putdata();
    }
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
  console.log(upcoming_contests);
  console.log(ongoing_contests);
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

  $.each(ongoing_contests.items , function(i,post){ 
    e = new Date((post.st+post.du)*1000);
    //console.log(e.toDateString());
        console.log(min);


    if(e>curTime)
    {
      Time_dif = e-curTime+offset*60000;
      var day = (Time_dif/(24*3600000));

      if (day <1)
      {day = '';}
      else
      {day = day.toString().split('.')[0];
        day = day.concat(" days ");

        }
        console.log(day);

      var hrs = ((Time_dif%(24*3600000))/3600000);
    //  console.log(hrs);
      var min;
      if(hrs<1)
      {
        hrs= '';
      }
      else
      {
        hrs = hrs.toString().split('.')[0];
        hrs = hrs.concat(" hours ");
      }
  //    console.log(hrs);
      min = ((Time_dif%(24*3600000))%3600000)/60000;
      min = min.toString().split('.')[0];
      min = min.concat(" minutes ");
//  

      $("#ongoing").append(
        '<a class = "contest_url" href="'+post.url+'">'+
        '<li><br>'+post.name+
        '<br>End: '+e.toDateString() +  '( Remaining time :'+day+hrs+min+')<br>'+
        '</li></a><hr><br><br>');
    }
    
  });
  if(ongoing_contests.items.length==0)
  {
    $("#ongoing").append("<div><h6>No ongoing contsets</h6></div");
  }

  $.each(upcoming_contests.items , function(i,post){ 
    var s = new Date(post.st*1000);
    var e = new Date((post.st+post.du)*1000);

    FetchedContestURLs[post.url] = 1;
    var Time_dif = s-curTime+offset*60000;
    var day = (Time_dif/(24*3600000));
    
    if (day <1)
      {day = '';}
    else
      {day = day.toString().split('.')[0];
        day = day.concat(" days");

        }
      //  console.log(day);

      var hrs = ((Time_dif%(24*3600000))/3600000);
      //console.log(hrs);
      var min;
      if(hrs<1)
      {
        hrs= '';
      }
      else
      {
        hrs = hrs.toString().split('.')[0];
        hrs = hrs.concat(" hours");
      }
      //console.log(hrs);
      min = ((Time_dif%(24*3600000))%3600000)/60000;
      min = min.toString().split('.')[0];
      min = min.concat(" minutes");
      //console.log(min);




    //unreadTag = '<div class="unread">new</div>';

    $("#upcoming").append('<div class = "row contest"><div class="col s9">' + '<a  class = "contest_url" href='+'"'+post.url+'"'+' >'+
      '<li>'+post.name+
      '<br><br>Start: '+s.toDateString()+' ( after ' +  day +' '+ hrs+ ' ' + min + ' '+' )<br>'+
      'Duration: '+((post.du/60).toString().split('.')[0])+' min <br>'+
      '</li></a><br></div><div class =col s3><img src = "images/cf.png"></div>');
    
    
  });


  //saving into local storage
  localStorage.setItem("FetchedContestURLs",JSON.stringify(FetchedContestURLs));
  if(notifierTag){document.getElementById('scroll-info').style.display = "inline";}
  chrome.browserAction.setBadgeText({text: ""}); // We have 0 unread items.
  setTimeout(function(){$("#scroll-info").fadeOut(700);},5000);
}

    $(document).ready(function(){
    $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
     });
    });
