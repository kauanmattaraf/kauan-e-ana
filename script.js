// SIMULAÇÃO DE BACKEND - API REST
class PetShopAPI {
    constructor() {
        this.produtos = [
            { id: 1, nome: 'Ração Premium Cão', categoria: 'racao', preco: 89.90, descricao: 'Ração premium para cães adultos', disponivel: true },
            { id: 2, nome: 'Antipulgas Bravecto', categoria: 'medicamentos', preco: 145.00, descricao: 'Antipulgas e carrapatos', disponivel: true },
            { id: 3, nome: 'Brinquedo Kong', categoria: 'brinquedos', preco: 35.00, descricao: 'Brinquedo resistente para cães', disponivel: true }
        ];
        this.servicos = [];
        this.delivery = [];
        this.veterinario = [];
        this.nextId = 4;
    }

    // GET /produtos
    getProdutos() {
        return { status: 200, data: this.produtos };
    }

    // POST /produtos
    createProduto(produto) {
        const novoProduto = {
            id: this.nextId++,
            ...produto,
            disponivel: true
        };
        this.produtos.push(novoProduto);
        return { status: 201, data: novoProduto };
    }

    // DELETE /produtos/:id
    deleteProduto(id) {
        const index = this.produtos.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            this.produtos.splice(index, 1);
            return { status: 200, message: 'Produto excluído com sucesso' };
        }
        return { status: 404, message: 'Produto não encontrado' };
    }

    // Métodos para outros serviços
    createServico(servico) {
        const novoServico = { id: this.nextId++, ...servico, status: 'agendado' };
        this.servicos.push(novoServico);
        return { status: 201, data: novoServico };
    }

    createDelivery(delivery) {
        const novoDelivery = { id: this.nextId++, ...delivery, status: 'pendente' };
        this.delivery.push(novoDelivery);
        return { status: 201, data: novoDelivery };
    }

    createVeterinario(consulta) {
        const novaConsulta = { id: this.nextId++, ...consulta, status: 'agendada' };
        this.veterinario.push(novaConsulta);
        return { status: 201, data: novaConsulta };
    }

    getServicos() {
        return { status: 200, data: this.servicos };
    }

    getDelivery() {
        return { status: 200, data: this.delivery };
    }

    getVeterinario() {
        return { status: 200, data: this.veterinario };
    }

    deleteServico(id) {
        const index = this.servicos.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            this.servicos.splice(index, 1);
            return { status: 200, message: 'Serviço cancelado' };
        }
        return { status: 404, message: 'Serviço não encontrado' };
    }

    deleteDelivery(id) {
        const index = this.delivery.findIndex(d => d.id === parseInt(id));
        if (index !== -1) {
            this.delivery.splice(index, 1);
            return { status: 200, message: 'Pedido cancelado' };
        }
        return { status: 404, message: 'Pedido não encontrado' };
    }

    deleteVeterinario(id) {
        const index = this.veterinario.findIndex(v => v.id === parseInt(id));
        if (index !== -1) {
            this.veterinario.splice(index, 1);
            return { status: 200, message: 'Consulta cancelada' };
        }
        return { status: 404, message: 'Consulta não encontrada' };
    }
}

// Instância da API
const api = new PetShopAPI();

// FUNÇÕES DE NAVEGAÇÃO
function showSection(sectionName) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remover classe active de todas as abas
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Mostrar seção selecionada
    document.getElementById(sectionName).classList.add('active');
    
    // Adicionar classe active na aba correspondente
    event.target.classList.add('active');
    
    // Carregar dados da seção
    loadSectionData(sectionName);
}

function loadSectionData(section) {
    switch(section) {
        case 'home':
            updateStats();
            break;
        case 'produtos':
            loadProdutos();
            break;
        case 'servicos':
            loadServicos();
            break;
        case 'delivery':
            loadDelivery();
            break;
        case 'veterinario':
            loadVeterinario();
            break;
        case 'admin':
            updateAdminStats();
            break;
    }
}

// FUNÇÕES DE ESTATÍSTICAS
function updateStats() {
    const produtos = api.getProdutos();
    const servicos = api.getServicos();
    const delivery = api.getDelivery();
    const veterinario = api.getVeterinario();
    
    document.getElementById('totalProdutos').textContent = produtos.data.length;
    document.getElementById('totalPedidos').textContent = delivery.data.length;
    document.getElementById('totalServicos').textContent = servicos.data.length + veterinario.data.length;
}

