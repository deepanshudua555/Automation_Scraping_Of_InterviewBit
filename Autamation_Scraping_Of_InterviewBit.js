//Automation and Scrapping of interview bit
//making folders and pdfs of questions of specific companies
//npm init -y
//npm install minimist
//npm install axios
//npm install puppeteer
//npm install jsdom
//npm install pdf-lib
//npm install path


//node Autamation_Scraping_Of_InterviewBit.js --url="https://www.interviewbit.com"


let minimist = require("minimist");
let axios = require("axios");
let puppeteer = require("puppeteer");
let jsdom = require("jsdom");
let { PDFDocument, rgb } = require("pdf-lib");
let path = require("path");
let fs = require("fs");

let args = minimist(process.argv);
// console.log(args.url);
// console.log(args.config);

// let configJSON = fs.readFileSync(args.config, "utf-8");
// let configJSO = JSON.parse(configJSON);

// console.log(configJSO.userid);
// console.log(configJSO.password);
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
run();
async function run() {
    // start the browser
    let browser = await puppeteer.launch({
        defaultViewport: null,
        args: [
            "--start-maximized"
        ],
        headless: false
    });

    // get a tab
    let pages = await browser.pages();
    let page = pages[0];

    // go to url
    await page.goto(args.url);

    //click on sign in
    await page.waitForSelector("a[data-action='flow-trigger']");
    await page.click("a[data-action='flow-trigger']", { visible: true });


    // type mail-id ans email.id
    await page.waitForSelector("input[type='email']");
    await page.$$eval("[data-gtm-element='email']", (ele) => {
        let arr = document.querySelectorAll("[data-gtm-element='email']");
        arr[1].click();
        arr[1].value = "deepanshudua555@gmail.com";

    })
    await page.waitForSelector("input[type='password']");
    await page.$$eval("[data-gtm-element='password']", (ele) => {
        let arr = document.querySelectorAll("[data-gtm-element='password']");
        arr[1].click();
        arr[1].value = "InterviewBitDua@098";

    })

    //click continue
    await page.waitForSelector("button[class='form__action ibpp-button primary gtm-track-element']");
    await page.click("button[class='form__action ibpp-button primary gtm-track-element']", { visible: true });
    //click show all
    // let ctab = await browser.newPage();
    // await page.waitForSelector("a[href='/blog/technical-interview-questions/']");
    // await page.click("a[href='/blog/technical-interview-questions/']");    
    //click on company

    await page.waitForSelector(".view-more");
    let link = await page.$eval(".view-more", function (aTag) {
        let np = (aTag.getAttribute("href"));
        return np;

    });
    // console.log(link);


    // let npage = await browser.newPage();
    // await npage.goto(args.url+link);

    await page.goto(args.url + link);

    // await page.waitForSelector("button[filter-choosen='company']");
    // await page.click("button[filter-choosen='company']");


    await page.waitForSelector("a.no-hover-c");
    let comLinks = await page.$$eval("a.no-hover-c", function (atags) {
        let iLinks = [];
        for (let i = 0; i < atags.length; i++) {
            let url = atags[i].getAttribute("href");
            iLinks.push(url);
        }
        return iLinks;
    });
    // console.log(comLinks);

    /*  // await page.waitForSelector("a.no-hover-c>h3.h5");
    // let comName = await page.$$eval("a.no-hover-c>h3.h5", function (htags) {
        //     let hname = [];
        //     for (let i = 0; i < htags.length; i++) {
            //         // waitt();
            
            //         let url = htags[i].innerText("a.no-hover-c>h3.h5");
            //         hname.push(url);
            //     }
            //     return hname;
            // });   
            // console.log(comName);
            // console.log(hname);
            // console.log(comName.length);        */  /*WRONG CODE*/

    let patchedTexts = await page.evaluate(() => {
        let nodes = document.querySelectorAll('h3.h5');
        return [...nodes].map(e => e.textContent);
    });



    let comlinksJSON = JSON.stringify(comLinks);
    fs.writeFileSync("interview.json", comlinksJSON, "utf-8");

    let patchedTextsJSON = JSON.stringify(patchedTexts);
    fs.writeFileSync("company.json", patchedTextsJSON, "utf-8");

    // console.log(comLinks);
    // console.log(patchedTexts);
    // console.log(comLinks.length);
    // console.log(patchedTexts.length);




    let pdfDoc = await PDFDocument.load(fs.readFileSync("./template.pdf"));
    let pdfpages = pdfDoc.getPages();
    let pdfpage1 = pdfpages[0];
    ;
    let ycor = 741;
    for (let i = 0; i < 28; i++) {


        pdfpage1.drawText(comLinks[i], {
            x: 70,
            y: ycor,
            size: 9,
            color: rgb(0.030, 0.144, 0.255),
        })
        pdfpage1.drawText(i + 1 + patchedTexts[i], {
            x: 60,
            y: ycor + 12,
            size: 9,
            color: rgb(0, 0, 0),
        })
        ycor -= 27;
        //    if(fs.existsSync("./inter.pdf")){
        //        console.log(true);
        //    }

    }


    let pdfpage2 = pdfDoc.addPage();

    let ycord = 810;
    for (let i = 28; i < 58; i++) {


        pdfpage2.drawText(comLinks[i], {
            x: 70,
            y: ycord,
            size: 9,
            color: rgb(0.030, 0.144, 0.255),
        })
        pdfpage2.drawText(i + 1 + patchedTexts[i], {
            x: 60,
            y: ycord + 12,
            size: 9,
            color: rgb(0, 0, 0),
        })
        ycord -= 27;
        //    if(fs.existsSync("./inter.pdf")){
        //        console.log(true);
        //    }
    }

    let pdfpage3 = pdfDoc.addPage();

    let ycordd = 810;
    for (let i = 58; i < comLinks.length; i++) {


        pdfpage3.drawText(comLinks[i], {
            x: 70,
            y: ycordd,
            size: 9,
            color: rgb(0.030, 0.144, 0.255),
        })
        pdfpage3.drawText(i + 1 + patchedTexts[i], {
            x: 60,
            y: ycordd + 12,
            size: 9,
            color: rgb(0, 0, 0),
        })
        ycordd -= 27;
        //    if(fs.existsSync("./inter.pdf")){
        //        console.log(true);
        //    }
    }




    let bytes = await pdfDoc.save();
    fs.writeFileSync("./interview_questions.pdf", bytes, "utf-8");


    await page.waitFor(2000);
    await browser.close();
}