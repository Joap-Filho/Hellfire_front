function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Verifica se o campo de usuário e senha estão vazios
    if (!username || !password) {
        Swal.fire('Erro', 'Por favor, insira usuário e senha.', 'error');
        return;
    }

    authHeader = 'Basic ' + btoa(username + ':' + password);
    localStorage.setItem('auth', authHeader);

    // Exibe a mensagem de "Aguardando a resposta da API"
    showLoading(true, "Aguardando a resposta da API...");

    // Endpoint correto para a API de estoque
    fetch('https://hellfire-ys4u.onrender.com/api/estoque/', {
        method: 'GET',  // Supondo que o método GET é utilizado para consultar o estoque
        headers: {
            'Authorization': authHeader,  // Usando o header de autenticação
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorHtml => {
                // Se a resposta não for JSON, mostramos o erro HTML no console
                console.error('Erro recebido:', errorHtml);
                Swal.fire('Erro', 'Usuário ou senha incorretos. Tente novamente.', 'error');
                throw new Error('Usuário ou senha incorretos');
            });
        }
        // Tenta parsear como JSON se a resposta for válida
        return response.json();
    })
    .then(data => {
        // Esconde a mensagem de carregamento antes de exibir o SweetAlert de sucesso
        showLoading(false);

        // Sucesso no login
        Swal.fire('Login bem-sucedido!', 'Você foi redirecionado para o estoque.', 'success').then(() => {
            window.location.href = 'estoque.html';
        });
    })
    .catch(error => {
        // Esconde a mensagem de carregamento em caso de erro
        showLoading(false);

        // Caso algum outro erro ocorra
        console.error(error);
        Swal.fire('Erro ao autenticar', error.message, 'error');
    });
}





function logout() {
    localStorage.removeItem('auth');
    window.location.href = 'login.html';
}

window.onload = function() {
    authHeader = localStorage.getItem('auth');

    if (!authHeader && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    if (authHeader && window.location.pathname.includes('login.html')) {
        window.location.href = 'estoque.html';
        return;
    }

    if (window.location.pathname.includes('estoque.html')) {
        loadItems();
    } else if (window.location.pathname.includes('editar.html')) {
        loadEditForm();
    }
};

function showLoading(show, message = "Aguardando a resposta da API...") {
    const loadingDiv = document.getElementById('loading');
    const dashboard = document.getElementById('dashboard');

    if (!loadingDiv) return; // Evita erro se o elemento não existir

    if (show) {
        if (loadingDiv.style.display === "flex") return; // Evita chamar mais de uma vez
        loadingDiv.innerText = message;
        loadingDiv.style.display = "flex";
        if (dashboard) dashboard.style.opacity = "0.5"; // Escurece a tela
    } else {
        loadingDiv.style.display = "none";
        if (dashboard) dashboard.style.opacity = "1"; // Volta ao normal
    }
}


function loadItems() {
    if (document.getElementById('loading').style.display !== "flex") {
        showLoading(true, "Aguardando a resposta da API...");
    }

    fetch('https://hellfire-ys4u.onrender.com/api/estoque/', {
        headers: { 'Authorization': authHeader }
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector('#itemsTable tbody');
        tbody.innerHTML = ''; // Limpa a tabela antes de inserir os itens
        data.forEach(item => {
            const row = document.createElement("tr");
            row.id = `item-${item.id}`;  // Atribui um ID único à linha
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.categoria}</td>
                <td>${item.nome_item}</td>
                <td>${item.municao || '-'}</td>
                <td>${item.quantidade_atual}</td>
                <td>${item.quantidade_minima}</td>
                <td>${item.quantidade_maxima}</td>
                <td>${new Date(item.data_atualizacao).toLocaleString()}</td>
                <td>${item.observacoes || '-'}</td>
                <td>
                    <a href="editar.html?id=${item.id}"><button class="edit-btn">Editar</button></a>
                    <button class="delete-btn" data-id="${item.id}">Excluir</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                deleteItem(id);
            });
        });

        showLoading(false); // Esconde a "Aguardando a resposta da API..." após carregar
    })
    .catch(error => Swal.fire('Erro ao carregar estoque', error.message, 'error'));
}



function loadEditForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        Swal.fire('Erro', 'ID do item não encontrado.', 'error').then(() => {
            window.location.href = 'estoque.html';
        });
        return;
    }

    showLoading(true, "Aguardando a resposta da API...");

    fetch(`https://hellfire-ys4u.onrender.com/api/estoque/${id}/`, {
        headers: { 'Authorization': authHeader }
    })
    .then(response => response.json())
    .then(item => {
        document.getElementById('item_id').value = item.id;
        document.getElementById('categoria').value = item.categoria;
        document.getElementById('nome_item').value = item.nome_item;
        document.getElementById('municao').value = item.municao || '';
        document.getElementById('quantidade_atual').value = item.quantidade_atual;
        document.getElementById('quantidade_minima').value = item.quantidade_minima;
        document.getElementById('quantidade_maxima').value = item.quantidade_maxima;
        document.getElementById('data_atualizacao').value = new Date(item.data_atualizacao).toLocaleString();
        document.getElementById('observacoes').value = item.observacoes || '';
    })
    .catch(error => Swal.fire('Erro ao carregar item para edição', error.message, 'error'))
    .finally(() => showLoading(false));
}

function saveEdit() {
    showLoading(true, "Salvando alterações...");

    const id = document.getElementById('item_id').value;
    const updatedItem = {
        categoria: document.getElementById('categoria').value,
        nome_item: document.getElementById('nome_item').value,
        municao: document.getElementById('municao').value || null,
        quantidade_atual: document.getElementById('quantidade_atual').value,
        quantidade_minima: document.getElementById('quantidade_minima').value,
        quantidade_maxima: document.getElementById('quantidade_maxima').value,
        observacoes: document.getElementById('observacoes').value || null
    };

    fetch(`https://hellfire-ys4u.onrender.com/api/estoque/${id}/`, {
        method: 'PUT',
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
    })
    .then(() => {
        Swal.fire('Item atualizado com sucesso!', '', 'success').then(() => {
            window.location.href = 'estoque.html';
        });
    })
    .catch(error => Swal.fire('Erro ao atualizar item', error.message, 'error'))
    .finally(() => showLoading(false));
}

function addItem() {
    showLoading(true, "Adicionando item...");

    const newItem = {
        categoria: document.getElementById('categoria').value,
        nome_item: document.getElementById('nome_item').value,
        municao: document.getElementById('municao').value || null,  // Torna municao opcional
        quantidade_atual: document.getElementById('quantidade_atual').value,
        quantidade_minima: document.getElementById('quantidade_minima').value,
        quantidade_maxima: document.getElementById('quantidade_maxima').value,
        observacoes: document.getElementById('observacoes').value || null  // Torna observacoes opcional
    };

    fetch('https://hellfire-ys4u.onrender.com/api/estoque/', {
        method: 'POST',
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                // Se o servidor retorna um erro, mostramos as categorias ou campos ausentes
                if (errorData.errors && errorData.errors.categoria) {
                    Swal.fire('Campos ausentes', `Categoria ausente: ${errorData.errors.categoria.join(', ')}`, 'error');
                } else {
                    Swal.fire('Erro ao adicionar item', 'Algum erro ocorreu ao adicionar o item. Tente novamente.', 'error');
                }
                throw new Error('Erro ao adicionar item');
            });
        }
        return response.json();
    })
    .then(() => {
        Swal.fire('Item adicionado com sucesso!', '', 'success').then(() => {
            window.location.href = 'estoque.html';
        });
    })
    .catch(error => {
        // Caso o erro não seja relacionado ao servidor (erro de rede, por exemplo)
        console.error(error);
        Swal.fire('Erro ao adicionar item', error.message, 'error');
    })
    .finally(() => showLoading(false));
}


function deleteItem(id) {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            showLoading(true, "Excluindo...");

            fetch(`https://hellfire-ys4u.onrender.com/api/estoque/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': authHeader }
            })
            .then(() => {
                const row = document.querySelector(`#item-${id}`);
                if (row) {
                    row.remove();
                }
                showLoading(false);
            })
            .catch(error => {
                showLoading(false);
                Swal.fire('Erro ao excluir item', error.message, 'error');
            });
        }
    });
}
