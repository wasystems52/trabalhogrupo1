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
        console.log('\n Livro não encontrado.');
        await perguntar('\nPressione ENTER...');
        return;
    }

    livros.splice(index, 1);
    salvarDados();
    console.log('\n Livro removido do acervo.');
    await perguntar('\nPressione ENTER...');
}
}

// guilherme
async function menuCliente() {
    console.clear();
    console.log("===== MENU DO CLIENTE ====");
    console.log("1. Ver Catálogo de Livros");
    console.log("2. Pegar Livro Emprestado");
    console.log("3. Devolver um Livro");
    console.log("4. Voltar ao Menu Principal");

    console.log("==========================")

    const opcao = wait
    perguntar("Escolha uma opção: ");

    switch (opcao.trim()) {
        case "1":
            listarLivros();
            await
            perguntar("\nPressione ENTER para voltar...");
            break;
            case "2":
                await pegarEmprestado();
                break;
                case "3":
                    await devolverLivro();
                    break;
                    case "4":
                        await menuPrincipal():
                        return;
                        default:
                            console.log("\n Opção Inválida!")
;
awaitperguntar("\nPressione ENTER para voltar...");
    }
    await menuCliente();
}

