var eventos = [];
var currentDate = [];
var categories = [];
var inputSearch = document.querySelector("#searchInput");
var select = document.querySelector("#selectCategoria");


async function getData(){
    await fetch("https://amazingeventsapi.herokuapp.com/api/eventos")
    .then(response => response.json())
    .then(json => eventos.push(...json.eventos) && currentDate.push(json.fechaActual))
    categories = [... new Set(eventos.map((o) => o.category))]; //armo el array con los valores unicos de cada categoria
    displaySelectOptions(categories, eventos);
    displayEventsPasados(eventos);
}
getData();

//BUSCADOR DESDE INPUT TEXT

inputSearch.addEventListener("keyup", search);

function search(event){
    var valor = event.target.value;
    var data = eventos.filter(evento => evento.name.toLowerCase().includes(valor.toLowerCase()) || 
                                        evento.description.toLowerCase().includes(valor.toLowerCase()));
    displayEventsPasados(data);
}

//FILTRO MEDIANTE SELECT-OPTION

select.addEventListener("change",selectFilter);

function selectFilter(event) {
    var selectedValue = event.target.value;
    if (selectedValue == "noSelection") {
        var data = eventos.filter(evento => evento.date < currentDate)
    }else{
        var data = eventos.filter(evento => evento.category == selectedValue);
    }
    displayEventsPasados(data);
}


var searchParametro = "";
var category =[];
category.push(...eventos.filter(evento => evento.category));

function displayEventsPasados (data){
    let toDisplay = [];
    if(data == undefined){
        toDisplay.push(...eventos);
    }else{
        toDisplay.push(...data);
    }
    let pasado = "";
    toDisplay.map(evento =>{
        if(evento.date < currentDate ){
            pasado += `
            <article>
                <h2>${evento.name}</h2>
                <img src="${evento.image}" alt="imagen" class="imgCartas"> 
                <p class="date">${evento.date} - ${evento.place}</p>
                <p>${evento.description}</p>
                <p class="guests">Asistentes: ${evento.assistance}</p>
                <button class="buttonCards"><a href="./card_detail.html?id=${evento.id}">Ver mas</a></button>
            </article>
            `
        }
    })
    document.querySelector('#todospasados').innerHTML = pasado;
}
displayEventsPasados();

function displaySelectOptions(categories, eventos) {
    var selectOptions = `<option value="noSelection">--- Seleccione una categoria ---</option>`;
    categories.forEach(element =>{
        selectOptions +=`
        <option value="${element}">${element}</option>
        `
    });
    document.querySelector("#selectCategoria").innerHTML = selectOptions;
}