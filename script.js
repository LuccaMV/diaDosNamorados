// #region configuracao-cliente
const CONFIGURACAO_CLIENTE = {
  nomesCasal: "Lucca & Maria",
  dataInicio: "15/01/2016",
  fotos: ["img/foto-2.jpg", "img/foto-1.jpg", "img/foto-4.jpg"],
  corPrimaria: "#b033d6",
  corSecundaria: "#6a0572",
  corFundoInicio: "#fdf2f8",
  corFundoFim: "#fce7f3",
  corMoldura: "#f8fafc",
  corDourado: "#d4a76a",
  mensagensPorFoto: [
    "Cada refeição ao seu lado é só mais uma desculpa linda pra te admirar de perto e me apaixonar de novo.💕",
    "De todos os destinos que conhecemos, o meu favorito sempre foi você 💕",
    "Eu te amo tanto que faltam palavras, mas nunca falta sentimento! 💖",
  ],
  velocidadeSlideshow: 3000,
  arquivoMusica: "music/musica-fundo.mp3",
  volumeMusica: 0.15,
}
// #endregion

// #region aplicar-configuracoes
function aplicarConfiguracoes() {
  const root = document.documentElement
  root.style.setProperty("--cor-primaria", CONFIGURACAO_CLIENTE.corPrimaria)
  root.style.setProperty("--cor-secundaria", CONFIGURACAO_CLIENTE.corSecundaria)
  root.style.setProperty("--cor-fundo-inicio", CONFIGURACAO_CLIENTE.corFundoInicio)
  root.style.setProperty("--cor-fundo-fim", CONFIGURACAO_CLIENTE.corFundoFim)
  root.style.setProperty("--cor-moldura", CONFIGURACAO_CLIENTE.corMoldura)
  root.style.setProperty("--cor-dourado", CONFIGURACAO_CLIENTE.corDourado)

  document.getElementById("nomes-casal").textContent = CONFIGURACAO_CLIENTE.nomesCasal
  document.getElementById("data-relacionamento").textContent = CONFIGURACAO_CLIENTE.dataInicio

  const elementoMusica = document.getElementById("musica-fundo")
  elementoMusica.src = CONFIGURACAO_CLIENTE.arquivoMusica
  elementoMusica.volume = CONFIGURACAO_CLIENTE.volumeMusica
}
// #endregion

// #region elementos-dom
const elementos = {
  contadorDias: document.getElementById("contador-dias"),
  slideshowFotos: document.getElementById("slideshow-fotos"),
  indicadoresFotos: document.getElementById("indicadores-fotos"),
  botaoIniciar: document.getElementById("botao-iniciar"),
  botaoAnterior: document.getElementById("botao-anterior"),
  botaoProximo: document.getElementById("botao-proximo"),
  textoMensagem: document.getElementById("texto-mensagem"),
  musicaFundo: document.getElementById("musica-fundo"),
  containerCoracoes: document.querySelector(".container-coracoes"),
  petalasFundo: document.querySelector(".petalas-fundo"),
  petalasFrente: document.querySelector(".petalas-frente"),
}
// #endregion

// #region variaveis-controle
let indiceAtualFoto = 0
let estaRodando = false
let intervaloSlideshow
let intervaloCoracoes
let intervaloPetalasFundo
let intervaloPetalasFrente
let intervaloPetalasExtras
// #endregion

// #region funcoes-galeria
function inicializarGaleria() {
  CONFIGURACAO_CLIENTE.fotos.forEach((caminhoFoto, indice) => {
    const elementoImagem = document.createElement("img")
    elementoImagem.src = caminhoFoto
    elementoImagem.alt = `Foto do casal ${indice + 1}`
    elementoImagem.className = "foto-casal"
    elementos.slideshowFotos.appendChild(elementoImagem)
  })

  CONFIGURACAO_CLIENTE.fotos.forEach((_, indice) => {
    const indicador = document.createElement("div")
    indicador.className = "indicador"
    if (indice === 0) indicador.classList.add("ativo")
    indicador.addEventListener("click", () => irParaFoto(indice))
    elementos.indicadoresFotos.appendChild(indicador)
  })

  elementos.botaoAnterior.addEventListener("click", () => {
    navegarFotos("anterior")
  })

  elementos.botaoProximo.addEventListener("click", () => {
    navegarFotos("proximo")
  })

  atualizarMensagemPorFoto()
}

