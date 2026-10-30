// Reglas de ventaja entre los tipos.
const TIPOS = {
  agua: { nombre: "Agua", emoji: "💧", venceA: "fuego" },
  fuego: { nombre: "Fuego", emoji: "🔥", venceA: "tierra" },
  tierra: { nombre: "Tierra", emoji: "🌱", venceA: "agua" },
};

// Catálogo de ataques. Cada mascota recibe cinco de estos ataques.
const CATALOGO_ATAQUES = {
  Chorro: { elemento: "agua", emoji: "💧" },
  Burbuja: { elemento: "agua", emoji: "🫧" },
  Hidrobomba: { elemento: "agua", emoji: "🌊" },
  Ascua: { elemento: "fuego", emoji: "🔥" },
  Llamarada: { elemento: "fuego", emoji: "🔥" },
  "Giro Fuego": { elemento: "fuego", emoji: "☄️" },
  Latigazo: { elemento: "tierra", emoji: "🌱" },
  "Hoja Afilada": { elemento: "tierra", emoji: "🍃" },
  Terremoto: { elemento: "tierra", emoji: "⛰️" },
};

// Datos base de cada mascota: tres ataques de su tipo y uno de cada tipo restante.
const CATALOGO_MOKEPONES = [
  {
    nombre: "Hipodoge",
    elemento: "agua",
    foto: "./assets/mokepons_mokepon_hipodoge_attack.png",
    ataques: ["Chorro", "Burbuja", "Hidrobomba", "Ascua", "Latigazo"],
  },
  {
    nombre: "Capipepo",
    elemento: "tierra",
    foto: "./assets/mokepons_mokepon_capipepo_attack.png",
    ataques: ["Latigazo", "Hoja Afilada", "Terremoto", "Chorro", "Ascua"],
  },
  {
    nombre: "Ratigueya",
    elemento: "fuego",
    foto: "./assets/mokepons_mokepon_ratigueya_attack.png",
    ataques: ["Ascua", "Llamarada", "Giro Fuego", "Chorro", "Latigazo"],
  },
];

class Mokepon {
  constructor({ nombre, elemento, foto, ataques }) {
    this.nombre = nombre;
    this.elemento = elemento;
    this.foto = foto;
    this.vidaMaxima = 3;
    this.vida = this.vidaMaxima;

    // Cada combate crea ataques nuevos para que el estado "usado" no se comparta.
    this.ataques = ataques.map((nombreAtaque, indice) => ({
      id: `${nombre}-${indice}`,
      nombre: nombreAtaque,
      usado: false,
      ...CATALOGO_ATAQUES[nombreAtaque],
    }));
  }

  get estaVivo() {
    return this.vida > 0;
  }

  get ataquesDisponibles() {
    return this.ataques.filter((ataque) => !ataque.usado);
  }

  recibirDanio() {
    this.vida = Math.max(0, this.vida - 1);
  }
}

// Referencias al DOM.
const pantallaSeleccion = document.getElementById("seleccionar-mascota");
const pantallaCombate = document.getElementById("seleccionar-ataque");
const sectionReiniciar = document.getElementById("Reiniciar");
const botonMascotaJugador = document.getElementById("boton-mascota");
const botonReiniciar = document.getElementById("boton-reiniciar");
const errorSeleccion = document.getElementById("error-seleccion");
const contenedorAtaques = document.getElementById("botones-ataque");
const resultado = document.getElementById("resultado");
const registroCombate = document.getElementById("registro-combate");
const combatienteJugador = document.getElementById("combatiente-jugador");
const combatienteEnemigo = document.getElementById("combatiente-enemigo");
const barraVidaJugador = document.getElementById("barra-vida-jugador");
const barraVidaEnemigo = document.getElementById("barra-vida-enemigo");

// Estado de la partida.
let jugador = null;
let enemigo = null;
let turno = 0;
let terminado = false;

function iniciarJuego() {
  pantallaCombate.style.display = "none";
  sectionReiniciar.style.display = "none";

  botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador);
  botonReiniciar.addEventListener("click", reiniciarJuego);

  document.querySelectorAll('input[name="mascota"]').forEach((input) => {
    input.addEventListener("change", () => {
      errorSeleccion.hidden = true;
    });
  });
}

