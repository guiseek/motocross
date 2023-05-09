import {create} from './utilities'

const trailer = localStorage.getItem('trailer')

if (trailer != 'assistido') {
  const dialog = create('dialog', {open: true})
  const video = create('video', {
    autoplay: true,
    src: 'trailer.mp4',
  })
  const botao = {
    assistir: create('button', {innerText: 'Assistir'}),
    fechar: create('button', {innerText: 'Já assisti, fechar'}),
  }
  const linha = create('hr')
  const acoes = create('footer')

  botao.assistir.onclick = () => {
    video.play()
  }
  botao.fechar.onclick = () => {
    dialog.close()
    if (!video.paused) {
      video.pause()
    }
  }
  dialog.onclose = () => {
    localStorage.setItem('trailer', 'assistido')
  }

  acoes.append(...Object.values(botao))
  dialog.append(video, linha, acoes)
  document.body.appendChild(dialog)
}
