import "./css/index.css"
import IMask from "imask"

// Primeira variável para estilizar a cor do cartão de acordo com a Bandeira
const cartaoBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
)

// Segunda variável para estilizar a cor do cartão de acordo com a Bandeira
const cartaoBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
)

// Variável para mudar a logo do cartão de acordo com a Bandeira
const cartaoLogo = document.querySelector(".cc-logo span:nth-child(2) img")

// Função para aplicar as cores e a logo do cartão de acordo com sua Bandeira
function setCardType(type) {
  const colors = {
    visa: ["#436d99", "#2D57F2"],
    mastercard: ["#df6f29", "#c69347"],
    default: ["black", "gray"],
  }

  cartaoBgColor01.setAttribute("fill", colors[type][0])

  cartaoBgColor02.setAttribute("fill", colors[type][1])

  cartaoLogo.setAttribute("src", `cc-${type}.svg`)
}

// Função global para utilizar no console do navegador
globalThis.setCardType = setCardType

// Definição das Máscaras
// Máscara do CÓDIGO DE SEGURANÇA
// Seleção do atributo do CÓDIGO DE SEGURANÇA
const codigoSeguranca = document.querySelector("#security-code")

// Padrão de 4 dígitos
const codigoSegurancaPattern = {
  mask: "0000",
}

// Implementação da máścara do CÓDIGO DE SEGURANÇA
const securityCodeMasked = IMask(codigoSeguranca, codigoSegurancaPattern)

// Máscara da DATA DE EXPIRAÇÃO
// Seleção do atributo da DATA DE EXPIRAÇÃO
const expirationDate = document.querySelector("#expiration-date")

// Padrão de 2 digitos para mês e ano. O mẽs varia de 1 a 12 e o ano varia do ano atual a 10 anos a frente
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}

// Implementação da DATA DE EXPIRAÇÃO
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// Máscara do NÚMERO DO CARTÃO
// Seleção do atributo do NÚMERO DO CARTÃO
const cardNumber = document.querySelector("#card-number")

// Máscara para definir a Bandeira do cartão de acordo com os digitos iniciais do NÚMERO DO CARTÃO
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    console.log(foundMask)

    return foundMask
  },
}

// Implementação do NÚMERO DO CARTÃO
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

// Evento para adicionar o cartão com o button
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("cartão adicionado!")
})

// Evento para bloquear atualização da página (form) ao clicar o button
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

// Evento para adicionar texto (nome) no Nome do titular
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  // Ternário caso o não haja texto exibir nome padrão para sugerir ao usuário
  // Caso o usuário digite algum nome, exibi-lo
  ccHolder.innerText =
    cardHolder.value.length == 0 ? "FULANO DA SILVA" : cardHolder.value
})

// Observa o security code, quando aceito pelo IMask, atualiza o valor mostrado
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

// Ternário para exibir o valor padrão (123) caso o usuário não insira outro valor
// Função chamada na função anterior
function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}

// Observa o o número do cartão e muda a bandeira de acordo com os requisitos do IMask
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

// Ternário para exibir valor padrão no NÚMERO DO CARTÃO caso usuário não digite nada
// O valor do NÚMERO DO CARTÃO atualiza de acordo com a entrada do usuário
// Chamado na função anterior
function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

// Observa a DATA DE EXPIRAÇÃO e caso atenda os requisitos do IMask, atualiza seus valores
expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

// Ternário para exibir o valor padrão da DATA DE EXPIRAÇÃO (02/32) caso o usuário não digite nada
// O valor da DATA DE EXPIRAÇÃO atualiza de acordo com a entrada do usuário
// Chamada na função anterior
function updateExpirationDate(date) {
  const ccExppiration = document.querySelector(".cc-extra .value")
  ccExppiration.innerText = date.length == 0 ? "02/32" : date
}