function seleccionarMascotaJugador() {
  const inputSeleccionado = document.querySelector('input[name="mascota"]:checked');

  if (!inputSeleccionado) {
    errorSeleccion.hidden = false;
    return;
  }

  errorSeleccion.hidden = true;

  const datosJugador = CATALOGO_MOKEPONES.find(
    (mokepon) => mokepon.nombre === inputSeleccionado.value
  );
  const rivales = CATALOGO_MOKEPONES.filter(
    (mokepon) => mokepon.nombre !== datosJugador.nombre
  );

  jugador = new Mokepon(datosJugador);
  enemigo = new Mokepon(rivales[aleatorio(0, rivales.length - 1)]);
  turno = 0;
  terminado = false;

  pantallaSeleccion.style.display = "none";
  pantallaCombate.style.display = "flex";
  sectionReiniciar.style.display = "none";
  registroCombate.innerHTML = "";
  pintarResultado("¡Que comience el combate!");

  pintarCombatiente(jugador, "jugador");
  pintarCombatiente(enemigo, "enemigo");
  actualizarVidas();
  renderizarAtaques();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function pintarCombatiente(mokepon, lado) {
  const tipo = TIPOS[mokepon.elemento];

  document.getElementById(`mascota-${lado}`).textContent = mokepon.nombre;

  const elemento = document.getElementById(`elemento-${lado}`);
  elemento.textContent = `${tipo.emoji} ${tipo.nombre}`;
  elemento.className = `tipo tipo-${mokepon.elemento}`;

  const imagen = document.getElementById(`imagen-${lado}`);
  imagen.src = mokepon.foto;
  imagen.alt = `${mokepon.nombre}, mascota de tipo ${tipo.nombre}`;

  // Algunos sprites miran hacia un lado; los giramos para que apunten al rival.
  const debeMirarse =
    (mokepon.nombre === "Hipodoge" && lado === "jugador") ||
    (mokepon.nombre === "Ratigueya" && lado === "enemigo");
  imagen.classList.toggle("mirror", debeMirarse);
}

function actualizarVidas() {
  actualizarVidaCombatiente(jugador, "jugador");
  actualizarVidaCombatiente(enemigo, "enemigo");
}

function actualizarVidaCombatiente(mokepon, lado) {
  document.getElementById(`vidas-${lado}`).textContent = mokepon.vida;
  document.getElementById(`vida-maxima-${lado}`).textContent = mokepon.vidaMaxima;

  const barra = lado === "jugador" ? barraVidaJugador : barraVidaEnemigo;
  const porcentaje = (mokepon.vida / mokepon.vidaMaxima) * 100;

  barra.style.width = `${porcentaje}%`;
  barra.classList.toggle("baja", mokepon.vida === 1);

  const contenedorBarra = barra.parentElement;
  contenedorBarra.setAttribute("aria-valuemax", mokepon.vidaMaxima);
  contenedorBarra.setAttribute("aria-valuenow", mokepon.vida);

  const combatiente = lado === "jugador" ? combatienteJugador : combatienteEnemigo;
  combatiente.classList.toggle("debilitado", !mokepon.estaVivo);
}

function renderizarAtaques() {
  contenedorAtaques.innerHTML = "";

  jugador.ataques.forEach((ataque, indice) => {
    const tipo = TIPOS[ataque.elemento];
    const boton = document.createElement("button");

    boton.type = "button";
    boton.className = `boton-de-ataque tipo-${ataque.elemento}`;
    boton.disabled = ataque.usado || terminado;
    boton.setAttribute("aria-label", `${ataque.nombre}, ataque de tipo ${tipo.nombre}`);

    const emoji = document.createElement("span");
    emoji.className = "ataque-emoji";
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = ataque.emoji;

    const nombre = document.createElement("span");
    nombre.className = "ataque-nombre";
    nombre.textContent = ataque.nombre;

    const etiquetaTipo = document.createElement("span");
    etiquetaTipo.className = "ataque-tipo";
    etiquetaTipo.textContent = tipo.nombre;

    boton.append(emoji, nombre, etiquetaTipo);
    boton.addEventListener("click", () => ejecutarTurno(indice));
    contenedorAtaques.appendChild(boton);
  });
}

function ejecutarTurno(indiceAtaque) {
  if (terminado) return;

  const ataqueJugador = jugador.ataques[indiceAtaque];
  if (!ataqueJugador || ataqueJugador.usado) return;

  ataqueJugador.usado = true;
  const ataqueEnemigo = elegirAtaqueEnemigo();

  if (!ataqueEnemigo) {
    comprobarFin();
    return;
  }

  turno += 1;

  const ganadorTurno = resolverTurno(ataqueJugador, ataqueEnemigo);

  if (ganadorTurno === "jugador") {
    enemigo.recibirDanio();
    animarDanio(combatienteEnemigo);
  } else if (ganadorTurno === "enemigo") {
    jugador.recibirDanio();
    animarDanio(combatienteJugador);
  }

  actualizarVidas();
  renderizarAtaques();
  mostrarResultadoTurno(ataqueJugador, ataqueEnemigo, ganadorTurno);
  comprobarFin();
}

function elegirAtaqueEnemigo() {
  const disponibles = enemigo.ataquesDisponibles;
  if (disponibles.length === 0) return null;

  const ataque = disponibles[aleatorio(0, disponibles.length - 1)];
  ataque.usado = true;
  return ataque;
}

function resolverTurno(ataqueJugador, ataqueEnemigo) {
  if (ataqueJugador.elemento === ataqueEnemigo.elemento) {
    return "empate";
  }

  if (TIPOS[ataqueJugador.elemento].venceA === ataqueEnemigo.elemento) {
    return "jugador";
  }

  return "enemigo";
}

function mostrarResultadoTurno(ataqueJugador, ataqueEnemigo, ganadorTurno) {
  const detalles = {
    jugador: "¡Ganaste el turno! La mascota rival perdió 1 PS.",
    enemigo: "La mascota rival ganó el turno. Perdiste 1 PS.",
    empate: "Mismo tipo de ataque: nadie perdió PS.",
  };

  const resumen =
    `Turno ${turno}: ${ataqueJugador.emoji} ${ataqueJugador.nombre} vs ` +
    `${ataqueEnemigo.emoji} ${ataqueEnemigo.nombre}. ${detalles[ganadorTurno]}`;

  pintarResultado(detalles[ganadorTurno], ganadorTurno);
  agregarRegistro(resumen, ganadorTurno);
}

function comprobarFin() {
  if (!jugador.estaVivo) {
    finalizarCombate("enemigo", "Tu mascota se quedó sin PS.");
    return true;
  }

  if (!enemigo.estaVivo) {
    finalizarCombate("jugador", "¡La mascota rival se quedó sin PS!");
    return true;
  }

  const sinAtaquesJugador = jugador.ataquesDisponibles.length === 0;
  const sinAtaquesEnemigo = enemigo.ataquesDisponibles.length === 0;

  if (sinAtaquesJugador || sinAtaquesEnemigo) {
    if (jugador.vida > enemigo.vida) {
      finalizarCombate(
        "jugador",
        `Se agotaron los ataques. Ganaste por PS: ${jugador.vida} a ${enemigo.vida}.`
      );
    } else if (enemigo.vida > jugador.vida) {
      finalizarCombate(
        "enemigo",
        `Se agotaron los ataques. Perdiste por PS: ${jugador.vida} a ${enemigo.vida}.`
      );
    } else {
      finalizarCombate(
        "empate",
        `Se agotaron los ataques y ambos terminaron con ${jugador.vida} PS.`
      );
    }
    return true;
  }

  return false;
}

function finalizarCombate(tipo, detalle) {
  terminado = true;

  const titulos = {
    jugador: "🏆 ¡Ganaste el combate!",
    enemigo: "💀 Perdiste el combate.",
    empate: "🤝 Empate.",
  };

  pintarResultado(`${titulos[tipo]} ${detalle}`, tipo, true);
  agregarRegistro(detalle, tipo);
  renderizarAtaques();
  sectionReiniciar.style.display = "flex";
}

function agregarRegistro(texto, tipo) {
  const linea = document.createElement("p");
  linea.className = `registro-linea ${tipo}`;
  linea.textContent = texto;

  registroCombate.appendChild(linea);
  registroCombate.scrollTop = registroCombate.scrollHeight;
}

function pintarResultado(texto, tipo = "", esFinal = false) {
  resultado.textContent = texto;
  resultado.className = "mensaje-resultado";

  if (tipo) resultado.classList.add(tipo);
  if (esFinal) resultado.classList.add("resultado-final");
}

function animarDanio(combatiente) {
  combatiente.classList.remove("recibiendo-danio");
  void combatiente.offsetWidth;
  combatiente.classList.add("recibiendo-danio");

  window.setTimeout(() => {
    combatiente.classList.remove("recibiendo-danio");
  }, 400);
}

function reiniciarJuego() {
  jugador = null;
  enemigo = null;
  turno = 0;
  terminado = false;

  document.querySelectorAll('input[name="mascota"]').forEach((input) => {
    input.checked = false;
  });

  pantallaCombate.style.display = "none";
  pantallaSeleccion.style.display = "flex";
  sectionReiniciar.style.display = "none";
  contenedorAtaques.innerHTML = "";
  registroCombate.innerHTML = "";
  errorSeleccion.hidden = true;
  pintarResultado("Mucha suerte...");

  combatienteJugador.classList.remove("debilitado", "recibiendo-danio");
  combatienteEnemigo.classList.remove("debilitado", "recibiendo-danio");
  barraVidaJugador.style.width = "100%";
  barraVidaEnemigo.style.width = "100%";

  document.getElementById("imagen-jugador").removeAttribute("src");
  document.getElementById("imagen-jugador").alt = "";
  document.getElementById("imagen-enemigo").removeAttribute("src");
  document.getElementById("imagen-enemigo").alt = "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener("load", iniciarJuego);
