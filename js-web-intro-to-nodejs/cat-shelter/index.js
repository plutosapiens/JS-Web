const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const homeHtml = require("./views/home/index");
const siteCss = require("./content/styles/site");
const addBreedHtml = require("./views/addBreed");
const addCatHtml = require("./views/addCat")
const catTemplate = require("./views/kittyTemplate")
const port = 5555;

const cats = [
    {
        imageUrl: 'https://imgflip.com/s/meme/Cute-Cat.jpg',
        name: 'tsunami',
        breed: 'ulichna',
        description: 'very cute cat',
    },
    {
        imageUrl: 'https://uploads.dailydot.com/2018/10/olli-the-polite-cat.jpg?q=65&auto=format&w=2270&ar=2:1&fit=crop',
        name: 'pesho',
        breed: 'ulichna',
        description: 'very cute cat',
    },
    {
        imageUrl: 'https://ih1.redbubble.net/image.3800727516.4531/pp,840x830-pad,1000x1000,f8f8f8.jpg',
        name: 'dancho',
        breed: 'ulichna',
        description: 'very cute cat',
    },
    {
        imageUrl: 'https://static.wikia.nocookie.net/b2754c24-37a4-48ae-b9c1-aa857c4019a7/scale-to-width/370',
        name: 'marijka',
        breed: 'ulichna',
        description: 'very cute cat',
    },
]

const server = http.createServer((req, res) =>{
    const { url } = req;

    if(url === "/" && req.method === 'GET'){
        const imgUrlPattern = /{{imgUrl}}/g;
        const namePattern = /{{name}}/g;
        const breedPattern = /{{breed}}/g;
        const descriptionPattern = /{{desccription}}/g;
        const catHtml = cats.map(cat => catTemplate
            .replace(imgUrlPattern, cat.imageUrl)
            .replace(namePattern, cat.name)
            .replace(breedPattern, cat.breed)
            .replace(descriptionPattern, cat.description)
            ).join('');
        const homeHtmlTemplate = homeHtml.replace("{{cats}}", catHtml)

        res.writeHead(200,{
            "Content-Type": "text/html",
        });
        res.write(homeHtmlTemplate)
    }
    else if(url ==="/content/styles/site.css" && req.method === 'GET'){
        res.writeHead(200, {
            "Cintent-Type": "text/css"
        });
        res.write(siteCss)
    }
    else if(url ==="/cats/add-breed" && req.method === 'GET'){
        res.writeHead(200, {
            "Content-Type": "text/html"
        })
        res.write(addBreedHtml)
    }
    else if(url ==="/cats/add-breed" && req.method === 'POST'){
        console.log('Inside POST handler for /cats/add-breed');
        let formData = '';

        req.on('data', (data) => {
            formData += data;
        });
        
        req.on('end', () => {

            let body = qs.parse(formData);

            console.log('Parsed body:', body);

            fs.readFile('./data/breeds.json', 'utf-8', (err,data) => {
                if (err) {
                    console.error('Error reading breeds.json:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }

                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                let json = JSON.stringify(breeds.sort());

                fs.writeFile('./data/breeds.json', json, 'utf-8', (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing breeds.json:', writeErr);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    } else {
                        console.log('The breed was uploaded successfully! :)');
                        res.writeHead(301, {
                            'Location': '/'
                        });
            res.end();
                    }
                });
            });
        });
    }
    else if(url === "/cats/add-cat" && req.method === 'GET'){
        res.writeHead(200, {
            "Content-Type": "text/html"
        })
        res.write(addCatHtml)
    }
    res.end();
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
