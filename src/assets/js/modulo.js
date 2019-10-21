const downloadImage = require('image-downloader');
const dl = require('download-file-with-progressbar');

var dd;
var error;
var url_borrar;


function cargarModulo(){
	dialog.showOpenDialog(function (fileNames) { 
		console.log('Load Modulo from modulo.js');
	    // fileNames is an array that contains all the selected 
	    if(fileNames === undefined) { 
	        alert('No ha seleccionado ningun archivo');  return;		        
	      }    

	      if(fileNames.length !=1){
	        alert('Debe escoger solo un archivo'); return;
	      }
	                      
	      let fileWithExtenseion = path.basename( fileNames[0] );         
	      let nameFileEncrypt = fileWithExtenseion.split('.')[0];
	      console.log('nombreArchivo', nameFileEncrypt);
	      
	      var resultado = desencriptar( nameFileEncrypt, true  );
	      if(!resultado.valid)  {
	        alert("Módulo no cargado, verifique que sea un modulo válido");return;
	      }      
	      let idusuario = resultado.resultado[0];
	      var numeromodulo = resultado.resultado[1];      
	      console.log('numeromodulo', numeromodulo);

	      let licencia = fs.readFileSync(archivolicencia, 'utf8');          
	      licencia = JSON.parse(licencia);

	      if(idusuario != licencia.c){
	        alert('Módulo no válido'); return;
	      }


	      let unzipper = new DecompressZip( fileNames[0] );
	      console.log('Ruta completa carpeta donde se alojaran los modulos: '+carpetamodulos+numeromodulo);
	      $('#cargandomodulo').toggle(); //.text('Cargando Modulo ...');
	        // Add the error event listener
	      unzipper.on('error', function (err) {
	        console.log('evento error')
	          alert(err);
	      });

	      // Notify when everything is extracted
	      unzipper.on('extract', function (log) {       
	          console.log('log es', log);	          
    		  alert('Módulo cargado con éxito');
    		  $('#cargandomodulo').toggle();	         
    		  location.reload();
	      });

	      // Notify "progress" of the decompressed files
	      unzipper.on('progress', function (fileIndex, fileCount) {
	          //console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
	          
	      });

	      unzipper.extract({
	          path: carpetamodulos+numeromodulo		          
	      });      
 	});
}


function componenteSeccion(seccion, seccionAux){
	
	return '<h6 id="title_'+seccionAux+'" class="btn btn-icon btn-lg mr-1 mb-1 btn-block" style="text-align:left; border-color: #FF9149; color:#FF9149; font-size:17px; box-shadow: none !important;">'+'<i class="la la-cube"></i>'+' '+seccion+'<i class="la la-plus" style="float:right"></i>'+'</h6>'+
	        		'<div id="content_'+seccionAux+'" style=""></div>';
}

