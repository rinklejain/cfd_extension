var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        myArr = JSON.parse(this.responseText);
        document.getElementById("aa").innerHTML = myArr.result[0].id;
    }
};
xmlhttp.open("GET", "http://codeforces.com/api/contest.list", true);
xmlhttp.send();


d = new Date(date);
	console.log(d);