// SELECTORS
const onScreen = document.querySelector(".screen");
const addRndButton = document.querySelector("#add-rnd-btn");
const userAddButton = document.querySelector("#user-add-btn");
const remButton = document.querySelector("#rem-btn");
const remAllButton = document.querySelector("#rem-all-btn");
const userInput = document.querySelector("#number-input");
const dispErrInput = document.querySelector("#display-err-input");
const dispErrMediana = document.querySelector("#display-med-message");
const medButton = document.querySelector("#median-btn");
const tableHead = document.querySelector("#t-head");
const tableBody = document.querySelector("#t-body");


// List 5 random numbers
let numbersList = new Array(5).fill(0).map(v => getRandomInt());

const screen = document.createElement("h1");
screen.innerHTML = numbersList.join(', ');
onScreen.appendChild(screen);

// Get data from backend -> GET
const getData =
    axios.get("http://localhost:5501/api/mediana/get").then(response => {
        loadTableData(response.data);
    }).catch(err => {
        if (err) throw err;
    });


// EVENT LISTENERS

// Add random number
addRndButton.addEventListener("click",  () => {
    numbersList.push(getRandomInt());
    screen.innerHTML = numbersList.join(', ');
    removeErrorSigns();
});

// Add number user
userAddButton.addEventListener("click", (e) => {
    e.preventDefault();
    let uInput = Number(userInput.value);
    if (Number.isInteger(uInput) && uInput > 0 ) {
        numbersList.push(uInput);
        removeErrorSigns();
    } else {
        dispErrInput.innerHTML = '<i class="fas fa-exclamation-circle"></i> Vnesi pozitivno celo število!';
        userInput.style.borderColor = "rgb(179, 6, 6)";
    }
    screen.innerHTML = numbersList.join(', ');
    userInput.value = "";
    dispErrMediana.innerHTML = "";
});

// Remove random number
remButton.addEventListener("click", () => { 
    numbersList.splice(getRandomInt(0, numbersList.length-1), 1)
    screen.innerHTML = numbersList.join(', ');
    removeErrorSigns();
});

// Remove all
remAllButton.addEventListener("click", () => { 
    numbersList.length = 0;
    screen.innerHTML = numbersList;
    removeErrorSigns();
});

// Caputure and send numbers to backend -> POST
medButton.addEventListener("click", () => {
    removeErrorSigns();

    if (numbersList.length < 1) {
        dispErrMediana.innerHTML = '<i class="fas fa-exclamation-circle"></i> Dodaj vsaj eno število!';
        return;
    };

    axios.post("http://localhost:5501/api/mediana/calculate", {
        numbers: numbersList,
    }).then(response => {
        const [date, mediana] = response.data.split("m");
        const dateFormat = `${date.slice(8, 10)}. ${date.slice(5, 7)}. ${date.slice(0, 4)} - ${date.slice(12, 20)}`;
        
        tableBody.innerHTML = `<tr><td>${dateFormat}</td><td>${mediana}</td></tr> ${tableBody.innerHTML}`;
    }).catch(err => {
        if (err) throw err;
    });
});


// HELPER FUNCTIONS

function loadTableData(medianaData) {
    let dataHtml = "";

    if (!medianaData.length) return;

    for(let {CREATED_AT, MEDIANA} of medianaData) {
        const date = `${CREATED_AT.slice(8, 10)}. ${CREATED_AT.slice(5, 7)}. ${CREATED_AT.slice(0, 4)} - ${CREATED_AT.slice(11, 19)}`;
        dataHtml = `<tr><td>${date}</td><td>${MEDIANA}</td></tr> ${dataHtml}`;
    }

    tableHead.innerHTML = "<tr><th>Ustvarjeno</th> <th>Mediana</th></tr>";
    tableBody.innerHTML = dataHtml;
};

function getRandomInt(min=1, max=1000) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
};

function removeErrorSigns() {
    dispErrInput.innerHTML = "";
    userInput.style.borderColor = "white";
    dispErrMediana.innerHTML = "";
};