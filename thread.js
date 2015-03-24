Thread = function (threadMethod, callback) {
    var methodStr = threadMethod.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, ''),
        args;

    this.paramsArray = methodStr.slice(methodStr.indexOf('(') + 1, methodStr.indexOf(')')).match(/([^\s,]+)/g);
    this.methodBody = methodStr.substring(methodStr.indexOf('{') + 1, methodStr.lastIndexOf('}'));
    this.onmessage = (typeof callback === 'undefined') ? function (message) { console.log(message.data);} : callback;
};

Thread.prototype = {
    start: function () {
        //Inject custom arguments field
        if (arguments !== undefined) {
            if (this.paramsArray.length >= 1) {
                this.methodBody = 'function work(' + this.paramsArray + ') {' + this.methodBody + '} onmessage = function (message) {postMessage(work.apply(this, message.data));};';
            }
        }
        var objURL = URL.createObjectURL(new Blob([this.methodBody], {
            type: 'text/javascript'
        }));

        this.worker = new Worker(objURL);
        
        this.worker.onmessage = this.onmessage;
    },
    call: function (data) {
        if (typeof this.worker === 'undefined') {
            this.start();
        }
        
        var args = [];
        for (var i = 0; i < arguments.length; i += 1) {
            args.push(arguments[i]);
        }
        
        this.worker.postMessage(args);
    },
    stop: function () {
        if (this.worker) {
            this.worker.terminate();
        }
    }
};
