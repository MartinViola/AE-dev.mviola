//EXPORTAR DATOS DESDE .JSON
var eventos = [];

async function getData(){
    await fetch("https://amazingeventsapi.herokuapp.com/api/eventos")
    .then(response => response.json())
    .then(json => eventos.push(...json.eventos))

    var id = location.search.split("?id=").filter(Number);
    var selectedId = Number(id[0]);
    var evento = eventos.find(function(x){
        return x.id == selectedId
    })
    
    var templateHtml =`
        <article>
        <img src="${evento.image}" alt="imagen" class="imgCartas">  
        <h2>${evento.name}</h2>
        <p class="date">${evento.date} - ${evento.place}</p>
        <p>${evento.description}</p>
        <p class="price">Costo: $${evento.price},00</p>
        </article>
        `
    document.querySelector('#carddetails').innerHTML = templateHtml;
}
getData();
