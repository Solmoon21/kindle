class Tile {
    constructor(colour,value,state){
        this.colour = colour;
        this.value = value;
        this.state = state; // lit or not
    }
}

// -1 => w, 0-4 => b, -2 => empty b, 5 -> bulb
easy = [
    [-1,-1,-1, 1,-1,-1,-1],
    [-1, 0,-1,-1,-1, 2,-1],
    [-1,-1,-1,-1,-1,-1,-1],
    [-2,-1,-1,-2,-1,-1,-2],
    [-1,-1,-1,-1,-1,-1,-1],
    [-1,-2,-1,-1,-1, 2,-1],
    [-1,-1,-1, 3,-1,-1,-1],
]

med = [
    [-1,-1, 0,-1,-2,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1],
    [-2,-1,-2,-1, 3,-1,-2],
    [-1,-1,-1, 1,-1,-1,-1],
    [ 2,-1,-2,-1,-2,-1,-2],
    [-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-2,-1, 2,-1,-1],
]

advc = [
    [-1,-2,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1, 3,-1, 2,-1,-2],
    [-1, 0,-2,-1,-1,-1,-1,-2,-1,-1],
    [-1,-1,-1,-1,-2,-1,-1,-1,-1,-1],
    [-1, 1,-1,-1,-2, 1,-2,-1,-1,-1],
    [-1,-1,-1,-2,-2,-2,-1,-1, 3,-1],
    [-1,-1,-1,-1,-1,-2,-1,-1,-1,-1],
    [-1,-1, 1,-1,-1,-1,-1, 0,-2,-1],
    [ 3,-1,-2,-1, 0,-1,-1,-1,-1,-1],
    [-1,-1,-1, 1,-1,-1,-1,-1, 0,-1],
]

let table = [] // actual table
function Translate(level) {
    table = []
    level.forEach(row => {
        newRow = []
        row.forEach(e => {
            col = e==-1 ? "W" : "B"
            newRow.push(new Tile(col,e,"N"))
        });
        table.push(newRow)
    });
}

//html table
board = document.querySelector("#gameTable")
clock = document.querySelector("#displayTime");
let currlevel;
let username;
let paused = false;
let end = false;
let elapsed = 0;
function Start(name,level) {
    currlevel = level
    username = name;
    UpdateTime()
    setInterval(UpdateTime,1000)
    Translate(level=="EASY"?easy: level=="MEDIUM"?med:advc)
    DisplayTable()
    AddClickEvent()
}

function Reload(){
    checkpoint = JSON.parse(localStorage.getItem("checkpoint"))
    
    if(checkpoint){
        console.log(checkpoint)
        currlevel = checkpoint.level
        table = checkpoint.table
        username = checkpoint.name
        document.querySelector("#displayName").innerHTML = checkpoint.name
        elapsed = checkpoint.time
        UpdateTime()
        setInterval(UpdateTime,1000)
        DisplayTable()
        AddClickEvent()
    }
    else {
        console.log("no")
    }
}

const pauseBtn = document.querySelector("#pause")
pauseBtn.addEventListener("click", (e) => {
    paused = true
    pauseBtn.classList.toggle("off")
    document.querySelector(".pause-menu").classList.remove("off")
})

const unpauseBtn = document.querySelector("#unpause")
unpauseBtn.addEventListener("click", () => {
    paused = false
    pauseBtn.classList.toggle("off")
    document.querySelector(".pause-menu").classList.add("off")
})

function UpdateTime(){
    if(paused || end)
        return
    elapsed++
    clock.innerHTML = elapsed 
}


function DisplayTable(){
    board.innerHTML = ""
    for(var i=0;i<table.length;i++){
        tr = document.createElement("tr")
        for(var j=0;j<table.length;j++){
            element = table[i][j]
            e = document.createElement("td")
            e.style.color = adjtest(i,j,table[i][j].value) ? "green" : "white"
            e.style.background = element.value == 5 ? `url("Images/light-bulb-11.svg")` : "none"
            var bg = ""
            if(ErrorLight(i,j)){
                bg = "red"
                console.log(i+" "+j)
            }
            else{
                if(element.colour == "B")
                    bg = "black"
                else{
                    if(element.state == "Y")
                        bg = "yellow"
                    else
                        bg = "white"
                }
            }
            e.style.backgroundColor = bg
            e.innerHTML = element.colour == "B" && element.value>-1 ? element.value : "";
            tr.appendChild(e)
        }
        board.appendChild(tr)
    }
}

function RenderTable() {
    for(var i=0;i<table.length;i++){
        for(var j=0;j<table.length;j++){
            if(table[i][j].value == 5){
                LitRC(i,j,true)
            }
        }
    }

}

