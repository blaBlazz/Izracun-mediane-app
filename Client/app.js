// SELECTORS
const onScreen = document.querySelector(".screen");
const addRndButton = document.querySelector("#add-rnd-btn");
const userAddButton = document.querySelector("#user-add-btn");
const remButton = document.querySelector("#rem-btn");
const remAllButton = document.querySelector("#rem-all-btn");
const userInput = document.querySelector("#number-input");
const dispErrN = document.querySelector("#display-err-n");
const dispErrM = document.querySelector("#display-err-m");
const medButton = document.querySelector("#median-btn");
const tableHead = document.querySelector("#t-head");
const tableBody = document.querySelector("#t-body");

// List 5 random numbers
var numbersList = new Array(5).fill(0);
for (let i in numbersList) {
    numbersList[i] = getRandomInt();
}

const screen = document.createElement("h1");
screen.innerText = numbersList.join(', ');
onScreen.appendChild(screen);


// EVENT LISTENERS

// Add random number
addRndButton.addEventListener("click",  () => {
    numbersList.push(getRandomInt());
    screen.innerText = numbersList.join(', ');
    dispErrN.innerHTML = "";
    dispErrM.innerHTML = "";
});
// Add user number
userAddButton.addEventListener("click", (e) => {
    e.preventDefault();
    let uInput = Number(userInput.value);
    if (Number.isInteger(uInput) && uInput > 0 ) {
        numbersList.push(uInput);
        dispErrN.innerHTML = "";
    } else {
        dispErrN.innerHTML = "Vnesite pozitivno celo število";
    }
    userInput.value = "";
    screen.innerText = numbersList.join(', ');
    dispErrM.innerHTML = "";
});
// Remove random number
remButton.addEventListener("click", () => { 
    numbersList.splice(getRandomInt(0, numbersList.length-1), 1)
    screen.innerText = numbersList.join(', ');
    dispErrN.innerHTML = "";
    dispErrM.innerHTML = "";
});
// Remove all
remAllButton.addEventListener("click", () => { 
    numbersList.length = 0;
    screen.innerText = numbersList;
    dispErrN.innerHTML = "";
    dispErrM.innerHTML = "";
});

// Caputure and send numbers to backend -> POST
medButton.addEventListener("click", () => {
    dispErrN.innerHTML = "";
    if (numbersList.length < 1) {
        dispErrM.innerHTML = "Vnesite vsaj eno število!";
        return;
    };
    axios.post("http://localhost:5501/api/mediana/calculate", {
        numbers: numbersList,
    }).then(response => {
        let calMed = response.data.split("m");
        calMed[0] = calMed[0].slice(8, 10) + ". " + calMed[0].slice(5, 7) + ". " + calMed[0].slice(0, 4) + " - " + calMed[0].slice(12, 20);
        
        tableBody.innerHTML = `<tr><td>${calMed[0]}</td><td>${calMed[1]}</td></tr>` + tableBody.innerHTML;
        dispErrM.innerHTML = "";
    }).catch(err => {
        if (err) throw err;
    });
});

// Get data from backend -> GET
const getData =
    axios.get("http://localhost:5501/api/mediana/get").then(response => {
        loadTableData(response.data);
    }).catch(err => {
        if (err) throw err;
    });



// FUNCTIONS

//Table construction from backend data
function loadTableData(medianaData) {
    let dataHtml = "";

    if (!medianaData.length) return;

    for(let entry of medianaData) {
        let date = entry.CREATED_AT;
        date = date.slice(8, 10) + ". " + date.slice(5, 7) + ". " + date.slice(0, 4) + " - " + date.slice(11, 19);
        dataHtml = `<tr><td>${date}</td><td>${entry.MEDIANA}</td></tr>` + dataHtml;
    }

    tableHead.innerHTML = "<tr><th>Ustvarjeno</th> <th>Mediana</th></tr>";
    tableBody.innerHTML = dataHtml;
}

// Generate random number
function getRandomInt(min=1, max=1000) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}