const express = require('express')/*Declarando constantes del servidor express y sus componentes para el uso de la app de FB Messenger*/
const bodyParser = require('body-parser')
const request = require('request')

//Este es id de token que nos dio FB
const APP_TOKEN = ''
var app = express()//creo un objeto de servidor express
app.use(bodyParser.json())//Para que express utilice el bodyparser

//Abrimos el puerto y mandamos un mensaje como test
app.listen(3000,function(){
  console.log('Servidor listo desde el localhost:3000')
})
//Como prueba mandamos un get como repuesta
app.get('/',function(req, res){
  res.send('Abriendo el puerto desde Mi Computadora con NgRock')
})
//Creamos el directorio de webhook para que funcione con la API de Facebook
app.get('/webhook',function(req, res){
  /*Esta condicion es importante ya que si no se implementa
  nos botara un error al querer hacer el callback de devolucion
  de llamada.*/
  //Si la verificion de token es igual a lo que pusimos en el cuadro
  //de texto que creamos entonces nos  mandamos a FB una confirmacion correcta
  if(req.query['hub.verify_token'] === 'hello_token'){
    res.send(req.query['hub.challenge'])//todo esto es de la API de FB
  }else{
    res.send('Tu no tienes que entrar prro')//En caso de error
  }
})
//Tambien el POSTT
app.post('/webhook',function(req, res){
  var datosFB = req.body //Aqui se almacenara cuando FB nos envie algo
  if (datosFB.object == 'page') { //Si el objeto de datos es una pagina de Facebook
    datosFB.entry.forEach(function(pageEntry){//Recorre por el arreglo de la data
      pageEntry.messaging.forEach(function(messagingEvent){//recorre dentro de otro del mensaje de evento
        if (messagingEvent.message) {//si el mensaje no esta vacio
          captaEnviaMensaje(messagingEvent)//invoco para que esta funcion lo haga todo
          //Este arreglo Json(nuetro BOT) le contestará al emisor
        }
      })
    })
  }
  res.sendStatus(200)
})
/*Los pasos son los siguiente:
1°Capta la DATA recogida de la API de FB del usuario emisor para nosotros
2°Guardamos el identificador de plataforma(Facebook web, messenger, lite, messenger web, app FB,etc.) en una variable
3°Guardamos el mensaje contenido que nos envia aquel usuario emisor
4°Evaluamos el mensaje para saber que responderle mediante un diccionario.
5°Preparamos el envio de nuestro mensaje hacia el usuario terminada.
6° Nos conectamos y enviamos a la API de Facebook para que este le envie al usuario
7°Listo terminado !!
*/
/*funcion que captura el evento del mensaje en si*/
function captaEnviaMensaje(messagingEvent){
  var IDemisor = messagingEvent.sender.id//Capturo el ID de ese mensaje
  var MensajeEmisor = messagingEvent.message.text//Capturo el mensaje en texto
  evaluarMensajeTexto(IDemisor, MensajeEmisor)
}
/*Evalua el mensaje mediante el diccionario para saber que mandar inteligentemente*/
function evaluarMensajeTexto(IDemisor, MensajeEmisor){
  var mensaje = '';
  var MensajeEmisor = MensajeEmisor.toLowerCase();//convierto a minuscula todo el texto enviado por el usuario emisor
  if (DiccionarioBot(MensajeEmisor, 'creador')){//Si encuentra esta palabra dentro del texto completo
    mensaje = 'Mi creador es Rodolfo Escalante Cumpa :) un programador muy divertido XD'//El bot le responde
  }else if(DiccionarioBot(MensajeEmisor,'amigos')){
    mensaje = 'La lista de amigos es muy larga, sin embargo te daré algunos: Jordy Ramirez Trejo, Samuel Diaz Encina, Yors Bravo Mendoza y Muchos mas :D'//default mensaje
  }else if (DiccionarioBot(MensajeEmisor,'novia')) {
    mensaje = 'Mi creador no tiene novia desde hace mucho tiempo :('
  }else if(DiccionarioBot(MensajeEmisor,'familia')){
    mensaje = 'Mi familia :/ son los  ESCALANTE ;)'
  } else if(DiccionarioBot(MensajeEmisor, 'llerva marihuana maldy copa caños')){
    mensaje = 'Es la mejor droga que existe jajaj :p'
  } else if(DiccionarioBot(MensajeEmisor,'tania')){
    mensaje = 'Fue una de mis enamoradas en el año 2011 y 2012 ah por cierto la más bonita xdd :D'
  } else if(DiccionarioBot(MensajeEmisor,'inteligente')){
    mensaje = 'Soy muy inteligente, de lo contrario no te estuviera respondiendo cada segundo :D'
  } else if(DiccionarioBot(MensajeEmisor,'funcionas boot') || DiccionarioBot(MensajeEmisor,'funciona tu algoritmo') || DiccionarioBot(MensajeEmisor,'funcionamiento de tu algoritmo') || DiccionarioBot(MensajeEmisor,'es tu algoritmo') ){
    mensaje = 'Mi algoritmo funciona así: Me conecto a los servicios de inteligencia artificial de Facebook mediante una API y luego desde un servidor externo empiezo a recibir y procesar la data que me envias. Tengo un arbol muy amplio de decisiones que compara los indices de los textos y palabras que me puedan enviar :D'
  }else if(DiccionarioBot(MensajeEmisor,'peru')){
    mensaje = 'Es el mejor Pais del mundo con una hermosa cultura y comida deliciosa xdd'
  }else if(DiccionarioBot(MensajeEmisor,'America')){
    mensaje = 'el mejor continente del mundo a nada XD'
  }else if(DiccionarioBot(MensajeEmisor,'cueto')) {
    mensaje = 'El instituto donde estudié informatica :D'
  }else if(DiccionarioBot(MensajeEmisor,'pump')){
    mensaje = 'Donde paso mayor parte de mi tiempo libre!! jugando y bailando :D ;) <3'
  }else if (DiccionarioBot(MensajeEmisor,'hardwell')) {
    mensaje = 'Uno de los mejores DJ´s del mundo ;) <3'
  }else if(DiccionarioBot(MensajeEmisor,'margin garrix')){
    mensaje = 'El mejor Dj del mundo, amo su canción IN THE NAME OF LOVE ft Bebe Rexha <3'
  }else if(DiccionarioBot(MensajeEmisor,'electronica')){
    mensaje = 'Es un genero musical muy buena! la mayoria de adolescentes y jovenes la esuchamos :D'
  }else if (DiccionarioBot(MensajeEmisor,'tu nombre')){
    mensaje = 'Mi nombre es WeBoot :D'
  }else if(DiccionarioBot(MensajeEmisor,'tu edad')){
    mensaje = 'Tengo 4 días de creación, aun estoy en desarrollo por eso puede que tenga deficiencias :('
  }else if(DiccionarioBot(MensajeEmisor,'musica favorita') || DiccionarioBot(MensajeEmisor,'musica te gusta')){
    mensaje = 'Me gusta mucho la musica electronica, en especial al DJ Martin Garrix y Marsmaloow <3'
  }else if(DiccionarioBot(MensajeEmisor,'de yors')){
    mensaje = 'Ese csmre es un pendejo que para llendo a putas nomas :v'
  }else if(DiccionarioBot(MensajeEmisor,'eres robot') || DiccionarioBot(MensajeEmisor,'eres un robot')){
    mensaje = 'No soy un robot, soy un boot inteligente que responde tus preguntas de manera rápida y sencilla'
  }else if(DiccionarioBot(MensajeEmisor,'el zelda')){
    mensaje = 'Aun no tengo pack prro! eso buscalo en google jajjajja :p'
  }
  else{
    mensaje = 'No puedo responderte esa pregunta, estoy en constante desarrollo. Dale hazme otra pregunta diferente ;)'
  }
  enviarMensajeTexto(IDemisor, mensaje)
}
/*Busca dentro del texto completo la palabra
para que asi el bot le responda en base a ello*/
function DiccionarioBot(texto, palabra){
  return texto.indexOf(palabra) > -1//busca la palbra
}
/*   */
function enviarMensajeTexto(IDemisor, mensaje){
  var MensajeBOT = {
    recipient:{//Recibidor de mensaje
      id: IDemisor,
    },
    message:{
      text: mensaje
    }
  }
  enviaraFacebook(MensajeBOT)//Le envia a Facebok el mensaje respondido por el BOT y este le envia al usuario emisor
}
function enviaraFacebook(MensajeBOT){
  //API de Facebook para regresarle a FB la respuesta
  //Utilizamos para el middleaware de REQUEST de EXPRESS
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',//API Graph de FB
     qs: {access_token: APP_TOKEN},//El token que nos dio FB
     method: 'POST',
     json: MensajeBOT//Los mensajes que enviara nuestro BOT mediante formato JSON
  },function(error, response, data){//En caso de error invocaeste callback
    if (error) {
      console.log('No es posible enviar el mensaje, error')
    }else{
      console.log('Mensaje enviado correctamente!')
    }
  })
}
