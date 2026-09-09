async function pegarEmprestado() {
    console.log('\n---  Pegar Livro Emprestado ---');
    listarLivros();
    if (livros.length === 0) {
        await perguntar('\nPressione ENTER...');
        return;
    }

    const id = await perguntar('\nDigite o ID do livro que deseja: ');
    const livro = livros.find(l => l.id === id.trim());

    if (!livro) {
        console.log('\n Livro não encontrado.');
    } else if (!livro.disponivel) {
        console.log('\n Este livro já está emprestado no momento!');
    } else {
        livro.disponivel = false;
        salvarDados();
        console.log(`\n Boa leitura! Você pegou "${livro.titulo}" emprestado.`);
    }
    await perguntar('\nPressione ENTER para continuar...');
}

