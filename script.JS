const form =
document.getElementById("pedidoForm");

const mensagem =
document.getElementById("mensagem");

const listaPedidos =
document.getElementById("listaPedidos");

const totalCamisas =
document.getElementById("totalCamisas");

const valorTotal =
document.getElementById("valorTotal");

const tamanhos = [

    "ppf","pf","mf","gf","ggf",
    "ppm","pm","mm","gm","ggm"

];

// CALCULAR TOTAL
tamanhos.forEach(id => {

    document
    .getElementById(id)
    .addEventListener("input", calcularTotal);

});

function calcularTotal(){

    let total = 0;

    tamanhos.forEach(id => {

        total += Number(
            document.getElementById(id).value
        );

    });

    totalCamisas.innerHTML = total;

    valorTotal.innerHTML =
    "R$ " + (total * 39).toFixed(2);

}

// PEDIDOS LOCAL
let pedidos = [];

// ENVIAR FORM
form.addEventListener("submit", async function(e){

    e.preventDefault();

    // CAMPOS
    const nome =
    document.getElementById("nome").value.trim();

    const campo =
    document.getElementById("campo").value.trim();

    const supervisao =
    document.getElementById("supervisao").value.trim();

    const whatsapp =
    document.getElementById("whatsapp").value.trim();

    const confirmacao =
    document.getElementById("confirmacao").value;

    const retirada =
    document.getElementById("retirada").value.trim();

    // VALIDAR
    if(

        nome === "" ||
        campo === "" ||
        supervisao === "" ||
        whatsapp === "" ||
        confirmacao === "" ||
        retirada === ""

    ){

        mensagem.innerHTML =
        "⚠ Preencha todos os campos.";

        mensagem.style.color =
        "red";

        return;

    }

    // TOTAL
    let total = 0;

    tamanhos.forEach(id => {

        total += Number(
            document.getElementById(id).value
        );

    });

    if(total <= 0){

        mensagem.innerHTML =
        "⚠ Informe pelo menos 1 camisa.";

        mensagem.style.color =
        "red";

        return;

    }

    // DADOS
    const dados = {

        nome,
        campo,
        supervisao,
        whatsapp,
        confirmacao,
        retirada,

        totalCamisas: total,

        valorTotal: total * 39

    };

    mensagem.innerHTML =
    "Enviando pedido...";

    mensagem.style.color =
    "#07301C";

    try{

        // ENVIO GOOGLE SHEETS
        await fetch(

            "https://script.google.com/macros/s/AKfycbx_JOv9jM1g8fV_u6TxeFwPStdLG6DSSa3AxA8kfhAkZT_hmjGdb1jCu7r1T4Dpa5SllQ/exec",

            {

                method: "POST",

                mode: "no-cors",

                headers: {

                    "Content-Type":
                    "application/json"

                },

                body: JSON.stringify(dados)

            }

        );

        // ADICIONAR NA TELA
        pedidos.push(dados);

        atualizarTabela();

        mensagem.innerHTML =
        "✅ Pedido enviado com sucesso.";

        mensagem.style.color =
        "green";

        form.reset();

        calcularTotal();

    }catch(error){

        console.log(error);

        mensagem.innerHTML =
        "❌ Erro ao enviar pedido.";

        mensagem.style.color =
        "red";

    }

});

// TABELA
function atualizarTabela(){

    listaPedidos.innerHTML = "";

    pedidos.forEach((pedido)=>{

        listaPedidos.innerHTML += `

            <tr>

                <td>
                    ${pedido.nome}
                </td>

                <td>
                    ${pedido.campo}
                </td>

                <td>
                    ${pedido.supervisao}
                </td>

                <td>
                    ${pedido.whatsapp}
                </td>

                <td>
                    ${pedido.totalCamisas}
                </td>

                <td>
                    R$ ${pedido.valorTotal.toFixed(2)}
                </td>

                <td>
                    ${pedido.confirmacao}
                </td>

            </tr>

        `;

    });

}