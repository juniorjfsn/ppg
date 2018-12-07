//========= menurender =============//
var menurender; 
(function (menurender) {

	//---------// 
	function geraTabela(json,imei) {
		//console.log(JSON.stringify(json));
		var tabela = ''; 
		/*  var params = location.getQueryParams();
		var posicao= parseInt(params['posicao']);   
		var lista = json[posicao];   */
		
		$('#nomeUsuario').empty().html(json.Nome); 
		
		if(json.UrlVolta != undefined && json.UrlVolta != null & json.UrlVolta != 'null' && json.UrlVolta != '' ){
			var UrlVolta =    'menu_dados.html?Url=' +codifica(json.UrlVolta + imei)     +'&Menu=' ;
			$('#linkVoltar').attr("href",UrlVolta);
		}else{
			$('#linkVoltar').attr("href","menu_dados.html");
		}
		 
		if(json.dados != undefined && json.dados != 'null'  && json.dados != '' && json.dados != null){
			var lista = json.dados; 
			 
			//$('#cosoleLogMenu').append(JSON.stringify(json));
			for (var aa = 0, dados_1 = lista ; aa < dados_1.length; aa++) {
				var linha = dados_1[aa]; 
				var Url = null ; 
				if(linha['Url'] != undefined &&  linha['Url'] != null && linha['Url'] != 'null' && linha['Url'] != ''){
					Url = linha['Url'] ; 
				}
				//endereco = Url.split("/"); 
				//var menuu1 = endereco[4]; 
				//var menuu = menuu1.split("?");   
				//console.log('menu : '+menuu[0]);
				/* 
				<div class="card"> 
					<a href="quemsomos.html" class="btn btn-primary" style="height:85px;">
					<span class="info-box-icon"><i class="fa fa-users"></i></span>  
					<br><h5 style="float:left;">QUEM SOMOS</h5></a> 
				</div>
				*/ 
				console.log(((linha['Grid'])? Url+ imei:Url + imei));
				var URLhref = '';
				var icone_fa = '';
				if(linha['Proc']){
					URLhref = "javascript:proc.procedimentoExterno('"+Url+imei+"')" ;
					icone_fa =  '<i class="fa fa-share-square-o" aria-hidden="true"></i>' ;
				}else{
					URLhref = ( (linha['Grid'])
					? 'dados.html?posicao=' + aa + '&Url='+codifica(Url + imei) +'&nomeusuario=' + $('#nomeUsuario').html() 
					: 'menu_dados.html?posicao=' + aa + '&Url=' +codifica(Url + imei)) +'&Menu=' + linha['Menu'] +'&nomeusuario=' + $('#nomeUsuario').html();
					icone_fa = ((linha['Grid'])?'<i class="fa fa-table" aria-hidden="true"></i>' : '<i class="fa fa-bars" aria-hidden="true"></i>');									
				} 
			 
				
				tabela += '<div class="col-lg-6 m-b-2"> <div class="card"> ' +  
				 ( (Url != null)
				 ? '<a  href="' + URLhref + '" class="btn btn-primary" style="line-height: 1.0;min-height:55px;color:#fff;'
					+((json.Cor != null)? 'background-color:'+json.Cor +';border-color:#bbb':'')+'"><span class="info-box-icon">' + icone_fa + '</span>' 
				 : '<a class="btn btn-primary" style="line-height: 1.0;min-height:55px; color:#fff;'
					+((json.Cor != null)? 'background-color:'+json.Cor +';border-color:#bbb' :''  )+'">'
				 );
			   
				tabela += '<br/>'; 
				tabela +=  '<h5  style="float:left;text-transform:uppercase;">' + linha['Menu']  + '</h5>'  ;
				
				if(linha['captions'].length > 0){
					var captions = linha['captions'];
					for (var jj = 0, ca = captions; jj < ca.length; jj++) {
						var capt = ca[jj];
						tabela += '';
						tabela += '<br/>' ; 
						tabela += '<h6 style="float:left;text-align:'+((capt.Centraliza)? 'center':'left' ) 
						+';width:100%;font-size:' + capt.TamFont + 'px;'
						+ ((capt.Negrito)? 'font-weight:700;' : '' ) +'color:' + ((json.Cor != null)? ''+json.Cor  :'#fff'  )  +'">'+ capt.Nome+ '</h6>' ;
						tabela += '<br/>'; 
					}
				}
				tabela +=  '</a> '
				+ '</div></div>' ;
				
			}
			if(json.Cor != null){ 
				$('#linkVoltar').css('background-color',json.Cor);
				$('#linkVoltar').css('border-color','#bbb');
			} 
			
		}else{  
			navigator.notification.alert('Menú inaccesible', alertDismissed, 'Erro', 'Fechar');  
		} 
		return tabela;
	}
	//---------//

	function carregaMenu(urljson,imei) {
		console.log(urljson);  
		var jqxhr = $.getJSON( urljson  , function() {
			//console.log( "success" );
		}).done(function(json) {
			$('#menu').empty().html( geraTabela(json,imei));
			//console.log( "second success" );
			$('#carregando').attr("src","");
			$('#carregando').attr("display","none");
		}).fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
		}).always(function() {
			//console.log( "complete" );
		}); 
	}
	//---------//
	menurender.carregaMenu = carregaMenu ;
	menurender.geraTabela = geraTabela;
})(menurender || (menurender = {}));
//========= menurender =============//


//========= proc =============//
var proc; 
(function (proc) {
	//---------// 
	function procedimentoExterno(Url){
		$.ajax({
			url: Url,
			method: "GET",
			cache: false,
			dataType: "json", 
			async : true,
			statusCode: {
				404: function() {  
					navigator.notification.alert('Página inaccesible', alertDismissed, 'Erro', 'Cerrar'); 
					console.log('Página inacessível');
				}
			}
		}).done(function( data, textStatus, jqXHR  ) {
			console.log('_____');
			console.log(textStatus);
			console.log('_____');
			console.log(jqXHR);
			console.log('_____'); 
			var json = data ; 
			navigator.notification.alert(json.Msg, alertDismissed, 'Mensaje', 'Cerrar');
			
		}).fail(function(jqXHR, textStatus, errorThrown  ) {  
			console.log('----------------');
			console.log( "Falha na requisição de dados : ");
			console.log(jqXHR); 
			console.log('....');
			console.log(textStatus);
			console.log('....');
			console.log(errorThrown);
			console.log('----------------');  
			navigator.notification.alert('No se pudo acceder a esta pantalla con sus respectivos datos', alertDismissed, 'Erro', 'Cerrar'); 
			$('#tabeladinamica').css("display","none");
		}).always(function() {
			console.log( "complete" );
		}); 
	}
	//---------//
	proc.procedimentoExterno = procedimentoExterno;
})(proc || (proc = {}));
//========= proc =============//