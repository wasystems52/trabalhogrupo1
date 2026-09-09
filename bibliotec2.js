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

const perguntar = (pergunta) => {

function listarLivros() {
    console.log('\n---  Catálogo de Livros ---');
    if (livros.length === 0) {
        console.log('Nenhum livro no acervo.');
        return;
    }
    livros.forEach((l) => {
        const status = l.disponivel ? ' Disponível' : ' Emprestado';
        console.log(`ID: ${l.id} | Título: "${l.titulo}" | Autor: ${l.autor} | Status: ${status}`);
    });
}

async function criarLivro() {
    console.log('\n---  Cadastrar Novo Livro ---');
    const titulo = await perguntar('Título: ');
    const autor = await perguntar('Autor: ');

    if (!titulo.trim() || !autor.trim()) {
        console.log('\n Campos obrigatórios vazios! Operação cancelada.');
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
    console.log('\n Livro adicionado com sucesso!');
    await perguntar('\nPressione ENTER...');
}

async function atualizarLivro() {
    console.log('\n---  Atualizar Livro ---');
    listarLivros();
    if (livros.length === 0) {
        await perguntar('\nPressione ENTER...');
        return;
    }

    const id = await perguntar('\nID do livro para editar: ');
    const livro = livros.find(l => l.id === id.trim());

    if (!livro) {
        console.log('\n Livro não encontrado.');
        await perguntar('\nPressione ENTER...');
        return;
    }

    const novoTitulo = await perguntar(`Novo Título [${livro.titulo}]: `);
    const novoAutor = await perguntar(`Novo Autor [${livro.autor}]: `);

    if (novoTitulo.trim()) livro.titulo = novoTitulo.trim();
    if (novoAutor.trim()) livro.autor = novoAutor.trim();

    salvarDados();
    console.log('\n Dados atualizados!');
    await perguntar('\nPressione ENTER...');
}

async function excluirLivro() {
    console.log('\n---  Excluir Livro ---');
    listarLivros();
    if (livros.length === 0) {
        await perguntar('\nPressione ENTER...');
        return;
    }

    const id = await perguntar('\nID do livro para remover: ');
    const index = livros.findIndex(l => l.id === id.trim());

    if (index === -1) {
        console.log('\n Livro nao encontrado.');
        await perguntar('\nPressione ENTER...');
        return;
    }

    livros.splice(index, 1);
    salvarDados();
    console.log('\n Livro removido do acervo.');
    await perguntar('\nPressione ENTER...');
}
}

// Maria Eduarda

async function menuPrincipal() {
    console.clear()
    console.log("======= SISTEMA DE BIBLIOTECA ============");
    console.log("Como voce deseja acessar o Sistema?");
    console.log("1.Entrar como Atendente(Gerenciamento!)");
    console.log("2.Entrar como Cliente(Consulta e Reserva)");
    console.log("3.Sair");
    console.log("============================================");

    const opcao=await perguntar("Escolha uma opcao:");
    switch(opcao.trim()) {
        case '1':
            await menuAtendente();
            break;
            case '2':
                await menuCliente();
                break;
                case '3':
                    console.log("\nSaindo...Obrigado por utilizar a biblioteca!");
                    rl.close();
                    process.exit(0);
                    default:
                        console.log("\nOpcao Invalida!");
                        await perguntar("\nPressione ENTER para tentar novamente...");
                        await menuPrincipal();
    }
}

async function menuAtendente() {
    console.clear();
    console.log("========== MENU DO ATENDENTE ==========");
    console.log("1.Cadastrar Novo Livro (Create)");
    console.log("2.Listar Livros Cadastrados (Read)");
    console.log("3.Atualiar Dados de um Livro(Update)");
    console.log("4. Remover Livro do Acervo(Delete)");
    console.log("5.Voltar ao Menu Principal");
    console.log("========================================"); 
}
await menuAtendente();

}
