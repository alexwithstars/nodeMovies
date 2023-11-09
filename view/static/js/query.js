import {Notify} from "./notify.js"

const movies=await (async function(){
	try{
		const request = await fetch(`${location.origin}/movies`)
		const movies = await request.json()
		if(movies.error){
			return false
		}
		return movies
	}catch{
		new Notify({
			text:"Failed fetch"
		})
		return false
	}
})()

;(function(){
	if(!movies){
		return
	}
	if(movies.error){
		new Notify({
			text:movies.error,
			color:"F88",
		})
		return
	}
	const mtt=(n)=>[Math.floor(n/60),n%60]
	const ntt=(n)=>n<10?`0${n}`:`${n}`
	const mainContent = document.getElementById("mainContent")
	let moviesData=""
	movies.forEach(entrie=>{
		const [h,m]=mtt(entrie.duration)
		let genres = ""
		entrie.genre.forEach(gen=>{
			genres+=`<span>${gen}</span>`
		})
		moviesData+=`
		<div class="movie" title="click para copiar id" id="${entrie.id}">
			<h2 class="title">${entrie.title}</h2>
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
	;[...mainContent.children].forEach(entrie=>entrie.addEventListener("click",e=>{
		navigator.clipboard.writeText(e.target.id)
		.then(()=>{
			new Notify({
				text:`Id Copiado exitosamente`,
				color:"#8f8",
				time:3000
			})
		})
		.catch(()=>{
			new Notify({
				text:"No se pudo copiar",
				color:"#F88",
				time:3000
			})
		})
	}))
})()