function ErrorLight(row,col){
    if(table[row][col].value != 5)
        return false

    var i = row
    while(i>0 && table[i-1][col].colour != "B"){
        if(table[i-1][col].value == 5){
            i = 0
            return true
        }
        i--
    }
    i = row
    while(i<table.length-1 && table[i+1][col].colour != "B"){
        if(table[i+1][col].value == 5){
            i = table.length
            return true
        }
        i++
    }

    var j = col 
    while(j>0 && table[row][j-1].colour != "B"){
        if(table[row][j-1].value == 5){
            j = 0
            return true
        }
        j--
    }

    j = col 
    while(j<table.length-1 && table[row][j+1].colour != "B"){
        if(table[row][j+1].value == 5){
            j = table.length
            return true
        }
        j++
    }
    return false
}

function AddClickEvent(){
    board.addEventListener("click",
    (e)=>{
        if(end)
            return
        if(e.target.matches("td")){
            var i = e.target.closest('tr').rowIndex 
            var j = e.target.cellIndex
            if(table[i][j].colour == "B")
                return;
            Lit(i,j)
            console.clear()
            printTable()
            RenderTable()
            DisplayTable()
            if(isOver()){
                end = true
                Save()
                Restart()
            }
                
        }
    })
}

function animates(i,j){
    if(i<0 || i==table.size)
        return
    if(j<0 || j==table.size)
        return
}

function Lit(i,j) {
    if(table[i][j].value == 5){
        table[i][j].value = -1 
        table[i][j].state = "N"
        LitRC(i,j,false)
    }
    else{
        table[i][j].value = 5
        table[i][j].state = "Y"
    }
}

function LitRC(row,col,con) {
    var state = con ? "Y" : "N"
    table[row][col].state = state

    var i = row
    while(i>0 && table[i-1][col].colour != "B"){
        table[i-1][col].state = state
        i--
    }
    i = row
    while(i<table.length-1 && table[i+1][col].colour != "B"){
        table[i+1][col].state = state
        i++
    }

    var j = col 
    while(j>0 && table[row][j-1].colour != "B"){
        table[row][j-1].state = state
        j--
    }

    j = col 
    while(j<table.length-1 && table[row][j+1].colour != "B"){
        table[row][j+1].state = state
        j++
    }
}

function adjtest(i,j,amount) {
    var bulb = 0
    if(i-1>=0 && table[i-1][j].value == 5){
        bulb++
    }
    if(j-1>=0 && table[i][j-1].value == 5)
        bulb++
    if(i+1<table.length && table[i+1][j].value == 5)
        bulb++
    if(j+1<table.length && table[i][j+1].value == 5)
        bulb++
    return bulb == amount    
}

function blacktest() {
    for(var i=0;i<table.length;i++){
        for(var j=0;j<table.length;j++){
            if(table[i][j].colour == "B" && table[i][j].value > -1)
                if(!adjtest(i,j,table[i][j].value))
                    return false
        }
    }
    return true
}

function whitetest() {
    for(var i=0;i<table.length;i++){
        for(var j=0;j<table.length;j++){
            if(table[i][j].colour == "W" && table[i][j].state == "N")
                return false
        }
    }
    return true
}

function bulbneighbor(row,col){
    var colstr = ""
    for(var i=0;i<table.length;i++){
        if(table[i][col].value == 5){
            colstr += "5"
        }   
        else if(table[i][col].colour == "B")
            colstr += "#"
    }

    var rowstr = ""
    for(var i=0;i<table.length;i++){
        if(table[row][i].value == 5)   
            rowstr += "5"
        else if(table[row][i].colour == "B")
            rowstr += "#"
    }

    return colstr.includes("55") || rowstr.includes("55")
}

function bulbtest() {
    for(var i=0;i<table.length;i++){
        for(var j=0;j<table.length;j++){
            if(table[i][j].value == 5 && bulbneighbor(i,j))
                return false                
        }
    }
    return true
}

function isOver(){
    return whitetest() && blacktest() && bulbtest()
}

function printTable(){
    for(var i=0;i<table.length;i++){
        var row = ""
        for(var j=0;j<table.length;j++){
            row += table[i][j].value + " "
        }
        console.log(row)
    }
}

document.querySelector("#restart").addEventListener("click",Restart)
function Restart(){
    end = false
    paused = false
    elapsed = 0
    clock.innerHTML = elapsed
    table = []
    Translate(currlevel=="EASY"?easy: currlevel=="MEDIUM"?med:advc)
    DisplayTable()
    pauseBtn.classList.toggle("off")
    document.querySelector(".pause-menu").classList.add("off")
}


document.querySelector("#save").addEventListener("click",SaveGame)
function SaveGame(){
    let obj = {
        name : username,
        table : table,
        time : elapsed,
        level : currlevel
    }
    localStorage.removeItem("checkpoint")
    localStorage.setItem("checkpoint", JSON.stringify(obj))
    paused = false
    pauseBtn.classList.toggle("off")
    document.querySelector(".pause-menu").classList.add("off")
}

function Save(){
    let old_data = JSON.parse(localStorage.getItem("scores"))
    if(old_data){
        console.log(old_data)
        old_data.push({name:username,level:currlevel,time:elapsed})
        localStorage.removeItem("scores")
    }
    else{
        old_data = [{name:username,level:currlevel,time:elapsed}]
    }
    localStorage.setItem("scores", JSON.stringify(old_data))
}
