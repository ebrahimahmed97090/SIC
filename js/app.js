let arr = [];
let startadress;
let rws;
let rd = document.querySelector('.rd')
let newtd;
let adr = [];
let obcode = [];
let obcdebin = [];
let passone = document.querySelector('.passon');
let cadr = document.querySelector(".cadr");
let tblhd = document.querySelector('.thd');
let newth;
let tblcnt = document.querySelector('.assmb');
let tbl = document.querySelector('.tbdy');
let fl = document.querySelector('.form-control-file');
let sub = document.querySelector('.ss');
let newrow;
let adrsstr = [];
let adrbin = [];
let symbtblc = document.querySelectorAll('.tbdysymc');
let symbtbl = document.querySelectorAll('.tbdysym');
let ob = document.querySelector('.ob');
let hte = document.querySelector('.hte');
let pastw = document.querySelector('.passtw');
let symboltable = [[], []];
let ans = document.querySelector('.ans');
let index = [];
indexbin = [];
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
                arr[index] = line.split('\t');
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
    rd.removeAttribute("disabled");
});


//create display the file after parse it into an array
//create header

//event to handle new array of values

sub.addEventListener('submit', e => {
    tblcnt.innerHTML = '<h4>Program</h4><table class="table-bordered asmtbl"><thead><tr class="thd"><th class="p-1">label</th><th class="p-1">mnemonic</th><th class="p-1">operand</th></tr></thead><tbody class="tbdy"></tbody></table>';
    tbl = document.querySelector('.tbdy');
    e.preventDefault();
    for (let i = 0; i < arr.length; i++) {
        newrow = document.createElement("TR");
        tbl.appendChild(newrow);
        newrow.classList.add("rw");
    }
    rws = document.querySelectorAll(".rw");
    for (let i = 0; i < arr.length; i++) {
        for (let k = 0; k < arr[i].length; k++) {
            newtd = document.createElement("TD");
            rws[i].appendChild(newtd);
            newtd.innerText = arr[i][k];
            newtd.classList.add('p-1')
            if (k == 0) {
                newtd.classList.add('label')
            }
            if (k == 1) {
                newtd.classList.add('memonic')
            }
            if (k == 2) {
                newtd.classList.add('operand')
            }

        }
    }
//declare first address inside the event because javascript is async language (0x) for hex in js
    startadress = parseInt("0x" + arr[0][2]);
    cadr.removeAttribute("disabled");
    fl.setAttribute("disabled", "");
    rd.setAttribute("disabled", "");

});
//create array of addresses

//event button to calculate addresses
cadr = document.querySelector(".cadr");
//event to calculate addresses
cadr.addEventListener('click', e => {
    tblhd = document.querySelector('.thd');

    newth = document.createElement("TH");
    tblhd.appendChild(newth);
    newth.innerText = "adress";
//handling addresses cases
    for (let i = 0; i < arr.length; i++) {
        newtd = document.createElement("TD");
        rws[i].appendChild(newtd);
        newtd.classList.add('p-1')
        if (i == 0) {
            adr.push(startadress);
            newtd.innerText = startadress.toString(16).padStart(4, "0");
        } else if (arr[i][1] == "WORD") {
            startadress += 3;
            adr.push(startadress);

        } else if (arr[i][1] == "RESW") {
            startadress += (3 * parseInt(arr[i][2]));
            adr.push(startadress);

        } else if (arr[i][1] == "BYTE" && arr[i][2][0] == 'X' && arr[i][2][1] == '`') {
            console.log(arr[i][2].length)
            startadress += (Math.floor((arr[i][2].length - 3) / 2));
            adr.push(startadress);

        } else if (arr[i][1] == "BYTE" && arr[i][2][0] == 'C' && arr[i][2][1] == '`') {
            startadress += arr[i][2].length - 4;
            adr.push(startadress);

        } else if (arr[i][1] == "BYTE" && (arr[i][2][0] != 'C' || arr[i][2][0] == 'X')) {
            startadress += 1;
            adr.push(startadress);

        } else if (arr[i][1] == "RESB") {
            startadress += (parseInt(arr[i][2]));
            adr.push(startadress);
        } else {
            startadress += 3;
            adr.push(startadress);


        }
        if (i != 0) {

            newtd.innerText = adr[i].toString(16).padStart(4, "0");

            newtd.classList.add('address')

        }
    }
//symbol table

    passone = document.querySelector('.passon');
    passone.innerHTML = '<h4>pass one</h4><table class="table-bordered"><thead><tr class=""><th class="p-1">Symbol</th><th class="p-1">Adress</th></tr></thead><tbody class="tbdysym"></tbody></table>';
    symbtbl = document.querySelector('.tbdysym');
    for (let a = 0; a < arr.length; a++) {
        if (arr[a][0] == "" || a == 0) {

        } else {
            symboltable[0].push(arr[a][0]);
            symboltable[1].push(adr[a - 1]);
            newrow = document.createElement("TR");
            symbtbl.appendChild(newrow);
            newrow.classList.add("rwsym");
            newtd = document.createElement("TD");
            newrow.appendChild(newtd);
            newtd.innerText = arr[a][0];
            newtd.classList.add('p-1');
            newtd.classList.add('sym');
            newtd = document.createElement("TD");
            newrow.appendChild(newtd);
            newtd.innerText = adr[a].toString(16).padStart(4, "0");
            newtd.classList.add('p-1');
            newtd.classList.add('adr');


        }
    }
    ob.removeAttribute("disabled");
    cadr.setAttribute("disabled", "");
    rd.setAttribute("disabled", "");
});

