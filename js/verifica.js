//========= verifica =============//
var verifica;
(function (verifica) { 
	//---------//
	function verificaRegistro(servidor,imei){
		var retorno = false;
		var verlink = servidor+'/webapippg/VerificaLogin?imei='+imei ;
		console.log(verlink);
		$.ajax({
			url: verlink,
			method: "GET",
			cache: false,
			dataType: "json",
			async : false,
			statusCode: {
				404: function() { 
					console.log('Servidor inacessível');
				}
			}
		}).done(function( data, textStatus, jqXHR  ) { 
			json = data ;  
			$('.linklogado').css("display","none");
			if(json.Registrado){
				$('.linklogado').css("display","block");	
				$('#nomeUsuario').empty().html(limitarString(json.Nome,40));
				retorno = true;
			}else{
				$('.linklogado').css("display","none");
				retorno = false; 
			}
		}).fail(function(jqXHR, textStatus, errorThrown  ) {  
			/*
			console.log('----------------');
			console.log( "Error en la solicitud de datos : ");
			console.log(jqXHR); 
			console.log('....');
			console.log(textStatus);
			console.log('....');
			console.log(errorThrown);
			console.log('----------------'); 
			*/
			$('.linklogado').css("display","none");
		}); 
		return retorno ;
	}
	//---------//
	function verificaRegistroLogout(servidor,imei){
		var retorno = false;
		var verlink = servidor+'/webapippg/VerificaLogin?imei='+imei ;
		console.log(verlink);
		$.ajax({
			url: verlink,
			method: "GET",
			cache: false,
			//dataType: "json",
			async : false,
			statusCode: {
				404: function() { 
					console.log('Servidor inacessível');
				}
			}
		}).done(function( data, textStatus, jqXHR ) { 
			json = data ;   
			if(json.Registrado ){ 
				sugereLogout(json.Cpf);
				retorno = true;
			}else{
				sugereLogin();
				retorno = false; 
			}   
			
		}).fail(function(jqXHR, textStatus, errorThrown  ) {  
			console.log('----------------');
			console.log( "Error en la solicitud de datos : ");
			console.log(jqXHR); 
			console.log('....');
			console.log(textStatus);
			console.log('....');
			console.log(errorThrown);
			console.log('----------------'); 
 
			sugereLogin(); 
		}); 
		return retorno ;
	}
	
	function sugereLogin(){
		$('#login').css("display","block");
		$('#LogoutUsuario').css("display","none");
		$('.linklogado').css("display","none");
	}
	
	function sugereLogout(cpf_usuario){
	
		$('#formLogin input[name^="cpf_usuario"]').val(cpf_usuario);
		$('.linklogado').css("display","block");	 
		  
		$('#nomeUsuario').empty().html(limitarString(json.Nome,45)); 
		$('#LogoutUsuario').css("display","block");
		$('#login').css("display","none");
	}
	
	function limitarString(str, size){
		if (str==undefined || str=='undefined' || str =='' || size==undefined || size=='undefined' || size ==''){
			return str;
		} 
		var shortText = str;
		if(str.length >= size+3){
			shortText = str.substring(0, size).concat(' ...');
		}
		return shortText;
	}
	//sdfsdfsd sdf asdf asdf a asdf asdf 435  asdfasgf
	//---------//
	verifica.verificaRegistro = verificaRegistro; 
	verifica.verificaRegistroLogout = verificaRegistroLogout; 
})(verifica || (verifica = {})); 
//========= verifica =============//

