//create array of empty string to set it into string to not get NaN error
let arr = [""];
let startadress;
let rws;
let newtd;
let adr = [""];
let passone = document.querySelector('.passon');
let cadr = document.querySelector(".cadr");
let tblhd = document.querySelector('.thd');
let newth;
let tblcnt = document.querySelector('.assmb');
let tbl = document.querySelector('.tbdy');
let fl = document.querySelector('.form-control-file');
let sub = document.querySelector('.ss');
let newrow;
let symbtbl = document.querySelector('.tbdysym');
let ob = document.querySelector('.ob');
let pastw = document.querySelector('.passtw');
let symboltable = Array(Array(), Array());

//function to read assembly problem and turn it into 2d array
function readSingleFile(evt) {
    var f = evt.target.files[0];
    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            let contents = e.target.result;
            let ct = r.result;
            let lines = ct.split('\n');

            lines.forEach((line, index) => {
                arr[index] = line.split('\t');
            })
        }
        r.readAsText(f);

    } else {
        alert("Failed to load file");
    }
}

//read file from file uploader in html
fl.addEventListener('change', readSingleFile, false);


//create display the file after parse it into an array
//create header
fl.addEventListener('change', e => {
    tblcnt.innerHTML = '<table class="table-bordered asmtbl"><thead><tr class="thd"><th class="p-1">label</th><th class="p-1">mnemonic</th><th class="p-1">operand</th></tr></thead><tbody class="tbdy"></tbody></table>';

});
//event to handle new array of values

sub.addEventListener('submit', e => {
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
        }
    }
//declare first adress inside the event because javascript is async language (0x) for hex in js
    startadress = parseInt("0x" + arr[0][2]);
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
            newtd.innerText = startadress.toString(16).toString().padStart(4, "0");
        } else if (arr[i][1] == "WORD") {
            startadress += 3;
            adr.push(startadress);

        } else if (arr[i][1] == "RESW") {
            startadress += (3 * parseInt(arr[i][2]))
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

            newtd.innerText = adr[i].toString(16).toString().padStart(4, "0");
        }
    }
//symbol table

    passone = document.querySelector('.passon');
    passone.innerHTML = '<h1>pass one</h1><table class="table-bordered"><thead><tr class=""><th class="p-1">Symbol</th><th class="p-1">Adress</th></tr></thead><tbody class="tbdysym"></tbody></table>';
    symbtbl = document.querySelector('.tbdysym')
    for (let a = 0; a < arr.length; a++) {
        if (arr[a][0] == "" || a == 0) {

        } else {
            symboltable[0].push(arr[a][0]);
            symboltable[1].push(adr[a - 1].toString(16));
            newrow = document.createElement("TR");
            symbtbl.appendChild(newrow);
            newrow.classList.add("rwsym");
            newtd = document.createElement("TD");
            newrow.appendChild(newtd);
            newtd.innerText = arr[a][0];
            newtd.classList.add('p-1');
            newtd = document.createElement("TD");
            newrow.appendChild(newtd);
            newtd.innerText = adr[a].toString(16);
            newtd.classList.add('p-1');

        }
    }
    console.log(arr);
    console.log(symboltable);
});

ob.addEventListener('click', e => {
    let X;
    for (let i = 1; i < arr.length - 1; i++) {
        //indexed
        if (arr[i][2].search(',X') == -1) {
            X = 0;
        } else if (arr[i][2].search(',X') != -1) {
            X = 1;
        }
        //console.log(symboltable[0].);
        if (arr[i][1] != "WORD" && arr[i][1] != "BYTE" && arr[i][1] != "RESW" && arr[i][1] != "RESB") {


            //pick address from symbol table
            pastw.innerHTML += `<h1>${i} - ${arr[i][1]} - ${arr[i][2]} </h1><table class="table-bordered"><thead><tr class=""><th class="p-1">OP-Code</th><th class="p-1">X</th><th class="p-1">ADDRESS</th></tr></thead><tbody class="tbdysym"><tr><td></td><td>${X}</td><td>${adr[i - 1].toString(16).toString().padStart(4, "0")}</td></tr></tbody></table>`;
        }
    }


});