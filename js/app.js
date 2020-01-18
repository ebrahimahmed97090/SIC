//document selector variables 
let passOne = document.querySelector('.passon');
let readFile = document.querySelector('.rd');
let tableContent = document.querySelector('.assmb');
let tbl = document.querySelector('.tbdy');
let fl = document.querySelector('.form-control-file');
let sub = document.querySelector('.ss');
let calculateAddresses = document.querySelector(".cadr");
let tableHead = document.querySelector('.thd');
let symbolTableContent = document.querySelectorAll('.tbdysymc');
let symbtbl = document.querySelectorAll('.tbdysym');
let ob = document.querySelector('.ob');
let hte = document.querySelector('.hte');
let passTwo = document.querySelector('.passtw');
//creating new elements variables will be declared later
let newTableHead;
let newTableRow;
let newTableData;
//the whole program
let programStatement = [];
//start address
let startAddress;
//addresses array
let addresses = [];
//instructions array
let instructions = [];
let instructionsBin = [];
let addressStr = [];
let addressBin = [];
let symbolTable = [[], []];
let index = [];
indexbin = [];
let obCode = [];
let k;

//function to read assembly problem and turn it into 2d array
function readSingleFile(evt) {
    let f = evt.target.files[0];
    if (f) {
        let r = new FileReader();
        r.onload = function (e) {
            let contents = e.target.result;
            let ct = r.result;
            let lines = ct.split('\n');

            lines.forEach((line, index) => {
                programStatement[index] = line.split('\t');
            })
        };
        r.readAsText(f);

    } else {
        alert("Failed to load file");
    }
}

//read file from file uploader in html

fl.addEventListener('change', readSingleFile, false);
fl.addEventListener('change', e => {
    readFile.removeAttribute("disabled");
});


//create display the file after parse it into an array
//create header

//event to handle new array of values

sub.addEventListener('submit', e => {
    tableContent.innerHTML = '<h4>Program</h4><table class="table-bordered asmtbl"><thead><tr class="thd"><th class="p-1">label</th><th class="p-1">mnemonic</th><th class="p-1">operand</th></tr></thead><tbody class="tbdy"></tbody></table>';
    tbl = document.querySelector('.tbdy');
    e.preventDefault();
    for (let i = 0; i < programStatement.length; i++) {
        newTableRow = document.createElement("TR");
        tbl.appendChild(newTableRow);
        newTableRow.classList.add("rw");
    }
    newTableRow = document.querySelectorAll(".rw");
    for (let i = 0; i < programStatement.length; i++) {
        for (let k = 0; k < programStatement[i].length; k++) {
            newTableData = document.createElement("TD");
            newTableRow[i].appendChild(newTableData);
            newTableData.innerText = programStatement[i][k];
            newTableData.classList.add('p-1')
            if (k == 0) {
                newTableData.classList.add('label')
            }
            if (k == 1) {
                newTableData.classList.add('memonic')
            }
            if (k == 2) {
                newTableData.classList.add('operand')
            }

        }
    }
//declare first address inside the event because javascript is async language (0x) for hex in js
    startAddress = parseInt("0x" + programStatement[0][2]);
    calculateAddresses.removeAttribute("disabled");
    fl.setAttribute("disabled", "");
    readFile.setAttribute("disabled", "");

});
//create array of addresses

