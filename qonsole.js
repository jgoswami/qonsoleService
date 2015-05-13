var http = require('http'),
	express = require('express'),
	path = require('path');
	db = require('./db').db,
	dbconn = require('./dboperations').DBConnection,
	utils = require('./utils'),
	ObjectID = require("mongojs").ObjectId;

var dbconn = new DBConnection(db);
var app = express();

//listen to port
app.set('port', process.env.port || 3000);
var bodyParser = require('body-parser');
app.use( bodyParser.json());
app.use (bodyParser.urlencoded( { extended: true}));

// get collection
app.get('/:collection', function(req,res){
	dbconn.getCollection( req.params.collection, function(error, docs){
		utils.sendResponse( error, res, docs);
	});
});

//get sorted collection
app.get('/:collection/sort/:field', function(req, res){
	console.log("inside getSortedCollection");
	dbconn.getSortedCollection(req.params.collection, req.params.field, function(error, docs){
		utils.sendResponse( error, res, docs);
	});
});

//get a single entity
app.get('/:collection/:entity', function(req, res){
	var entity = req.params.entity;
	if ( entity) {
		utils.checkIdHexFormat( entity, function(error){
			if(error){
				console.log( "invalid entity" , entity);
				res.status(400).send(error);
			}else{
				dbconn.getEntity(req.params.collection, ObjectID(entity), function(error, doc){
					utils.sendResponse(error, res, doc);
				});
			}
		});
	}else {
		res.status(400).send( {error: 'bad url', url: req.url});
	}
});

//insert
app.get('/:collection/save/:fieldName_1/:fieldValue_1/:fieldName_2/:fieldValue_2', function(req, res){
	var field1 = req.params.field1;
	var field2 = req.params.field2;
	var obj = {};
	obj[req.params.fieldName_1] = req.params.fieldValue_1;
	obj[req.params.fieldName_2] = req.params.fieldValue_2;
	obj.created_at = new Date();
	dbconn.insert(req.params.collection, obj, function(error, saved){
		utils.sendResponse(error, res, obj);
	});
});


//insert using post
app.post('/:collection', function(req, res){
	var obj = req.body;
	var collectionName = req.params.collection;
	obj.created_at = new Date();

	dbconn.insert(collectionName, obj, function(error, saved){
		utils.sendResponse(error, res, obj);
	});
});

//update
app.put('/:collection/:entity', function(req, res){
	var entity = req.params.entity;
	var obj = req.body;

	console.log( "inside put:" , entity);
	console.log ( "collectionName:", req.params.collection);

	if ( entity) {
		console.log ("checking entity");
		utils.checkIdHexFormat( entity, function(error){
			if(error){
				console.log( "invalid entity" , entity);
				res.status(400).send(error);
			}else{
				console.log ("valid entity");
				obj.updated_at = new Date();
				console.dir(obj);
				dbconn.update(req.params.collection, ObjectID(entity), obj, function(error, saved){
					utils.sendResponse(error, res, {'result': 'Database updated'});
				});
			}
		});
	} else {
		res.status(400).send( {error: 'bad url', url: req.url});
	}
});


//delete
app.delete('/:collection/:entity', function(req, res){
	var entity = req.params.entity;
	if ( entity) {
		utils.checkIdHexFormat( entity, function(error){
			if(error){
				console.log( "invalid entity" , entity);
				res.status(400).send(error);
			}else{
				dbconn.delete(req.params.collection, ObjectID(entity), function(error, doc){
					utils.sendResponse(error, res, {'result':'Delete Success'});
				});
			}
		});
	}else{
		res.status(400).send( {error: 'Delete Failed!!'});
	}

});


//handle 404
app.use( function(req, res){
	res.render('404', {url: req.url});
});

//create http server
http.createServer(app).listen( app.get('port'), function() {
	console.log('Mongo rest server listening on port ' + app.get('port'));
});


//curl -H "Content-Type: application/json" -X PUT -d '{"type":"running","distance":3.3, "time": 35, "day":"tuesday"}' http://localhost:3000/activities/5552f16b278168c7a46067f4
//curl -H "Content-Type: application/json" -X POST -d '{"type":"running","distance":13.09, "time": 175, "day":"saturday"}' http://localhost:3000/activities
