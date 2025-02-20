# Hellfire Estoque

**Hellfire Estoque** é uma aplicação web desenvolvida para facilitar a **gestão de estoques** de forma eficiente e moderna. Com uma **interface escura** e **responsiva**, o site proporciona uma experiência de usuário agradável e funcional, mesmo em ambientes de pouca iluminação.

---

## 🚀 Funcionalidades principais

- **Login e autenticação**: Permite que os usuários façam login com **autenticação básica**, garantindo acesso ao sistema de estoque.
- **Gerenciamento de itens no estoque**:
  - **Adicionar itens**: Facilita o cadastro de novos itens no estoque com campos como nome, categoria, quantidade atual, mínima e máxima.
  - **Editar itens**: Permite que os itens já cadastrados sejam modificados conforme necessário.
  - **Excluir itens**: A exclusão de itens é feita de forma segura, com confirmação de ação e uma interface de carregamento que indica o progresso da operação.
  - **Visualização do estoque**: Exibe todos os itens cadastrados com detalhes como nome, categoria, munição, quantidade e observações.
- **Responsividade**: O layout do site é **totalmente responsivo**, funcionando perfeitamente em **desktops, tablets e smartphones**.
- **Feedback visual**: Utiliza mensagens de carregamento (como "Aguardando a resposta da API" e "Excluindo...") para fornecer um feedback claro sobre o status das ações do usuário.

---

## 🛠️ Tecnologias utilizadas

- **Frontend**:
  - HTML
  - CSS
  - JavaScript
- **Backend**: API RESTful com autenticação básica via cabeçalhos HTTP.
- **Bibliotecas externas**:
  - **SweetAlert2** para exibição de mensagens de alerta e sucesso.
  - **Fetch API** para comunicação com o servidor.

---

## 📂 Estrutura do Projeto

O projeto é dividido nas seguintes seções:

- **index.html**: Página inicial que redireciona automaticamente para o login.
- **login.html** e **login.css**: Página de login para autenticação de usuários.
- **estoque.html** e **estoque.css**: Página para visualização e gerenciamento de itens do estoque.
- **adicionar.html** e **adicionar.css**: Página para adicionar novos itens ao estoque.
- **editar.html** e **editar.css**: Página para editar itens existentes no estoque.
- **script.js**: Arquivo JavaScript com lógica de autenticação, gerenciamento de itens e controle de interações na interface.