function updateAdminStats() {
    const produtos = api.getProdutos();
    const servicos = api.getServicos();
    const delivery = api.getDelivery();
    const veterinario = api.getVeterinario();
    
    document.getElementById('adminTotalProdutos').textContent = produtos.data.length;
    document.getElementById('adminTotalServicos').textContent = servicos.data.length;
    document.getElementById('adminTotalDelivery').textContent = delivery.data.length;
    document.getElementById('adminTotalVeterinario').textContent = veterinario.data.length;
}

// FUNÇÕES DE PRODUTOS
function loadProdutos() {
    try {
        const response = api.getProdutos();
        const produtos = response.data;
        
        const container = document.getElementById('produtosList');
        
        if (produtos.length === 0) {
            container.innerHTML = '<div class="loading">Nenhum produto cadastrado</div>';
            return;
        }
        
        container.innerHTML = produtos.map(produto => `
            <div class="produto-card">
                <div class="produto-nome">${produto.nome}</div>
                <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
                <div class="produto-categoria">${produto.categoria}</div>
                <div>${produto.descricao}</div>
                <div class="status-badge ${produto.disponivel ? 'status-disponivel' : 'status-indisponivel'}">
                    ${produto.disponivel ? 'Disponível' : 'Indisponível'}
                </div>
                <br>
                <button class="btn btn-danger" onclick="excluirProduto(${produto.id})">🗑️ Excluir</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        document.getElementById('produtosList').innerHTML = '<div class="loading">Erro ao carregar produtos</div>';
    }
}

function filtrarProdutos() {
    const search = document.getElementById('searchProdutos').value.toLowerCase();
    const categoria = document.getElementById('filtroCategoria').value;
    
    const response = api.getProdutos();
    let produtos = response.data;
    
    if (search) {
        produtos = produtos.filter(p => 
            p.nome.toLowerCase().includes(search) || 
            p.categoria.toLowerCase().includes(search) ||
            p.descricao.toLowerCase().includes(search)
        );
    }
    
    if (categoria) {
        produtos = produtos.filter(p => p.categoria === categoria);
    }
    
    const container = document.getElementById('produtosList');
    
    if (produtos.length === 0) {
        container.innerHTML = '<div class="loading">Nenhum produto encontrado</div>';
        return;
    }
    
    container.innerHTML = produtos.map(produto => `
        <div class="produto-card">
            <div class="produto-nome">${produto.nome}</div>
            <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
            <div class="produto-categoria">${produto.categoria}</div>
            <div>${produto.descricao}</div>
            <div class="status-badge ${produto.disponivel ? 'status-disponivel' : 'status-indisponivel'}">
                ${produto.disponivel ? 'Disponível' : 'Indisponível'}
            </div>
            <br>
            <button class="btn btn-danger" onclick="excluirProduto(${produto.id})">🗑️ Excluir</button>
        </div>
    `).join('');
}

function excluirProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        const response = api.deleteProduto(id);
        if (response.status === 200) {
            alert('✅ Produto excluído com sucesso!');
            loadProdutos();
            updateStats();
        } else {
            alert('❌ Erro ao excluir produto: ' + response.message);
        }
    }
}

// FUNÇÕES DE SERVIÇOS
function loadServicos() {
    try {
        const response = api.getServicos();
        const servicos = response.data;
        
        const container = document.getElementById('servicosList');
        
        if (servicos.length === 0) {
            container.innerHTML = '<div class="loading">Nenhum serviço agendado</div>';
            return;
        }
        
        container.innerHTML = servicos.map(servico => `
            <div class="pedido-item">
                <strong>🐾 ${servico.pet}</strong><br>
                <strong>👤 Tutor:</strong> ${servico.tutor}<br>
                <strong>📞 Telefone:</strong> ${servico.telefone}<br>
                <strong>✂️ Serviço:</strong> ${servico.tipo}<br>
                <strong>📅 Data:</strong> ${servico.data} às ${servico.horario}<br>
                <div class="status-badge status-disponivel">${servico.status}</div>
                <br>
                <button class="btn btn-danger" onclick="cancelarServico(${servico.id})">❌ Cancelar</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        document.getElementById('servicosList').innerHTML = '<div class="loading">Erro ao carregar serviços</div>';
    }
}

function cancelarServico(id) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        const response = api.deleteServico(id);
        if (response.status === 200) {
            alert('✅ Agendamento cancelado com sucesso!');
            loadServicos();
            updateStats();
        } else {
            alert('❌ Erro ao cancelar agendamento: ' + response.message);
        }
    }
}

