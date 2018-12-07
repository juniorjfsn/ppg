// from Ideal.js (https://github.com/webarthur/ideal.js)
window.location.getQueryParams = function(query) {

    // se o parâmetro query não foi definido pega o parâmetro da URL
    if (!query) {
        query = window.location.search.substring(1)
    }

    var l = query.length
    var q = {} // objeto a ser retornado
    var n = '' // nome
    var v = '' // valor
    var t = false

    // percorre os caracteres da variavel "query"
    for (var i = 0; i < l; i++) {
        // pega o caractere
        var c = query[i]

        // caso o caractere seja = passa a armazenar os caracteres como valor
        if (c === '=') {
            t = true
        }
        // caso o caractere seja & ou seja o último caractere
        else if (c === '&' || i === l - 1) {
            if (i === l - 1) {
                v += (c === '+') ? ' ' : c
            }
            // armazena no objeto de retorno
            q[n] = decodeURIComponent(v)

            // reinicia variáveis
            t = false
            n = ''
            v = ''
        }
        // caso a variável não seja igual a interrogação
        else if (i > 0 || c !== '?') {
            // armazena como valor
            if (t) {
                // redefine caractere "+" como espaço
                v += (c === '+') ? ' ' : c
            }
            // armazena como nome
            else {
                n += c
            }
        }
    }

    // retorna objeto
    return q
} 


// from Ideal.js (https://github.com/webarthur/ideal.js)
window.location.getQueryParam = function(name, query) {
  
  // se o parâmetro query não foi definido pega o parâmetro da URL
  if (!query) {
    query = window.location.search
  }
  
  var l = query.length
  var n = '' // nome
  var v = '' // valor
  var t = false
  
  // percorre os caracteres da variavel "query"
  for (var i=0; i<l; i++) {
    var c = query[i]
    
    // caso o caractere seja = passa a armazenar os caracteres como valor
    if (c==='=') {
      t = true
    }
    // caso o caractere seja & ou seja o último caractere
    else if (c==='&' || i===l-1) {
      
      // se for o parâmetro desejado, retorna o valor
      if (n===name) {
        if (i===l-1) {
          v += (c === '+') ? ' ' : c
        }
        return decodeURIComponent(v)
      }
      
      // senão, reinicia as variáveis de controle
      t = false
      n = ''
      v = ''
    }
    // caso a variável não seja igual a interrogação
    else if (i>0 || c!=='?') {
      // armazena como valor
      if (t) {
        // redefine + como espaço
        v += (c === '+') ? ' ' : c
      }
      // armazena como nome
      else {
        n += c
      }
    }
  }
}

function codifica(str) {
    var arr = [];
    for (var i = 0, l = str.length; i < l; i ++) {
    var hex = Number(str.charCodeAt(i)).toString(16);
    arr.push(hex);
    }
    return arr.join('');
}

function descodifica(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function numeroParaMoeda(n, c, d, t){
	c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

