export class Notify {
  constructor ({ text, color = '#0af', id = null, time = 5000 }) {
    this.text = text
    this.color = color
    this.id = id
    this.time = time
    this.#main()
  }

  #delay (time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  #copyButton () {
    const button = document.createElement('button')
    const text = document.createElement('span')
    const img = document.createElement('img')
    text.textContent = 'Copiar Id'
    img.src = './assets/images/clip.svg'
    button.appendChild(img)
    button.appendChild(text)
    button.addEventListener('click', () => {
      navigator.clipboard.writeText(this.id)
        .then(() => {
          new Notify({
            text: 'Copiado exitosamente',
            color: '#8f8',
            time: 3000
          })
        })
        .catch(() => {
          new Notify({
            text: 'No se pudo copiar',
            color: '#F88',
            time: 3000
          })
        })
    })
    return button
  }

  #main () {
    const container = document.createElement('div')
    container.style.background = this.color
    container.classList.add('notify')
    const content = document.createElement('div')
    const text = document.createElement('span')
    text.textContent = this.text
    content.appendChild(text)
    if (this.id) {
      const button = this.#copyButton()
      content.appendChild(button)
    }
    container.appendChild(content)
    document.body.appendChild(container)
    setTimeout(() => {
      container.classList.add('hide')
      setTimeout(() => {
        document.body.removeChild(container)
      }, 500)
    }, this.time)
  }
}
