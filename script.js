// Função para adicionar ou editar um item
// Adicione essas variáveis com os detalhes da sua conta Cloudinary
const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dffdd61lf/upload';
const cloudinaryUploadPreset = 'ml_default'; // Você pode criar um upload preset nas configurações do Cloudinary

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

    let pictureLink = '';

    if (itemImage) {
        // Cria um FormData para enviar a imagem para o Cloudinary
        const formData = new FormData();
        formData.append('file', itemImage);
        formData.append('upload_preset', cloudinaryUploadPreset);

        try {
            const cloudinaryResponse = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData
            });

            if (cloudinaryResponse.ok) {
                const cloudinaryData = await cloudinaryResponse.json();
                pictureLink = cloudinaryData.secure_url; // URL segura da imagem enviada
            } else {
                throw new Error('Erro ao enviar a imagem para o Cloudinary');
            }
        } catch (error) {
            console.error('Erro ao enviar imagem:', error);
            alert('Não foi possível enviar a imagem. Tente novamente.');
            return;
        }
    }

    // Cria um objeto para o item
    const itemData = {
        title: itemTitle,
        pictureLink: pictureLink, // URL da imagem no Cloudinary
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

        if (editIndex !== null && editIndex !== '') {
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

        this.reset();
        window.location.href = 'itemList.html';

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
                image.src = item.pictureLink || ''; // Certifique-se de que a API retorna o URL da imagem corretamente
                image.alt = item.title;

                const title = document.createElement('h3');
                title.textContent = item.title;

                const description = document.createElement('p');
                description.textContent = `Local Encontrado: ${item.foundLocation}`;

                const location = document.createElement('p');
                location.textContent = `Local atual: ${item.currentLocation}`;

                const foundDate = document.createElement('p');
                foundDate.textContent = `Data que foi encontrado: ${formatDate(item.foundDate)}`;

                const foundBy = document.createElement('p');
                foundBy.textContent = `Encontrado por: ${item.whoFound}`;

                const returnedStatus = document.createElement('h5');
                returnedStatus.textContent = `Status: ${item.isRetrieved ? 'Devolvido' : 'Não devolvido'}`;

                const returnedDate = document.createElement('p');
                returnedDate.textContent = `Data de devolução: ${item.retrievedDate ? formatDate(item.retrievedDate) : 'N/A'}`;

                const returnedBy = document.createElement('p');
                returnedBy.textContent = `Devolvido por: ${item.whoRetrieved || 'N/A'}`;

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.onclick = () => {
                    localStorage.setItem('editIndex', item.id); // Armazena o ID do item a ser editado
                    window.location.href = 'itemRegister.html'; // Vai para a página de edição
                };

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.onclick = () => deleteItem(item.id);

                // Adiciona todos os elementos ao itemDiv
                itemDiv.appendChild(image);
                itemDiv.appendChild(title);
                itemDiv.appendChild(returnedStatus);
                itemDiv.appendChild(description);
                itemDiv.appendChild(location);
                itemDiv.appendChild(foundDate);
                itemDiv.appendChild(foundBy);
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
async function prefillEditForm() {
    const editIndex = localStorage.getItem('editIndex');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const viewItemsButton = document.getElementById('view-items-button');

    if (editIndex) {
        try {
            // Faz a requisição à API para obter o item específico
            const response = await fetch(`https://tw-lostandfound-api-392265918189.us-central1.run.app/api/v1/items/${editIndex}`);
            
            if (!response.ok) throw new Error('Erro ao buscar item da API');

            const item = await response.json();

            // Verifique se o item realmente existe
            if (item) {
                document.getElementById('item-title').value = item.title || '';
                document.getElementById('item-description').value = item.foundLocation || '';
                document.getElementById('item-location').value = item.currentLocation || '';
                document.getElementById('found-date').value = item.foundDate || '';
                document.getElementById('found-by').value = item.whoFound || '';
                document.getElementById('returned').value = item.isRetrieved ? 'Sim' : 'Não';
                document.getElementById('returned-date').value = item.retrievedDate || '';
                document.getElementById('returned-by').value = item.whoRetrieved || '';

                // Mostra os botões de salvar e cancelar, e oculta o de ver itens
                submitButton.textContent = 'Salvar Alterações';
                cancelEditButton.style.display = 'inline';
                viewItemsButton.style.display = 'none';
            } else {
                console.error('Item não encontrado no índice fornecido');
                resetForm();
            }
        } catch (error) {
            console.error('Erro ao buscar item:', error);
            alert('Erro ao buscar dados do item. Tente novamente.');
            resetForm();
        }
    } else {
        // Caso seja um novo item ou o índice não exista, limpa o formulário
        resetForm();
    }

    function resetForm() {
        document.getElementById('add-item-form').reset();
        localStorage.removeItem('editIndex');
        submitButton.textContent = 'Adicionar Item';
        cancelEditButton.style.display = 'none';
        viewItemsButton.style.display = 'inline';
    }
}

// Função para cancelar a edição
document.getElementById('cancel-edit-button').addEventListener('click', function() {
    localStorage.removeItem('editIndex'); // Remove o índice de edição
    window.location.href = 'itemList.html'; // Recarrega a página para voltar ao modo de adição
});

// Chama a função para preencher o formulário se a Página 1 estiver sendo carregada
window.onload = prefillEditForm;

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}