// FUNÇÕES DE DELIVERY
function loadDelivery() {
    try {
        const response = api.getDelivery();
        const pedidos = response.data;
        
        const container = document.getElementById('deliveryList');
        
        if (pedidos.length === 0) {
            container.innerHTML = '<div class="loading">Nenhum pedido de delivery</div>';
            return;
        }
        
        container.innerHTML = pedidos.map(pedido => `
            <div class="pedido-item">
                <strong>🚚 ${pedido.tipo}</strong><br>
                <strong>👤 Cliente:</strong> ${pedido.cliente}<br>
                <strong>📞 Telefone:</strong> ${pedido.telefone}<br>
                <strong>📍 Endereço:</strong> ${pedido.endereco}<br>
                ${pedido.observacoes ? `<strong>📝 Observações:</strong> ${pedido.observacoes}<br>` : ''}
                <div class="status-badge status-disponivel">${pedido.status}</div>
                <br>
                <button class="btn btn-danger" onclick="cancelarDelivery(${pedido.id})">❌ Cancelar</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar delivery:', error);
        document.getElementById('deliveryList').innerHTML = '<div class="loading">Erro ao carregar pedidos</div>';
    }
}

function cancelarDelivery(id) {
    if (confirm('Tem certeza que deseja cancelar este pedido?')) {
        const response = api.deleteDelivery(id);
        if (response.status === 200) {
            alert('✅ Pedido cancelado com sucesso!');
            loadDelivery();
            updateStats();
        } else {
            alert('❌ Erro ao cancelar pedido: ' + response.message);
        }
    }
}

// FUNÇÕES DE VETERINÁRIO
function loadVeterinario() {
    try {
        const response = api.getVeterinario();
        const consultas = response.data;
        
        const container = document.getElementById('veterinarioList');
        
        if (consultas.length === 0) {
            container.innerHTML = '<div class="loading">Nenhuma consulta agendada</div>';
            return;
        }
        
        container.innerHTML = consultas.map(consulta => `
            <div class="pedido-item">
                <strong>🐾 ${consulta.pet} (${consulta.especie})</strong><br>
                <strong>👤 Tutor:</strong> ${consulta.tutor}<br>
                <strong>📞 Telefone:</strong> ${consulta.telefone}<br>
                <strong>🩺 Consulta:</strong> ${consulta.tipo}<br>
                <strong>📅 Data:</strong> ${consulta.data} às ${consulta.horario}<br>
                ${consulta.observacoes ? `<strong>📝 Sintomas:</strong> ${consulta.observacoes}<br>` : ''}
                <div class="status-badge status-disponivel">${consulta.status}</div>
                <br>
                <button class="btn btn-danger" onclick="cancelarConsulta(${consulta.id})">❌ Cancelar</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar consultas:', error);
        document.getElementById('veterinarioList').innerHTML = '<div class="loading">Erro ao carregar consultas</div>';
    }
}

function cancelarConsulta(id) {
    if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
        const response = api.deleteVeterinario(id);
        if (response.status === 200) {
            alert('✅ Consulta cancelada com sucesso!');
            loadVeterinario();
            updateStats();
        } else {
            alert('❌ Erro ao cancelar consulta: ' + response.message);
        }
    }
}

