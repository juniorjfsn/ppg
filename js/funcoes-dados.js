//========= dadosconta =============//
var dadosconta; 
(function (dadosconta) {
	//---------// 
	function geraTabelaDadosConta(json,dc) {

		var tabela = '';    
		var provento = 0;
		var desconto = 0;
		var saldo    = 0;
  
		var cab = json['cab'];
		var dados = json['dados']; 
		//var quantLin = json['QuantLin'];
		var tamFont = json['TamFont'];
		var altLin =  json['AltLin'];
		if(json['Resumo']){  
			var captions = json['captions']; 
			tabela += '<div class="info-box bg-green">'; 
			tabela += '<div class="info-box-content">'; 
			for (var jj = 0, ca = captions; jj < ca.length; jj++) {
				var caption_ = ca[jj];
				tabela += '<h6 class="info-box-text text-white" style="text-align:left;">'+caption_+'</h6>' ;
			}
			tabela += '</div>'; 
			tabela += '</div>';  
		}else{ 
		}
		 
		tabela += '<div class="info-box-text bg-orange" style="text-align:center;background-color:#eee;border-radius:5px;padding:7px 2px 1px 2px;">';
		tabela += '<h6   style="color:#fff;">'+json['Tabela']+ '</h6>'; 
		tabela += '</div>'; 
			
		tabela += '<div class="table-responsive" ><table id="dadosConta'+dc+'" class="table table-bordered table-striped">';

		var colunas = '';
		for (var aa = 0, cab_1 = cab; aa < cab_1.length; aa++) {
			var linha = cab_1[aa]; 
			colunas += (
						(linha['nome']==='Valor')
						?'<th style="font-size: '+tamFont+'px; height:'+altLin+'px;text-align:right;">' + linha['nome']+ '</th>'
						:'<th style="font-size: '+tamFont+'px; height:'+altLin+'px;">' + linha['nome']+ '</th>'
						);
		}
		var thead = '';
		thead += '<thead>';
		thead += '<tr>';   
		thead += colunas;
		thead += '</tr>';
		thead += '</thead>';
		tabela += thead; 
		tabela += '<tbody>'; 
		for (var bb = 0, dados_1 = dados; bb < dados_1.length; bb++) {
			var linha = dados_1[bb];
			tabela += '<tr>';
			for (var coluna in linha) {  
				if(coluna === 'Prov'){
					provento +=  linha[coluna] ;
				}else if(coluna === 'Desc') {
					desconto +=  linha[coluna]  ;
				} 
				var tdValor = '';
				if(coluna === 'Valor'){
					if(linha[coluna] != null && linha[coluna] != 'null'){
						if(linha[coluna] < 0 ){
							tdValor = '<td style="font-size: '+tamFont+'px; height:'+altLin+'px;width:33%;text-align:right;">' +'<span style="color:#b00;">'+ numeroParaMoeda(linha[coluna])+'</span> </td>';
						}else if( linha[coluna] == 0){
							tdValor = '<td style="font-size: '+tamFont+'px; height:'+altLin+'px;width:33%;text-align:right;">' +'<span style="color:#000;">'+ numeroParaMoeda(linha[coluna])+'</span> </td>';
						}else if(linha[coluna] > 0){
							tdValor = '<td style="font-size: '+tamFont+'px; height:'+altLin+'px;width:33%;text-align:right;">' +'<span style="color:#080;">'+ numeroParaMoeda(linha[coluna])+'</span> </td>';
						}else{
							tdValor = '<td style="font-size: '+tamFont+'px; height:'+altLin+'px;width:33%;text-align:right;">' + numeroParaMoeda(linha[coluna])+ '</td>';
						} 	  
					} 
				}else{
					tdValor = '<td style="font-size: '+tamFont+'px; height:'+altLin+'px;">' +linha[coluna]+ '</td>';
				} 
				tabela +=  tdValor ; 
			}
			tabela += '</tr>';
		}
		saldo =  (provento - desconto)  ;  
		tabela += '</tbody>';  
		tabela += '</table></div><br/><br/>';   
	 
		$('#tabeladinamica2').append(tabela);
	}
	 
	function tabelaDadosConta(UrlTable){
		$('#tabeladinamica2').empty().html(''); 
		//var qtde_tabelas = $('#qtde_tabelas').val();
		 $('#qtde_tabelas_conta').val(UrlTable.length);
		
		var dc = 1; 
		for (var abb = 0, urlConta = UrlTable; abb < urlConta.length; abb++) {
			console.log(urlConta[abb]);
			var jqxhr = $.getJSON( urlConta[abb], function() {
				console.log( "success" );
			}).done(function(json) {
				$('#tabeladinamica2').css("display","block");
				$.when(  geraTabelaDadosConta(json,dc)  ).then(function( data, textStatus, jqXHR ) { 
					console.log( 'tabelas da Conta: - ' + abb + ' - qtderegistros: ' + json.dados.length + ' - QuantLin: ' + json.QuantLin);	
					var var_bPaginate = (json.dados.length >= json.QuantLin )?true:false;	
					var var_info = (json.dados.length >= json.QuantLin )?true:false;	
					var var_searching = (json.dados.length >= json.QuantLin )?true:false;						
					$('#dadosConta' + dc ).DataTable({
						"language": { url : 'lib/DataTables/localisation/pt-BR.json' }
						//"ordering": false,
						,"bSort": false 
						,"bPaginate": var_bPaginate 
						,"info": var_info
						,"searching": var_searching
						,"lengthChange": false
					}); 
				});  
				console.log( "second success" );
			}).fail(function( jqxhr, textStatus, error ) {
				var err = textStatus + ", " + error;
				console.log( "Request Failed: " + err );
				$('#tabeladinamica2').css("display","none");
			}).always(function() {
				console.log( "complete" );
			});
			dc++;
		}   
	}
 
	//---------//
	dadosconta.geraTabelaDadosConta = geraTabelaDadosConta;
	dadosconta.tabelaDadosConta = tabelaDadosConta;
})(dadosconta || (dadosconta = {}));
//========= dadosconta =============//