//========= autentica =============//
var autentica;
(function (autentica) { 

	//---------//
	function efetuarToken(token, imei) { 
		var Url =  servidor+'/webapippg/ConfirmaAcesso?imei='+imei+'&codigo='+token+''  ;
		console.log(Url);

		var jqxhr = $.getJSON( Url , function() {
			console.log( "success" );
		}).done(function(json) {
			try {
				if (json.Cod === 0) {
					//alert(json.Msg);
					navigator.notification.alert(json.Msg, alertDismissed, 'Mensaje', 'Cerrar'); 
					window.location.href="menu_dados.html";
				} 
				else if(json.Cod === 1) { 
					navigator.notification.alert(json.Msg, alertDismissed, 'Atención', 'Cerrar');
				}
				else if(json.Cod === 3) {
					navigator.notification.alert(json.Msg, alertDismissed, 'Atención', 'Cerrar'); 
				}else if(json.Cod === 4) {
					navigator.notification.alert(json.Msg, alertDismissed, 'Atención', 'Cerrar'); 
				} 
			} catch (e) {
				console.log(e.message); 
			}
		}).fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
		});  
	} 
	//---------//
	function efetuarLogin(cpf, nascimento, imei){  
		var newcpf = cpf.replace(/[^\d]+/g,'')
		var Url = servidor+'/webapippg/Login?cpf='+newcpf+'&nascimento='+nascimento+'&imei='+imei+'';	
		console.log(Url); 
		var jqxhr1 = $.getJSON( Url  , function() {
			console.log( "success" );
		}).done(function(json) { 
			console.log(JSON.stringify(json)); 
			try {  
				if (json.Cod === 2) {  
					navigator.notification.alert(json.Msg, alertDismissed, 'Mensaje', 'Cerrar'); 
					$('#LoginToken').css('display','block');
					$('#login').css('display','none');
				} 
				else if(json.Cod === 1) {
					navigator.notification.alert(json.Msg, alertDismissed, 'Atención', 'Cerrar');  
				} else if(json.Cod === 3) {
					navigator.notification.alert(json.Msg, alertDismissed, 'Atención', 'Cerrar');  

				}else if(json.Cod === 4) {
					navigator.notification.alert(json.Msg, alertDismissed, 'Atención', 'Cerrar');   
				} else if(json.Cod === 0) { 
					navigator.notification.alert(json.Msg, alertDismissed, 'Mensaje', 'Cerrar'); 
					window.location.href="menu_dados.html";
				} 
			} catch (e) {
				console.log(e.message); 
			}
			console.log( "second success" );
		}).fail(function( jqxhr, textStatus, error ) {
			//alert('Servidor não encontrado!  : '   + Url);  
			navigator.notification.alert('Servidor no encontrado!  : ', alertDismissed, 'Error', 'Cerrar');  
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
		}).always(function() {
			console.log( "complete" );
		});  
	}
	
	//---------//
	function efetuarLogout(cpf,  imei){  
		var newcpf = cpf.replace(/[^\d]+/g,'')
		var Url = servidor + '/webapippg/Logout?imei='+imei+'';	
		console.log(Url); 
		var jqxhr1 = $.getJSON( Url  , function() {
			console.log( "success" );
		}).done(function(json) { 
			console.log(JSON.stringify(json)); 
			// {"Cod":0,"Msg":"Seu Aparelho foi desconecato do IAJA com sucesso !!","Url":"https://appiaja.adventistas.org/webapippg/MainMenu/imei="}
			try {   
				if (json.Cod === 0) {  
					navigator.notification.alert(json.Msg, alertDismissed, 'Mensaje', 'Cerrar'); 
					window.location.href="index.html";
				} else if(json.Cod === 4) { 
					navigator.notification.alert(json.Msg, alertDismissed, 'Mensaje', 'Cerrar'); 
					window.location.href="login.html";
				} 
			} catch (e) {
				console.log(e.message); 
			}
			console.log( "second success" );
		}).fail(function( jqxhr, textStatus, error ) {
			//alert('Servidor não encontrado!  : '   + Url);  
			navigator.notification.alert('Servidor no encontrado!  : ', alertDismissed, 'Error', 'Cerrar');  
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
		});  
	}
	
	//---------//
	autentica.efetuarToken = efetuarToken;  
	autentica.efetuarLogin = efetuarLogin;  
	autentica.efetuarLogout = efetuarLogout;  
})(autentica || (autentica = {})); 
//========= autentica =============//