//event button to calculate addresses
calculateAddresses = document.querySelector(".cadr");
//event to calculate addresses
calculateAddresses.addEventListener('click', e => {
    tableHead = document.querySelector('.thd');

    newTableHead = document.createElement("TH");
    tableHead.appendChild(newTableHead);
    newTableHead.innerText = "adress";
//handling addresses cases
    for (let i = 0; i < programStatement.length; i++) {
        newTableData = document.createElement("TD");
        newTableRow[i].appendChild(newTableData);
        newTableData.classList.add('p-1')
        if (i == 0) {
            addresses.push(startAddress);
            newTableData.innerText = startAddress.toString(16).padStart(4, "0");
        } else if (programStatement[i][1] == "WORD") {
            startAddress += 3;
            addresses.push(startAddress);

        } else if (programStatement[i][1] == "RESW") {
            startAddress += (3 * parseInt(programStatement[i][2]));
            addresses.push(startAddress);

        } else if (programStatement[i][1] == "BYTE" && programStatement[i][2][0] == 'X' && programStatement[i][2][1] == '`') {

            startAddress += (Math.floor((programStatement[i][2].length - 3) / 2));
            addresses.push(startAddress);

        } else if (programStatement[i][1] == "BYTE" && programStatement[i][2][0] == 'C' && programStatement[i][2][1] == '`') {
            startAddress += programStatement[i][2].length - 4;
            addresses.push(startAddress);

        } else if (programStatement[i][1] == "BYTE" && (programStatement[i][2][0] != 'C' || programStatement[i][2][0] == 'X')) {
            startAddress += 1;
            addresses.push(startAddress);

        } else if (programStatement[i][1] == "RESB") {
            startAddress += (parseInt(programStatement[i][2]));
            addresses.push(startAddress);
        } else {
            startAddress += 3;
            addresses.push(startAddress);


        }
        if (i != 0) {

            newTableData.innerText = addresses[i].toString(16).padStart(4, "0");

            newTableData.classList.add('address')

        }
    }
//symbol table

    passOne = document.querySelector('.passon');
    passOne.innerHTML = '<h4>pass one</h4><table class="table-bordered"><thead><tr class=""><th class="p-1">Symbol</th><th class="p-1">Adress</th></tr></thead><tbody class="tbdysym"></tbody></table>';
    symbtbl = document.querySelector('.tbdysym');
    for (let a = 0; a < programStatement.length; a++) {
        if (programStatement[a][0] == "" || a == 0) {

        } else {
            symbolTable[0].push(programStatement[a][0]);
            symbolTable[1].push(addresses[a - 1]);
            newTableRow = document.createElement("TR");
            symbtbl.appendChild(newTableRow);
            newTableRow.classList.add("rwsym");
            newTableData = document.createElement("TD");
            newTableRow.appendChild(newTableData);
            newTableData.innerText = programStatement[a][0];
            newTableData.classList.add('p-1');
            newTableData.classList.add('sym');
            newTableData = document.createElement("TD");
            newTableRow.appendChild(newTableData);
            newTableData.innerText = addresses[a].toString(16).padStart(4, "0");
            newTableData.classList.add('p-1');
            newTableData.classList.add('addresses');


        }
    }
    ob.removeAttribute("disabled");
    calculateAddresses.setAttribute("disabled", "");
    readFile.setAttribute("disabled", "");
});

