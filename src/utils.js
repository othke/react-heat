import colorramp from './colorramp'

const screenMap = new Map()
const screenSize = { x: global.innerWidth, y: global.innerHeight }
let canvas
let ctx
// number of pixel (width and height) in the canvas
const step = 100
// interval for classification
let interval

const rainbow = () => {
    listeners()
    mountCanvas()
    drawCanvas()
}

const listeners = () => {
    // listeners resize
    const updateScreenSizeListener = global.addEventListener('resize', updateScreenSize)
    // listeners mouse move
    const recordMousePositionListener = global.addEventListener('mousemove', accumulatorDebounce(recordMousePosition, 500))
    const recordMouseClickListener = global.addEventListener('click', accumulatorDebounce(recordMousePosition, 100))
}

const updateScreenSize = e => {
    const { innerWidth, innerHeight } = e.target
    screenSize.x = innerWidth
    screenSize.y = innerHeight
}

const mountCanvas = () => {
    canvas = document.createElement('canvas')
    ctx = canvas.getContext('2d')
    canvas.id = 'rainbowCanvas'
    canvas.width = screenSize.x
    canvas.height = screenSize.y
    canvas.style.top = 0
    canvas.style.position = 'absolute'
    canvas.style.backgroundColor = '#ffffff47'
    document.body.appendChild(canvas)
}

/**
 * draw canvas
 */
const drawCanvas = () => {
    canvas.width = screenSize.x
    canvas.height = screenSize.y
    requestAnimationFrame(drawCanvas)
    ctx.clearRect(0, 0, screenSize.x, screenSize.y)
    const xStep = screenSize.x / 100
    const yStep = screenSize.y / 100
    for (let x = 0; x < 100; x++) {
        for (let y = 0; y < 100; y++) {
            const coordinate = `${x}@${y}`
            const value = screenMap.get(coordinate)
            if (!value) continue
            const valueInterval = Math.round(value / interval)
            ctx.fillStyle = `rgba(${colorramp[valueInterval]}, 0.2)`;
            ctx.fillRect(x * xStep, y * yStep, xStep, yStep)
        }
    }
}

/**
 * debounce function with an accumulator
 * the callback function will receive an array of accumalted events
 * @param {*} func 
 * @param {*} wait 
 * @param {*} immediate 
 */
function accumulatorDebounce(func, wait, immediate) {
    let timeout;
    let accumulator = []
    return function () {
        let context = this;
        accumulator.push(arguments)
        let later = function () {
            timeout = null;
            if (!immediate) {
                func.call(context, accumulator);
                accumulator = []
            }
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.call(context, accumulator);
            accumulator = []
        }
    };
};

/**
 * update the accumulate mouse position
 * @param {*} accumulator 
 */
const recordMousePosition = accumulator => {
    accumulator.forEach(args => {
        const event = args[0]
        const { clientX, clientY } = event
        const percentageX = Math.floor(clientX / screenSize.x * 100)
        const percentageY = Math.floor(clientY / screenSize.y * 100)
        const coordinate = `${percentageX}@${percentageY}`
        const currentValue = screenMap.get(coordinate) || 0
        screenMap.set(coordinate, currentValue + 1)
    })
    let min = Infinity
    let max = -Infinity
    screenMap.forEach((value, key) => {
        min = min > value ? value : min
        max = max < value ? value : max
    })
    const delta = max - min
    interval = delta / colorramp.length
}

export default rainbow