function navegarFotos(direcao) {
  const totalFotos = CONFIGURACAO_CLIENTE.fotos.length

  if (direcao === "proximo") {
    indiceAtualFoto = (indiceAtualFoto + 1) % totalFotos
  } else {
    indiceAtualFoto = (indiceAtualFoto - 1 + totalFotos) % totalFotos
  }

  atualizarExibicaoFotos()
  atualizarMensagemPorFoto()
}

function irParaFoto(indice) {
  indiceAtualFoto = indice
  atualizarExibicaoFotos()
  atualizarMensagemPorFoto()
}

function atualizarExibicaoFotos() {
  elementos.slideshowFotos.style.transform = `translateX(-${indiceAtualFoto * 100}%)`

  const indicadores = elementos.indicadoresFotos.querySelectorAll(".indicador")
  indicadores.forEach((indicador, indice) => {
    indicador.classList.toggle("ativo", indice === indiceAtualFoto)
  })
}

function atualizarMensagemPorFoto() {
  const mensagem = CONFIGURACAO_CLIENTE.mensagensPorFoto[indiceAtualFoto] || CONFIGURACAO_CLIENTE.mensagensPorFoto[0]

  elementos.textoMensagem.style.opacity = "0"
  setTimeout(() => {
    elementos.textoMensagem.textContent = mensagem
    elementos.textoMensagem.style.opacity = "1"
  }, 300)
}

function alternarSlideshow() {
  if (!estaRodando) {
    iniciarSlideshow()
  } else {
    pararSlideshow()
  }
}

function iniciarSlideshow() {
  estaRodando = true
  elementos.botaoIniciar.innerHTML = `
    <div class="icone-coracao">⏸️</div>
    <span class="texto-botao">Pausar História</span>
    <div class="brilho-botao"></div>
  `

  elementos.musicaFundo.play().catch((erro) => {
    console.log("Não foi possível reproduzir a música automaticamente:", erro)
  })

  iniciarAnimacaoCoracoes()
  iniciarAnimacaoPetalas()

  intervaloSlideshow = setInterval(() => {
    navegarFotos("proximo")
  }, CONFIGURACAO_CLIENTE.velocidadeSlideshow)
}

function pararSlideshow() {
  estaRodando = false
  elementos.botaoIniciar.innerHTML = `
    <div class="icone-coracao">💕</div>
    <span class="texto-botao">Continuar História</span>
    <div class="brilho-botao"></div>
  `

  elementos.musicaFundo.pause()
  clearInterval(intervaloSlideshow)
  clearInterval(intervaloCoracoes)
  clearInterval(intervaloPetalasFundo)
  clearInterval(intervaloPetalasFrente)
  clearInterval(intervaloPetalasExtras)
}
// #endregion

// #region animacao-coracoes
function criarCoracao() {
  const totalCoracoes = document.querySelectorAll(".coracao-flutuante").length
  if (totalCoracoes >= 15) return

  const coracao = document.createElement("div")
  coracao.className = "coracao-flutuante"

  const tiposCoracao = ["❤️", "💕", "💖", "💗", "💝", "💘"]
  coracao.innerHTML = tiposCoracao[Math.floor(Math.random() * tiposCoracao.length)]

  const posicaoEsquerda = Math.random() * 100
  coracao.style.left = `${posicaoEsquerda}%`

  const tamanho = Math.random() * 12 + 18
  coracao.style.fontSize = `${tamanho}px`

  const duracao = Math.random() * 6 + 8
  coracao.style.animationDuration = `${duracao}s, 3s`

  const atraso = Math.random() * 2
  coracao.style.animationDelay = `${atraso}s, 0s`

  elementos.containerCoracoes.appendChild(coracao)

  setTimeout(
    () => {
      if (coracao.parentNode) {
        coracao.remove()
      }
    },
    (duracao + atraso) * 1000,
  )
}

