function fatorial(num) {
    if (num < 0) 
        return -1;
    else if (num == 0) 
        return 1;
    else {
        return (num * fatorial(num - 1));
    }
}

function fdpAcumulada(fdp) {
    const acumulada = [];
    let soma = 0;

    for (const probabilidade of fdp) {
        soma += probabilidade;
        acumulada.push(soma);
    }

    return acumulada;
}

const Binomial = {
    binomial(n, k, p) {
        const q = 1 - p;
        const combinacao = fatorial(n) / [fatorial(k) * fatorial(n - k)]
        const pX = combinacao * Math.pow(p, k) * Math.pow(q, n-k);
        return pX;
    },

    fdp(n, k, p) {
        const labels = [];
        const probabilities = [];

        for (let x = 0; this.binomial(n, x, p) > 9e-4 || x <= k; x++) {
            probabilities.push(this.binomial(n, x, p));
            labels.push(x)
        }
        
        return [labels, probabilities];
    },

    binomialAcumulada() {

    },

    E() {
      return n * p;  
    },

    V() {
        return n * p * (1 - p);
    }
}

const Poisson = {
    poisson(lambda, k) {
        const poisson = [Math.pow(lambda, k) * Math.exp(-lambda)] / fatorial(k)
        return poisson;
    },

    fdp(lambda, k) {
        const labels = [];
        const probabilities = [];

        for (let x = 0; this.poisson(lambda, x) > 9e-4 || x <= k; x++) {
            probabilities.push(this.poisson(lambda, x));
            labels.push(x)
        }
        
        return [labels, probabilities];
    },

    poissonAcumulada() {

    },

    E() {
        return lambda;
    },

    V() {
        return lambda;
    }
}

const Uniforme = {
    uniforme(n) {
        return 1 / n; 
    },

    fdp(n) {
        const labels = Array.from({ length:n }, (_, i) => i + 1);
        const probabilities = labels.map(value => this.uniforme(n));
        return [labels, probabilities];
    },

    uniformeAcumulada() {

    },

    E(n) {
        const X = Array.from({length: n+1}, (_, i) => i);
        return X.reduce((acc, valor) => acc + valor, 0) / X.length;
    },
}

const Geometrica = {
    geometrica(p, k) {
        return (k > 0) ? p * Math.pow((1 - p), (k - 1)) : 0;
    },

    fdp(p, k) {
        const labels = [];
        const probabilities = [];//1e-4 = 0,0000000001

        for (let x = 1; this.geometrica(p, x) > 9e-4; x++) {
            probabilities.push(this.geometrica(p, x));
            labels.push(x)
        }
        
        return [labels, probabilities];
    },

    geometricaAcumulada() {

    },

    E() {
        return 1 / p;
    },

    V() {
        return (1 - p) / Math.pow(p, 2);
    }
}

export {Binomial, Poisson, Uniforme, Geometrica, fdpAcumulada};