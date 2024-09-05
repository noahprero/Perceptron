const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;
const epoch_count = document.getElementById('epoch-count');
const current_weights = document.getElementById('current-weights');
const control_radio = document.getElementById('draw-toggles');
const learning_rate_slider = document.getElementById('learning-rate');
const learning_rate_label = document.getElementById('learning-rate-label');
const LEFT_BOUND = -canvas.width / 2;
const RIGHT_BOUND = canvas.width / 2;
const TOP_BOUND = -canvas.height / 2;
const BOTTOM_BOUND = canvas.height / 2;

// Translate coordinate system to center the origin
ctx.translate(canvas.width / 2, canvas.height / 2);

// Learning rate listener
learning_rate_slider.addEventListener(('input'), function() {
    learning_rate = parseFloat(learning_rate_slider.value);
    learning_rate_label.innerHTML = "Learning rate: " + learning_rate;
});

// Draw toggle listener
let draw_mode = 'labels';
control_radio.addEventListener(('change'), function(event) {
    draw_mode = event.target.value;
    drawWeightedData();
    ctx.strokeStyle = "black";
    drawLine(LEFT_BOUND, f(LEFT_BOUND), RIGHT_BOUND, f(RIGHT_BOUND));
    ctx.strokeStyle = "green";
    drawLine(LEFT_BOUND, perceptron.guessLine(LEFT_BOUND), RIGHT_BOUND, perceptron.guessLine(RIGHT_BOUND));
});

// Train on keyboard press
let key_down = false;
document.addEventListener(('keydown'), function() {
    key_down = true;
});

document.addEventListener(('keyup'), function() {
    key_down = false;
});


function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
}


function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
} 


function generateRandomPoints(n) {
    let random_points = [];
    for(let i = 0; i < n; i ++) {
        let random_point = [
            Math.round(random(LEFT_BOUND, RIGHT_BOUND)),
            Math.round(random(TOP_BOUND, BOTTOM_BOUND))
        ];

        random_points.push(random_point);
    }

    return random_points;
}


// Generate correct labels for inputs
function generateLabels(inputs) {
    let labels = [];
    for(let point of inputs) {
        labels.push(labelPoint(point));
    }

    return labels;
}


// Classify points of data
function labelPoint(point) {
    let x = point[0];
    let y = point[1];

    // Check point position relative to line
    if(y > f(x)) {
        return 1;
    }
    return -1;
}


let coeff = random(-1, 1);
let constant = random(-100, 100);
// Function of classifying line
function f(x) {
    return coeff * x + constant;
}


// Show results given perceptron's current weights
function drawWeightedData() {
    ctx.clearRect(LEFT_BOUND, TOP_BOUND, RIGHT_BOUND * 2, BOTTOM_BOUND * 2);
    //ctx.globalAlpha = 0.4;
    for(let i = 0; i < inputs.length; i++) {
        let point = inputs[i];
        let x = point[0];
        let y = point[1];
        let output = perceptron.guess(point);
        if(draw_mode == 'labels') {
            ctx.fillStyle = output == 1 ? 'red' : 'blue';  // Draw according to guessed label
        }
        else {
            ctx.fillStyle = output == labels[i] ? 'green' : 'red';  // Draw according to correctness
        }
        
        drawCircle(x, y, point_size);
    }
    ctx.globalAlpha = 1;
}

// Train the perceptron
function update(epochs) {
    for(let e = 0; e < epochs; e++) {
        for(let i = 0; i < inputs.length; i++) {
            // Train through all the data
            point_index = i;
            perceptron.train(inputs[point_index], labels[point_index], learning_rate);
        }

        total_epoch_count++;
        epoch_count.innerHTML = "EPOCH: " + total_epoch_count;

        ctx.clearRect(LEFT_BOUND, TOP_BOUND, RIGHT_BOUND * 2, BOTTOM_BOUND * 2);
        drawWeightedData();
        drawLine(LEFT_BOUND, f(LEFT_BOUND), RIGHT_BOUND, f(RIGHT_BOUND));

        // Draw the approximated line from the perceptron
        ctx.strokeStyle = "green";
        drawLine(LEFT_BOUND, perceptron.guessLine(LEFT_BOUND), RIGHT_BOUND, perceptron.guessLine(RIGHT_BOUND));
        ctx.strokeStyle = "black";

        current_weights.innerHTML = "WEIGHTS: <br>" + perceptron.weights[0].toFixed(4) + ", <br>" + perceptron.weights[1].toFixed(4) + " <br><br> BIAS: <br>" + perceptron.bias.toFixed(4);
    }
    
}


let total_epoch_count = 0;

let learning_rate = parseFloat(learning_rate_slider.value);
learning_rate_label.innerHTML = "Learning rate: " + learning_rate;
let point_size = 2;

let perceptron = new Perceptron(2);
current_weights.innerHTML = "WEIGHTS: <br>" + perceptron.weights[0].toFixed(4) + ", <br>" + perceptron.weights[1].toFixed(4) + " <br><br> BIAS: <br>" + perceptron.bias.toFixed(4);

// Generate data points
let inputs = generateRandomPoints(10000);

// Generate correct data (points with correct labels)
let labels = generateLabels(inputs);

drawWeightedData();
ctx.lineWidth = 5;
drawLine(LEFT_BOUND, f(LEFT_BOUND), RIGHT_BOUND, f(RIGHT_BOUND));
ctx.strokeStyle = "green";
drawLine(LEFT_BOUND, perceptron.guessLine(LEFT_BOUND), RIGHT_BOUND, perceptron.guessLine(RIGHT_BOUND));

function animate() {
    if(key_down) {
        update(1);
    }

    requestAnimationFrame(animate);
}

animate();