function iniciarAnimacaoCoracoes() {
  intervaloCoracoes = setInterval(criarCoracao, 700)
}
// #endregion

// #region animacao-petalas
function criarPetala(container, classe, tamanhoVariacao = "") {
  if (!container) return

  const totalPetalas = container.querySelectorAll(".petala").length
  if (totalPetalas >= 10) return

  const petala = document.createElement("div")
  petala.className = `petala ${classe} ${tamanhoVariacao}`

  const posicaoEsquerda = Math.random() * 100
  petala.style.left = `${posicaoEsquerda}%`

  petala.style.top = "-20px"

  const duracao = Math.random() * 8 + 12
  petala.style.animationDuration = `${duracao}s`

  const atraso = Math.random() * 2
  petala.style.animationDelay = `${atraso}s`

  const movimentoHorizontal = (Math.random() - 0.5) * 40
  petala.style.setProperty("--movimento-x", `${movimentoHorizontal}px`)

  container.appendChild(petala)

  setTimeout(
    () => {
      if (petala.parentNode) {
        petala.remove()
      }
    },
    (duracao + atraso) * 1000,
  )
}

function iniciarAnimacaoPetalas() {
  intervaloPetalasFundo = setInterval(() => {
    const tamanhos = ["", "pequena", ""]
    const tamanhoAleatorio = tamanhos[Math.floor(Math.random() * tamanhos.length)]
    criarPetala(elementos.petalasFundo, "fundo", tamanhoAleatorio)
  }, 1800)

  intervaloPetalasFrente = setInterval(() => {
    const tamanhos = ["", "grande", "pequena"]
    const tamanhoAleatorio = tamanhos[Math.floor(Math.random() * tamanhos.length)]
    criarPetala(elementos.petalasFrente, "frente", tamanhoAleatorio)
  }, 2200)

  intervaloPetalasExtras = setInterval(() => {
    const containers = [elementos.petalasFundo, elementos.petalasFrente]
    const classes = ["fundo", "frente"]
    const indiceAleatorio = Math.floor(Math.random() * 2)

    const tamanhos = ["pequena", "", "grande"]
    const tamanhoAleatorio = tamanhos[Math.floor(Math.random() * tamanhos.length)]

    criarPetala(containers[indiceAleatorio], classes[indiceAleatorio], tamanhoAleatorio)
  }, 1500)
}
// #endregion

// #region contador-dias
function atualizarContadorDias() {
  const hoje = new Date()
  const [dia, mes, ano] = CONFIGURACAO_CLIENTE.dataInicio.split("/")
  const dataInicio = new Date(ano, mes - 1, dia)

  const diferencaTempo = hoje - dataInicio
  const diferencaDias = Math.floor(diferencaTempo / (1000 * 60 * 60 * 24))

  elementos.contadorDias.textContent = `${diferencaDias} dias juntos ❤️`
}
// #endregion

// #region inicializacao
function inicializar() {
  aplicarConfiguracoes()
  atualizarContadorDias()
  inicializarGaleria()

  elementos.botaoIniciar.addEventListener("click", alternarSlideshow)

  for (let i = 0; i < 4; i++) {
    setTimeout(criarCoracao, i * 500)
  }

  for (let i = 0; i < 3; i++) {
    setTimeout(() => criarPetala(elementos.petalasFundo, "fundo", "pequena"), i * 800)
    setTimeout(() => criarPetala(elementos.petalasFrente, "frente", ""), i * 1200)
  }

  setInterval(atualizarContadorDias, 3600000)
}

document.addEventListener("DOMContentLoaded", inicializar)
// #endregion
