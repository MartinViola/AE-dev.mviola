// 1) eventos con menor y mayor % de audiencia
// 2) eventos con mayor capacidad
// 3) ingreso x categoria
// 4) % de asistencia por categoria

var eventos = [];
var currentDate = [];
var eventosPasados = [];
var eventosCapacidad = [];
var eventoMenorAudiencia = {};
var eventoMayorAudicencia = {};
var eventoMayorCapacidad = {};
var categories = [];
var ingresoCategoria = [];
var porcentajeAsistencia = [];

async function getData(){
    await fetch("https://amazingeventsapi.herokuapp.com/api/eventos")
    .then(response => response.json())
    .then(json => eventos.push(...json.eventos) && currentDate.push(json.fechaActual))
    //Normalizo eventos futuros, assistencia = 0

    // for (let i=0; i < eventos.length; i++){
    //     if (eventos[i].assistance == undefined) {
    //         eventos[i].assistance = 0;
    //     }
    // }    
    reporteIndicadores(eventos);
    categories = [... new Set(eventos.map((o) => o.category))]; //armo el array con los valores unicos de cada categoria
    categories.map(categoria => ingresosXcat(categoria, eventos));
    categories.map(categoria => calculadoraAsistencia(categoria, eventos));
    displayCategorias(categories);
    displayAsistencia(porcentajeAsistencia);
    displayIngresos(ingresoCategoria);
}
getData();

function  reporteIndicadores(eventos){
    eventosPasados = eventos.filter(evento => evento.date < currentDate[0]).sort((a,b) => a.assistance-b.assistance);

    eventoMenorAudiencia = {"event": eventosPasados[0].name, "audience": eventosPasados[0].assistance};

    eventoMayorAudicencia = {"event": eventosPasados[eventosPasados.length-1].name, "audience": eventosPasados[eventosPasados.length-1].assistance};

    eventosCapacidad = eventos.sort((a,b) => b.capacity - a.capacity); //ordeno de MAYOR a menor por Capacidad
    eventoMayorCapacidad = {"event": eventosCapacidad[0].name, "capacity": eventosCapacidad[0].capacity};

    

    document.querySelector('#menorAsistencia').innerHTML = `El evento de <span>menor asistencia</span> fue <span>"${eventoMenorAudiencia.event}"</span> con una audiencia de <span>${eventoMenorAudiencia.audience} espectadores</span>`;
    document.querySelector('#mayorAsistencia').innerHTML = `El evento de <span>MAYOR asistencia</span> fue <span>"${eventoMayorAudicencia.event}"</span> con una audiencia de <span>${eventoMayorAudicencia.audience} espectadores</span>`;
    document.querySelector('#mayorCapacidad').innerHTML = `El evento de <span>MAYOR capacidad</span> es <span>"${eventoMayorCapacidad.event}"</span> con una capacidad de <span>${eventoMayorCapacidad.capacity} espectadores</span>`;
}

function ingresosXcat(categoria, eventos){
    var total = 0;
    eventos.forEach(element => {
        if(categoria == element.category){
            total += (element.price*(element.assistance || element.estimate));
        }
    });
    ingresoCategoria.push({"category": categoria, "income": total});
    return ingresoCategoria;
}

function calculadoraAsistencia(categoria, eventos) {
    var sumAssist = 0;
    var sumCap = 0;
    var percAssist;
    for (let i=0; i < eventos.length; i++){
        if (eventos[i].category == categoria && eventos[i].date <= currentDate){
            sumAssist += eventos[i].assistance;
            sumCap += eventos[i].capacity;
        }
    }
    percAssist = ((sumAssist/sumCap)*100).toFixed(2);
    porcentajeAsistencia.push({"category": categoria, "pAssist": percAssist});
}

function displayCategorias (categorias){
    let html = "<th>Categoria:</th>";
    categorias.map(categoria => {
        html +=`
        <th>${categoria}</th>
        `
    })
    document.querySelector('#cat').innerHTML = html;
}

function displayIngresos(ingresoCategoria){
    let html = "<th>Ingresos [$]</th>";
    ingresoCategoria.map(elemento => {
        html +=`
        <td>${elemento.income}</td>
        `
    })
    document.querySelector('#income').innerHTML = html;
}

function displayAsistencia(porcentajeAsistencia){
    let html = "<th>Audiencia [%]</th>";
    porcentajeAsistencia.map(elemento => {
        html +=`
        <td>${elemento.pAssist}</td>
        `
    })
    document.querySelector('#assist').innerHTML = html;
}