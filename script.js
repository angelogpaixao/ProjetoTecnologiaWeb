// Função para adicionar um novo item ao localStorage
document.getElementById('add-item-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Pega os valores do formulário
    const itemImage = document.getElementById('item-image').files[0]; // Arquivo de imagem
    const itemTitle = document.getElementById('item-title').value;
    const itemDescription = document.getElementById('item-description').value;
    const itemLocation = document.getElementById('item-location').value;

    // Verifica se o navegador suporta FileReader para salvar a imagem como base64
    if (itemImage && window.FileReader) {
        const reader = new FileReader();
        reader.onloadend = function () {
            // Cria um objeto com os dados do item
            const newItem = {
                image: reader.result, // Armazena a imagem em formato base64
                title: itemTitle,
                description: itemDescription,
                location: itemLocation
            };

            // Recupera os itens existentes do localStorage ou cria um array vazio
            let items = JSON.parse(localStorage.getItem('lostItems')) || [];
            // Adiciona o novo item ao array
            items.push(newItem);
            // Armazena o array atualizado no localStorage
            localStorage.setItem('lostItems', JSON.stringify(items));

            // Reseta o formulário
            document.getElementById('add-item-form').reset();
            alert('Objeto cadastrado com sucesso!');
        };
        reader.readAsDataURL(itemImage); // Lê a imagem como base64
    } else {
        alert('Por favor, insira uma imagem válida!');
    }
});

// Função para exibir os itens cadastrados na página de listagem
function displayItems() {
    const itemsContainer = document.getElementById('items-list-container');

    // Recupera os itens armazenados no localStorage
    const items = JSON.parse(localStorage.getItem('lostItems')) || [];

    // Limpa o contêiner
    itemsContainer.innerHTML = '';

    // Itera sobre os itens e cria os elementos HTML para cada um
    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        
        itemElement.innerHTML = `
            <img src="${item.image}" alt="Imagem do Objeto">
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <p><strong>Localização:</strong> ${item.location}</p>
        `;

        itemsContainer.appendChild(itemElement);
    });
}

// Chama a função displayItems na página de listagem
if (document.getElementById('items-list-container')) {
    displayItems();
}
