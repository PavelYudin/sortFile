const fs = require('fs');
const existFile = process.argv[2];
const fileResult = "result.txt";
let fileExtens = "";

if(existFile.indexOf(".")) {
    fileExtens = existFile.match(/\.\w+/)[0];
}

const readableStream = fs.createReadStream(existFile, "utf8");
const arrFileName = [1];



readableStream.on("data", function(chunk){
  
    fs.appendFileSync(`${arrFileName[arrFileName.length - 1]}${fileExtens}`, chunk);
    
    const size = fs.statSync(`${arrFileName[arrFileName.length - 1]}${fileExtens}`).size /// (1024 * 1024);
    
    if(size > 70000) {
        let arrDatas =  fs.readFileSync(`${arrFileName[arrFileName.length - 1]}${fileExtens}`, "utf8");

        if(arrDatas[0] === "\n") {
            arrDatas = arrDatas.slice(1);
        }

        let arrData = arrDatas.split("\n");
        const arrDataSort = arrData.sort();
        fs.writeFileSync(`${arrFileName[arrFileName.length - 1]}${fileExtens}`, arrDataSort.join("\n"));
        arrFileName.push(arrFileName[arrFileName.length - 1] + 1);
    }

});

readableStream.on("end", () => {
    let arrDatas =  fs.readFileSync(`${arrFileName[arrFileName.length - 1]}${fileExtens}`, "utf8");

    if(arrDatas[0] === "\n") {
        arrDatas = arrDatas.slice(1);
    }

    let arrData = arrDatas.split("\n");
    const arrDataSort = arrData.sort();
    fs.writeFileSync(`${arrFileName[arrFileName.length - 1]}${fileExtens}`, arrDataSort.join("\n"));
  
    let map = new Map();
    
    while(arrFileName.length) {

        for(let i = 0; i < arrFileName.length; i++) {
            const fileName = arrFileName[i];
            
            if(map.get(fileName) !== undefined) continue;

            let dataFile =  fs.readFileSync(`${fileName}${fileExtens}`, "utf8");

            const arrData = dataFile.split("\r");
            
            let copLine = arrData.shift();
            
            copLine = copLine.replace("\n", "");

            map.set(fileName, copLine);
            
            if(arrData.length) {
                let dataInFile = arrData.join("\r");
                fs.writeFileSync(`${fileName}${fileExtens}`, dataInFile);
                
            } else {
                fs.unlinkSync(`${fileName}${fileExtens}`);
                const indexFile = arrFileName.indexOf(fileName);
                arrFileName.splice(indexFile, 1);
            }
        }
        
            let buf = '';
            let index = 0;

            for(let m of map) {
                if(buf === '') {
                    buf = m[1];
                    index = m[0];
                } else {
                    if(buf >= m[1]) {
                        buf = m[1];
                        index = m[0];
                    }
                }

            }

            const addedLine = map.get(index);           
            map.delete(index);
       
            fs.writeFileSync(fileResult, addedLine + "\n", {flag: "a"});   
    }
});


