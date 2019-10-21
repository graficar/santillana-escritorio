




function existeLicencia(username, token) {  
   var archivolicencia = path.join(app.getPath('userData'), 'js/'+username+'.json');
	
   //Check if file exists   
   if(fs.existsSync(archivolicencia)) {
   	  let data = fs.readFileSync(archivolicencia, 'utf8');
	  let datos_archivo = JSON.parse(data); 
	   
	  	   
	   if(datos_archivo['token']==token)
		   return data;
	   else
		   return false;
	   
   	} else {
   		return false;
   	}
}

function isLicenciaValida(strLicencia){
	console.log('strLicencia', strLicencia);
	try{
		let d = JSON.parse(strLicencia);
		if(d.a && d.b && d.c){
			return true;
		}
		return false;
	}catch(err){
		console.log('cathc err: ', err);
		return false;
	}	
}

function cargarLicencia(){
	dialog.showOpenDialog(function (fileNames) { 
		// fileNames is an array that contains all the selected 
		if(fileNames === undefined) { 
		   console.log("No file selected"); 
		
		} else { 		      
		  if(fileNames.length ==1)
		  {
			fs.readFile(fileNames[0], 'utf-8', (err, data) => {        
				 if(err){ 
					alert("An error ocurred reading the file :" + err.message) 
					return;
				 }
				 if(!isLicenciaValida(data))
				 {
					alert('Licencia Incorrecta');
					return;
				 }
				 fs.writeFile(archivolicencia, data, (err) => {
					if(err)
					{
						alert('Error:: '+err);
						return;
					}
					$('#cargarlicencia').hide();
					$('.ingreso').show();
					alert('Licencia cargada correctamente. Ya puede iniciar sesión con sus credenciales');

				 });	
				 $("#login-form")[0].reset();			        
			});	      	  		
		  }		       	
		  else
			alert('Elija soloun archivo');
			//console.log('manejar cuando se cargue mas de un archivo')
		} 
	}); 
}