const resultList = document.querySelector(".result-list")
resultList.innerHTML = ""
var dict = JSON.parse(localStorage.getItem("scores"))

if(dict){
    document.querySelector(".records").classList.remove("off")
    dict.forEach(element => {
        var temp = document.createElement("li");
        temp.innerHTML = `<div class="result">  
                            <div class="r-left">
                                <div class="user">${element.name}</div>
                            </div>
                            <div class="r-right">
                                <div class="map">${element.level}</div>
                                <div class="score">${element.time}</div>
                            </div>
                        </div>`
        resultList.appendChild(temp)
    });
}

var board = document.querySelector("#pgameTable")
var checkpoint = JSON.parse(localStorage.getItem("checkpoint"))
if(checkpoint){
    document.querySelector(".preview").classList.remove("off")
    table = checkpoint.table
    document.querySelector("#pdisplayName").innerHTML = checkpoint.name
    document.querySelector("#pdisplayTime").innerHTML = checkpoint.time
    board.innerHTML = ""
    for(var i=0;i<table.length;i++){
        tr = document.createElement("tr")
        for(var j=0;j<table.length;j++){
            element = table[i][j]
            e = document.createElement("td")
            e.style.background = element.value == 5 ? `url("Images/light-bulb-11.svg")` : "none"
            e.style.backgroundColor = element.colour == "W"?  element.state == "Y" ? "yellow": "white": "black";
            e.innerHTML = element.colour == "B" && element.value>-1 ? element.value : "";
            tr.appendChild(e)
        }
        board.appendChild(tr)
    }
}
else{
    console.log("no data")
}

let level = "EASY"
const selected = document.querySelector(".selected")
const optionsContainer = document.querySelector(".options-container")

const options = document.querySelectorAll(".option")
selected.addEventListener("click",() => {
    optionsContainer.classList.toggle("active")
})

options.forEach(o => {
    o.addEventListener("click", () => {
        level = o.querySelector("label").innerHTML
        selected.innerHTML = level;
        optionsContainer.classList.toggle("active")
    })
} )

const playBtn = document.querySelector("#play")
playBtn.addEventListener("click", () => {
    document.querySelector(".menu").classList.toggle("off")
    document.querySelector(".game").classList.toggle("off")
    name = document.querySelector("#name").value;
    document.querySelector("#displayName").innerHTML = name;
    Start(name,level.trim()) 
})


const reloadBtn = document.querySelector("#reload")
reloadBtn.addEventListener("click", () => {
    document.querySelector(".menu").classList.toggle("off")
    document.querySelector(".game").classList.toggle("off")
    name = document.querySelector("#name").value;
    document.querySelector("#displayName").innerHTML = name;
    Reload()
})