import './style.scss'
import './trailer'

const c = document.createElement('canvas')
const ctx = c.getContext('2d')!
c.width = innerWidth
c.height = innerHeight

const tamanho = 50
const dunas = 750

let tempo = 0
let velocidade = 0
let jogando = true
const Key: Record<string, number> = {
  ArrowUp: 0,
  ArrowDown: 0,
  ArrowLeft: 0,
  ArrowRight: 0,
}

document.body.appendChild(c)

export const lerp = (start: number, end: number, t: number) => {
  return start + ((end - start) * (1 - Math.cos(t * Math.PI))) / 2
}

const perm: number[] = []
let value

while (perm.length < dunas) {
  while (perm.includes((value = Math.floor(Math.random() * dunas))));
  perm.push(value)
}

export const noise = (x: number) => {
  x = (x * 0.005) % dunas
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x))
}

class Piloto {
  posicao = {
    x: c.width / 2,
    y: 0,
  }

  velocidade = {
    vertical: 0,
    rotacao: 0,
  }

  rotacao = 0

  imagem = new Image()

  constructor() {
    this.imagem.src = 'piloto.svg'
  }

  desenha() {
    const roda = {
      traseira: c.height - noise(tempo + this.posicao.x) * 0.25,
      dianteira: c.height - noise(tempo + 5 + this.posicao.x) * 0.25,
    }

    let deCastigo = 0

    if (roda.traseira - tamanho > this.posicao.y) {
      this.velocidade.vertical += 0.1
    } else {
      this.velocidade.vertical -= this.posicao.y - (roda.traseira - tamanho)
      this.posicao.y = roda.traseira - tamanho

      deCastigo = 1
    }

    if (!jogando || (deCastigo && Math.abs(this.rotacao) > Math.PI * 0.5)) {
      jogando = false
      this.velocidade.rotacao = 5
      Key.ArrowUp = 1
      this.posicao.x -= velocidade * 5
    }

    const angulo = Math.atan2(
      roda.dianteira - tamanho - this.posicao.y,
      this.posicao.x + 5 - this.posicao.x
    )

    this.posicao.y += this.velocidade.vertical

    if (deCastigo && jogando) {
      this.rotacao -= (this.rotacao - angulo) * 0.5
      this.velocidade.rotacao =
        this.velocidade.rotacao - (angulo - this.rotacao)
    }

    this.velocidade.rotacao += (Key.ArrowLeft - Key.ArrowRight) * 0.05
    this.rotacao -= this.velocidade.rotacao * 0.1

    if (this.rotacao > Math.PI) this.rotacao = -Math.PI
    if (this.rotacao < -Math.PI) this.rotacao = Math.PI

    ctx.save()
    ctx.translate(this.posicao.x, this.posicao.y)
    ctx.rotate(this.rotacao)
    ctx.drawImage(this.imagem, -tamanho, -tamanho, 100, 100)

    ctx.restore()
  }
}

const piloto = new Piloto()

function desenhaCenario() {
  velocidade -= (velocidade - (Key.ArrowUp - Key.ArrowDown)) * 0.1
  tempo += 10 * velocidade

  ctx.fillStyle = 'cornflowerblue'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.fillStyle = 'burlywood'

  ctx.beginPath()
  ctx.moveTo(0, c.height)

  for (let i = 0; i < c.width; i++) {
    ctx.lineTo(i, c.height - noise(tempo + i) * 0.25)
  }

  ctx.lineTo(c.width, c.height)
  ctx.fill()

  piloto.desenha()

  requestAnimationFrame(desenhaCenario)
}

onkeydown = (event) => {
  Key[event.key] = 1
}
onkeyup = (event) => {
  Key[event.key] = 0
}

desenhaCenario()