ob.addEventListener('click', e => {
    passTwo.innerHTML += "<h4>pass two</h4>";
    let indx;
    let X;
    for (let i = 1; i < programStatement.length - 1; i++) {
        // index direct
        if (programStatement[i][2].search(',X') == -1) {
            X = 0;
            index.push(X);

        } else if (programStatement[i][2].search(',X') != -1) {

            let nw = programStatement[i][2].trim().slice(0, -2);
            programStatement[i][2] = nw;

            X = 1;
            index.push(X);
        }

        //check the equality of every symbol in symbol table with the program
        symbolTable[0].forEach((symbol, index) => {

            if (programStatement[i][2].trim() == symbol.trim()) {
                indx = index;
            }

        });
        //check if RESW or RESB
        if (programStatement[i][1] == "RESW" || programStatement[i][1] == "RESB") {
            instructions.push("no instructions")
        }

        //check in WORD adds value in hex
        else if (programStatement[i][1] == "WORD") {

            instructions.push(parseInt(programStatement[i][2]).toString(16));


            passTwo.innerHTML +=

                `<div class="pstwtbl">
    <h5 class="text-center">${i} - ${programStatement[i][1]} - ${programStatement[i][2]}
    </h5>
    <table class="table-bordered m-auto">
        <thead>
        <tr class="">
            <th class="p-1 text-center" colspan="3">OP-Code</th>
        </tr>
        </thead>
        <tbody class="tbdysymc">
        <tr>

            <td class="adrsss text-center adrsps " colspan="3">${parseInt(programStatement[i][2]).toString(16).padStart(4, "0")}</td>
        </tr>
        </tbody>
    </table>
</div>`
        } else if (programStatement[i][1] == "BYTE" && programStatement[i][2][0] == 'X' && programStatement[i][2][1] == '`') {

            instructions.push((Math.floor((programStatement[i][2].length - 3) / 2)).toString(16).padStart(4, "0"));
            passTwo.innerHTML +=

                `<div class="pstwtbl">
    <h5 class="text-center">${i} - ${programStatement[i][1]} - ${programStatement[i][2]}
    </h5>
    <table class="table-bordered m-auto">
        <thead>
        <tr class="">
            <th class="p-1 text-center" colspan="3">OP-Code</th>
        </tr>
        </thead>
        <tbody class="tbdysymc">
        <tr>

            <td class="adrsss text-center adrsps " colspan="3">${(Math.floor((programStatement[i][2].length - 3) / 2)).toString(16).padStart(4, "0")}</td>
        </tr>
        </tbody>
    </table>
</div>`

        } else if (programStatement[i][1] == "BYTE" && programStatement[i][2][0] == 'C' && programStatement[i][2][1] == '`') {
            instructions.push((programStatement[i][2].length - 4).toString(16));
            passTwo.innerHTML +=


                `<div class="pstwtbl">
    <h5 class="text-center">${i} - ${programStatement[i][1]} - ${programStatement[i][2]}
    </h5>
    <table class="table-bordered m-auto">
        <thead>
        <tr class="">
            <th class="p-1 text-center" colspan="3">OP-Code</th>
        </tr>
        </thead>
        <tbody class="tbdysymc">
        <tr>
            <td class="adrsss text-center adrsps " colspan="3">${(programStatement[i][2].length - 4).toString(16).padStart(4, "0")}</td>
        </tr>
        </tbody>
    </table>
</div>`

        } else if ((programStatement[i][1] == "BYTE" && programStatement[i][2][0] != 'C' && programStatement[i][2][1] != '`') || programStatement[i][1] == "BYTE" && programStatement[i][2][0] != 'X' && programStatement[i][2][1] != '`') {
            instructions.push(parseInt(programStatement[i][2]).toString(16))


        }
        let opdx;
        if (!(programStatement[i][1] != "WORD" && programStatement[i][1] != "BYTE" && programStatement[i][1] != "RESW" && programStatement[i][1] != "RESB")) {
            continue;
        }
        opcodetable.forEach((opcd, index) => {
            if (opcd.memonic == programStatement[i][1]) {
                opdx = index;
                instructions.push(opcodetable[opdx].opcode)
            }
        })
        addressStr.push(symbolTable[1][indx + 1].toString(16).padStart(4, "0"));
        passTwo.innerHTML +=
            `<div class="pstwtbl">
    <h5 class="text-center">${i} - ${programStatement[i][1]} - ${programStatement[i][2]}
    </h5>
    <table class="table-bordered">
        <thead>
        <tr class="">
            <th class="p-1">Ins</th>
            <th class="p-1">X</th>
            <th class="p-1 text-center">ADDRESS</th>
        </tr>
        </thead>
        <tbody class="tbdysymc">
        <tr>
            <td class="text-center opcdsp">${opcodetable[opdx].opcode}</td>
            <td class="text-center">${X}</td>
            <td class="adrsss text-center adrsps">${symbolTable[1][indx + 1].toString(16).padStart(4, "0").toUpperCase()}</td>
        </tr>
        </tbody>
    </table>
</div>`;
    }

    let z;
    let a;
    for (let i = 0; i < instructions.length; i++) {
        z = "";

        for (let g = 0; g < instructions[i].length; g++) {
            if (instructions[i] == "no instructions") {
                z = "no instructions";
                break
            } else {

                z += parseInt(instructions[i][g], 16).toString(2).padStart(4, "0")
            }

        }

        instructionsBin.push(z.padStart(8, "0").replace(/\d{4}(?=.)/g, '$& '));


    }
    for (let i = 0; i < addressStr.length; i++) {
        a = ""
        for (let g = 0; g < addressStr[i].length; g++) {

            if (g == 0) {
                a += (parseInt(addressStr[i][g], 16).toString(2).padStart(3, "0") + " ")
            } else {
                a += (parseInt(addressStr[i][g], 16).toString(2).padStart(4, "0") + " ")
            }
        }
        addressBin.push(a);
    }

    symbolTableContent = document.querySelectorAll('.tbdysymc');
    let i = 0;
    let v = 0;
    while (i < symbolTableContent.length || v < programStatement.length) {
        if (instructionsBin[i] == "no instructions" || programStatement[v][1] == "WORD" || programStatement[v][1] == "BYTE") {
            console.log(programStatement[v][1]);
            v++
        }
        //  if (instructionsBin[v] != "no instructions" && programStatement[v][1] != "WORD" && programStatement[v][1] != "BYTE")
        else {
            let q = parseInt(((instructionsBin[v]), 2).toString(16).replace(/ /g, '').padStart(2, "0").toUpperCase() + (parseInt((index[v] + addressBin[v]).toString(), 2).toString(16).replace(/ /g, '').padStart(4, "0").toUpperCase()));
            symbolTableContent[i].innerHTML += `<tr>
    <td>${instructionsBin[v]}</td>
    <td class="text-right">${index[v]}</td>
    <td>${addressBin[v]}
    </td>
</tr>
<tr>
    <td class="text-center opcdsp">${parseInt((instructionsBin[v]), 2).toString(16).replace(/ /g, '').padStart(2, "0").toUpperCase()}</td>
    <td COLSPAN="2" class="text-center spcshex">${parseInt((index[v] + addressBin[v]), 2).toString(16).replace(/ /g, '').padStart(4, "0").toUpperCase()}</td>
</tr>
<tr>
    <td colspan="3" class="text-center">Ob-code: ${q}</td>
</tr>`;
            v++;
            i++;
            obCode.push(q);
        }
    }


    ob.setAttribute("disabled", "");
    hte.removeAttribute("disabled");
    console.log(addressBin)
});

hte.addEventListener('click', e => {
    passTwo.innerHTML += `<h5>HTE Record</h5><br><p>H</p><p>${programStatement[0][0] + programStatement[0][2]}</p>`

});
