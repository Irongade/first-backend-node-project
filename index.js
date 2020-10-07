const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify")

const replaceTemplate = require("./modules/replacedTemplates")

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8")
// console.log(textIn);

// const textOut = `this is what we know about the avocado: ${textIn}. \n created at ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut)


// fs.readFile("./txt/read-this.txt", "utf-8", (err, data) => {
//     console.log(data)
// } ) 

// console.log("File written");

//////////////////////////////
// SERVER

const tempOverview =  fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8")
const tempCard =  fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8")
const tempProduct =  fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8")

const data =  fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}))

const server = http.createServer( (req, res) => {

    const {query, pathname} = url.parse(req.url, true)

    // overview page
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead( 200, {"Content-type": "text/html"} )
        
        const cardsHtml = dataObj.map(el => {
           return replaceTemplate(tempCard, el)
        }).join("")
        const output = tempOverview.replace(/{PRODUCT_CARDS}/g, cardsHtml)
        res.end(output);

    } 
    // Product page
    else if ( pathname === "/product") {
        const product = dataObj[query.id]
        res.writeHead( 200, {"Content-type": "text/html"} )
        const output = replaceTemplate(tempProduct, product)

        res.end(output);
    }
    // API 
    else if (pathname === "/api") {
        res.writeHead(200, {
            "Content-type": "application/json"
        })
        res.end(data)
    } 
    // NOT FOUND
    else {
        res.writeHead(404, {
            "Content-type": "text/html",
            "my-own-header": "hello-world"
        })
        res.end("<h1>Page not found! </h1>");
    }
} );

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening to request on port 8000")
})



