Thread
========

Thread takes all of the ouch out of web workers. With Thread, you can create multithreaded applications by calling only two functions, and you don't need to have external scripts to do parallel processing. It's like [Multithread.js](http://keithwhor.github.io/multithread.js/]) except 1/6th as big with 1/6th of the features too xD

Installation
===========
Import the library using:
``` html
<script src="thread.js"></script>
```

or copy and paste the minified version (less than 1KB!):
``` javascript
Thread=function(c,b){var a=c.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,"");this.paramsArray=a.slice(a.indexOf("(")+1,a.indexOf(")")).match(/([^\s,]+)/g);this.methodBody=a.substring(a.indexOf("{")+1,a.lastIndexOf("}"));this.onmessage="undefined"===typeof b?function(a){console.log(a.data)}:b};
Thread.prototype={start:function(){void 0!==arguments&&1<=this.paramsArray.length&&(this.methodBody="function work("+this.paramsArray+") {"+this.methodBody+"} onmessage = function (message) {postMessage(work.apply(this, message.data));};");var c=URL.createObjectURL(new Blob([this.methodBody],{type:"text/javascript"}));this.worker=new Worker(c);this.worker.onmessage=this.onmessage},call:function(c){"undefined"===typeof this.worker&&this.start();for(var b=[],a=0;a<arguments.length;a+=1)b.push(arguments[a]);
this.worker.postMessage(b)},stop:function(){this.worker&&this.worker.terminate()}};
```


Usage
=====
``` javascript
var thread = new Thread(
    //fdefine an anonymous function with whatever variables you need
    function (a, b) {
        return a * b;   //whatever you return will be sent back to the main thread
    },
    function (message) {
    	//do whatever you want with the message that is returned
        console.log(message.data);
    });
//call the function you defined earlier
thread.call(6,7);
```
Example: http://keithwhor.github.io/multithread.js/
