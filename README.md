# paper-paypal-component
A Nodejs module implementation of Paypal API

Use this light SDK to access the simple payal APis to send payment.

The aim of this project is to help developpers to create __*single page application*__ selling website by providing a simple server side implementation of the paypal SDK and a lightweight client side library to work with it.

* index.js
* paypal-api.js

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

## Server side

Now you've installed the module, you need to update server.js file to add that module.

As we have done it for **Express** earlier, just require **`paper-paypal-component`**

```javascript
var paypal = require('paper-paypal-component');

// paper-paypal-component routes
paypal.init(app, __dirname);
```

We also need to define static routes to load resources like CSS or Javascript client side.

Here we create a route for **node_modules** to load the **paypal-api.js** file

```javascript

app.use("/node_modules", express.static(__dirname + '/node_modules'));

// ...
```

## Client side

To help you working with the server side module we've created a client side library, that already know all the route and argument to work with the Paypal APIs.

Include the library in you application and start using it like so :

```html
<!--
...
-->
        <script src='/node_modules/paper-paypal-component/dist/paypal/paypal-api.js'></script>
    </body>
</html>

```
    Note : To ensure the library is correctly leaded use the console : *console.log(PaypalApi);*

# III - Usage

First of all, we need to create a config file to store the paypal __*clientID*__, and the __*secret*__ key

```javascript
// config.json
{
	"clientID": "YOUR_CLENT_ID",
	"secret": "YOUR_SECRET_KEY"
}
```

    Note : The config.js must be at the same level that your server.js

To use the Paypal SDK, there is 3 main methods available

```javascript
/**
 *
 */
Paypal.getToken(callback);

/**
 *
 */
Paypal.sendPayment(paramsObject);

/**
 *
 */
Paypal.executePayment(acessToken, callback)
```

