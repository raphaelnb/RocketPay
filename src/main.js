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
