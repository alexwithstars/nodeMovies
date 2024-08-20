const form = `
<div class="inp">
<input type="text" name="title" id="title" required>
<label for="title">Titulo</label>
<span class="valid message" id="message-title">Titulo invalido</span>
</div>
<div class="inp">
<input type="number" name="year" id="year" required>
<label for="year">Año</label>
<span class="valid message" id="message-year">Año invalido (1900 - Acutalidad)</span>
</div>
<div class="inp">
<input type="text" name="director" id="director" required>
<label for="director">Director</label>
<span class="valid message" id="message-director">Director invalido</span>
</div>
<div class="inp">
<input type="number" name="duration" id="duration" required>
<label for="duration">Duracion (Minutos)</label>
<span class="valid message" id="message-duration">Duracion invalida</span>
</div>
<div class="inp">
<input type="number" step="0.1" name="rate" id="rate" required>
<label for="rate">Calificacion: ( 0.0 - 10.0 )</label>
<span class="valid message" id="message-rate">Numero invalido (mantenlo en el rango)</span>
</div>
<div class="inp">
<input type="url" name="poster" id="poster" required>
<label for="poster">Poster (Url)</label>
<span class="valid message" id="message-poster">Url invalida</span>
</div>
<div class="genres-cont">
<div class="inp">
	<input type="text" list="genresOptions" id="genre" class="genre" autocomplete="off" placeholder="Enter para agregar">
	<label for="genre">Generos</label>
	<datalist id="genresOptions">
	</datalist>
</div>
<span class="valid message" id="message-genre">Generos invalidos (selecciona generos de la lista)</span>
<div class="genres" id="genres">
</div>
</div>
<div class="sub-cont">
<input type="submit" value="">
<div class="load">
<span style="--delay:0s;"></span>
<span style="--delay:0.2s;"></span>
<span style="--delay:0.4s;"></span>
</div>
</div>
`
const element = document.createElement('movieForm')
element.innerHTML = form
export const movieForm = element
