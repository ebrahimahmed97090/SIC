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
//array contains
//0 Label 1 MemoNic 2 Operand 3 addresses 4 Instructions 5 Index reg 6 Address of symbol 7 address of symbol in hex 8 address of symbol in binary
// 9 instruction in binary

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
        if (i === 0) {
            program[i].push(startAddress);

            newTableData.innerText = startAddress.toString(16).padStart(4, "0");
        } else if (i === 1) {
            program[i].push(startAddress);
            newTableData.innerText = startAddress.toString(16).padStart(4, "0");
        } else if (program[i - 1][1] === "WORD") {
            startAddress += 3;
            program[i].push(startAddress);

        } else if (program[i - 1][1] === "RESW") {
            startAddress += (3 * parseInt(program[i - 1][2]));
            program[i].push(startAddress);

        } else if (program[i - 1][1] === "BYTE" && program[i - 1][2][0] === 'X' && program[i - 1][2][1] === '`') {

            startAddress += (Math.floor((program[i - 1][2].length - 3) / 2));
            program[i].push(startAddress);

        } else if (program[i - 1][1] === "BYTE" && program[i - 1][2][0] === 'C' && program[i - 1][2][1] === '`') {
            startAddress += program[i + 1][2].length - 4;
            program[i].push(startAddress);

        } else if (program[i - 1][1] === "BYTE" && (program[i - 1][2][0] !== 'C' || program[i - 1][2][0] === 'X')) {
            startAddress += 1;
            program[i].push(startAddress);

        } else if (program[i - 1][1] === "RESB") {
            startAddress += (parseInt(program[i - 1][2]));
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

function HexAddresses(program) {
    program.forEach(programs => {
        if (programs[6] === "N/S") {
            programs.push("N/S")
        } else {
            programs.push(intToHexStrInFour(programs[6]))
        }
    })
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
            programs.push("N/I")
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

function intToHexStrInFour(str) {


    return str.toString(16).padStart(4, "0");
}

function adrStrHexToBinaryInFour(program) {

    program.forEach(programs => {
        if (programs[7] === "N/S") {
            programs.push("N/S")
        } else {
            programs.push("");


            for (let i = 0; i < programs[7].length; i++) {

                if (i === 0) {
                    programs[8] += (parseInt(programs[7][i], 16).toString(2).padStart(3, "0")) + " ";

                } else {
                    programs[8] += (parseInt(programs[7][i], 16).toString(2).padStart(4, "0")) + " ";
                }
            }

        }
    })
}

function instStrHexToBinaryInFour(program) {

    program.forEach(programs => {
        if (programs[4] === "N/I") {
            programs.push("N/I")
        } else {
            programs.push("");


            for (let i = 0; i < programs[4].length; i++) {


                programs[9] += (parseInt(programs[4][i], 16).toString(2).padStart(4, "0")) + " ";

            }

        }
    })
}

function addSymbolAddress(program) {
    let sym = symbolTable(program);
    program.forEach(programs => {

        if (programs[1] === "Start" || programs[1] === "RESW" || programs[1] === "RESB" || programs[1] === "BYTE" || programs[1] === "WORD" || programs[1] === "End") {
            programs.push("N/S")
        } else {
            sym[0].forEach((z, index) => {

                if (-1 !== (programs[2]).trim().search(z.trim())) {
                    programs.push(sym[1][index]);
                }
            });


        }
    });

}

function mergeIndexRegWithAddress(program) {
    program.forEach(prog => {
        if (prog[8] === "N/S") {
            prog.push("N/S")
        } else {
            prog.push(prog[5].toString() + prog[8])
        }
    })
}

function fromSeparatedBinaryToHex(program) {
    program.forEach(prog => {
        if (prog[9] === "N/I") {
            prog.push("N/I");
            prog.push("N/S");

        } else {
            prog.push(prog[9].replace(/ /g, ''));
            prog.push(prog[10].replace(/ /g, ''));
            prog[11] = parseInt(prog[11], 2).toString(16).padStart(2, "0").toUpperCase();
            prog[12] = parseInt(prog[12], 2).toString(16).padStart(4, "0").toUpperCase();
        }
    })
}

function obCode(program) {
    program.forEach(pro => {
        if (pro[1] === "WORD") {
            pro.push(parseInt(pro[2]).toString(16).padStart(6, "0").toUpperCase())
        } else if (pro[1] === "BYTE") {
            if (pro[2].search("X`") === 0) {
                pro.push(pro[2].replace("X`", "").replace("`", "").padStart(2, "0"));

            } else if (pro[2].search("C`") === 0) {
                pro.push(getstrASCII(pro[2]))
            }
        } else if (pro[1] === "RESW" || pro[1] === "RESB" || pro[1] === "Start" || pro[1] === "End") {
            pro.push("N/O")
        } else {
            pro.push(pro[11] + pro[12]);
        }
    })
}

function getstrASCII(gtsq) {
    let ASCIISTR = "";
    gtsq = gtsq.replace("C`", "").replace("`", "").trim();
    gtsq = gtsq.split("");
    for (let i = 0; i < gtsq.length; i++) {
        ASCIISTR += ASCII[gtsq[i]]
    }
    return ASCIISTR.padStart(6, "0")
}

function HTE(program) {
    let HTE = [["H", program[0][0].substr(0, 6).padEnd(6, '*'), program[0][2].padStart(7, "0"), (program[program.length - 1][3] - program[0][3]).toString(16).padStart(6, "0").toUpperCase()], ["E", program[0][2].padStart(7, "0").toUpperCase()]];
    let T = [];
    let q = 0;
    let z = 1;
    for (let i = 0; i < program.length - 1; i++) {
        T.push(program[i][13]);
        if (program[i][13] === "N/O" || program[i + 1][13] === "N/O" || i % 11 === 0) {

            T.splice(0, 0, "T", program[i - q][3].toString(16).padStart(6, "0").toUpperCase(), (program[i + 1][3] - program[i - q][3]).toString(16).padStart(2, "0").toUpperCase());
            if (T.length === 4 && T.includes("N/O")) {
                T = [];
                q = 0;
                continue;
            } else {
                HTE.splice(z, 0, T);
                T = [];
                q = 0;
                z++;
                continue;
            }
        }

        q++;
    }

    return HTE;
}

function printPassTwo(program) {
    for (let i = 0; i < program.length; i++)
        if (program[i][11] === "N/I") {
            if (program[i][13] !== "N/O") {
                $(`<div class="wds"><h5>${i} ${program[i][1]} ${program[i][2]}</h5><table class="table table-bordered"><thead><tr><th scope="col" class="text-center">OP Code</th><th scope="col" class="text-center">X</th><th scope="col" class="text-center">Address</th></tr></thead><tbody><tr><td colspan="3" class="text-center">${program[i][13]}</td></tr></tbody>
</div>`).appendTo(".passtw");
            }
        } else {
            $(`<div class="wds"><h5>${i} ${program[i][1]} ${program[i][2]}</h5><table class="table table-bordered"><thead><tr><th scope="col" class="text-center">OP Code</th><th scope="col" class="text-center">X</th><th scope="col" class="text-center">Address</th></tr></thead><tbody><tr><td class="text-center">${program[i][11]}</td><td class="text-center">${program[i][5]}</td><td class="text-center">${program[i][7]}</td></tr><tr><td class="text-center">${program[i][9]}</td><td class="text-center">${program[i][5]}</td><td class="text-center">${program[i][8]}</td></tr><tr><td class="text-center">${program[i][11]}</td><td colspan="2" class="text-center">${program[i][10]}</td></tr><tr><td colspan="3" class="text-center">${program[i][13]}</td></tr></tbody>
</div>`).appendTo(".passtw");
        }
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
    HexAddresses(programStatement);
    adrStrHexToBinaryInFour(programStatement);
    instStrHexToBinaryInFour(programStatement);
    mergeIndexRegWithAddress(programStatement);
    fromSeparatedBinaryToHex(programStatement);
    obCode(programStatement);
    printPassTwo(programStatement)
    console.log(programStatement);
    $(".ob").attr("disabled", "");

    $(".hte").removeAttr("disabled");

});

$(".hte").click(() => {
    let hte = HTE(programStatement);
    $(".assmb").append(`<div class="row"><div class="col-12"><div class="htect"></div></div></div>`)
    for (let i = 0; i < hte.length; i++) {
        hte[i].forEach(e => {
            $(".htect").append(`<p class="d-inline-block">${e},</p>`)

        });
        $(".htect").append(`<br>`)

    }
    $(".hte").attr("disabled", "")
});