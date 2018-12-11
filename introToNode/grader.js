function average(arr){
    var total = 0;
    
    for (var i = 0; i < arr.length; i++) {
        total += arr[i];
        var ave = Math.round(total / arr.length);
    } 
    console.log(ave);
}

var scores = [90, 98, 89, 100, 100, 86, 94];
average(scores);

var scores2 = [40, 65, 77, 82, 80, 54, 73, 63, 95, 49];
average(scores2);