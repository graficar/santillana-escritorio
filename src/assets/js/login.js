const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const request = require('request');

function isSesionActiva(){
	var sesion = localStorage.getItem('lasesion');
	if (sesion){		
		return true;	
	}
	return false;
}


function cerrarSesion(){
	localStorage.removeItem('lasesion');    
	localStorage.removeItem('nombreusuario');
    localStorage.clear();    
    location.reload();
}

function getSesion(){
	let lasesion = localStorage.getItem('lasesion');
	return JSON.parse( lasesion );
}

function mostrarLogin(){
	$('#login').show();		
	//$('#divprincipal').hide();
	document.body.style.backgroundColor = "#12c5eb";
	$("#login-form")[0].reset();
	$("#username").focus();

	
		
}


function desencriptar(textoEncriptado, isNombreModulo){
  let res = { };
  console.log(textoEncriptado);
  //textoEncriptado = 'ev+CxjvdxCP2N0JsvZKweNfG1TcPSdwpYHExVAACWyr51Hxkt/hTl5DbBah2UZmW+Q==';
					   
  try{  
		if(isNombreModulo){
			textoEncriptado = textoEncriptado.replace(/-/g, "+");
			textoEncriptado = textoEncriptado.replace(/_/g, "/");
			console.log(textoEncriptado);
		}
        
	  
        var llave = '{]Wn%g(9aKNG'; //Quemado en el codigo 		
        var input = Buffer.from(textoEncriptado, 'base64'); 
        var salt = input.slice(0, 16); 
        var nonce = input.slice(16, 28);
        textoEncriptado = input.slice(28, -16);
        var tag = input.slice(-16);
        var key = crypto.pbkdf2Sync(llave, salt, 40000, 32, 'sha256');
        var cipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
        cipher.setAuthTag(tag);
        var plaintext = Buffer.concat([cipher.update(textoEncriptado), cipher.final()]);
console.log(plaintext.toString('utf-8'));
        if(isNombreModulo)
          res['resultado'] = plaintext.toString('utf-8').split('_');
        else
          res['resultado'] = plaintext.toString('utf-8');
        res['valid'] = true;
        return res;
  }catch(err){    
    return {resultado: err, valid:false};
  }
}

function encriptar(texto){
	var key = '5BO6UBTMLD3VPLBGR63Q8ZAUOKNP98F5';
  	var iv = 'vapoemqnyqspgiqj';
	var prefijo = '{]Wn%g(9aKOZ';
	var encipher = crypto.createCipheriv('aes-256-cbc', key, iv),
    buffer = Buffer.concat([
      encipher.update(texto),
      encipher.final()
    ]);
						  
	//console.log(Buffer.from(prefijo).toString('base64')+buffer.toString('base64'));
  	return Buffer.from(prefijo).toString('base64')+buffer.toString('base64');
  
}


function login(event){			
	event.preventDefault();
	
	if(!$('#username').val() || !$('#password').val()){
		alert('Por favor ingrese usuario y contraseña');
		return;
	}
	
	$( '#mensajeLogin' ).text("Cargando datos...");
		
	let username = $('#username').val();
	let password = $('#password').val();
	
	let clave = encriptar(password);
	console.log(servidor+"api/conexionApp?usuario=" + username + "&token=" + clave);
	request(servidor+"api/conexionApp?usuario=" + username + "&token=" + clave, { json: true }, (err, res, body) => {
		let usuario = "";
		
	  	if (err) { 
			usuario = existeLicencia(username, clave);
			
			if(usuario==false){
				alert("No se puede obtener datos del usuario, verifique su usuario y clave. Verifique su conexión a Internet.");
				$( '#mensajeLogin' ).text("");
				return;
			}else{
				let datos_usuario = JSON.parse(usuario);
				localStorage.setItem('nombreusuario', datos_usuario.nombre);
				localStorage.setItem('tipousuario', datos_usuario.tipo);
				localStorage.setItem('lasesion', usuario);				
				location.reload(); 
			}
	  	}else{
			if(body.status==200){
				$( '#mensajeLogin' ).text("Cargando usuario...");
				fs.writeFile(path.join(__dirname, 'js/'+username+'.json'), JSON.stringify(body.datos), function (err) {
				  	if (err) throw err;				  
				  	
					usuario = existeLicencia(username, clave);
					let datos_usuario = JSON.parse(usuario);
					localStorage.setItem('nombreusuario', datos_usuario.nombre);
					localStorage.setItem('tipousuario', datos_usuario.tipo);
					localStorage.setItem('lasesion', usuario);
					cargaPortadas();
				});

				
			}else{
				alert("No se puede obtener datos del usuario, verifique su usuario y clave.");
				$( '#mensajeLogin' ).text("");
				return;
				
			}
	  	}
	  
		
	});
	
	/*
	
	
	var resultado = desencriptar(data.a, false);  
	if(!resultado.valid)  {
		alert(resultado.resultado); return;
	}

	console.log('resultado', resultado);
	console.log('USERRRRR', username);
	if(resultado.resultado != username){  	
		alert('Usuario Incorrecto'); 
		$("#login-form")[0].reset();
		$("#username").focus();
		return;
	}
	localStorage.setItem('nombreusuario', resultado.resultado);


	bcrypt.compare(password, data.b,
	  function(bad, check){
		if(check){
			console.log('Contrasenia correcta');
			//mostrarPrincipal();	    	
			location.reload();
			localStorage.setItem('lasesion', JSON.stringify({
				usuario: data.a,
				password: data.b,
				userid: data.c,
				iv: data.d,
				nombreusuario : resultado
			}));								
		}else{
			alert( "Clave Incorrecta" );
			//$("#login-form")[0].reset();
			$("#password").val('');
			$("#password").focus();
		}				
	});	*/
}