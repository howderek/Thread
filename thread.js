Thread = function (threadMethod, callback) {
    var methodStr = threadMethod.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, ''),
        args;

    this.paramsArray = methodStr.slice(methodStr.indexOf('(') + 1, methodStr.indexOf(')')).match(/([^\s,]+)/g);
    this.methodBody = methodStr.substring(methodStr.indexOf('{') + 1, methodStr.lastIndexOf('}'));
    this.onmessage = (typeof callback === 'undefined') ? function (message) {
        console.log(message.data);
    } : callback;
    this.DEBUG = false;
};

Thread.prototype = {
    log: function (message, level) {
        var level = level || 'debug';
        if (level === 'error') {
            console.error('Thread: ' + message);
        } else if (level === 'warn') {
            console.error('Thread: ' + message);
        } else if (this.DEBUG) {
            console.log('%c' + message, 'color: #6f3232');
        }
    },
    start: function () {
        //Inject custom arguments field
        if (arguments !== undefined) {
            if (this.paramsArray) {
                this.methodBody = 'function work(' + this.paramsArray.join(',') + ') {' + this.methodBody + '} onmessage = function (message) {postMessage(work.apply(this, message.data));};';
            } else {
                this.methodBody = 'function work() {' + this.methodBody + '} onmessage = function (message) {postMessage(work.apply(this, message.data));};';
            }
            this.log('Injected Web Worker created:\n' + this.methodBody)
        }
        var objURL = URL.createObjectURL(new Blob([this.methodBody], {
            type: 'text/javascript'
        }));

        this.worker = new Worker(objURL);

        this.worker.onmessage = this.onmessage;
    },
    call: function () {
        this.log('Web Worker called.');
        if (typeof this.worker === 'undefined') {
            this.log('Web Worker wasn\'t started yet, starting.');
            this.start();
        }

        if (arguments.length >= 1) {
            var args = [];
            for (var i = 0; i < arguments.length; i += 1) {
                args.push(arguments[i]);
            }
            this.log('Arguments appear to be present, sending...\nArguments:' + args.join(','));
            this.worker.postMessage(args);
        } else {
            this.worker.postMessage([true]);
        }

    },
    stop: function () {
        this.log('Web Worker cleanly terminated.');
        if (this.worker) {
            this.worker.terminate();
        }
    }
};
