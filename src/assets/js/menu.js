function componenteItemMenu(numeroModulo, portada){	
	return '<div class="col-xl-2 col-md-3 col-sm-3" style="display: inherit; margin-top: 2vh;"><div class="card card-modulo" style="height: 100%;"><div class="card-content" style="height: 100%;"><div class="card-body" style="padding: 0 !important; height: 100%;"><a href="#" style="height: 100%;" id="idmodulo'+numeroModulo+'"><img src="'+portada+'" class="card-img-top img-fluid"><button class="btn btn-verde-modulo btn-modulos btn-modulos-portada">Ingresar</button></a></div></div></div></div>';
	
	/*return '<li class="nav-item"><i class="btn-outline-info la la-server"></i> <a id="idmodulo'+numeroModulo+
	        	'" class="nav-link active" href="#"  style="background-color: #fff; color: #42535b; display: inline; padding:0">'
	        	+nombreModulo+'</a></li>';*/
}