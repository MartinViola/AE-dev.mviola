//EXPORTAR DATOS DESDE .JSON
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
    displayEventsFuturos(eventos);
    // checkboxCategorias();
}
getData();

//BUSCADOR DESDE INPUT TEXT
inputSearch.addEventListener("keyup", search);

function search(event){
    var valor = event.target.value;
    var data = eventos.filter(evento => evento.name.toLowerCase().includes(valor.toLowerCase()) || 
    evento.description.toLowerCase().includes(valor.toLowerCase()));
    displayEventsFuturos(data);
}

//FILTRO MEDIANTE SELECT-OPTION

select.addEventListener("change",selectFilter);

function selectFilter(event) {
    var selectedValue = event.target.value;
    if (selectedValue == "noSelection") {
        var data = eventos.filter(evento => evento.date > currentDate)
    }else{
        var data = eventos.filter(evento => evento.category == selectedValue);
    }
    displayEventsFuturos(data);
}

//Display eventos futuros

function displayEventsFuturos(data){   
    var toDisplay = [];
    if(data == undefined){
        toDisplay.push(...eventos);
    }else{
        toDisplay.push(...data);
    }
    let futuro = "";
    toDisplay.map(evento =>{
        if(evento.date > currentDate ){
            futuro += `
            <article>
                <h2>${evento.name}</h2>
                <img src="${evento.image}" alt="imagen" class="imgCartas"> 
                <p class="date">${evento.date} - ${evento.place}</p>
                <p>${evento.description}</p>
                <p class="price">Costo: $${evento.price},00</p>
                <button class="buttonCards"><a href="./card_detail.html?id=${evento.id}">Ver mas</a></button>
            </article>
            `
        }
    })
    document.querySelector('#todosfuturos').innerHTML = futuro;
}
displayEventsFuturos();

// //Funcion para definir los valores unicos de categorias dentro del .JSON
// function checkboxCategorias(){
//     var unique = [];
//     unique = eventos.map(evento => evento.category);
//     const dataArray = new Set(unique);
//     var arrayCategorias = [...dataArray];
//     createCheckbox(arrayCategorias);
// }
// //FUNCION PARA CREAR LOS CHECKBOX DE FORMA DINAMICA
// var checkbox;
// function createCheckbox(arrayCategorias){
//     var inputCheckbox = "";
//     arrayCategorias.forEach(element => {
//         inputCheckbox += `<label class="mycheckbox" for=""><input type="checkbox" class="checkboxCont" value="${element}">${element}</label>`
//     });
//     document.querySelector("#checkboxCategorias").innerHTML = inputCheckbox;
//     checkbox = document.querySelectorAll(".checkboxCont");
//     var checkboxSelected= [];
//     function captureCheckbox(){
//         checkbox.forEach(check =>{
//             check.addEventListener("click",function(){
//                 if(check.checked == true){
//                     checkboxSelected.push(check.value);
//                 }else{
//                     checkboxSelected = checkboxSelected.filter(uncheck => uncheck !== check.value);
//                 }
//             })
//         })
//     }
//     captureCheckbox();
// }

function displaySelectOptions(categories, eventos) {
    var selectOptions = `<option value="noSelection">--- Seleccione una categoria ---</option>`;
    categories.forEach(element =>{
        console.log(categories);
        selectOptions +=`<option value="${element}">${element}</option>`
    });
    document.querySelector("#selectCategoria").innerHTML = selectOptions;
}

//