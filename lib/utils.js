'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _colorramp = require('./colorramp');

var _colorramp2 = _interopRequireDefault(_colorramp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var screenMap = new Map();
var screenSize = { x: global.innerWidth, y: global.innerHeight };
var canvas = void 0;
var ctx = void 0;
// number of pixel (width and height) in the canvas
var step = 100;
// interval for classification
var interval = void 0;

var rainbow = function rainbow() {
    listeners();
    mountCanvas();
    drawCanvas();
};

var listeners = function listeners() {
    // listeners resize
    var updateScreenSizeListener = global.addEventListener('resize', updateScreenSize);
    // listeners mouse move
    var recordMousePositionListener = global.addEventListener('mousemove', accumulatorDebounce(recordMousePosition, 500));
    var recordMouseClickListener = global.addEventListener('click', accumulatorDebounce(recordMousePosition, 100));
};

var updateScreenSize = function updateScreenSize(e) {
    var _e$target = e.target,
        innerWidth = _e$target.innerWidth,
        innerHeight = _e$target.innerHeight;

    screenSize.x = innerWidth;
    screenSize.y = innerHeight;
};

var mountCanvas = function mountCanvas() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.id = 'rainbowCanvas';
    canvas.width = screenSize.x;
    canvas.height = screenSize.y;
    canvas.style.top = 0;
    canvas.style.position = 'absolute';
    canvas.style.backgroundColor = '#ffffff47';
    document.body.appendChild(canvas);
};

/**
 * draw canvas
 */
var drawCanvas = function drawCanvas() {
    canvas.width = screenSize.x;
    canvas.height = screenSize.y;
    requestAnimationFrame(drawCanvas);
    ctx.clearRect(0, 0, screenSize.x, screenSize.y);
    var xStep = screenSize.x / 100;
    var yStep = screenSize.y / 100;
    for (var x = 0; x < 100; x++) {
        for (var y = 0; y < 100; y++) {
            var coordinate = x + '@' + y;
            var value = screenMap.get(coordinate);
            if (!value) continue;
            var valueInterval = Math.round(value / interval);
            ctx.fillStyle = 'rgba(' + _colorramp2.default[valueInterval] + ', 0.2)';
            ctx.fillRect(x * xStep, y * yStep, xStep, yStep);
        }
    }
};

/**
 * debounce function with an accumulator
 * the callback function will receive an array of accumalted events
 * @param {*} func 
 * @param {*} wait 
 * @param {*} immediate 
 */
function accumulatorDebounce(func, wait, immediate) {
    var timeout = void 0;
    var accumulator = [];
    return function () {
        var context = this;
        accumulator.push(arguments);
        var later = function later() {
            timeout = null;
            if (!immediate) {
                func.call(context, accumulator);
                accumulator = [];
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.call(context, accumulator);
            accumulator = [];
        }
    };
};

/**
 * update the accumulate mouse position
 * @param {*} accumulator 
 */
var recordMousePosition = function recordMousePosition(accumulator) {
    accumulator.forEach(function (args) {
        var event = args[0];
        var clientX = event.clientX,
            clientY = event.clientY;

        var percentageX = Math.floor(clientX / screenSize.x * 100);
        var percentageY = Math.floor(clientY / screenSize.y * 100);
        var coordinate = percentageX + '@' + percentageY;
        var currentValue = screenMap.get(coordinate) || 0;
        screenMap.set(coordinate, currentValue + 1);
    });
    var min = Infinity;
    var max = -Infinity;
    screenMap.forEach(function (value, key) {
        min = min > value ? value : min;
        max = max < value ? value : max;
    });
    var delta = max - min;
    interval = delta / _colorramp2.default.length;
};

exports.default = rainbow;