//========= renderizador =============//
var renderizador; 
(function (renderizador) {
	
	//---------// 
	function geraTabela(json,urljson,imei) {  
		
		var params   = location.getQueryParams();
		var Menu     = params['Menu'] ;   
		
		dadosconta.tabelaDadosConta(json.UrlTable);
		var tabelas = json.tabelas ;
		$('#qtde_tabelas').val(json.tabelas.length);
		
		if(json['Combo']){ 
			var TxtAnt = json.ComboUrls.Anterior['TxtAnt'];
			var UrlAnt = json.ComboUrls.Anterior['UrlAnt'];
			console.log('UrlAnt : '+UrlAnt);
			if(TxtAnt != null && TxtAnt != '' && UrlAnt != null && UrlAnt != '' ){
				if(urljson != (UrlAnt+imei) ){ 
				console.log('UrlAnt: '+UrlAnt);  
					//$('.anterior').empty().html('<a  class="btn btn-secondary" href="dados.html?Url=' +codifica(UrlAnt+imei) +'&Menu=' + Menu +'"   ><i class="fa fa-mail-reply"></i>  '+TxtAnt+'</a>');
					$('.anterior').empty().html('<a  class="btn btn-secondary" href="javascript:renderizador.carregaDadosDaGrid(\'' +(UrlAnt+imei) +'\',\''+imei+'\')"><i class="fa fa-mail-reply"></i>  '+TxtAnt+'</a>');
					$('.anterior').css('display','block');
				}else{
					$('.anterior').css('display','none');
				}
			}else{
				$('.anterior').css('display','none');
			} 
			var TxtProx = json.ComboUrls.Proximo['TxtProx'];
			var UrlProx = json.ComboUrls.Proximo['UrlProx']; 
			if(TxtProx != null && TxtProx != '' && UrlProx != null && UrlProx != '' ){   
				if(urljson != (UrlProx+imei) ){ 
					console.log('UrlProx: '+UrlProx);  
					//$('.proximo').empty().html('<a class="btn btn-secondary" href="dados.html?Url=' +codifica(UrlProx+imei) +'&Menu=' + Menu +'" style="float:right;" >'+TxtProx+'  <i class="fa fa-mail-forward"></i></a>');  
					$('.proximo').empty().html('<a class="btn btn-secondary" href="javascript:renderizador.carregaDadosDaGrid(\'' +(UrlProx+imei) +'\',\''+imei+'\')" style="float:right;" >'+TxtProx+'  <i class="fa fa-mail-forward"></i></a>');  
					$('.proximo').css('display','block');
				}else{
					$('.proximo').css('display','none');
				}
			}else{
				$('.proximo').css('display','none');
			}
		}else{ 
			$('#caixaAnteriorProximo').css('display','none');
		}
		
	  
		var caixalaranja = '';
		if(json['Resumo']){   
			$('#caixalaranja').empty().html();
			$('#resumoLiquido').css("display","block");
			var captions = json['captions'];   
			for ( var jj = 0, ca = captions; jj < ca.length; jj++ ) {
				var capt = ca[jj]; 
				caixalaranja += '<h6 class="info-box-text" style="text-align:'+( (capt.Centraliza)? 'center':'left' )
				+';font-size:'+capt.TamFont+'px;'+((capt.Negrito)? 'font-weight:700;' :''  )+' color:' + ( (capt.ResumoCor != null)? ''+capt.ResumoCor  :'#fff'  ) + '">'+capt.Nome+'</h6>' ;
			}   
			$('#caixalaranja').empty().html(caixalaranja);
			

		}else{ 
			$('#resumoLiquido').css("display","none"); 
		}
		
		var tabela = '';   
		for (var aaa = 0, dad = tabelas; aaa < dad.length; aaa++) {
			var provento = 0;
			var desconto = 0;
			var saldo    = 0;
			var tabe = dad[aaa];
			var quantLin = tabe['QuantLin'];
			var tamFont = tabe['TamFont'];
			var altLin =  tabe['AltLin'];
			//console.log(JSON.stringify(tabe));
			var cab = tabe['cab'];
			var dados = tabe['dados']; 
 
			if(tabe['Resumo']){ 
				// $('#saldo').empty().html(json.SaldoGeral);
				
				if(tabe.ResumoCor != null){
					//console.log('tabe.ResumoCor : ' + tabe.ResumoCor );
					$('#linkVoltar').css('background-color', tabe.ResumoCor);
					$('#linkVoltar').css('border-color','#bbb');
					tabela += '<div class="info-box" style="background-color:'+tabe.ResumoCor +';">'; 
				}else{
					tabela += '<div class="info-box bg-blue">'; 
				}

				// $('#caixalaranja').append('<h5 class="text-white" style="text-align:center;">'+caption_+'</h5>' );
				
				// tabela += '<div class="info-box '+((tabe.ResumoCor != null)? '': 'bg-blue')+'" style="'+((tabe.ResumoCor != null)? 'background-color:'+tabe.ResumoCor +';' :''  )+'">'; 
				
				tabela += '<div class="info-box-content">'; 
				var captions = tabe['captions'];
				for (var jj = 0, ca = captions; jj < ca.length; jj++) {
					var capt = ca[jj];
					tabela += '<h6 class="info-box-text text-white" style="text-align:'+((capt.Centraliza)? 'center':'left' )
					+';font-size:'+capt.TamFont+'px;'+((capt.Negrito)? 'font-weight:700;' :''  )+'color:'+((capt.ResumoCor != null)? ''+capt.ResumoCor  :'#fff'  )+'">'+capt.Nome+'</h6>' ;
				}
				tabela += '</div>'; 
				tabela += '</div>';  
			/*	"Nome": "Valor líquido: R$ 446,25",
          "TamFont": 14,
          "Negrito": true
		  */
			}else{
				
			}
			tabela += '<div class="info-box-text bg-orange" style="text-align:center;background-color:#eee;border-radius:5px;padding:7px 2px 1px 2px;">';
			tabela += '<h6   style="color:#fff;">'+tabe['Tabela']+ '</h6>'; 
			tabela += '</div>'; 
			
			tabela += '<div class="table-responsive" ><table id="example'+(aaa+1)+'" class="table table-bordered table-striped">';

			var colunas = '';
			for (var aa = 0, cab_1 = cab; aa < cab_1.length; aa++) {
				var linha = cab_1[aa]; 
				colunas += (
							(linha['nome']==='Valor')
							?'<th style="font-size: '+tamFont+'px; height:'+altLin+'px;text-align:right;">' + linha['nome']+ '</th>'
							:'<th style="font-size: '+tamFont+'px; height:'+altLin+'px;">' + linha['nome']+ '</th>'
							);
			}
			var thead = '';
			thead += '<thead>';
			thead += '<tr>';   
			thead += colunas;
			thead += '</tr>';
			thead += '</thead>';
			tabela += thead;
		 
			tabela += '<tbody>';
			
			for (var bb = 0, dados_1 = dados; bb < dados_1.length; bb++) {
				var linha = dados_1[bb];
				tabela += '<tr style="height:'+altLin+'px;">';
				for (var coluna in linha) {  
					if(coluna === 'Prov'){
						provento +=  linha[coluna] ;
					}else if(coluna === 'Desc') {
						desconto +=  linha[coluna]  ;
					}  
					var tdValor = '';
					if(coluna === 'Valor'){
						if(linha[coluna] != null && linha[coluna] != 'null'){
							if(linha[coluna] < 0 ){
								tdValor = '<td style="font-size: '+tamFont+'px;  height:'+altLin+'px; width:33%;text-align:right;">' +'<span style="color:#b00;">'+ numeroParaMoeda(linha[coluna])+'</span> </td>';
							}else if( linha[coluna] == 0){
								tdValor = '<td style="font-size: '+tamFont+'px;  height:'+altLin+'px; width:33%;text-align:right;">' +'<span style="color:#000;">'+ numeroParaMoeda(linha[coluna])+'</span> </td>';
							}else if(linha[coluna] > 0){
								tdValor = '<td style="font-size: '+tamFont+'px;  height:'+altLin+'px; width:33%;text-align:right;">' +'<span style="color:#080;">'+ numeroParaMoeda(linha[coluna])+'</span> </td>';
							}else{
								tdValor = '<td style="font-size: '+tamFont+'px;  height:'+altLin+'px; width:33%;text-align:right;">' + numeroParaMoeda(linha[coluna])+ '</td>';
							} 	  
						} 
					}else{
						tdValor = '<td style="font-size: '+tamFont+'px;  height:'+altLin+'px; ">' +linha[coluna]+ '</td>';
					}
					tabela +=  tdValor ; 
				}
				tabela += '</tr>';
			}
			saldo =  (provento - desconto)  ; 
			$('#infoTabelas').append('<div id="infoTabela'+(aaa+1)+'">{ "qtderegistros": '+ dados.length +', "provento": '+ provento +', "desconto": '+ desconto +', "saldo": '+ saldo +' }</div>');
			tabela += '</tbody>'; 
			/*
			var tfoot = '';
			tfoot += '<tfoot>';
			tfoot += '<tr>';  
			tfoot += colunas;
			tfoot += '</tr>';
			tfoot += '</tfoot>';
			tabela += tfoot;  
			*/
			tabela += '</table></div>';   
		} 
		return tabela;
	}
	 
	//---------//
	function carregaDadosDaGrid(urljson,imei) {
		$.ajax({
			url: urljson,
			method: "GET",
			cache: false,
			dataType: "json", // text, html, xml, json, jsonp, script.  
			async : true,
			statusCode: {
				404: function() { 
					navigator.notification.alert('Datos inaccesibles', alertDismissed, 'Error', 'Cerrar'); 
					console.log('Pantalla inaccesible');
				}
			}
		}).done(function( data, textStatus, jqXHR  ) {
			console.log('_____');
			console.log(textStatus);
			console.log('_____');
			console.log(jqXHR);
			console.log('_____');
			
			$('#tabeladinamica').css("display","block");
			
			var json = data ;
			
			// $('#nome_usuario').empty().html(json.Nome);   
			$('#tituloMenu').empty().html(json.Titulo); 
			// $('#periodo').empty().html(json.Periodo); 
			
            if(json.Nome != undefined  && json.Nome != null && json.Nome != 'null' && json.Nome != '' )
            {
                $('#nomeUsuario').empty().html(json.Nome);
            }
			
            var UrlVolta = 'menu_dados.html?Url=' + codifica(json.UrlVolta + imei) + '&Menu=' ;
			$('#linkVoltar').attr("href",UrlVolta);

			
			if(json.tabelas != undefined){
				$.when(  
					$('#tabeladinamica').empty().html( renderizador.geraTabela(json,urljson,imei) )
				).then(function( data, textStatus, jqXHR ) {   
					var qtde_tabelas = $('#qtde_tabelas').val();
					for (var bb = 1 ; bb <= qtde_tabelas; bb++) { 
						// $('#infoTabelas').append('<div>{ "qtderegistros": '+ dados_1.length +'}</div>');
						// var infoTabela = JSON.parse($('#infoTabela'+bb).html()); 
						console.log( 'infoTabela - '+bb+' - qtderegistros: '+json.tabelas[(bb-1)].dados.length+' - QuantLin: '+json.tabelas[(bb-1)].QuantLin); 
						

						var iDisplayLength =  json.tabelas[(bb-1)].QuantLin;
						var var_pageLength =  json.tabelas[(bb-1)].QuantLin;
						
						var var_bPaginate = (json.tabelas[(bb-1)].dados.length >  json.tabelas[(bb-1)].QuantLin )?true:false;
						var var_info = (json.tabelas[(bb-1)].dados.length > json.tabelas[(bb-1)].QuantLin )?true:false;
						var var_searching = (json.tabelas[(bb-1)].dados.length >  json.tabelas[(bb-1)].QuantLin )?true:false;
						$('#example' + bb).DataTable({
							"language": {  url: 'lib/DataTables/localisation/pt-BR.json' } 
							,"pagingType": "numbers"
							,"ordering": false
							,"bSort": false  	
							,"lengthMenu":[5,7,10,15, 20, 25, 35 , 40, 50, 60, 70, 100,var_pageLength ]
							,"iDisplayLength": iDisplayLength  
							,"pageLength": var_pageLength 
							,"bPaginate": var_bPaginate 
							,"info": var_info
							,"searching": var_searching
							,"lengthChange": false
						});
					}  
					$('#carregando').attr("src","");
					$('#carregando').css("display","none");
				});  
			}else{  
				navigator.notification.alert('Datos inaccesibles', alertDismissed, 'Error', 'Cerrar'); 
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
			navigator.notification.alert('No se pudo acceder a esta pantalla con sus respectivos datos', alertDismissed, 'Error', 'Cerrar'); 
			$('#tabeladinamica').css("display","none");
		}).always(function() {
			console.log( "complete" );
		}); 
		//========= get Dados JSON =============//
	}
	//---------//
	renderizador.geraTabela = geraTabela;
	renderizador.carregaDadosDaGrid = carregaDadosDaGrid;
})(renderizador || (renderizador = {}));
//========= renderizador =============//



