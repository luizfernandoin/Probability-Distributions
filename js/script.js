import {Binomial, Poisson, Uniforme, Geometrica} from "./math_VAD.mjs";

const btn = document.querySelector(".btn");
const distribuicao = document.getElementById('distribuicao');
const parametrosContainer = document.querySelector('.content-parametros');

const distribuicoes = {
  binomial: { parametros: ['n', 'k', 'p'] },
  uniforme: { parametros: ['n'] },
  geometrica: { parametros: ['p', 'k'] },
  poisson: { parametros: ['lambda', 'k'] },
};

function renderInputs() {
    const distribuicaoSelecionada = distribuicao.value;
    const parametros = distribuicoes[distribuicaoSelecionada].parametros;

    // Limpar os inputs existentes
    parametrosContainer.innerHTML = '';

    // Adicionar novos inputs com base na distribuição selecionada
    parametros.forEach(parametro => {
        const div = document.createElement('div');
        div.setAttribute('class', 'input');

        const inputField = document.createElement('input');
        inputField.setAttribute('class', 'input');
        inputField.setAttribute('type', 'number');
        inputField.setAttribute('id', parametro);
        inputField.setAttribute('placeholder', parametro);

        div.appendChild(inputField);
        parametrosContainer.appendChild(div);
    });
}

function gerarGrafico() {
    let qualDistribuicao;
    let p, k, n, lambda;
    let probabilidade;

    switch (distribuicao.value) {
        case "binomial":
            p = parseFloat(document.getElementById('p').value);
            k = parseInt(document.getElementById('k').value);
            n = parseInt(document.getElementById('n').value);

            if (n >= k) {
                qualDistribuicao = Binomial.fdp(n, k, p);
                probabilidade = [k, Binomial.binomial(n, k, p)];
            } else {
                Swal.fire({
                    title: "ERRO!",
                    text: "O número de sucessos não deve ser maior que o número de tentativas.",
                    icon: "error"
                });
            }
            break;
        case "uniforme":
            n = parseInt(document.getElementById('n').value);
            qualDistribuicao = Uniforme.fdp(n);
            probabilidade = [n, Uniforme.uniforme(n)];
            break;
        case "geometrica":
            p = parseFloat(document.getElementById('p').value);
            k = parseInt(document.getElementById('k').value);
            qualDistribuicao = Geometrica.fdp(p, k);
            probabilidade = [k, Geometrica.geometrica(p, k)];
            break;
        case "poisson":
            k = parseInt(document.getElementById('k').value);
            lambda = parseInt(document.getElementById('lambda').value);
            if (lambda > 0) {
                qualDistribuicao = Poisson.fdp(lambda, k);
                probabilidade = [k, Poisson.poisson(lambda, k)];
            } else {
                Swal.fire({
                    title: "ERRO!",
                    text: "Valor informado incorreto!",
                    icon: "error"
                });
            }
            break;
    }
    console.log(probabilidade)
    mostrarGrafico(distribuicao, qualDistribuicao[0], qualDistribuicao[1], probabilidade);
}


function mostrarGrafico(distribuicao, labels, probabilities, probabilidade) {
    const probabilidadeNumero = probabilidade[1];

    const chartData = {
        labels: labels,
        datasets: [{
          label: distribuicao.value,
          data: probabilities,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
    };
    
    const config = {
        type: 'bar',
        data: chartData,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `p(X = ${probabilidade[0]}) ~ ${probabilidadeNumero.toFixed(10)}`,
                    position: 'top',
                    align: 'center'
                }
            }
        }
    };
    
    Swal.fire({
        title: 'Gráfico',
        html: '<div id="chart-container" style="height: 400px;"></div>',
        didOpen: () => {
            const chartContainer = document.getElementById('chart-container');
            const chartCanvas = document.createElement('canvas');
            chartCanvas.id = 'myChartInSweetAlert';
            chartCanvas.style.height = '100%'; // Ocupar a altura total do contêiner
            chartContainer.appendChild(chartCanvas);

            const ctxInSweetAlert = chartCanvas.getContext('2d');
            new Chart(ctxInSweetAlert, config);
        },
        showConfirmButton: false,
        width: 900,
    });
}

btn.addEventListener('click', () => {
    gerarGrafico();
});

distribuicao.addEventListener('change', () => {
    renderInputs();
})