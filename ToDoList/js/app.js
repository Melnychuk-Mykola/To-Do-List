// Вибір елементів
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

// Імена класів
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

// Змінні
let LIST, id;

// отримання елементів із localstorage
let data = localStorage.getItem("TODO");

// перевірка, чи не порожні дані
if(data){
    LIST = JSON.parse(data);
    id = LIST.length; // встановити id як останній елемент у списку
    loadList(LIST); // завантажити список у інтерфейс користувача
}else{
    // якщо дані порожні
    LIST = [];
    id = 0;
}

// завантаження елементів у інтерфейс користувача
function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

// очищення localstorage
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
});

// Показ сьогоднішньої дати
const options = {weekday : "long", month:"short", day:"numeric"};
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("en-US", options);

// функція додавання елемента "to do"

function addToDo(toDo, id, done, trash){
    
    if(trash){ return; }
    
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";
    
    const item = `<li class="item">
                    <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                    <p class="text ${LINE}">${toDo}</p>
                    <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                  </li>
                `;
    
    const position = "beforeend";
    
    list.insertAdjacentHTML(position, item);
}

// додавання елемента до списку за допомогою клавіші enter
document.addEventListener("keyup",function(event){
    if(event.keyCode == 13){
        const toDo = input.value;
        
        // якщо поле введення не порожнє
        if(toDo){
            addToDo(toDo, id, false, false);
            
            LIST.push({
                name : toDo,
                id : id,
                done : false,
                trash : false
            });
            
            // додати елемент до localstorage (цей код потрібно додати там, де оновлюється масив LIST)
            localStorage.setItem("TODO", JSON.stringify(LIST));
            
            id++;
        }
        input.value = "";
    }
});

// завершення "to do"
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    
    LIST[element.id].done = LIST[element.id].done ? false : true;
}

// видалення "to do"
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    
    LIST[element.id].trash = true;
}

// вибір елементів, створених динамічно

list.addEventListener("click", function(event){
    const element = event.target; // повертає натиснутий елемент всередині списку
    const elementJob = element.attributes.job.value; // завершити або видалити
    
    if(elementJob == "complete"){
        completeToDo(element);
    }else if(elementJob == "delete"){
        removeToDo(element);
    }
    
    // додати елемент до localstorage (цей код потрібно додати там, де оновлюється масив LIST)
    localStorage.setItem("TODO", JSON.stringify(LIST));
});
