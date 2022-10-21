import "./css/index.css"
import IMask from "imask"

const cartaoBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
)

const cartaoBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
)

const cartaoLogo = document.querySelector(".cc-logo span:nth-child(2) img")

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

globalThis.setCardType = setCardType

const codigoSeguranca = document.querySelector("#security-code")

const codigoSegurancaPattern = {
  mask: "0000",
}

const securityCodeMasked = IMask(codigoSeguranca, codigoSegurancaPattern)

const expirationDate = document.querySelector("#expiration-date")

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

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")

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

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExppiration = document.querySelector(".cc-extra .value")
  ccExppiration.innerText = date.length == 0 ? "02/32" : date
}
