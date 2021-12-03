
let total = document.getElementById("sum");
let btnStart = document.getElementById("btn-start") ;
let msjePpal = document.getElementById("message-el");
let cardsEl = document.getElementById("cards-el");
let btnNewCard = document.getElementById("btnPedir");
let btnReset = document.getElementById("btn-Borrar");
let overlay = document.querySelector(".overlay");
let btnPlantarse = document.getElementById("btnPlantarse");
let btnsDOMJuegoIniciado = document.querySelector(".absolute-container");
let dealerBotDOM = document.getElementById("dealerBotDOM");
const btnRestarApuesta = document.querySelector(".restarApuesta");
const btnSumarApuesta = document.querySelector(".sumarApuesta");
let totalEfectivoDOM = document.getElementById("totalEfectivo");

let botCards = [];
const player = {
  name:"anónimo",
  efectivo:50,
  cartas:[],
}

let firstCard = 0
let secondCard = getRandomBetween ()
let sum = 0
let areWePlaying = false;
let isGameOver = false;


document.addEventListener("DOMContentLoaded",  ()=>{
  initializeCards();
})

function getRandomBetween ()  {
  return Math.floor(Math.random () * (10) + 1)                   
}
function initializeCards (){
  /*Esta funcion la llamo c/vez q termino un juego(ademas de al cargar), asi q
  esta bien reiniciar el array de cartas del player
  */
  sum = 0;
  player.cartas.length = 0
  botCards.length = 0;
  firstCard = getRandomBetween ()
  secondCard = getRandomBetween ()
  player.cartas.push(firstCard, secondCard)
  sum = firstCard + secondCard;
}

//-----------------------------------------------------------------
function startGame (){
  if(isGameOver){
    return renderizarNotificacion("Reiniciá el juego.")
  }
  if(!totalAApostar){
    return renderizarNotificacion("Hay que poner la papota.")
  }
  if(areWePlaying){
    return
  }
  document.getElementById(`startGame`).play();
  overlay.classList.remove("show")

  renderGame();

  areWePlaying = true;
  btnsDOMJuegoIniciado.style.display = "flex";
}
function newCard (){
  /*ESTA FUNCION ACTUALIZA SUM*/
 let newCard = getRandomBetween ();
 player.cartas.push(newCard)
   sum += newCard
   renderGame();
 }

function renderGame (){
  /*x las dudas q el timer q limpia las cartas siguiera activo*/
  stopInterval()
  dealerBotDOM.textContent =""; 
  cardsEl.textContent = "";

  let HTMLCartasPlayer = "Cartas: "
  let message =""
  for (let i = 0; i<player.cartas.length; i++) {
    //Ultima CARTA q muestra el TOTAL
    if (player.cartas.length-1 == i){
      HTMLCartasPlayer +=`<span class="cartaItem last" data-totalDinamico="Total: ${sum}">${player.cartas[i]}</span>`
    }else {
      HTMLCartasPlayer += `<span class="cartaItem">${player.cartas[i]}</span>`
    }   
  }
  cardsEl.innerHTML =  HTMLCartasPlayer
total.textContent = "Total: " + sum;
    if (sum <= 20) {
     message = "¿Querés otra carta?"
  } 
  else if (sum === 21) {
     message = "Ganaste!!!"
   blackJackWin();
  } else  {
    message ='Qué lástima. Mejor suerte para la próxima.'
    blackJackLose();
     }
  msjePpal.textContent = message
}

function blackJackWin (){
   player.efectivo +=totalAApostar
   document.getElementById(`applauseWin`).play();
  terminarJuego(`Ganaste €${totalAApostar}. 💵😀`,"¿Querés jugar otra partida? Hacé tu apuesta.")
}

function blackJackLose (){
   player.efectivo -=totalAApostar

   /*--------------GAME OVER----------------------------*/
   if(player.efectivo==0){
    document.getElementById(`gameOver`).play();
    isGameOver = true
     return terminarJuego("GAME OVER", "La próxima será...");
   }
   /*--------------------------------------------------*/

   document.getElementById(`gameLost`).play();
   terminarJuego(`Perdiste €${totalAApostar}. 😓`,"¿Querés jugar otra partida? Hacé tu apuesta.")
}


