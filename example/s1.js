var s1 = function(storage_name)
{
	//console.log('this ', this.localStorage)

	//localstorage name
	var ls_name = storage_name; 
	var ls_data = this.localStorage; 
	//for to speed up things store in js dom storage inaddition to localstorage
	var dom; 

	var check_typeof = function (val) 
	{
		var str = typeof(val);			   
				 
		if( Array.isArray(val))
		{ 
			return 'array';
		} 
		else if(str === "object")
		{
			return 'object';		 
		}		
		else 
		{
			return str;
		} 
		 
	};

	var size = function (collection) 
	{ 
		var str = check_typeof(collection);

		if(str ==="number" || str ==="string")
		{
		  var d1 = str.toString()
		  return collection.toString().length; 
		}

		else if(str ==="object")
		{ 
			var i =0;
			for (ele in collection) {  i++;	};				 
			return i;
		} 
		else if( str ==="array")
		{
			var i =0;
			collection.forEach( function(element, index){i++;});	 
			return i;
		}    
	};
	var auto_id = function (len) 
	{  
		return Math.random().toString(36).substr(2,len) ;
	};

	var findobj = function(obj, lookup_id)
	{
		for (var prop in obj)
		{ 
			if (obj.hasOwnProperty(prop))
			{
				if ( prop == lookup_id)
				{
					return {id:prop, val: obj[lookup_id],};
				}
			}
		}
	};

	var exist = function (LookUpIndexKey) 
	{      
		var DataCheck =  localStorage.getItem(ls_name);
		return size(DataCheck) > 0 ? true : false;
	}

	
	var add = function(val)
	{ 
		var str = check_typeof(val);			   
		var d2 = '';
		 
		if( str == "array")
		{ 
			d2 = JSON.stringify({data_type:'array', raw_data: val});
		} 
		else if(str == "object")
		{
			d2 = JSON.stringify({data_type:str, raw_data: val});			 
		} 		
		else 
		{
			d2 = JSON.stringify({data_type:str, raw_data: val});
		} 
		localStorage.setItem(ls_name,d2);

	};

	var append = function(append_val)
	{ 
		var val =  JSON.parse(localStorage.getItem(ls_name)); 
	 	if(size(val) >0)
		{
			var data_type = val.data_type;
			var collection = val.raw_data;

			if(data_type =='object')
			{
				for(k1 in append_val)
				{
					collection[k1] = append_val[k1];
				}
				//update localstorage
				add(collection); 
			}
			if(data_type =='array')
			{
				collection.push(append_val);
				//update localstorage
				add(collection);  
			}
		}
	};


	var get = function()
	{	 
		var val =   JSON.parse(localStorage.getItem(ls_name)); 

		if(size(val) >0)
 		{
			var str = val.data_type;
			var data = val.raw_data;
			return data; 
		}
	}; 	 


 	var getwhere = function(lookup)
	{ 
		var val =  JSON.parse(localStorage.getItem(ls_name)); 
		var data_type = val.data_type;
		var collection = val.raw_data;

		if(check_typeof(lookup) == 'string')
		{			
			if(data_type == "object")
			{
				var d = findobj(collection, lookup);
				if(size(d) > 0)
				{
					return d.val;
				}
			}
		}
		if(check_typeof(lookup) == 'object')
		{  
			var all_rows = [];
			collection.map(function(ele)
			{	  
				var a ;
				for(var k1 in lookup)
				{	
					var obj_k1 = k1;
					var obj_v1 = lookup[k1];

					if(size(findobj(ele, obj_k1)) > 0)
					{
						var d = findobj(ele, obj_k1).id;
						if( ele[d] == lookup[k1])
						{
							a = ele;
						}
					}
				}
				if(a)
				{
					all_rows.push(ele);
				}
			}); 
			if(size(all_rows) > 0)
			{
				return all_rows;
			}
		}
	};

	var updatewhere = function(updateObjval, whereobj)
	{	
		var val = JSON.parse(localStorage.getItem(ls_name)); 
		var data_type = val.data_type;
		var collection = val.raw_data;  
		if(data_type == "object")
		{ 
			for (var k1 in updateObjval)
			{
				var obj_k1 = k1;
				var obj_v1 = updateObjval[k1];

				if(size(findobj(collection, obj_k1)) > 0)
				{
					var d = findobj(collection, obj_k1).id;
					collection[d] = obj_v1; 
				}
			}
			//update localstorage
			add(collection);
			return collection;
		}
		else if(data_type == "array")
		{
			var val_updated = [];
			collection.map(function(v1)
			{	
				for( k1 in whereobj)
				{	
					var obj_k1 = k1;
					var obj_v1 =  whereobj[k1];
					var d = findobj(v1, obj_k1).id;
					if(size(d) > 0)
					{						
						if(v1[d] == obj_v1)
						{
							for(var k2 in updateObjval)
							{
								var obj_k2 = k2;
								var obj_v2 =  updateObjval[k2];
								
								if( v1[obj_k2])
								{
									v1[obj_k2] = obj_v2;
								}
							}														
							val_updated.push(v1);
						}
					}
				}
			});
			//update localstorage
			add(collection); 

			return val_updated;			
		}
	};

	var remove = function()
	{		
		var val = JSON.parse(localStorage.getItem(ls_name)); 			
		if(size(val) >0)
 		{
			localStorage.removeItem(ls_name); 			 
			return val; 
		}
	};


	var removewhere = function(whereobj)
	{		
		var val = JSON.parse(localStorage.getItem(ls_name)); 
		var data_type = val.data_type;
		var collection = val.raw_data; 

		if(data_type == "object")
		{
			for(var k1 in whereobj)
			{	
				var obj_k1 = k1;
				var obj_v1 = whereobj[k1];
				if(collection[k1] == whereobj[k1])
				{
					delete collection[k1];
				}
			}
			
			//update localstorage
			add(collection);
 
			return collection;			
		}
		else if(data_type == "array")
		{			 
			collection.map(function(v1, i1)
			{	 
				for( k1 in v1)
				{	
	 				for(k2 in whereobj) 
	 				{
	 					if(k1 == k2)
	 					{
	 						if(v1[k1] == whereobj[k2])
	 						{	 							
	 							delete collection[i1]
	 						}
	 					}
	 				}
				}	 
			});
			var a1 = [];
			collection.forEach( function(ele, index) 
			{	
				//will remove empty array(s)
				if(ele)
				{
					a1.push(ele);
				}
			});			
			 
			//update localstorage
			add(a1);			 

			return a1;
		}
	}; 

	var removeall = function()
	{	
		localStorage.clear();		 	 
	};
	 

	return {
		name:name,
		exist:exist,
		add:add,
		append:append,
		get:get,
		getwhere:getwhere,
		updatewhere:updatewhere,
		remove:remove,	
		removewhere:removewhere,
		removeall:removeall,
	}
};