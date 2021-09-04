
const http = require('http'); //1

const server = http.createServer((req, res) => { //2
    res.end();
});
server.listen(8000);

const options = {
    hostname: '127.0.0.1',
    port: 8000
};

const sendHttpRequest = () => {  //3
    const req = http.request(options, () => {
        console.log('Response received from the server');

        setImmediate(() => //4
            server.close(() => //5
                console.log('Closing the server')));
    });
    req.end();
};

setTimeout(() => sendHttpRequest(), 8000); //6


// 1. Loop begins
// 2. poll
// 3. poll
// 4. check
// 5. close callback
// 6. Iteration ends