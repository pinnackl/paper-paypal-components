# paper-paypal-component
A Nodejs module implementation of Paypal API

Use this light SDK to access the simple payal APis to send payment.

Requirelent :
* Nodejs (lastest version)
* npm
* Bower

# I - Create your HTTP server using Nodejs

First you need to create a simple http server using nodejs and a node module called __*Express*__

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
var express = require('express');
...
```

This simple server will serve your file over the **localhost** using the port **3000**

# II - Require paper-paypal-component node module

