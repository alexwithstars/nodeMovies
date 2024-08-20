import { Notify } from './notify.js'

const logged = await (async function () {
  try {
    const body = JSON.stringify({
      logkey: localStorage.getItem('logkey') ?? '',
      username: localStorage.getItem('username') ?? ''
    })
    const request = await fetch(`${location.origin}/users/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
    const response = await request.json()
    if (response.error) {
      new Notify({
        text: 'you are not logged in',
        color: '#F88',
        time: 3000
      })
      await new Promise(resolve => setTimeout(() => resolve(), 3000))
      location.assign(`${location.origin}/view/start`)
      return false
    }
  } catch {
    new Notify({
      text: 'Failed fetch, try reload window',
      time: 10000
    })
    return false
  }
  localStorage.setItem('stop', "don't touch or your session will be corrupted")
  return true
})()

const movies = await (async function () {
  try {
    const request = await fetch(`${location.origin}/movies`)
    const movies = await request.json()
    if (movies.error) {
      return false
    }
    return movies
  } catch {
    new Notify({
      text: 'Failed fetch'
    })
    return false
  }
})()

;(function () {
  if (!movies || !logged) {
    return
  }
  if (movies.error) {
    new Notify({
      text: movies.error,
      color: 'F88'
    })
    return
  }
  const mtt = (n) => [Math.floor(n / 60), n % 60]
  const ntt = (n) => n < 10 ? `0${n}` : `${n}`
  const mainContent = document.getElementById('mainContent')
  let moviesData = ''
  movies.forEach(entrie => {
    const [h, m] = mtt(entrie.duration)
    let genres = ''
    entrie.genre.forEach(gen => {
      genres += `<span>${gen}</span>`
    })
    moviesData += `
		<div class="movie" title="click para copiar id" id="${entrie.id}">
			<h2 class="title" title="${entrie.title}">${entrie.title}</h2>
			<div class="top">
				<div class="data">
					<div class="i-dir icon"></div>
					<span>${entrie.director}</span>
				</div>
				<div class="data">
					<div class="i-year icon"></div>
					<span>${entrie.year}</span>
				</div>
			</div>
			<div class="mid">
				<div class="data">
					<div class="i-medal icon"></div>
					<span>${entrie.rate}</span>
				</div>
				<div class="data">
					<div class="i-time icon"></div>
					<span>${ntt(h)}:${ntt(m)}h</span>
				</div>
			</div>
			<div class="genres">
				${genres}
			</div>
			<div class="bott">
				<img src="${entrie.poster}" height="100">
				<div class="poster">
					<img src="${entrie.poster}" height="100">
				</div>
			</div>
		</div>
		`
  })
  mainContent.innerHTML = moviesData
  ;[...mainContent.children].forEach(entrie => entrie.addEventListener('click', e => {
    navigator.clipboard.writeText(entrie.id)
      .then(() => {
        new Notify({
          text: 'Id Copiado exitosamente',
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
  }))
})()

'use strict'
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

const username = gti('username')
username.textContent = localStorage.getItem('username')

const logout = gti('logout')
logout.addEventListener('click', () => {
  localStorage.removeItem('username')
  localStorage.setItem('logged', false)
  location.assign(`${location.origin}/view/start`)
})

const profile = gti('profile')
const profileImg = gti('profileImg')
profileImg.addEventListener('click', e => {
  e.stopPropagation()
  profile.classList.toggle('show')
})
document.addEventListener('click', () => profile.classList.toggle('show', false))

qsa('.a').forEach(entrie => entrie.addEventListener('click', () => location.assign(`${location.origin}/view/${entrie.getAttribute('value')}`)))
