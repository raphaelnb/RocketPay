import "./css/index.css"

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

//setCardType("default")

globalThis.setCardType = setCardType
