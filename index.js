// File system module
const fs = require('fs');

// Routing module
const url = require('url');

// Webserver module
const http = require('http');


// Get data from file system
// ! __dirname actual folder absolute path (read synchronus mode)
const json =  fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

// Create webserver
// Request url ex.: http://127.0.0.1:1337/laptop?id=2
const server = http.createServer((req, res)  => {       
      
    // Get the pathname ex.: /laptop from the request
    const pathName = url.parse( req.url, true).pathname;   
    
    // Get the id from the request
	const id = url.parse( req.url, true).query.id; 
    

    // ROUTING LOGIC
    // Products overview
	if (pathName === '/products' || pathName === '/') { 

        // Build response
        res.writeHead(200, { 'Content-type': 'text/html'}); 
        
        // Get the product overview template from file system (read ASYNC mode)
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            
            // Get the product card template from file system (read ASYNC mode)
            fs.readFile(`${__dirname}/templates/template-cards.html`, 'utf-8', (err, data) => {
                
                // Create html template string with cards data
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                
                // Fill the product overview template
                overviewOutput = overviewOutput.replace('{%CARDSTEMPLATE%}', cardsOutput); 
                
                // Send response
                res.end(overviewOutput);
            });
        });
    
    // Laptop details     
	} else if(pathName === '/laptop' && id < laptopData.length) {

		// Build response
        res.writeHead(200, { 'Content-type': 'text/html'}); 
        
        // Get the product template from file system (read ASYNC mode)
        // Send response with template
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            
            // Send response
            res.end(output);
        });
        
    // Image request. If url pathName contains .jpg/.jpeg/.png./gif 
    } else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {  

        // Get the image from file system (read ASYNC mode)
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {

            // Set and send image type response
            res.writeHead(200, {'Content-type': 'image/jpg'});
            res.end(data);
        })
	} else {
		res.writeHead(404, { 'Content-type': 'text/html'}); 
		res.end('Url was not found!');
	}
});

// Create standard node port and ip for server (localhost 127.0.0.1:1337)
server.listen(1337, '127.0.0.1', () => {    
	console.log('Get request from the port, start triggering the server!');
});

function replaceTemplate (originalHtml, laptop) {

    // ! replace return with the new data, need regular exp.: /*/g for replace more then one case
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%ID%}/g, laptop.id);
    
    return output;
};