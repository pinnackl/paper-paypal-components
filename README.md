# paper-paypal-component
A Nodejs module implementation of Paypal API

Use this light SDK to access the simple payal APis to send payment.

The aim of this project is to help developpers to create __*single page application*__ selling website by providing a simple server side implementation of the paypal SDK and a lightweight client side library to work with it.

Requirelent :
* Nodejs (lastest version)
* npm
* Bower

# I - Create your HTTP server using Nodejs

First you need to create a simple http server using nodejs and a node module called __*Express*__

    Note: You could use a HTTP server without Express but it make it easier to create route in your application

## a) Install module using npm

To install a node modules nodejs use npm a javascript dependency manager that list every modules available and their dependencies

(You can visit http://npmjs.com)

Use the command line to install your needed modules.

First run : **npm init** to create you project _**package.json**_ file, and follow the instructions.

```bash
$ npm init
```

Then use **npm install** to install packages

```bash
$ npm install --save express
```

    Note: The --save option will add the node module dependency to your package.json file

The modules will be installed in a **node_modules** folder
  
## b) create a simple server

To create a simple HTTP server create a *app* folder and in it create a _**server.js**_ file.

```javascript
/*  app/server.js */
/**
 * We require all the node modules needed
 * to create a simple HTTP server
 */

// The follow dependencies are required to create a simple HTTP server
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```

This simple server will serve your file over the **localhost** using the port **3000**

# II - Require paper-paypal-component node module

To use our Paypal mini SDK, you need to install our node module.

To do so, use npm to install the module

```bash
$ npm install --save paper-paypal-component
```

Now you've installed the module.