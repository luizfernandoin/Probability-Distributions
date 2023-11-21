import {Binomial, Poisson, Uniforme, Geometrica, fdpAcumulada} from "./math_VAD.mjs";

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

    parametrosContainer.innerHTML = '';

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

function gerarGrafico(event) {
    event.preventDefault();
    const acumulada = document.getElementById('acumulada').checked;

    let qualDistribuicao;
    let probabilidade;
    let probAcumuladas;
    let erro = false;

    switch (distribuicao.value) {
        case "binomial":
            let p = parseFloat(document.getElementById('p').value);
            let k = parseInt(document.getElementById('k').value);
            let n = parseInt(document.getElementById('n').value);

            erro = isNaN(p) || isNaN(k) || isNaN(n) || n < k;

            if (!erro) {
                qualDistribuicao = Binomial.fdp(n, k, p);
                probabilidade = [k, Binomial.binomial(n, k, p)];
            } else {
                exibirErro("O número de sucessos não deve ser maior que o número de tentativas.");
            }
            break;
        case "uniforme":
            let n_uniforme = parseInt(document.getElementById('n').value);

            erro = isNaN(n_uniforme);

            if (!erro) {
                qualDistribuicao = Uniforme.fdp(n_uniforme);
                probabilidade = [n_uniforme, Uniforme.uniforme(n_uniforme)];
            }
            break;
        case "geometrica":
            let p_geometrica = parseFloat(document.getElementById('p').value);
            let k_geometrica = parseInt(document.getElementById('k').value);

            erro = isNaN(p_geometrica) || isNaN(k_geometrica);

            if (!erro) {
                qualDistribuicao = Geometrica.fdp(p_geometrica, k_geometrica);
                probabilidade = [k_geometrica, Geometrica.geometrica(p_geometrica, k_geometrica)];
            }
            break;
        case "poisson":
            let k_poisson = parseInt(document.getElementById('k').value);
            let lambda_poisson = parseInt(document.getElementById('lambda').value);

            erro = isNaN(k_poisson) || isNaN(lambda_poisson) || lambda_poisson <= 0;

            if (!erro) {
                qualDistribuicao = Poisson.fdp(lambda_poisson, k_poisson);
                probabilidade = [k_poisson, Poisson.poisson(lambda_poisson, k_poisson)];
            } else {
                exibirErro("Valor informado incorreto!");
            }
            break;
    }

    if (erro) {
        exibirErro("Informe todos os campos!");
    } else {
        if (acumulada && !erro) {
            probAcumuladas = fdpAcumulada(qualDistribuicao[1]);
        }
        mostrarGrafico(distribuicao, qualDistribuicao[0], qualDistribuicao[1], probabilidade, probAcumuladas);
    }
}

function exibirErro(mensagem) {
    Swal.fire({
        title: "ERRO!",
        text: mensagem,
        icon: "error"
    });
}



function mostrarGrafico(distribuicao, labels, probabilities, probabilidade, acumulada) {
    const probabilidadeNumero = probabilidade[1];

    let textoTitulo;
    if (acumulada) {
        let probAproximada;

        if (probabilidade[0] < acumulada.length) {
            if (distribuicao.value == "geometrica"){
                probAproximada = acumulada[probabilidade[0] - 1];
            } else {
                probAproximada = acumulada[probabilidade[0]];
            }
        } else {
            probAproximada = acumulada[acumulada.length - 1];
        }
        textoTitulo = `P(X <= ${probabilidade[0]}) ~ ${probAproximada.toFixed(10)}`;
        probabilities = acumulada;
    } else {
        textoTitulo = `p(X = ${probabilidade[0]}) ~ ${probabilidadeNumero.toFixed(10)}`;
    }

    const chartData = {
        labels: labels,
        datasets: [{
          label: distribuicao.value,
          data: probabilities,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          stepped: 'before'
        }]
    };
    
    const config = {
        type: acumulada ? 'line' : 'bar',
        data: chartData,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: textoTitulo,
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
            chartCanvas.style.height = '100%';
            chartContainer.appendChild(chartCanvas);

            const ctxInSweetAlert = chartCanvas.getContext('2d');
            new Chart(ctxInSweetAlert, config);
        },
        showConfirmButton: false,
        width: 900,
    });
}

btn.addEventListener('click', gerarGrafico);
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") gerarGrafico(event);
});

distribuicao.addEventListener('change', () => {
    renderInputs();
})