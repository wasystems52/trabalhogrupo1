//washington
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ARQUIVO_DADOS = 'biblioteca.json';
let livros = [];

// Carrega os dados salvos
if (fs.existsSync(ARQUIVO_DADOS)) {
    try {
        livros = JSON.parse(fs.readFileSync(ARQUIVO_DADOS, 'utf-8'));
    } catch (e) {
        livros = [];
    }
}

function salvarDados() {
    fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(livros, null, 2));
}

// Promisify do readline.question
const perguntar = (pergunta) => new Promise((resolve) => {
    rl.question(pergunta, resolve);
});

function listarLivros() {
    console.log('\n--- Catálogo de Livros ---');
    if (livros.length === 0) {
        console.log('Nenhum livro no acervo.');
        return;
    }
    livros.forEach((l) => {
        const status = l.disponivel ? 'Disponível' : 'Emprestado';
        console.log(`ID: ${l.id} | Título: "${l.titulo}" | Autor: ${l.autor} | Status: ${status}`);
    });
}

async function criarLivro() {
    console.log('\n--- Cadastrar Novo Livro ---');
    const titulo = await perguntar('Título: ');
    const autor = await perguntar('Autor: ');

    if (!titulo.trim() || !autor.trim()) {
        console.log('\nCampos obrigatórios vazios! Operação cancelada.');
        await perguntar('\nPressione ENTER...');
        return;
    }

    livros.push({
        id: Date.now().toString().slice(-4),
        titulo: titulo.trim(),
        autor: autor.trim(),
        disponivel: true // Todo livro novo começa disponível
    });
    salvarDados();
    console.log('\nLivro adicionado com sucesso!');
    await perguntar('\nPressione ENTER...');
}

async function atualizarLivro() {
    console.log('\n--- Atualizar Livro ---');
    listarLivros();
    if (livros.length === 0) {
        await perguntar('\nPressione ENTER...');
        return;
    }

    const id = await perguntar('\nID do livro para editar: ');
    const livro = livros.find(l => l.id === id.trim());

    if (!livro) {
        console.log('\nLivro não encontrado.');
        await perguntar('\nPressione ENTER...');
        return;
    }

    const novoTitulo = await perguntar(`Novo Título [${livro.titulo}]: `);
    const novoAutor = await perguntar(`Novo Autor [${livro.autor}]: `);

    if (novoTitulo.trim()) livro.titulo = novoTitulo.trim();
    if (novoAutor.trim()) livro.autor = novoAutor.trim();

    salvarDados();
    console.log('\nDados atualizados!');
    await perguntar('\nPressione ENTER...');
}

//andre
async function pegarEmprestado() {
    console.log('\n--- Emprestar Livro ---');
    listarLivros();
    if (livros.length === 0) {
        await perguntar('\nPressione ENTER...');
        return;
    }

    const id = await perguntar('\nID do livro para emprestar: ');
    const livro = livros.find((item) => item.id === id.trim());

    if (!livro) {
        console.log('\nLivro não encontrado.');
    } else if (!livro.disponivel) {
        console.log('\nEsse livro já está emprestado.');
    } else {
        livro.disponivel = false;
        salvarDados();
        console.log('\nLivro emprestado com sucesso!');
    }
    await perguntar('\nPressione ENTER...');
}

async function devolverLivro() {
    console.log('\n--- Devolver Livro ---');
    listarLivros();
    if (livros.length === 0) {
        await perguntar('\nPressione ENTER...');
        return;
    }

    const id = await perguntar('\nID do livro para devolver: ');
    const livro = livros.find((item) => item.id === id.trim());

    if (!livro) {
        console.log('\nLivro não encontrado.');
    } else if (livro.disponivel) {
        console.log('\nEsse livro já está disponível.');
    } else {
        livro.disponivel = true;
        salvarDados();
        console.log('\nLivro devolvido com sucesso!');
    }
    await perguntar('\nPressione ENTER...');
}

async function excluirLivro() {
    console.log('\n--- Excluir Livro ---');
    listarLivros();
    if (livros.length === 0) {
        await perguntar('\nPressione ENTER...');
        return;
    }

    const id = await perguntar('\nID do livro para remover: ');
    const index = livros.findIndex(l => l.id === id.trim());

    if (index === -1) {
        console.log('\nLivro não encontrado.');
        await perguntar('\nPressione ENTER...');
        return;
    }

    livros.splice(index, 1);
    salvarDados();
    console.log('\nLivro removido do acervo.');
    await perguntar('\nPressione ENTER...');
}

//Maria Eduarda

async function menuAtendente() {
    while (true) {
        console.clear();
        console.log("========== MENU DO ATENDENTE ==========");
        console.log("1. Cadastrar Novo Livro (Create)");
        console.log("2. Listar Livros Cadastrados (Read)");
        console.log("3. Atualizar Dados de um Livro (Update)");
        console.log("4. Remover Livro do Acervo (Delete)");
        console.log("5. Voltar ao Menu Principal");
        console.log("========================================"); 

        const opcao = (await perguntar('Escolha uma opção: ')).trim();
        
        if (opcao === '1') await criarLivro();
        else if (opcao === '2') {
            listarLivros();
            await perguntar('\nPressione ENTER para voltar...');
        } 
        else if (opcao === '3') await atualizarLivro();
        else if (opcao === '4') await excluirLivro();
        else if (opcao === '5') break;
        else {
            console.log('\nOpção inválida!');
            await perguntar('\nPressione ENTER para tentar novamente...');
        }
    }
}

async function menuCliente() {
    while (true) {
        console.clear();
        console.log("===== MENU DO CLIENTE =====");
        console.log("1. Ver Catálogo de Livros");
        console.log("2. Pegar Livro Emprestado");
        console.log("3. Devolver um Livro");
        console.log("4. Voltar ao Menu Principal");
        console.log("==========================");

        const opcao = (await perguntar("Escolha uma opção: ")).trim();

        if (opcao === "1") {
            listarLivros();
            await perguntar("\nPressione ENTER para voltar...");
        } 
        else if (opcao === "2") await pegarEmprestado();
        else if (opcao === "3") await devolverLivro();
        else if (opcao === "4") break;
        else {
            console.log("\nOpção Inválida!");
            await perguntar("\nPressione ENTER para voltar...");
        }
    }
}

async function menuPrincipal() {
    while (true) {
        console.clear();
        console.log("======= SISTEMA DE BIBLIOTECA ============");
        console.log("Como você deseja acessar o Sistema?");
        console.log("1. Entrar como Atendente (Gerenciamento)");
        console.log("2. Entrar como Cliente (Consulta e Empréstimo)");
        console.log("3. Sair");
        console.log("============================================");

        const opcao = (await perguntar("Escolha uma opção: ")).trim();

        if (opcao === '1') await menuAtendente();
        else if (opcao === '2') await menuCliente();
        else if (opcao === '3') {
            console.log("\nSaindo... Obrigado por utilizar a biblioteca!");
            rl.close();
            process.exit(0);
        } else {
            console.log("\nOpção Inválida!");
            await perguntar("\nPressione ENTER para tentar novamente...");
        }
    }
}

// Inicializa a aplicação
menuPrincipal();
