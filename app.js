var express =require("express");
var app=express()
var bodyParser=require("body-parser");
var request=require("request");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

var firebase = require("firebase");
 var config = {
    apiKey: "AIzaSyD2wOFVVPSe3yBEo7j5lc4f611g1eSTIdM",
    authDomain: "hope-7fb17.firebaseapp.com",
    databaseURL: "https://hope-7fb17.firebaseio.com",
    projectId: "hope-7fb17",
    storageBucket: "hope-7fb17.appspot.com",
    messagingSenderId: "988629004611"
  };
  firebase.initializeApp(config);
   const database = firebase.database();
  var ref = firebase.database().ref();
var returnArr;
ref.child('appointments').on("value", function(snapshot) {
   returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });
});
console.log(returnArr);
// console.log(database.ref('/appointments/'));







app.get("/friends",function(req,res){
    res.render("friends",{friends:returnArr});
});

request("https://query.yahooapis.com/v1/public/yql?q=select%20astronomy.sunset%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22maui%2C%20hi%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function(error,response,body){
   if(!error && response.statusCode==200){
       var parsedData = JSON.parse(body);
       console.log(parsedData.query["results"]["channel"]["astronomy"]["sunset"]);
   } 
});

// "/" to say "Hello There"
// app.get("/", function(req,res){
//     res.send("Hi There!!!" );
// });



// /// "/bye" to say "GoodBye"
// app.get("/bye",function(req,res){
//     res.send("Good Bye!!!"); 
// });

// app.get("/r/:subreddit", function(req,res){
//   res.send("Welcome to subreddit"); 
// });


// app.get("*", function(req,res){
//     res.send("You are a Star") ;
// });


app.get("/thing",function(req,res){
    // var thing=req.params.thing;
    res.render("home.ejs",{}); 
});


app.get("/search",function(req,res){
   res.render("search"); 
});


app.get("/results",function(req,res){
    var search=req.query.search;
    console.log(search);
    var url="http://www.omdbapi.com/?s="+ search + "&apikey=thewdb";
    request(url,function(error,response,body){
        if(!error && response.statusCode ==200){
            var results =JSON.parse(body);
            res.render("results",{results:results});
        }
    });
});


app.get("/speak/:id", function(req,res){
    var name=req.params.id;
    if(name=="pig"){
        res.send("The "+ name + " says 'Oink'");
    }
    if(name=="cow"){
        res.send("The "+ name + " says 'Moo'");
    }
    if(name=="dog"){
        res.send("The "+ name + " says 'Woof Woof!'");
    }
});


app.get("/repeat/:id/:t", function(req,res){
   var name= req.params.id;
   var times = Number(req.params.t);
   var message="";
   for(var i=0;i< times;i++){
        message+=name;
        message+=" ";
   }
   res.send(message);
//   console.log(times);
//   for(var i=0;i<times;i++){
//       res.send("Hello");
//   }
       
});


app.post("/addfriend",function(req,res){
    var newfriend=req.body.newfriend;
    friends.push(newfriend);
    res.redirect("/friends");
});

app.get('/',function(req,res){
   res.send("Hello"); 
});


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started");
});