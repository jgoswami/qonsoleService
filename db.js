var uri = "10.0.0.13/qonsoledb",
	collections = ["users", "activities", "jobs"],
	db = require("mongojs").connect(uri, collections),
	ObjectID = require("mongojs").ObjectId;

db.on( 'error', function(error){
	console.log( 'database error', error);
});

db.on( 'ready', function(){
	console.log( 'database connected', uri);
});

exports.db = db;
