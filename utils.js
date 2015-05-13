//utils.js
//===========


module.exports = {

	 sendResponse: function(error, res, docs){
		if(error) { 
			console.log( error);
			res.status(400).send(error);
		}else{
			console.dir( docs);
			res.set('Content-Type', 'application/json');
			res.status(200).send(docs);
		}
	},

	checkIdHexFormat: function(entity, callback){
		var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
		if(!checkForHexRegExp.test(entity)) callback("invalid entity");
		else callback(null);
	}

};