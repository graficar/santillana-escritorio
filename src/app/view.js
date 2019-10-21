'use strict';

const shell = require('electron').remote.shell;

localStorage.setItem('finDocumentos', 1);
localStorage.setItem('finMultimedia', 1);

require('electron').remote.getCurrentWindow().on('close', () => {
  // window was closed...
	localStorage.removeItem('lasesion');    
		localStorage.removeItem('nombreusuario');
		localStorage.clear();
})

//En esta funcion se controla lo que se muestra cuando se inicia sesión y controla los modulos cargados.
function mostrarPrincipal(){	
	$('#divprincipal').toggle();	
	$('#nombreusuario').html(localStorage.getItem('nombreusuario'));
	
	//fondo cabecera
	if(localStorage.getItem('tipo')==1)
		$( "#divprincipal .navbar" ).removeClass( "cabeceraDocente" ).addClass( "cabeceraEstudiante" );
	else
		$( "#divprincipal .navbar" ).removeClass( "cabeceraEstudiante" ).addClass( "cabeceraDocente" );
		
	//console.log('Name User', localStorage.getItem('nombreusuario'));
	document.body.style.background = '#FDFDFD';	
	
	//Lectura de los modulos
	var datos = getSesion();
		
	//Quito los caracteres especiales / del token
	var carpetaToken = datos.token;
	carpetaToken = carpetaToken.replace(/\//g,'');
	
	for(var elemento in datos.modulo){
		let datos_modulo = datos.modulo[elemento];
		let nombrePortada = datos_modulo.portada.split('/');
		let nombreLibro = datos_modulo.modulo_nombre;
		nombrePortada = nombrePortada[nombrePortada.length-1];
		

		$('#modulosInicio').append(componenteItemMenu(datos_modulo.modulo_id, carpetamodulos+carpetaToken+'/'+datos_modulo.modulo_id+'/'+nombrePortada));

		$('#idmodulo'+datos_modulo.modulo_id).on('click', () => {

			$('#recurso').removeAttr('src'); //Remover el attributo src evita q sigue emitiendo sonidos al salir del multimedia
			$('#modulosInicio, #atras, #atrasmodulo, #multimedia, #recurso, #cargandomodulo, #textoCargar').hide();
			$('#secciones, #titulo').html('');
			$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+nombreLibro+'</li>');
			$('#moduloresumen, #atrasprincipal, #sincronizar').show();
			$('#titulo').append(datos_modulo.modulo_nombre);
			$('#parrafodescripcion').text(datos_modulo.descripcion);
			$( '#sincronizar' ).attr("data-id", datos_modulo.modulo_id);

			localStorage.setItem('nombreLibro', nombreLibro);

			//Se estructuran ñas secciones
			for(let seccion in datos_modulo.seccion){

				let seccionAux = seccion.replace(/\s/g,'');
				seccionAux = seccionAux.replace("#",'');
				seccionAux = seccionAux.replace(/'/g,'');
				seccionAux = seccionAux+'_'+(Math.floor(Math.random() * (100 - 1) + 1));

				$('#secciones').append( componenteSeccion(seccion, seccionAux) );


				$('#title_'+seccionAux).on('click', function(){
					$('#content_'+seccionAux).toggle();
				});	        		

				//Se estructuran las subsecciones
				let rutaModulo = carpetamodulos+carpetaToken+'/'+datos_modulo.modulo_id;
				//let rutaModulo = 'file://'+ __dirname+'/recursos/' +items[iauxiliar];
				estructurarSubSecciones(rutaModulo, seccionAux, datos_modulo.seccion[seccion] );        		        		
			}
			
		});
	}
	
	eventosModulo();
	
	/*var items = null;
	//Se leen Los modulos
	try{
		items = fs.readdirSync(carpetamodulos);
	}catch(err){
		fs.mkdirSync(carpetamodulos);
		items = fs.readdirSync(carpetamodulos);
		console.log('en el catch', carpetamodulos +'  ---   '+items +' puttt');
		//alert(err); return;
	}
	console.log('funca con readdirSync jj', carpetamodulos);
	if(items.length == 0){
		return;
	}		

    for (var i=0; i<items.length; i++) {	    
    	let modulojson = fs.readFileSync(carpetamodulos+items[i]+'/modulo.json', 'utf8');
        modulojson = JSON.parse(modulojson);

        $('#listamodulos').append( componenteItemMenu(items[i], modulojson.nombre) );
        let iauxiliar = i;
          
        
    } */   
}



$(document).ready( function() {
	document.getElementsByTagName("html")[0].style.overflow = "hidden";
	//console.log( "ready!" );
	//cerrarSesion();	
	if(isSesionActiva()){		
		mostrarPrincipal();
	}else{
		mostrarLogin(); 
	} 

	$('#cargarlicencia').on('click', () => {
		cargarLicencia();
	});
	$('#login-form').on('submit', (event) => {
    	login(event);
    });

	$('#cerrarsesion').on('click', ()=>{
		cerrarSesion();			
	});
	
	//console.log('ruta completa carpeta donde se alojaran los modulos es : '+carpetamodulos);    

	//Evento, cuando el multimedia se ha cargado completamente en el Ifrane
	$('#multimedia').on('load', function() {
		//console.log('cargada total de la multimedia');
		let hyperlinks = $(this).contents().find("body a");
		//console.log('hyperlinks', hyperlinks);        
    	
		for(var i = 0; i < hyperlinks.length; i++)
		{			
		    if(hyperlinks[i].getAttribute('target') != null && hyperlinks[i].getAttribute('target') == '_blank')
		    {
				var str = hyperlinks[i].getAttribute('href');
				var ext_archivo = str.substring(str.length - 4, str.length);
				
				
				if(ext_archivo == ".pdf" || ext_archivo == ".doc" || ext_archivo == ".docx" || ext_archivo == ".xls" || ext_archivo == ".xlsx" || ext_archivo == ".ppt" || ext_archivo == ".pptx"){
					hyperlinks[i].setAttribute('id', 'documento'+i);
					let iaux = i;
					$(this).contents().find('#documento'+i).on('click', function(event){			    		
						
						event.preventDefault();						
						var urlDocumento = this.href.substr(8);
						//console.log(urlDocumento);
						shell.openItem(urlDocumento);	    		
					});	
				}else{
					hyperlinks[i].setAttribute('id', 'idunidad'+i);
					hyperlinks[i].removeAttribute('target');   		    			    	
					let iaux = i;
					$(this).contents().find('#idunidad'+i).on('click', function(event){

						$('#atras, #multimedia').hide();			    				    	
						$('#recurso').attr({
							 src : hyperlinks[iaux].href
						});		    	
						$('#recurso, #atrasmodulo').show();

						$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" ><a href="#" id="listaRecurso">'+localStorage.getItem('nombreLibro')+'</a></li><li class="breadcrumb-item" id="listaContenido">'+localStorage.getItem('nombreMultimedia')+'</li>');


						event.preventDefault();
						event.stopPropagation();	    		
					});	
				}
		    			
		    	
		    }
		}
		
    });
	
	
	$('#recurso').on('load', function() {
		console.log('cargada total de la multimedia');
		let hyperlinks = $(this).contents().find("body a");
		//console.log('hyperlinks', hyperlinks);        
    	
		for(var i = 0; i < hyperlinks.length; i++)
		{			
		    if(hyperlinks[i].getAttribute('target') != null && hyperlinks[i].getAttribute('target') == '_blank')
		    {
				var str = hyperlinks[i].getAttribute('href');
				var ext_archivo = str.substring(str.length - 4, str.length);
				
				
				if(ext_archivo == ".pdf" || ext_archivo == ".doc" || ext_archivo == ".docx" || ext_archivo == ".xls" || ext_archivo == ".xlsx" || ext_archivo == ".ppt" || ext_archivo == ".pptx"){
					hyperlinks[i].setAttribute('id', 'documento'+i);
					let iaux = i;
					$(this).contents().find('#documento'+i).on('click', function(event){			    		
						
						event.preventDefault();						
						var urlDocumento = this.href.substr(8);
						//console.log(urlDocumento);
						shell.openItem(urlDocumento);	    		
					});	
				}else{
					hyperlinks[i].setAttribute('id', 'idunidad'+i);
					hyperlinks[i].removeAttribute('target');   		    			    	
					let iaux = i;
					$(this).contents().find('#idunidad'+i).on('click', function(event){			    		
						console.log('di click 2');


						$('#atras, #multimedia').hide();			    				    	
						$('#recurso').attr({
							 src : hyperlinks[iaux].href
						});		    	
						$('#recurso, #atrasmodulo').show();
						$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" ><a href="#" id="listaRecurso">'+localStorage.getItem('nombreLibro')+'</a></li><li class="breadcrumb-item" id="listaContenido">'+localStorage.getItem('nombreMultimedia')+'</li>');

						event.preventDefault();
						event.stopPropagation();	    		
					});	
				}
				
		    		
		    	
		    }
		}    
    });
});



