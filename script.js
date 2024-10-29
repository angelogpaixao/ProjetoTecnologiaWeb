// Função para adicionar ou editar um item
document.getElementById('add-item-form')?.addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio do formulário

    const itemImage = document.getElementById('item-image').files[0];
    const itemTitle = document.getElementById('item-title').value;
    const itemDescription = document.getElementById('item-description').value;
    const itemLocation = document.getElementById('item-location').value;
    const itemFoundDate = document.getElementById('found-date').value;
    const itemFoundBy = document.getElementById('found-by').value;
    const itemReturned = document.getElementById('returned').value;
    const itemReturnedDate = document.getElementById('returned-date').value;
    const itemReturnedBy = document.getElementById('returned-by').value;


    // Cria um objeto para o item
    const itemData = {
        title: itemTitle,
        pictureLink: itemImage ? URL.createObjectURL(itemImage) : '',
        currentLocation: itemLocation,
        foundLocation: itemDescription,
        foundDate: itemFoundDate,
        whoFound: itemFoundBy,
        isRetrieved: itemReturned,
        whoRetrieved: itemReturnedBy,
        retrievedDate: itemReturnedDate
    };

    try {
        const editIndex = localStorage.getItem('editIndex');

        // Verifica se é uma edição ou um novo item
        if (editIndex !== null && editIndex !== '') {
            // Caso seja edição, envia uma requisição PUT para a API de edição
            const response = await fetch(`https://tw-lostandfound-api-392265918189.us-central1.run.app/api/v1/items/${editIndex}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemData)
            });
            if (response.ok) {
                alert('Item atualizado com sucesso!');
                localStorage.removeItem('editIndex');
            } else {
                throw new Error('Erro ao atualizar o item');
            }
        } else {
            // Caso seja um novo item, envia uma requisição POST para a API de criação
            const response = await fetch('https://tw-lostandfound-api-392265918189.us-central1.run.app/api/v1/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemData)
            });
            if (response.ok) {
                alert('Item adicionado com sucesso!');
            } else {
                throw new Error('Erro ao adicionar o item');
            }
        }

        // Limpa o formulário
        this.reset();

        // Redireciona para a página de listagem após adicionar/editar
        window.location.href = 'listagem.html';

    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao processar a solicitação.');
    }
});


// Função para exibir objetos cadastrados
document.addEventListener('DOMContentLoaded', async function() {
    const container = document.getElementById('items-list-container');

    try {
        // Realiza a requisição para a URL de listagem da API
        const response = await fetch('https://tw-lostandfound-api-392265918189.us-central1.run.app/api/v1/items');
        const items = await response.json();

        // Verifica se existem itens e os exibe
        if (items.length > 0) {
            items.forEach((item) => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');

                const image = document.createElement('img');
                image.src = item.imageUrl || ''; // Certifique-se de que a API retorna o URL da imagem corretamente
                image.alt = item.title;
                image.style.width = '100px';

                const title = document.createElement('h3');
                title.textContent = item.title;

                const description = document.createElement('p');
                description.textContent = `Descrição: ${item.foundLocation}`;

                const location = document.createElement('p');
                location.textContent = `Local atual: ${item.currentLocation}`;

                const foundDate = document.createElement('p');
                foundDate.textContent = `Data que foi encontrado: ${item.foundDate}`;

                const foundBy = document.createElement('p');
                foundBy.textContent = `Encontrado por: ${item.whoFound}`;

                const returnedStatus = document.createElement('p');
                returnedStatus.textContent = `Devolvido: ${item.isRetrieved ? 'Sim' : 'Não'}`;

                const returnedDate = document.createElement('p');
                returnedDate.textContent = `Data de devolução: ${item.retrievedDate || 'N/A'}`;

                const returnedBy = document.createElement('p');
                returnedBy.textContent = `Devolvido por: ${item.whoRetrieved || 'N/A'}`;

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.onclick = () => {
                    localStorage.setItem('editIndex', item.id); // Armazena o ID do item a ser editado
                    window.location.href = 'index.html'; // Vai para a página de edição
                };

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.onclick = () => deleteItem(item.id);

                // Adiciona todos os elementos ao itemDiv
                itemDiv.appendChild(image);
                itemDiv.appendChild(title);
                itemDiv.appendChild(description);
                itemDiv.appendChild(location);
                itemDiv.appendChild(foundDate);
                itemDiv.appendChild(foundBy);
                itemDiv.appendChild(returnedStatus);
                itemDiv.appendChild(returnedDate);
                itemDiv.appendChild(returnedBy);
                itemDiv.appendChild(editButton);
                itemDiv.appendChild(deleteButton);

                // Adiciona o itemDiv ao container
                container.appendChild(itemDiv);
            });
        } else {
            container.textContent = 'Nenhum objeto cadastrado.';
        }
    } catch (error) {
        console.error('Erro ao carregar itens:', error);
        container.textContent = 'Erro ao carregar itens.';
    }
});

// Função para excluir um item
async function deleteItem(id) {
    try {
        await fetch(`https://tw-lostandfound-api-392265918189.us-central1.run.app/api/v1/items/${id}`, {
            method: 'DELETE'
        });
        alert('Item excluído com sucesso!');
        location.reload(); // Recarrega a página para atualizar a lista
    } catch (error) {
        console.error('Erro ao excluir item:', error);
        alert('Erro ao excluir item.');
    }
}

// Função para preencher o formulário com os dados do item a ser editado
function prefillEditForm() {
    const editIndex = localStorage.getItem('editIndex');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const viewItemsButton = document.getElementById('view-items-button');

    if (editIndex !== null && editIndex !== '') {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        const item = items[editIndex];

        document.getElementById('item-title').value = item.title;
        document.getElementById('item-description').value = item.description;
        document.getElementById('item-location').value = item.location;

        // Mostra os botões de salvar e cancelar, e oculta o de ver itens
        submitButton.textContent = 'Salvar Alterações';
        cancelEditButton.style.display = 'inline'; // Mostra o botão de cancelar edição
        viewItemsButton.style.display = 'none'; // Esconde o botão de ver itens
    } else {
        // Caso seja um novo item, limpa o formulário
        document.getElementById('add-item-form').reset();
        localStorage.removeItem('editIndex'); // Remove o índice de edição ao voltar para cadastro

        // Mostra o botão de adicionar item e o botão de ver itens
        submitButton.textContent = 'Adicionar Item';
        cancelEditButton.style.display = 'none'; // Esconde o botão de cancelar
        viewItemsButton.style.display = 'inline'; // Mostra o botão de ver itens
    }
}

// Função para cancelar a edição
document.getElementById('cancel-edit-button').addEventListener('click', function() {
    localStorage.removeItem('editIndex'); // Remove o índice de edição
    window.location.href = 'index.html'; // Recarrega a página para voltar ao modo de adição
});

// Chama a função para preencher o formulário se a Página 1 estiver sendo carregada
window.onload = prefillEditForm;