ob.addEventListener('click', e => {
    pastw.innerHTML += "<h4>pass two</h4>";
    let indx;
    let X;
    for (let i = 1; i < arr.length - 1; i++) {
        // console.log(arr[i][2].value === symboltable[0][i].value)
        if (arr[i][2].search(',X') == -1) {
            X = 0;
            index.push(X);

        } else if (arr[i][2].search(',X') != -1) {

            let nw = arr[i][2].trim().slice(0, -2);
            arr[i][2] = nw;

            X = 1;
            index.push(X);
        }
        symboltable[0].forEach((symbl, index) => {

            if (arr[i][2].trim() == symbl.trim()) {
                indx = index;
            }

        });
        if (arr[i][1] == "RESW" || arr[i][1] == "RESB") {
            obcode.push("no obcode")
        } else if (arr[i][1] == "WORD")
            //indexed
        {

            obcode.push(parseInt(arr[i][2]).toString(16))
        } else if (arr[i][1] == "BYTE" && arr[i][2][0] == 'X' && arr[i][2][1] == '`') {

            obcode.push((Math.floor((arr[i][2].length - 3) / 2)).toString(16));

        } else if (arr[i][1] == "BYTE" && arr[i][2][0] == 'C' && arr[i][2][1] == '`') {
            obcode.push((arr[i][2].length - 4).toString(16));


        } else if ((arr[i][1] == "BYTE" && arr[i][2][0] != 'C' && arr[i][2][1] != '`') || arr[i][1] == "BYTE" && arr[i][2][0] != 'X' && arr[i][2][1] != '`') {
            obcode.push(parseInt(arr[i][2]).toString(16))
        }
        let opdx;
        if (!(arr[i][1] != "WORD" && arr[i][1] != "BYTE" && arr[i][1] != "RESW" && arr[i][1] != "RESB")) {
            continue;
        }
        opcodetable.forEach((opcd, index) => {
            if (opcd.memonic == arr[i][1]) {
                opdx = index;
                obcode.push(opcodetable[opdx].opcode)
            }
        })
        adrsstr.push(symboltable[1][indx + 1].toString(16).padStart(4, "0"));
        pastw.innerHTML +=

            `<div class="pstwtbl">
<h5>${i} - ${arr[i][1]} - ${arr[i][2]}
</h5>
<table class="table-bordered">
    <thead>
    <tr class="">
        <th class="p-1">OP-Code</th>
        <th class="p-1">X</th>
        <th class="p-1 text-center">ADDRESS</th>
    </tr>
    </thead>
    <tbody class="tbdysymc">
    <tr>
        <td class="text-center opcdsp">${opcodetable[opdx].opcode}</td>
        <td class="text-center">${X}</td>
        <td class="adrsss text-center adrsps">${symboltable[1][indx + 1].toString(16).padStart(4, "0")}</td>
    </tr>
    </tbody>
</table>
</div>`;
    }

    let z;
    let a;
    for (let i = 0; i < obcode.length; i++) {
        z = "";

        for (let g = 0; g < obcode[i].length; g++) {
            if (obcode[i] == "no obcode") {
                z = "no opcode";
                break
            } else {

                z += parseInt(obcode[i][g], 16).toString(2).padStart(4, "0")
            }

        }

        obcdebin.push(z.padStart(8, "0").replace(/\d{4}(?=.)/g, '$& '));


    }
    for (let i = 0; i < adrsstr.length; i++) {
        a = ""
        for (let g = 0; g < adrsstr[i].length; g++) {

            if (g == 0) {
                a += (parseInt(adrsstr[i][g], 16).toString(2).padStart(3, "0") + " ")
            } else {
                a += (parseInt(adrsstr[i][g], 16).toString(2).padStart(4, "0") + " ")
            }
        }
        adrbin.push(a);
    }

    symbtblc = document.querySelectorAll('.tbdysymc');
    let i = 0;
    let v = 0;
    while (i < symbtblc.length) {
        if (obcdebin[v] == "no opcode") {
            v++
        } else {
            symbtblc[i].innerHTML += `<tr><td>${obcdebin[v]}</td><td class="text-right">${index[v]}</td><td>${adrbin[v]}
</td></tr><tr><td class="text-center">op hex</td><td COLSPAN="2" class="text-center">add hex</td></tr>`;
            v++;
            i++;
        }
    }


    ob.setAttribute("disabled", "");
    hte.removeAttribute("disabled");
    console.log(adrbin)
});

hte.addEventListener('click', e => {
    //every hex digit to binary binary

});