function estructurarSubSecciones(rutaModulo, seccionAux, subSecciones){
	//console.log('rutaModulo', subSecciones);
	for(let sub in subSecciones){
		
		let subAux = sub.replace(/\s/g,''); //sub.replace('  ', '');
		subAux = subAux.replace("#",'');
		subAux = subAux.replace(/'/g,'');
		subAux = subAux+'_'+(Math.floor(Math.random() * (100 - 1) + 1));
		//console.log('subAux', subAux);
		$('#content_'+seccionAux).append( componenteSubSeccion(sub, subAux) );
		//let subAux = sub;
		//console.log('sub', sub);	        			
		
		crearVinculos(subSecciones[sub].vinculo, subAux);

		crearDocumentos(rutaModulo, 
			subSecciones[sub].documento, 
			subAux);

		crearMultimedia(rutaModulo, 
			subSecciones[sub].multimedia, 
			subAux);	        			
	}
}

function componenteSubSeccion(subSeccion, subSeccionAuxiliar){
	return "<div id='"+subSeccionAuxiliar+"' class='sub_seccion'><h4 style='font-weight: 100;'>"+subSeccion+"</h4></div>"
}

function crearVinculos(vinculos, subSeccionAuxiliar){
	let htmlSub = '<div class="contenido_sub_sec row">';
	for(let v in vinculos){		
		if(vinculos[v]){
			htmlSub += '<div class="col-md-6"><a class="btn btn-social btn-min-width mr-3 mb-3 btn-success1 btn-modulo vinculos" style="" href="'+vinculos[v]+'">'+'<span class="la la-link font-medium-4" style="line-height: 2.3rem !important;"></span>'+' '+v+'</a></div>';
		}      					      				
	}	
	$('#'+subSeccionAuxiliar).append(htmlSub+'</div>');
}

function crearDocumentos(rutaModulo, documentos, subSeccionAuxiliar){
	let htmlSub = '<div class="contenido_sub_sec row">';
	for(let d in documentos){	        				
		if(documentos[d]){
			let nombreArchivo = documentos[d].split('/');
			nombreArchivo = nombreArchivo[nombreArchivo.length-1];
			nombreArchivo = nombreArchivo.replace(/ /g, "%20");
			
			let nombreArchivoAux = documentos[d].split('/');
			nombreArchivoAux = nombreArchivoAux[nombreArchivoAux.length-1];
			//console.log(nombreArchivoAux.slice(0, -4));
			nombreArchivoAux = nombreArchivoAux.slice(0, -4);
			nombreArchivoAux = nombreArchivoAux.replace(/\s/g,''); //sub.replace('  ', '');
			nombreArchivoAux = nombreArchivoAux.replace("#",'');
			nombreArchivoAux = nombreArchivoAux.replace(/'/g,'');
			nombreArchivoAux = nombreArchivoAux+'_'+(Math.floor(Math.random() * (100 - 1) + 1));
			
			
			if(fs.existsSync(rutaModulo+'/'+nombreArchivo)){
				htmlSub +='<div class="col-md-6"><div class="btn-group mr-1 mb-1"><a id="'+nombreArchivoAux+'" class="btn btn-social btn-min-width btn-warning btn-modulo documentos" href="'+rutaModulo+'/'+nombreArchivo+'" data-nombre="'+d+'">'+'<span class="la la-file font-medium-4" style="line-height: 2.3rem !important;"></span> <span class="documentoNombre">'+d+'</span></a><button type="button" id="'+nombreArchivoAux+'_menu" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button><div class="dropdown-menu"><a class="dropdown-item elimnarDocumentos" href="'+rutaModulo+'/'+nombreArchivo+'" data-ruta="'+rutaModulo+'" data-href="'+documentos[d]+'" data-nombre="'+nombreArchivoAux+'">Eliminar</a></div></div><span class="imagenCarga"> <img src="../assets/imagenes/visto.png" class="icono"></span><span class="porcentajeCarga"> 100%</span></div>';
				
				
			}else{
				htmlSub +='<div class="col-md-6"><div class="btn-group mr-1 mb-1"><a id="'+nombreArchivoAux+'" class="btn btn-social btn-min-width btn-outline-warning btn-modulo descargaDocumentos" href="'+documentos[d]+'" data-ruta="'+rutaModulo+'" data-nombre="'+d+'">'+'<span class="la la-file font-medium-4" style="line-height: 2.3rem !important;"></span>'+' <span class="documentoNombre">'+d+'</span></a><button type="button" id="'+nombreArchivoAux+'_menu" class="btn btn-outline-warning dropdown-toggle" style="display: none;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button><div class="dropdown-menu"><a class="dropdown-item elimnarDocumentos" href="'+rutaModulo+'/'+nombreArchivo+'" data-ruta="'+rutaModulo+'" data-href="'+documentos[d]+'" data-nombre="'+nombreArchivoAux+'">Eliminar</a></div></div><span class="imagenCarga"> <img src="../assets/imagenes/carga.png" class="icono"></span><span class="porcentajeCarga"></span></div>';
			}			
		}      					      			
	}	   
	$('#'+subSeccionAuxiliar).append(htmlSub+'</div>');
	
	
	
	
	
}

function crearMultimedia(rutaModulo, multimedia, subSeccionAuxiliar){
	let htmlSub = '<div class="contenido_sub_sec row">';
	for(let m in multimedia){
		if(multimedia[m]){
			let nombre = multimedia[m].split("/");
			nombre = nombre[nombre.length-1];
			
			if(fs.existsSync(rutaModulo+'/'+nombre+'/index.html')){
				htmlSub +='<div class="col-md-6"><div class="btn-group mr-1 mb-1"><a id="'+nombre+'" class="btn btn-social btn-info btn-modulo multimedia" href="'+rutaModulo+'/'+nombre+'/index.html'+'" data-nombre="'+m+'">'+'<span class="la la-dropbox font-medium-3" style="line-height: 2.3rem !important;"></span>'+' <span class="multimediaNombre">'+m+'</span></a><button type="button" id="'+nombre+'_menu" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button><div class="dropdown-menu"><a class="dropdown-item elimnarMultimedia" href="'+rutaModulo+'/'+nombre+'" data-ruta="'+rutaModulo+'" data-href="'+multimedia[m]+'" data-nombre="'+nombre+'">Eliminar</a></div></div><span class="imagenCarga"> <img src="../assets/imagenes/visto.png" class="icono"></span><span class="porcentajeCarga"> 100%</span></div>';
				
			}else{				
				htmlSub +='<div class="col-md-6"><div class="btn-group mr-1 mb-1"><a id="'+nombre+'" class="btn btn-social btn-outline-info btn-modulo descargaMultimedia" href="'+multimedia[m]+'" data-ruta="'+rutaModulo+'" data-nombre="'+m+'">'+'<span class="la la-dropbox font-medium-3" style="line-height: 2.3rem !important;"></span>'+' <span class="multimediaNombre">'+m+'</span></a><button type="button" id="'+nombre+'_menu" class="btn btn-outline-info dropdown-toggle" style="display: none;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button><div class="dropdown-menu"><a class="dropdown-item elimnarMultimedia" href="'+rutaModulo+'/'+nombre+'" data-ruta="'+rutaModulo+'" data-href="'+multimedia[m]+'" data-nombre="'+nombre+'">Eliminar</a></div></div><span class="imagenCarga"> <img src="../assets/imagenes/carga.png" class="icono"></span><span class="porcentajeCarga"></span></div>';
			}	
			
			
			
		}      					      		
	}	        				   
	$('#'+subSeccionAuxiliar).append(htmlSub+'</div>');
	
	
}


function promiseSqrt(boton){
	return new Promise(function (fulfill, reject){
		
		
		setTimeout(function() {
			try{
				$( boton ).removeClass( "descargaDocumentos" ).addClass( "descargaProgreso" );
				let documentoNombre = $( boton ).find('span.documentoNombre').text();	
				$( boton ).find('span.documentoNombre').text(' Descargando...');
				console.log(documentoNombre);
				//descargar(boton, boton.href, boton.getAttribute("data-ruta"), 0, documentoNombre);				
			}catch(e){}
			fulfill({ value: 0 });
		}, 0 | Math.random() * 100);
	});
}

function eventosModulo(){
	var cancelar = 0;
	
	$(document).on('click', '#sincronizar', function (event) {		
		event.preventDefault();
		
		//Lectura de los modulos
		let datos = getSesion();
		let datos_modulo = datos.modulo[this.getAttribute("data-id")];		
				
		let botonesDocumentos = $( document ).find('a.descargaDocumentos');		
		let maximoDocumentos = botonesDocumentos.length;
		let actualDocumentos = 0;
		localStorage.setItem('finDocumentos', 2);
		
		let botonesMultimedia = $( document ).find('a.descargaMultimedia');		
		let maximoMultimedia = botonesMultimedia.length;
		let actualMultimedia = 0;
		localStorage.setItem('finMultimedia', 2);
		
		
		
		$( '#sincronizar' ).find('span.multimediaNombre').text("Cancelar");
		$( '#sincronizar' ).attr("id", "sincronizarCancelar");		
		$('#atrasprincipal').hide();
		$('.breadcrumb').html('<span id="textoCargar">Espere hasta descargar los contenidos.</span>');
		$( '#moduloresumen' ).attr("style", "margin-top: 61px");
		
		if(maximoDocumentos>0){
			$( botonesDocumentos[actualDocumentos] ).removeClass( "descargaDocumentos" ).addClass( "descargaProgreso" );
			let documentoNombre = $( botonesDocumentos[actualDocumentos] ).find('span.documentoNombre').text();	
			$( botonesDocumentos[actualDocumentos] ).find('span.documentoNombre').text(' Descargando...');
			console.log(documentoNombre);
			$( botonesDocumentos[actualDocumentos] ).closest('.col-md-6').find('span.imagenCarga').html('<img src="../assets/imagenes/carga.png" class="icono iconoCarga">');
			
			descargar(botonesDocumentos[actualDocumentos], botonesDocumentos[actualDocumentos].href, botonesDocumentos[actualDocumentos].getAttribute("data-ruta"), 0, documentoNombre, function callback(value, result) {
				if(result==0 && cancelar==0){
					if (++actualDocumentos === maximoDocumentos) {
						console.log('COMPLETED');
						localStorage.setItem('finDocumentos', 1);
						
						if(localStorage.getItem('finMultimedia')==1){
							$( '#sincronizarCancelar' ).find('span.multimediaNombre').text("Sincronizar todo");
							$( '#sincronizarCancelar' ).attr("id", "sincronizar");
							$('#atrasprincipal').show();
							$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
							$( '#moduloresumen' ).attr("style", "");
							
						}
					} else {					
						descargar(botonesDocumentos[actualDocumentos], botonesDocumentos[actualDocumentos].href, botonesDocumentos[actualDocumentos].getAttribute("data-ruta"), 0, documentoNombre, callback);
					}	
				}else{
					$( '#sincronizarCancelar' ).find('span.multimediaNombre').text("Sincronizar todo");
					$( '#sincronizarCancelar' ).attr("id", "sincronizar");		
					$('#atrasprincipal').show();
					$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
					$( '#moduloresumen' ).attr("style", "");
				}
				
			});
			
			/*botonesDocumentos.each(function(){        	    
				try{
					$( this ).removeClass( "descargaDocumentos" ).addClass( "descargaProgreso" );
					let documentoNombre = $( this ).find('span.documentoNombre').text();	
					$( this ).find('span.documentoNombre').text(' Descargando...');
					console.log(documentoNombre);
					$( this ).closest('.col-md-6').find('span.imagenCarga').html('<img src="../assets/imagenes/carga.png" class="icono iconoCarga">');
					descargar(this, this.href, this.getAttribute("data-ruta"), 0, documentoNombre);				
				}catch(e){}
        	});*/
			console.log(botonesDocumentos.length, botonesDocumentos[0]);
			
		}else{
			localStorage.setItem('finDocumentos', 1);
						
			if(localStorage.getItem('finMultimedia')==1){
				$( '#sincronizarCancelar' ).find('span.multimediaNombre').text("Sincronizar todo");
				$( '#sincronizarCancelar' ).attr("id", "sincronizar");		
				$('#atrasprincipal').show();
				$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
				$( '#moduloresumen' ).attr("style", "");
			}
		}
		
		if(maximoMultimedia>0){
			$( botonesMultimedia[actualMultimedia] ).removeClass( "descargaMultimedia" ).addClass( "descargaProgreso" );
			let multimediaNombre = botonesMultimedia[actualMultimedia].getAttribute("data-nombre");
			
			$( botonesMultimedia[actualMultimedia] ).closest('.col-md-6').find('span.imagenCarga').html('<img src="../assets/imagenes/carga.png" class="icono iconoCarga">');
			
			descargarMultimedia(botonesMultimedia[actualMultimedia], multimediaNombre, botonesMultimedia[actualMultimedia].href, botonesMultimedia[actualMultimedia].getAttribute("data-ruta"), function callbackM(value, result) {
				//console.log('END execution with value =', value, 'and result =', result);
				if(result==0  && cancelar==0){
					if (++actualMultimedia === maximoMultimedia) {
						//console.log('COMPLETED');
						localStorage.setItem('finMultimedia', 1);
						
						if(localStorage.getItem('finDocumentos')==1){
							$( '#sincronizarCancelar' ).find('span.multimediaNombre').text("Sincronizar todo");
							$( '#sincronizarCancelar' ).attr("id", "sincronizar");		
							$('#atrasprincipal').show();
							$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
							$( '#moduloresumen' ).attr("style", "");
						}
						
					} else {
						$( botonesMultimedia[actualMultimedia] ).removeClass( "descargaMultimedia" ).addClass( "descargaProgreso" );
						descargarMultimedia(botonesMultimedia[actualMultimedia], multimediaNombre, botonesMultimedia[actualMultimedia].href, botonesMultimedia[actualMultimedia].getAttribute("data-ruta"), callbackM);
					}
				}
			});
			
			/*botonesMultimedia.each(function(){        	    
				try{					
					$( this ).removeClass( "descargaMultimedia" ).addClass( "descargaProgreso" );
					let multimediaNombre = $( this ).find('span.multimediaNombre').text();
					$( this ).closest('.col-md-6').find('span.imagenCarga').html('<img src="../assets/imagenes/carga.png" class="icono iconoCarga">');
					descargarMultimedia(this, multimediaNombre, this.href, this.getAttribute("data-ruta"));			
				}catch(e){}
        	});*/
			//console.log(botonesMultimedia.length, botonesMultimedia[actualMultimedia]);
		}else{
			localStorage.setItem('finMultimedia', 1);
						
			if(localStorage.getItem('finDocumentos')==1){
				$( '#sincronizarCancelar' ).find('span.multimediaNombre').text("Sincronizar todo");
				$( '#sincronizarCancelar' ).attr("id", "sincronizar");
				$('#atrasprincipal').show();
				$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
				$( '#moduloresumen' ).attr("style", "");
			}
		}
		
	});
	
	$(document).on('click', '#sincronizarCancelar', function (event) {
		
		let nombre = url_borrar.split("/");		
		nombre = nombre[nombre.length-1];
		console.log(nombre);
		
		event.preventDefault();
		console.log("CANCELAR");
		dd.abort(); // to abort the download
		console.log("BORRRAR", url_borrar);
		fs.remove(url_borrar)
		.then(() => {			
		})
		.catch(err => {
		  console.error(err)
			
		});
		
		try{
			request(servidor+"api/contenidoZipEliminar?archivo=" + nombre, { json: true }, (err, res, body) => {			
				if (err) { 
					alert('Error al borrar: '+err);
				}
			});
		}catch(err){}
				
		location.reload();
		
		cancelar=1;
		
		$( '#sincronizarCancelar' ).find('span.multimediaNombre').text("Sincronizar todo");
		$( '#sincronizarCancelar' ).attr("id", "sincronizar");		
		$('#atrasprincipal').show();
		$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
		$( '#moduloresumen' ).attr("style", "");
		
	});	
	
	$(document).on('click', 'a.logoInicio', function (event) {		
		event.preventDefault();
		
		$('#recurso').removeAttr('src'); //Remover el attributo src evita q sigue emitiendo sonidos al salir del multimedia
		$('#modulosInicio').show();
		$('#moduloresumen, #multimedia, #atras, #recurso, #atrasmodulo, #atrasprincipal, #sincronizar').hide();
		$('#secciones, #titulo').html('');
		$('#parrafodescripcion').text('');
	});
	
	$(document).on('click', 'a.descargaMultimedia', function (event) {		
		event.preventDefault();
		
		$( this ).removeClass( "descargaMultimedia" ).addClass( "descargaProgreso" );
		let multimediaNombre = $( this ).find('span.multimediaNombre').text();
		$( this ).closest('.col-md-6').find('span.imagenCarga').html('<img src="../assets/imagenes/carga.png" class="icono iconoCarga">');
		
		$('#atrasprincipal').hide();
		$('.breadcrumb').html('<span id="textoCargar">Espere hasta descargar los contenidos.</span>');
		$( '#moduloresumen' ).attr("style", "margin-top: 61px");
		
		descargarMultimedia(this, multimediaNombre, this.href, this.getAttribute("data-ruta"));
	});
	
	$(document).on('click', 'a.multimedia', function (event) {		
		event.preventDefault();
		
		localStorage.setItem('nombreMultimedia', this.getAttribute("data-nombre"));
		
    	//let x = fs.readFileSync(carpetamodulos+'7/34f927/index.html', 'utf8');	
    	//console.log('RAW HTML', x);					    						    	
    	$('#moduloresumen, #atrasprincipal').hide();
		$('#multimedia').attr({
    		src : this.href
    	});		    	
    	$('#multimedia, #atras').show();
		$('#sincronizar').hide();
		$( '#contenedorModuloInicio' ).attr("class", "no-scroll");
		$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" ><a href="#" id="listaModulo">'+localStorage.getItem('nombreLibro')+'</a></li><li class="breadcrumb-item" id="listaContenido">'+this.getAttribute("data-nombre")+'</li>');
		
	});
	
	$(document).on('click', 'a.elimnarMultimedia', function (event) {	
		event.preventDefault();
				
		//console.log(this.href.substr(8));
		
		fs.remove(this.href.substr(8))
		.then(() => {
			let nombre = this.getAttribute("data-nombre");
			//console.log('#'+nombre+'_menu');
			$( '#'+nombre ).removeClass( "multimedia btn-info" ).addClass( "descargaMultimedia btn-outline-info" );	
			$( '#'+nombre+'_menu' ).removeClass( "btn-info" ).addClass( "btn-outline-info" );
			$( '#'+nombre+'_menu' ).hide();
			$( '#'+nombre ).attr("href", this.getAttribute("data-href"));			
			$( '#'+nombre ).attr("data-ruta", this.getAttribute("data-ruta"));
			$( this ).closest('.col-md-6').find('span.imagenCarga').html('<img src="../assets/imagenes/carga.png" class="icono">');
			$( this ).closest('.col-md-6').find('span.porcentajeCarga').text("");
		})
		.catch(err => {
		  console.error(err)
			alert('Error al eliminar el multimedia.');
		});
		
	});
	
	$(document).on('click', 'a.descargaDocumentos', function (event) {	
		event.preventDefault();
		
		$( this ).removeClass( "descargaDocumentos" ).addClass( "descargaProgreso" );
		let documentoNombre = $( this ).find('span.documentoNombre').text();	
		$( this ).find('span.documentoNombre').text(' Descargando...');
		$( this ).closest('.col-md-6').find('span.imagenCarga').html('<img src="../assets/imagenes/carga.png" class="icono iconoCarga">');
		
		$('#atrasprincipal').hide();
		$('.breadcrumb').html('<span id="textoCargar">Espere hasta descargar los contenidos.</span>');
		$( '#moduloresumen' ).attr("style", "margin-top: 61px");
		
		descargar(this, this.href, this.getAttribute("data-ruta"), 0, documentoNombre);
	});
	
	$(document).on('click', 'a.elimnarDocumentos', function (event) {	
		event.preventDefault();
		let nombre = this.getAttribute("data-nombre");
		console.log('#'+nombre+'_menu');
		$( '#'+nombre ).removeClass( "documentos btn-warning" ).addClass( "descargaDocumentos btn-outline-warning" );	
		$( '#'+nombre+'_menu' ).removeClass( "btn-warning" ).addClass( "btn-outline-warning" );
		$( '#'+nombre+'_menu' ).hide();
		$( '#'+nombre ).attr("href", this.getAttribute("data-href"));			
		$( '#'+nombre ).attr("data-ruta", this.getAttribute("data-ruta"));
		fs.unlinkSync(this.href.substr(8));
		$( this ).closest('.col-md-6').find('span.imagenCarga').html('<img src="../assets/imagenes/carga.png" class="icono">');
		$( this ).closest('.col-md-6').find('span.porcentajeCarga').text("");
	});

	$(document).on('click', 'a.documentos', function (event) {		
    	event.preventDefault();		
    	var urlAudio = this.href.substr(8);
		console.log(urlAudio);
		shell.openItem(urlAudio);		
    });
	
	$(document).on('click', 'a.vinculos', function (event) {		
    	event.preventDefault();				
		shell.openExternal(this.href);		
    });
		
	$('#atras').on('click', () => {	  	        		
		$('#moduloresumen, #atrasprincipal, #sincronizar').show();
		$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
		$('#atras, #multimedia').hide();
		$( '#contenedorModuloInicio' ).attr("class", "");
	});

	$('#atrasmodulo').on('click', () => {
		$('#recurso').removeAttr('src'); //Remover el attributo src evita q sigue emitiendo sonidos al salir del multimedia
		$('#multimedia, #atras').show();
		$('#recurso, #atrasmodulo').hide();
	});
	
	$('#atrasprincipal').on('click', () => {
		$('#recurso').removeAttr('src'); //Remover el attributo src evita q sigue emitiendo sonidos al salir del multimedia
		$('#modulosInicio').show();
		$('#moduloresumen, #multimedia, #atras, #recurso, #atrasmodulo, #atrasprincipal, #sincronizar').hide();
		$('#secciones, #titulo').html('');
		$('#parrafodescripcion').text('');
		$('.breadcrumb').html('<li class="breadcrumb-item">Inicio</li>');
	});
	
	$(document).on('click', '#listaInicio', function (event) {
		event.preventDefault();
    	location.reload();
    });
	
	$(document).on('click', '#listaModulo', function (event) {
		event.preventDefault();
    	$('#moduloresumen, #atrasprincipal, #sincronizar').show();
		$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
		$('#atras, #multimedia').hide();
		$( '#contenedorModuloInicio' ).attr("class", "");
		$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
    });
	
	$(document).on('click', '#listaRecurso', function (event) {
		event.preventDefault();
    	$('#recurso').removeAttr('src'); //Remover el attributo src evita q sigue emitiendo sonidos al salir del multimedia
		$('#multimedia, #atras').show();
		$('#recurso, #atrasmodulo').hide();
		
		$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" ><a href="#" id="listaModulo">'+localStorage.getItem('nombreLibro')+'</a></li><li class="breadcrumb-item" id="listaContenido">'+localStorage.getItem('nombreMultimedia')+'</li>');
    });
	
	
}

function resizeIframe(obj) {
	obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

function cargaPortadas(){
	
	var datos = getSesion();	
	var cont = 0;
	var total = Object.keys(datos.modulo).length-1;
	var carpetaToken = datos.token;
	carpetaToken = carpetaToken.replace(/\//g,'');
	
	$( '#mensajeLogin' ).text("Cargando portadas...");
	
	for(var elemento in datos.modulo){
		var datos_modulo = datos.modulo[elemento];
				
		try{
			fs.mkdirSync(carpetamodulos+carpetaToken);
		}catch(err){console.error(err);}
		
		try{
			fs.mkdirSync(carpetamodulos+carpetaToken+'/'+datos_modulo.modulo_id);
		}catch(err){console.error(err);}
		
		// Download to a directory and save with the original filename
		let nombrePortada = datos_modulo.portada.split('/');
		nombrePortada = nombrePortada[nombrePortada.length-1];
		
		const options = {
		  url: datos_modulo.portada,
		  dest: carpetamodulos+carpetaToken+'/'+datos_modulo.modulo_id+'/'+nombrePortada               // Save to /path/to/dest/image.jpg
		}

		downloadImage.image(options)
		  .then(({ filename, image }) => {			
			if(cont == total){
				$( '#mensajeLogin' ).text("");
				location.reload();
			}else{
				$( '#mensajeLogin' ).text("Cargando "+(cont+1)+" de "+total+" portadas");
				cont++;
			}
			
		  })
		  .catch((err) => {
			console.error(err);
			alert("Error al cargar las portadas, verifique su conexión de internet.");
			cont++;
		  })
	}
	
}

function descargar(boton, archivo, ruta, descomprimir=0, multimediaNombre="", callback){
	// Download to a directory and save with the original filename
	
	let  url = archivo;
	let  dest = ruta;
	let nombre = archivo.split("/");
	error = 0;
	nombre = nombre[nombre.length-1];
	nombre_carpeta = nombre.slice(0, -4);
	let id = boton.getAttribute("id");
	url_borrar = ruta+'/'+nombre;
		
	$('#atrasprincipal').hide();
	$('.breadcrumb').html('<span id="textoCargar">Espere hasta descargar los contenidos.</span>');
	$( '#moduloresumen' ).attr("style", "margin-top: 61px");
	
	option = {		
		dir: dest,
		onDone: (info)=>{
			
			
			
			if(descomprimir){
				//console.log("descomprimir");								
				$( boton ).find('span.multimediaNombre').text("Descomprimiendo...");
				descomprimirMultimedia(boton, ruta+'/'+nombre, ruta, multimediaNombre);				
			}else{
				let nombreBoton = boton.getAttribute("data-nombre");
				$( boton ).removeClass( "descargaProgreso btn-outline-warning" ).addClass( "documentos btn-warning" );				
				$( boton ).attr("href", ruta+'/'+nombre);
				$( boton ).find('span.documentoNombre').text(nombreBoton);				
				$( '#'+id+'_menu' ).show();
		 		$( '#'+id+'_menu' ).removeClass( "btn-outline-warning" ).addClass( "btn-warning" );
				$( boton ).closest('.col-md-6').find('span.imagenCarga').html('<img src="../assets/imagenes/visto.png" class="icono">');
				
				if(localStorage.getItem('finDocumentos')== 1 && localStorage.getItem('finMultimedia')==1){
					$('#atrasprincipal').show();
					$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
					$( '#moduloresumen' ).attr("style", "");	
				}
				
			}
			
			$( boton ).css("background-size", "0% " + "auto");
			
			try{
				//console.log('START execution with value =', boton);
				setTimeout(function() {
					callback(1, error);		
				}, 0 | Math.random() * 100);	
			}catch(err){}
			
			
		},
		onError: (err) => {			
			error = 1;
			if(descomprimir){
				$( boton ).removeClass( "descargaProgreso" ).addClass( "descargaMultimedia" );			
			}else{
				$( boton ).removeClass( "descargaProgreso" ).addClass( "descargaDocumentos" );				
			}
			
			if(localStorage.getItem('finDocumentos')== 1 && localStorage.getItem('finMultimedia')==1){
				$('#atrasprincipal').show();
				$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
				$( '#moduloresumen' ).attr("style", "");	
			}
			
			alert("Error al descargar el archivo, por favor verifique su conexión de internet.");
			
			try{
				console.log('START execution with value =', boton);
				setTimeout(function() {
					callback(1, error);		
				}, 0 | Math.random() * 100);	
			}catch(err){}
			
			
		},
		onProgress: (curr, total) => {
			let porcentaje = (curr / total * 100).toFixed(2);
			$( boton ).css("background-size", porcentaje+"% " + "auto");
			$( boton ).closest('.col-md-6').find('span.porcentajeCarga').text(" "+Math.round(porcentaje)+"%");
		},
	}

	dd = dl(url, option);
	
	
}

function descargarMultimedia(boton, multimediaNombre, url, ruta, callbackM){
	//console.log('this.href', "http://localhost:8081/red/public/api/contenidoZip?url=" + url);	
	
	let nombre = url.split("/");
	nombre = nombre[nombre.length-1];
	
	var errorM = 0;
	//console.log(servidor+"api/contenidoZip?url=" + url);
	$( boton ).find('span.multimediaNombre').text(' Procesando...');
	request(servidor+"api/contenidoZip?url=" + url, { json: true }, (err, res, body) => {
		let usuario = "";
		
	  	if (err) {
			$( boton ).removeClass( "descargaProgreso" ).addClass( "descargaMultimedia" );
			alert('Error en la descarga: '+err);
			errorM = 1;
			
			try{
				setTimeout(function() {
					callbackM(1, errorM);		
				}, 0 | Math.random() * 100);
			}catch(err){}
			
	  	}else{
			//console.log(body.status);
			if(body.status==200){
				try{
					fs.mkdirSync(ruta+'/'+nombre);
				}catch(err){}
				
				let archivo = servidor+'files/descargas/'+body.datos;
				//console.log(archivo);
				$( boton ).find('span.multimediaNombre').text(' Descargando...');				
				
				try{
					//console.log('START execution with value =', boton);
					//descargar(boton, archivo, ruta+'/'+nombre, 1, multimediaNombre);
					
					descargar(boton, archivo, ruta+'/'+nombre, 1, multimediaNombre, function callback(value, result) {
						//console.log('COMPLETED');
						
						setTimeout(function() {
							callbackM(1, result);		
						}, 0 | Math.random() * 100);
						
					});
					
						
				}catch(err){}
				
			}else{
				alert("No se puede obtener datos.");
				$( boton ).removeClass( "descargaProgreso" ).addClass( "descargaMultimedia" );
				errorM = 1;
				
				try{
					setTimeout(function() {
						callbackM(1, errorM);		
					}, 0 | Math.random() * 100);
				}catch(err){}
				
				

			}	
	  	}
	  
		
	});
}

function descomprimirMultimedia(boton, archivo, ruta, multimediaNombre=""){
	//console.log('descomprimir', archivo);
	let unzipper = new DecompressZip( archivo );
	let nombreBoton = boton.getAttribute("data-nombre");			
	//$('#cargandomodulo').toggle(); //.text('Cargando Modulo ...');

	// Add the error event listener
	unzipper.on('error', function (err) {
		console.log('evento error')
		  alert(err);
		  	
			if(localStorage.getItem('finDocumentos')== 1 && localStorage.getItem('finMultimedia')==1){
				$('#atrasprincipal').show();
				$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
				$( '#moduloresumen' ).attr("style", "");	
			}
	 });

	  // Notify when everything is extracted
	 unzipper.on('extract', function (log) {       
		//console.log('log es', log);
		let nombre = archivo.split("/");
		nombre = nombre[nombre.length-1]; 
		let nombre_carpeta = ruta.split("/");
		nombre_carpeta = nombre_carpeta[nombre_carpeta.length-1];
		 
		request(servidor+"api/contenidoZipEliminar?archivo=" + nombre, { json: true }, (err, res, body) => {			
			if (err) { 
				alert('Error al borrar: '+err);
			}
		});
		 
		 fs.unlinkSync(archivo);
		 
		 
		 //console.log('#'+nombre_carpeta+'_menu');
		 $( boton ).attr("href", ruta+'/'+'index.html');
		 $( boton ).removeClass( "descargaProgreso btn-outline-info" ).addClass( "multimedia btn-info" );
		 $( boton ).find('span.multimediaNombre').text(nombreBoton);
		 $( '#'+nombre_carpeta+'_menu' ).show();
		 $( '#'+nombre_carpeta+'_menu' ).removeClass( "btn-outline-info" ).addClass( "btn-info" );
		 $( boton ).closest('.col-md-6').find('span.imagenCarga').html('<img src="../assets/imagenes/visto.png" class="icono">');
		 
		 
		 
		 if(localStorage.getItem('finDocumentos')== 1 && localStorage.getItem('finMultimedia')==1){
			$('#atrasprincipal').show();
			$('.breadcrumb').html('<li class="breadcrumb-item"><a href="#" id="listaInicio">Inicio</a></li><li class="breadcrumb-item" >'+localStorage.getItem('nombreLibro')+'</li>');
			$( '#moduloresumen' ).attr("style", "");	
		 }
		 
		 	
		  //alert('Módulo cargado con éxito');
		  //$('#cargandomodulo').toggle();	         
		  //location.reload();
	 });

	 // Notify "progress" of the decompressed files
	 unzipper.on('progress', function (fileIndex, fileCount) {
		  //console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
		let porcentaje = ((fileIndex + 1) / fileCount * 100).toFixed(2);		
		$( boton ).closest('.col-md-6').find('span.porcentajeCarga').text(" "+Math.round(porcentaje)+"%");

	 });

	 unzipper.extract({
		  path: ruta		          
	 });  


}
