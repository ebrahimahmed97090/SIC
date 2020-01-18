let fl = document.querySelector('.form-control-file');
let sub = document.querySelector('.ss');
let readFile = document.querySelector('.rd');
let tableContent = document.querySelector('.assmb');
let calculateAddresses = document.querySelector(".cadr");
let newTableRow;
let newTableData;
let programStatement;
let symbtbl = document.querySelector('.tbdysym');
let passOne = document.querySelector('.passon');
let ob = document.querySelector('.ob');


function readProgram(evt) {
    let PS = [];
    let f = evt.target.files[0];
    if (f) {
        let r = new FileReader();
        r.onload = function (e) {
            let contents = e.target.result;
            let ct = r.result;
            let lines = ct.split('\n');

            lines.forEach((line, index) => {
                PS[index] = line.split('\t');
            });
            PS.forEach((col, index) => {
                col.forEach((cell, ind) => {
                    cell = cell.trim();
                })
            })

        };
        r.readAsText(f);

        return PS;
    } else {
        alert("Failed to load file");
    }
}

function writeProgram(arr) {
    tableContent.innerHTML = '<h4>Program</h4><table class="table-bordered asmtbl"><thead><tr class="thd"><th class="p-1">label</th><th class="p-1">mnemonic</th><th class="p-1">operand</th></tr></thead><tbody class="tbdy"></tbody></table>';
    tbl = document.querySelector('.tbdy');

    for (let i = 0; i < arr.length; i++) {
        newTableRow = document.createElement("TR");
        tbl.appendChild(newTableRow);
        newTableRow.classList.add("rw");
    }
    newTableRow = document.querySelectorAll(".rw");
    for (let i = 0; i < arr.length; i++) {
        for (let k = 0; k < arr[i].length; k++) {
            let newTableData = document.createElement("TD");
            newTableRow[i].appendChild(newTableData);
            newTableData.innerText = arr[i][k];
            newTableData.classList.add('p-1')
            if (k === 0) {
                newTableData.classList.add('label')
            }
            if (k === 1) {
                newTableData.classList.add('memonic')
            }
            if (k === 2) {
                newTableData.classList.add('operand')
            }

        }
    }
    calculateAddresses.removeAttribute("disabled");
    fl.setAttribute("disabled", "");
    readFile.setAttribute("disabled", "");
}

function calculateaddresses(program) {

    let tableHead = document.querySelector('.thd');
    let startAddress = parseInt("0x" + program[0][2]);
    let newTableHead = document.createElement("TH");
    tableHead.appendChild(newTableHead);
    newTableHead.innerText = "addresses";
//handling addresses cases

    for (let i = 0; i < program.length; i++) {


        let newTableData = document.createElement("TD");
        newTableRow[i].appendChild(newTableData);
        newTableData.classList.add('p-1');
        if (i === 0 || i === 1) {
            program[i].push(startAddress);
            newTableData.innerText = startAddress.toString(16).padStart(4, "0");
        } else if (program[i][1] === "WORD") {
            startAddress += 3;
            program[i].push(startAddress);

        } else if (program[i][1] === "RESW") {
            startAddress += (3 * parseInt(program[i][2]));
            program[i].push(startAddress);

        } else if (program[i][1] === "BYTE" && program[i][2][0] === 'X' && program[i][2][1] === '`') {

            startAddress += (Math.floor((program[i][2].length - 3) / 2));
            program[i].push(startAddress);

        } else if (program[i][1] === "BYTE" && program[i][2][0] === 'C' && program[i][2][1] === '`') {
            startAddress += program[i][2].length - 4;
            program[i].push(startAddress);

        } else if (program[i][1] === "BYTE" && (program[i][2][0] !== 'C' || program[i][2][0] === 'X')) {
            startAddress += 1;
            program[i].push(startAddress);

        } else if (program[i][1] === "RESB") {
            startAddress += (parseInt(program[i][2]));
            program[i].push(startAddress);
        } else {
            startAddress += 3;
            program[i].push(startAddress);


        }
        if (i !== 0) {

            newTableData.innerText = program[i][3].toString(16).padStart(4, "0").toUpperCase();

            newTableData.classList.add('address')

        }
    }

}

function symbolTable(program) {
    let symbolTable = [[], []];
    passOne = document.querySelector('.passon');
    passOne.innerHTML = '<h4>pass one</h4><table class="table-bordered"><thead><tr class=""><th class="p-1">Symbol</th><th class="p-1">Adress</th></tr></thead><tbody class="tbdysym"></tbody></table>';
    symbtbl = document.querySelector('.tbdysym');
    for (let a = 0; a < program.length; a++) {
        if (program[a][0] !== "" && a !== 0) {
            symbolTable[0].push(program[a][0]);
            symbolTable[1].push(program[a][3]);
            newTableRow = document.createElement("TR");
            symbtbl.appendChild(newTableRow);
            newTableRow.classList.add("rwsym");
            newTableData = document.createElement("TD");
            newTableRow.appendChild(newTableData);
            newTableData.innerText = program[a][0];
            newTableData.classList.add('p-1');
            newTableData.classList.add('sym');
            newTableData = document.createElement("TD");
            newTableRow.appendChild(newTableData);
            newTableData.innerText = program[a][3].toString(16).padStart(4, "0").toUpperCase();
            newTableData.classList.add('p-1');
            newTableData.classList.add('addresses');
        }

    }
    return symbolTable
}

function addInstructions(program) {
    program.forEach((programs) => {
        if (programs[1] == "Start" || programs[1] == "RESW" || programs[1] == "RESB" || programs[1] == "BYTE" || programs[1] == "WORD" || programs[1] == "End") {
            programs.push("No instruction")
        } else {
            opcodetable.forEach((op) => {
                if (op.memoNic == programs[1]) {
                    programs.push(op.obCode)
                }
            });
        }
    })

}

function XReg(program) {
    program.forEach(e => {
        if (e[2].search(",X") != -1) {
            e.push(1)
        } else {
            e.push(0)
        }
    })

}

function addSymbolAddress(program) {
    let sym = symbolTable(program);
    program.forEach(programs => {

        if (programs[1] == "Start" || programs[1] == "RESW" || programs[1] == "RESB" || programs[1] == "BYTE" || programs[1] == "WORD" || programs[1] == "End") {
            programs.push("No Symbol")
        } else {
            sym[0].forEach((z, index) => {

                if (-1 != (programs[2]).trim().search(z.trim())) {
                    programs.push(sym[1][index]);
                }
            });


        }
    });

}


fl.addEventListener('change', e => {

    programStatement = readProgram(e);
    readFile.removeAttribute("disabled");
});

sub.addEventListener('submit', e => {
    e.preventDefault();
    writeProgram(programStatement);

});

calculateAddresses.addEventListener('click', e => {
    calculateaddresses(programStatement);

    ob.removeAttribute("disabled");
    calculateAddresses.setAttribute("disabled", "");
    readFile.setAttribute("disabled", "");

});

ob.addEventListener('click', e => {
    addInstructions(programStatement);
    XReg(programStatement);
    addSymbolAddress(programStatement);
    console.log(programStatement);
});