// FUNÇÕES ADMINISTRATIVAS
function exportarDados() {
    const dados = {
        produtos: api.getProdutos().data,
        servicos: api.getServicos().data,
        delivery: api.getDelivery().data,
        veterinario: api.getVeterinario().data,
        exportadoEm: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dados, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'petcare_dados_' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('✅ Dados exportados com sucesso!');
}

function gerarRelatorio() {
    const produtos = api.getProdutos().data;
    const servicos = api.getServicos().data;
    const delivery = api.getDelivery().data;
    const veterinario = api.getVeterinario().data;
    
    const relatorio = `
RELATÓRIO PETCARE EXPRESS
========================
Data: ${new Date().toLocaleDateString('pt-BR')}

PRODUTOS:
- Total de produtos: ${produtos.length}
- Produtos disponíveis: ${produtos.filter(p => p.disponivel).length}
- Categorias: ${[...new Set(produtos.map(p => p.categoria))].join(', ')}

SERVIÇOS:
- Banho e Tosa agendados: ${servicos.length}
- Consultas veterinárias: ${veterinario.length}
- Pedidos delivery: ${delivery.length}

FATURAMENTO ESTIMADO:
- Produtos: R$ ${produtos.reduce((acc, p) => acc + p.preco, 0).toFixed(2)}
- Serviços: R$ ${(servicos.length * 35 + veterinario.length * 80).toFixed(2)}

TOTAL GERAL: ${produtos.length + servicos.length + delivery.length + veterinario.length} registros
    `;
    
    alert(relatorio);
}

function limparDados() {
    if (confirm('⚠️ ATENÇÃO: Esta ação irá excluir TODOS os dados do sistema. Deseja continuar?')) {
        if (confirm('⚠️ Tem certeza absoluta? Esta ação não pode ser desfeita!')) {
            api.produtos = [];
            api.servicos = [];
            api.delivery = [];
            api.veterinario = [];
            api.nextId = 1;
            
            alert('✅ Todos os dados foram excluídos!');
            
            // Recarregar dados em todas as seções
            updateStats();
            updateAdminStats();
            loadProdutos();
            loadServicos();
            loadDelivery();
            loadVeterinario();
        }
    }
}

// EVENT LISTENERS DOS FORMULÁRIOS
document.addEventListener('DOMContentLoaded', function() {
    // Formulário de Produtos
    document.getElementById('produtoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const produto = {
            nome: document.getElementById('produtoNome').value,
            categoria: document.getElementById('produtoCategoria').value,
            preco: parseFloat(document.getElementById('produtoPreco').value),
            descricao: document.getElementById('produtoDescricao').value
        };
        
        const response = api.createProduto(produto);
        
        if (response.status === 201) {
            alert('✅ Produto cadastrado com sucesso!');
            this.reset();
            loadProdutos();
            updateStats();
        } else {
            alert('❌ Erro ao cadastrar produto');
        }
    });
    
    // Formulário de Serviços
    document.getElementById('servicoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const servico = {
            pet: document.getElementById('servicoPet').value,
            tutor: document.getElementById('servicoTutor').value,
            telefone: document.getElementById('servicoTelefone').value,
            tipo: document.getElementById('servicoTipo').value,
            data: document.getElementById('servicoData').value,
            horario: document.getElementById('servicoHorario').value
        };
        
        const response = api.createServico(servico);
        
        if (response.status === 201) {
            alert('✅ Serviço agendado com sucesso!');
            this.reset();
            loadServicos();
            updateStats();
        } else {
            alert('❌ Erro ao agendar serviço');
        }
    });
    
    // Formulário de Delivery
    document.getElementById('deliveryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const delivery = {
            tipo: document.getElementById('deliveryTipo').value,
            cliente: document.getElementById('deliveryCliente').value,
            telefone: document.getElementById('deliveryTelefone').value,
            endereco: document.getElementById('deliveryEndereco').value,
            observacoes: document.getElementById('deliveryObs').value
        };
        
        const response = api.createDelivery(delivery);
        
        if (response.status === 201) {
            alert('✅ Pedido de delivery criado com sucesso!');
            this.reset();
            loadDelivery();
            updateStats();
        } else {
            alert('❌ Erro ao criar pedido de delivery');
        }
    });
    
    // Formulário de Veterinário
    document.getElementById('veterinarioForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const consulta = {
            pet: document.getElementById('vetPet').value,
            especie: document.getElementById('vetEspecie').value,
            tutor: document.getElementById('vetTutor').value,
            telefone: document.getElementById('vetTelefone').value,
            tipo: document.getElementById('vetTipo').value,
            data: document.getElementById('vetData').value,
            horario: document.getElementById('vetHorario').value,
            observacoes: document.getElementById('vetObservacoes').value
        };
        
        const response = api.createVeterinario(consulta);
        
        if (response.status === 201) {
            alert('✅ Consulta agendada com sucesso!');
            this.reset();
            loadVeterinario();
            updateStats();
        } else {
            alert('❌ Erro ao agendar consulta');
        }
    });
    
    // Configurar data mínima para hoje
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('servicoData').min = hoje;
    document.getElementById('vetData').min = hoje;
    
    // Carregar dados iniciais
    updateStats();
    loadProdutos();
});