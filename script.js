// Função para adicionar ou editar um item
document.getElementById('add-item-form')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    const itemImage = document.getElementById('item-image').files[0];
    const itemTitle = document.getElementById('item-title').value;
    const itemDescription = document.getElementById('item-description').value;
    const itemLocation = document.getElementById('item-location').value;

    // Cria um objeto para o item
    const item = {
        title: itemTitle,
        description: itemDescription,
        location: itemLocation,
        image: itemImage ? URL.createObjectURL(itemImage) : ''
    };

    // Verifica se é uma edição ou um novo item
    const editIndex = localStorage.getItem('editIndex');
    const items = JSON.parse(localStorage.getItem('items')) || [];

    if (editIndex !== null && editIndex !== '') {
        // Atualiza o item existente
        items[editIndex] = item;
        localStorage.removeItem('editIndex'); // Remove o índice de edição após a atualização
        alert('Item atualizado com sucesso!');
    } else {
        // Adiciona um novo item
        items.push(item);
        alert('Item adicionado com sucesso!');
    }

    // Salva os itens atualizados no LocalStorage
    localStorage.setItem('items', JSON.stringify(items));

    // Limpa o formulário
    this.reset();

    // Volta para a página de listagem após adicionar/editar
    window.location.href = 'listagem.html';
});

// Função para exibir objetos cadastrados na Página 2 (Listagem)
document.addEventListener('DOMContentLoaded', function() {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const container = document.getElementById('items-list-container');

    // Verifica se existem itens e os exibe
    if (items.length > 0) {
        items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            const image = document.createElement('img');
            image.src = item.image;
            image.alt = item.title;
            image.style.width = '100px'; // Ajusta a largura da imagem

            const title = document.createElement('h3');
            title.textContent = item.title;

            const description = document.createElement('p');
            description.textContent = item.description;

            const location = document.createElement('p');
            location.textContent = `Localização: ${item.location}`;

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => {
                localStorage.setItem('editIndex', index); // Armazena o índice do item a ser editado
                window.location.href = 'index.html'; // Vai para a página de edição
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => deleteItem(index);

            itemDiv.appendChild(image);
            itemDiv.appendChild(title);
            itemDiv.appendChild(description);
            itemDiv.appendChild(location);
            itemDiv.appendChild(editButton);
            itemDiv.appendChild(deleteButton);
            container.appendChild(itemDiv);
        });
    } else {
        container.textContent = 'Nenhum objeto cadastrado.';
    }
});

// Função para excluir um item
function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    items.splice(index, 1); // Remove o item do array
    localStorage.setItem('items', JSON.stringify(items)); // Atualiza o LocalStorage
    location.reload(); // Recarrega a página para atualizar a lista
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