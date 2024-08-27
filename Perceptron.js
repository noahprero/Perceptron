class Perceptron {
    constructor(n) {
        // Create random weights
        this.weights = []
        for(let i = 0; i < n; i++) {
            this.weights.push(random(-1, 1));
        }

        this.bias = Math.round(random(-100, 100));
    }


    guess(inputs) {
        let sum = 0;
        for(let i = 0; i < this.weights.length; i++) {
            sum += inputs[i] * this.weights[i];
        }

        sum += this.bias;
 
        // Using sign activation function
        let output = Math.sign(sum);
        return output;
    }


    train(inputs, label, learning_rate) {
        let guess = this.guess(inputs);

        let error = label - guess;
        
        for(let i = 0; i < this.weights.length; i++) {
            this.weights[i] += error * inputs[i] * learning_rate;
        }

    this.bias += error / 100;
    }


    // Guesses the line from weights
    guessLine(x) {
        return (-(this.bias / this.weights[1]) - (this.weights[0] / this.weights[1] * x));
    }
}