// Lista para armazenar os objetos cadastrados (simulação de memória temporária)
let objetosPerdidos = [];

// Função para cadastrar um novo objeto
document.getElementById("add-item-form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Captura os valores do formulário
    const imagem = document.getElementById("item-image").files[0];
    const nome = document.getElementById("item-title").value;
    const descricao = document.getElementById("item-description").value;
    const localizacao = document.getElementById("item-location").value;

    if (!imagem || !nome || !descricao || !localizacao) {
        alert("Preencha todos os campos!");
        return;
    }

    // Cria um objeto com os dados
    const objeto = {
        id: new Date().getTime(),
        nome: nome,
        descricao: descricao,
        localizacao: localizacao,
        imagemUrl: URL.createObjectURL(imagem),
    };

    // Adiciona o objeto à lista de objetos
    objetosPerdidos.push(objeto);

    // Armazena no localStorage para a página de listagem
    localStorage.setItem("objetosPerdidos", JSON.stringify(objetosPerdidos));

    // Limpa o formulário após o cadastro
    document.getElementById("add-item-form").reset();

    alert("Objeto cadastrado com sucesso!");
});

// Função para carregar os objetos cadastrados na página de listagem
function carregarObjetosCadastrados() {
    // Verifica se há objetos no localStorage
    const objetosSalvos = JSON.parse(localStorage.getItem("objetosPerdidos")) || [];
    objetosPerdidos = objetosSalvos;

    const container = document.getElementById("items-list-container");
    container.innerHTML = "";

    objetosPerdidos.forEach((objeto) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        const img = document.createElement("img");
        img.src = objeto.imagemUrl;
        img.alt = objeto.nome;

        const h2 = document.createElement("h2");
        h2.textContent = objeto.nome;

        const pDesc = document.createElement("p");
        pDesc.textContent = objeto.descricao;

        const pLocal = document.createElement("p");
        pLocal.textContent = `Localização: ${objeto.localizacao}`;

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.addEventListener("click", () => excluirObjeto(objeto.id));

        itemDiv.appendChild(img);
        itemDiv.appendChild(h2);
        itemDiv.appendChild(pDesc);
        itemDiv.appendChild(pLocal);
        itemDiv.appendChild(btnExcluir);

        container.appendChild(itemDiv);
    });
}

// Função para excluir um objeto
function excluirObjeto(id) {
    objetosPerdidos = objetosPerdidos.filter((objeto) => objeto.id !== id);
    localStorage.setItem("objetosPerdidos", JSON.stringify(objetosPerdidos));
    carregarObjetosCadastrados();
}

// Chama a função para carregar os objetos na página de listagem
if (document.getElementById("items-list-container")) {
    carregarObjetosCadastrados();
}