function terminarJuego(msjeOverlay, msjeenCasoGOver){
  overlay.classList.add("show");
  overlay.textContent = msjeOverlay;
  initializeCards();
  setTimeout( ()=>{
    totalEfectivoDOM.textContent = "Efectivo €"+player.efectivo;
    //reseteo el monto a apostar
    renderTotalApostarDOM(0)
    totalAApostar = 0;
    areWePlaying = false;
  },2000)
  setTimeout(()=>{
      msjePpal.textContent= msjeenCasoGOver;

  },3000) 
   limpiarDOMCartas(); 
}

let clearTime
function limpiarDOMCartas(){
   clearTime = setTimeout(()=>{
    dealerBotDOM.textContent =""; 
    cardsEl.textContent = "";
  },6000)
}
function stopInterval(){
  clearTimeout(clearTime);
}

//-----------------------------------------------------------------------
                            /*SECCION BOT EN ADELANTE*/

btnPlantarse.addEventListener("click",()=>{
  
  const first = getRandomBetween();
  const second =getRandomBetween();
  let totalBot = first + second;
  botCards.push(first,second)

  dealerBot(totalBot,botCards)
})
 
function dealerBot(totalBot,botCards){
  let cartasBotHTML="Cartas bot-dealer: "
   cartasBotHTML += botCards.map(function(carta, i){
    if (botCards.length-1 == i){
      return `<span class="cartaBot last" data-totalBotDinamico="Total: ${totalBot}">${carta}</span>`
    } else {
      return  `<span class="cartaBot">${carta}</span>`
    }
  }).join(" ")
   dealerBotDOM.innerHTML = cartasBotHTML;
  if(totalBot>21){
    return blackJackWin ()
  } else if (totalBot>sum){
   return blackJackLose ()
  } else if(totalBot>=17 && totalBot == sum){
    return terminarJuego("Empate técnico 😦", "¿Querés jugar otra partida? Hacé tu apuesta.")
  }else {
      /*Bot saca nueva carta y loopeamos nuevamente el proceso*/
  let extraBotCard = getRandomBetween();
  botCards.push(extraBotCard);
  totalBot+=extraBotCard;
  return dealerBot(totalBot,botCards);
  }

}

/*-----------------------NOTIFICACIONES-----------------------------------*/
function renderizarNotificacion(msje){
  let notificacionContainer = document.getElementById("notificaciones")
  notificacionContainer.textContent = msje;
  if(isGameOver){
    notificacionContainer.classList.add("showGameOver");
     setTimeout(()=>{
      notificacionContainer.classList.remove("showGameOver");
    },2000)
    return 
  }
  notificacionContainer.classList.add("show");
  setTimeout(()=>{
    notificacionContainer.classList.remove("show");
  },3000)
  
}


/*--------------------------------------------------------------------*/
let totalAApostar = 0;

function disminuirMontoBet(){
  if(isGameOver){
    return renderizarNotificacion("Reiniciá el juego.")
  }
  if (totalAApostar ==0||areWePlaying){
    return
  }
  totalAApostar -= 10;
  renderTotalApostarDOM(totalAApostar)
}

function aumentarMontoBet(){
  if(isGameOver){
    return renderizarNotificacion("Reiniciá el juego.")
  }
  if(areWePlaying){
    return
  }
  if (totalAApostar ==player.efectivo){
    return renderizarNotificacion("No hay más guita.")
  }
  totalAApostar += 10;
  renderTotalApostarDOM(totalAApostar)
}
function renderTotalApostarDOM(totalAApostar){
  let montoApuestaDOM = document.querySelector(".montoApuesta");
  let montoApuestaDOM2 = document.getElementById("totalApostado");
  montoApuestaDOM.textContent ="€"+ totalAApostar;
  montoApuestaDOM2.textContent=` Total a apostar: €${totalAApostar}`;
}
/*----------------------RESET-************************************/
btnReset.addEventListener("click", ()=>{
  if(isGameOver){
    return location.reload()
  }
  else if(confirm("¿Estás seguro que querés reiniciar el juego?  Todos esos euros que ganaste se van a evaporar.")){
      location.reload()
  }
})