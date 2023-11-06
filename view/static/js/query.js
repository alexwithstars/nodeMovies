const movies=await (async function(){
	try{
		const request = await fetch(`${location.origin}/movies`)
		const movies = await request.json()
		if(movies.error){
			return false
		}
		return movies

	}catch{
		alert("failed fetch")
		return false
	}
})()

;(function(){
	if(!movies){
		return
	}
	const mtt=(n)=>[Math.floor(n/60),n%60]
	const ntt=(n)=>n<10?`0${n}`:`${n}`
	let tableData=`
	<tr>
		<th>Titulo</th>
		<th>Director</th>
		<th>Año</th>
		<th>Duracion</th>
		<th>Calificación</th>
		<th>Generos</th>
	</tr>
	`
	movies.forEach(entrie=>{
		const [h,m]=mtt(entrie.duration)
		tableData+=`
		<tr>
			<td>${entrie.title}</td>
			<td>${entrie.director}</td>
			<td>${entrie.year}</td>
			<td>${ntt(h)}:${ntt(m)}</td>
			<td>${entrie.rate}</td>
			<td>${entrie.genre.join(" | ")}</td>
		</tr>
		`
	})
	const table = document.createElement("table")
	table.innerHTML=tableData
	document.body.appendChild(table)
})()