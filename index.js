var drawObj = {
    oCanvas: document.getElementsByTagName('canvas')[0],
    oColor: document.getElementsByClassName('color')[0],
    oClearAll: document.getElementsByClassName('clearAll')[0],
    oClear: document.getElementsByClassName('clear')[0],
    oRestore: document.getElementsByClassName('restore')[0],
    oRange: document.getElementsByClassName('range')[0],
    oLine: document.getElementsByClassName('line')[0],
    oRect: document.getElementsByClassName('rect')[0],
    oCircle: document.getElementsByClassName('circle')[0],
    ctx: document.getElementsByTagName('canvas')[0].getContext('2d'),
    dataArr: [],
    tempData: [],
    width: parseInt(document.getElementsByTagName('canvas')[0].width),
    height: parseInt(document.getElementsByTagName('canvas')[0].height),
    shape: 'line',
    position: {},
    ctxObj: {
        strokeStyle: 'black',
        lineWidth: 10
    },
    newMouseMove: null,
    init: function () {
        this.bindEvent();
        this.newMouseMove = this.throttle(this.mouseMove.bind(this), 40);
    },
    bindEvent: function () {
        self = this;
        self.myBind(self.oCanvas, 'mousedown', self.mouseDown.bind(self));
        self.myBind(self.oColor, 'change', self.colorChange);
        self.myBind(self.oRange, 'change', self.rangeChange);
        self.myBind(self.oClear, 'click', self.drawClear);
        self.myBind(self.oClearAll, 'click', self.clearAll);
        self.myBind(self.oRestore, 'click', self.restore);
        self.myBind(self.oLine, 'click', self.lineClick.bind(self));
        self.myBind(self.oRect, 'click', self.rectClick.bind(self));
        self.myBind(self.oCircle, 'click', self.circleClick.bind(self));

    },
    circleClick: function(e) {
        this.shape = 'circle';
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = this.ctxObj.strokeStyle;
        this.ctx.lineWidth = this.ctxObj.lineWidth;
    },
    rectClick: function (e) {
        this.shape = 'rect';
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = this.ctxObj.strokeStyle;
        this.ctx.lineWidth = this.ctxObj.lineWidth;
    },
    lineClick: function (e) {
        this.shape = 'line';
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = this.ctxObj.strokeStyle;
        this.ctx.lineWidth = this.ctxObj.lineWidth;
    },
    restore: function (e) {
        e = e || window.event;
        if (self.dataArr.length > 0) {
            self.ctx.putImageData(self.dataArr.pop(), 0, 0);
        }
    },
    clearAll: function (e) {
        e = e || window.event;
        self.ctx.clearRect(0, 0, self.oCanvas.width, self.oCanvas.height)
    },
    drawClear: function (e) {
        e = e || window.event;
        self.ctx.globalCompositeOperation = 'destination-out';
        self.ctx.strokeStyle = '#fff';

    },
    rangeChange: function (e) {
        e = e || window.event;
        self.ctxObj.lineWidth = self.ctx.lineWidth = e.srcElement.value / 4;
    },
    colorChange: function (e) {
        e = e || window.event;
        self.ctx.strokeStyle = e.srcElement.value;
        self.ctxObj.strokeStyle = e.srcElement.value;
        self.ctx.globalCompositeOperation = 'source-over';
    },
    mouseDown: function (e) {
        self = this;
        e = e || window.event;
        var data = self.ctx.getImageData(0, 0, self.width, self.height);
        self.tempData = data;
        self.dataArr.push(data);
        self.position.c_left = self.oCanvas.offsetLeft;
        self.position.c_top = self.oCanvas.offsetTop;
        self.position.c_x = e.offsetX;
        self.position.c_y = e.offsetY;
        self.ctx.lineCap = 'round';
        self.ctx.lineJoin = 'round';
        self.ctx.moveTo(self.position.c_x, self.position.c_y);
        self.myBind(document, 'mousemove', self.newMouseMove);
        self.myBind(document, 'mouseup', self.mouseUp.bind(self));

    },
    mouseMove: function (ev) {
        self = this;
        ev = ev || window.ev;
        var x = ev.clientX - self.position.c_left;
        var y = ev.clientY - self.position.c_top;
        // self.ctx.lineTo(x, y);
        // self.ctx.stroke();
        switch (self.shape) {
            case 'line':
                self.drawLine(x, y);
                break;
            case 'rect':
                // self.drawRect(x, y);
                break;
        }
    },
    drawRect: function (x, y) {
        x = x - this.position.c_x;
        y = y - this.position.c_y;
        this.ctx.rect(this.position.c_x, this.position.c_y, x, y);
        this.ctx.stroke();
    },
    drawCircle: function (x, y) {
        x = x - this.position.c_x;
        y = y - this.position.c_y;
        z_x = self.position.c_x + x/2;
        z_y = self.position.c_y + y/2;
        r = x > y ? x : y;

        this.ctx.arc(z_x, z_y , r, 0, Math.PI*2, 0);
        this.ctx.stroke();
    },
    drawLine: function (x, y) {
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    },
    mouseUp: function (ev) {
        self = this;
        ev = ev || window.ev;
        self.ctx.beginPath();
        var x = ev.clientX - self.position.c_left;
        var y = ev.clientY - self.position.c_top;
        if (self.shape == 'rect') {
            self.drawRect(x, y);
        }else if(self.shape == 'circle'){
            self.drawCircle(x, y);
        }
        self.myRemoveEvent(document, 'mousemove', self.newMouseMove);
    },
    throttle: function (handle, wait) {
        var lastTime = 0;
        return function (e) {
            var newTime = Date.now();
            if (newTime - lastTime > 18) {
                handle.apply(this, arguments);
                lastTime = newTime;
            }
        }
    },
    myBind: function (oDom, type, handle) {
        if (document.addEventListener) {
            oDom.addEventListener(type, handle, false)
        } else {
            oDom.attachEvent('on' + type, handle);
        }
    },
    myRemoveEvent: function (oDom, type, handle) {
        if (document.addEventListener) {
            oDom.removeEventListener(type, handle, false)
        } else {
            oDom.detachEvent('on' + type, handle);
        }
    }
}
drawObj.init();