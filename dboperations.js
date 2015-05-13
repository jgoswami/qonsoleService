
DBConnection = function(db) { 
	this.db = db;
};

//get a mongodb collection by name
DBConnection.prototype.getCollection = function(collectionName, callback){
	this.db.collection(collectionName ).find().toArray( function( error, docs){
		if(error) callback(error);
		else callback(null, docs);
	});
};

//sort and retrieve
DBConnection.prototype.getSortedCollection= function(collectionName, sortField, callback){
	this.db.collection(collectionName ).find().sort( { sortField:1} , function( error, docs){
		if(error) callback(error);
		else callback(null, docs);
	});
};

//get a single entity
DBConnection.prototype.getEntity = function(collectionName, id, callback){
	this.db.collection(collectionName).findOne( {'_id':id}, function(error, doc){
		if(error) callback(error);
		else callback(null, doc);
	});
};

//insert into a collection
DBConnection.prototype.insert = function(collectionName, obj, callback){
	this.db.collection(collectionName).save( obj, function(error, saved){
		if(error || !saved) callback( error);
		else callback(null, "user saved");
	});
};

//update an existing entity
DBConnection.prototype.update = function(collectionName, id, obj, callback){
	this.db.collection(collectionName).update( {'_id': id}, {$set:obj} , function(error, saved){
		if(error || !saved) callback(error);
		else callback(null, "Database updated");
	});
};

//delete
DBConnection.prototype.delete = function(collectionName, id, callback){
	this.db.collection(collectionName).remove( {'_id':id}, function(error, saved){
		if(error || !saved) callback(error);
		else callback(null, "Entity deleted");
	});
};


exports.DBConnection = DBConnection;
