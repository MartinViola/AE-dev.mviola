var eventos = [];
var currentDate = [];

async function getData(){
    await fetch("https://amazingeventsapi.herokuapp.com/api/eventos")
    .then(response => response.json())
    .then(json => eventos.push(...json.eventos) && currentDate.push(json.fechaActual))
    displayEvents(eventos);
}
getData();

function displayEvents (){
    let toDisplay = [];
    let futuro = "";
    let pasado = "";
    toDisplay.push(...eventos);
    let objetosFuturos = toDisplay.filter(evento => evento.date > currentDate);
    let dosEventosFuturos = objetosFuturos.sort((a,b) => a.date - b.date).slice(0,2);
    dosEventosFuturos.map(evento => {
        futuro += `
        <article>                    
            <h2>${evento.name}</h2>
            <img src="${evento.image}" alt="imagen" class="imgCartas"> 
            <p class="date">${evento.date} - ${evento.place}</p>
            <p>${evento.description}</p>
        </article>
        `
    })
    let objetosPasados = toDisplay.filter(evento => evento.date < currentDate);
    let dosEventosPasados = objetosPasados.sort((a,b) => b.date - a.date).slice(0,2);
    dosEventosPasados.map(evento => {
        pasado += `
        <article>                    
            <h2>${evento.name}</h2>
            <img src="${evento.image}" alt="imagen" class="imgCartas"> 
            <p class="date">${evento.date} - ${evento.place}</p>
            <p>${evento.description}</p>
        </article>
        `
    })
    // toDisplay.map(evento =>{
    //     if(evento.date > "2022-01-01" ){
    //         futuro += `
    //         <article>                    
    //             <h2>${evento.name}</h2>
    //             <p class="date">${evento.date} - ${evento.place}</p>
    //             <p>${evento.description}</p>
    //         </article>
    //         `
    //     }
    //     else{
    //         pasado += `
    //         <article>
    //             <h2>${evento.name}</h2>
    //             <p class="date">${evento.date} - ${evento.place}</p>
    //             <p>${evento.description}</p>
    //         </article>
    //         `
    //     }
    // })
    document.querySelector('#cardsfuturo').innerHTML = futuro;
    document.querySelector('#cardspasado').innerHTML = pasado;
}
displayEvents();