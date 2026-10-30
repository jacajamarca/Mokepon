const sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque")
const sectionReiniciar = document.getElementById ("Reiniciar")
const botonMascotaJugador = document.getElementById("boton-mascota")
const botonFuego = document.getElementById ("boton-fuego")
const botonAgua = document.getElementById ("boton-agua")
const botonTierra = document.getElementById ("boton-tierra")
const botonReiniciar = document.getElementById("boton-reiniciar")

const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota")
const inputHipodoge = document.getElementById('Hipodoge')
const inputCapipepo = document.getElementById('Capipepo')
const inputRatigueya = document.getElementById('Ratigueya')
const spanMascotaJugador = document.getElementById ("mascota-jugador")

const spanMascotaEnemigo = document.getElementById("mascota-enemigo")

const spanVidasJugador = document.getElementById("vidas-jugador")
const spanVidasEnemigo = document.getElementById("vidas-enemigo")

const sectionMensajes = document.getElementById("resultado")
const ataquesDelJugador = document.getElementById("ataques-del-jugador")
const ataquesDelEnemigo = document.getElementById("ataques-del-enemigo")

let mokepones = []
let ataqueJugador
let ataqueEnemigo
let vidasjugador = 3
let vidasEnemigo = 3

class mokepon{
    constructor(nombre, foto, vida){
        this.nombre = nombre
        this.vida = vida
        this.foto = foto
        this.ataques = []
    }
}
let hipodoge = new mokepon ("Hipodoge", "./assets/mokepons_mokepon_hipodoge_attack.png", 5 )
let capipepo = new mokepon ("Capipepo", "./assets/mokepons_mokepon_capipepo_attack.png", 5)
let ratigueya = new mokepon ("Ratigueya", "./assets/mokepons_mokepon_ratigueya_attack.png", 5)

hipodoge.ataques.push(
    {nombre: "💧", id : "boton-agua"}
    {nombre: "💧", id : "boton-agua"}
    {nombre: "💧", id : "boton-agua"}
    {nombre: "🔥", id : "boton-fuego"}
    {nombre: "🌱", id : "boton-tierra"}
)
capipepo.ataques.push(
    
    {nombre: "🌱", id : "boton-tierra"}
    {nombre: "🌱", id : "boton-tierra"}
    {nombre: "🌱", id : "boton-tierra"}
    {nombre: "💧", id : "boton-agua"}
    {nombre: "🔥", id : "boton-fuego"}
    
)
ratigueya.ataques.push(
    {nombre: "🔥", id : "boton-fuego"}
    {nombre: "🔥", id : "boton-fuego"}
    {nombre: "🔥", id : "boton-fuego"}
    {nombre: "💧", id : "boton-agua"}           
    {nombre: "🌱", id : "boton-tierra"}
)

function iniciarJuego(){
    sectionSeleccionarAtaque.style.display = "none"
    sectionReiniciar.style.display = "none"
    botonMascotaJugador.addEventListener("click", selecionarMascotaJugador)
    botonFuego.addEventListener("click", ataqueFuego)
    botonAgua.addEventListener("click", ataqueAgua)
    botonTierra.addEventListener("click", ataqueTierra)
    botonReiniciar.addEventListener("click", reiniciarJuego)
}

function selecionarMascotaJugador() {
    sectionSeleccionarMascota.style.display = "none"
    sectionSeleccionarAtaque.style.display = "flex"

    if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = "Hipodoge"
        } 
    else if (inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = "Capipepo"
    } 
    else if (inputRatigueya.checked) {
        spanMascotaJugador.innerHTML = "Ratigueya"
    } 
    else {
        alert('Selecciona una mascota')
    }
    seleccionarMascotaEnemigo()
}

function seleccionarMascotaEnemigo() {
    
            let ataqueAleatorio = aleatorio(1,3)
            if (ataqueAleatorio== 1){
                spanMascotaEnemigo.innerHTML = "Hipodoge"
            } else if (ataqueAleatorio == 2){
                spanMascotaEnemigo.innerHTML = "Capipepo"
            } else if (ataqueAleatorio == 3){
                spanMascotaEnemigo.innerHTML = "Ratigueya"
            }
}

function ataqueFuego(){
    ataqueJugador = "FUEGO"
    ataqueAleatorioEnemigo ()
}

function ataqueAgua(){
    ataqueJugador = "AGUA"
    ataqueAleatorioEnemigo ()
}

function ataqueTierra(){
    ataqueJugador = "TIERRA"
    ataqueAleatorioEnemigo ()
}
function ataqueAleatorioEnemigo(){
    let ataqueAleatorio = aleatorio(1,3)
        if (ataqueAleatorio == 1){
            ataqueEnemigo = "FUEGO"
        }else if (ataqueAleatorio == 2 ){
            ataqueEnemigo = "AGUA"   
        }else if (ataqueAleatorio == 3){
            ataqueEnemigo = "TIERRA"
        }
        combate()

}

function combate(){
if (ataqueEnemigo ==  ataqueJugador){
    crearMensaje("EMPATE")
    
}else if ( ataqueJugador == "FUEGO" && ataqueEnemigo == "TIERRA"){
    
    crearMensaje("GANASTE!!!")
    vidasEnemigo --
    spanVidasEnemigo.innerHTML = vidasEnemigo
}else if ( ataqueJugador == "AGUA" && ataqueEnemigo == "FUEGO") {
    crearMensaje("GANASTE!!!")
    vidasEnemigo --
    spanVidasEnemigo.innerHTML = vidasEnemigo
    
}else if ( ataqueJugador == "TIERRA" && ataqueEnemigo == "AGUA") {
   crearMensaje("GANASTE!!!")
   vidasEnemigo --
    spanVidasEnemigo.innerHTML = vidasEnemigo
}
else {
    crearMensaje("PERDISTE!!!")
    vidasjugador --
    spanVidasJugador.innerHTML = vidasjugador 
}
revisarVidas()
}

function revisarVidas(){
    if (vidasjugador == 0){
        crearMensajeFinal("LO SENTIMOS!!! Perdiste el combate.")
    }else if(vidasEnemigo == 0){
        crearMensajeFinal("FELICITACIONES!!! Ganaste el combate.")
    }
    
}
function crearMensaje (resultado){
    let nuevoAtaqueDelJugador = document.createElement("p")
    let nuevoAtaqueDelEnemigo = document.createElement("p")

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = ataqueJugador
    nuevoAtaqueDelEnemigo.innerHTML= ataqueEnemigo

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}

function crearMensajeFinal(resultadoFinal){
    sectionMensajes.innerHTML = resultadoFinal
    botonFuego.disabled = true
    botonAgua.disabled = true
    botonTierra.disabled = true
    botonMascotaJugador.disabled = true
    sectionReiniciar.style.display = "block" 
}

function reiniciarJuego (){
    location.reload(true)
}

function aleatorio(min, max){
    return(Math.floor(Math.random()*(max - min +1)+min))
}
window.addEventListener("load", iniciarJuego)