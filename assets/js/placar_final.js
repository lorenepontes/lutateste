document.addEventListener("DOMContentLoaded", () => {
  const categoriaTitulo = document.getElementById("categoria-titulo");
  const resultadoContainer = document.getElementById("resultado-container");
  const dataGeracaoSpan = document.getElementById("data-geracao");

  // FUNÇÃO PRINCIPAL PARA DESENHAR/ATUALIZAR A TABELA
  const renderizarPlacar = () => {
    const dadosJSON = localStorage.getItem("dadosPlacarFinal");

    if (!dadosJSON) {
      document.title = "placar_final";
      resultadoContainer.innerHTML =
        "<p>Aguardando dados da página principal...</p>";
      return;
    }

    const dados = JSON.parse(dadosJSON);

    document.title = `Resultado kata Categoria:${dados.categoria}`;

    // Limpa o conteúdo anterior
    resultadoContainer.innerHTML = "";

    // Atualiza o título da categoria

    categoriaTitulo.textContent = `${dados.categoria}`;

    // Ordena os atletas pela colocação
    dados.atletas.sort((a, b) => a.colocacao - b.colocacao);

    // Cria a tabela
    const table = document.createElement("table");
    table.innerHTML = `
            <thead>
                <tr>
                    <th>Colocação</th>
                    <th>Atleta</th>
                    <th>Notas Válidas</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
    const tbody = table.querySelector("tbody");

    // Preenche a tabela com os dados
    dados.atletas.forEach((atleta) => {
      const row = document.createElement("tr");

      let medalClass = "";
      if (atleta.colocacao === 1) medalClass = "gold";
      else if (atleta.colocacao === 2) medalClass = "silver";
      else if (atleta.colocacao === 3) medalClass = "bronze";

      row.innerHTML = `
                <td class="placement-cell ${medalClass}">${
        atleta.colocacao
      }º</td>
                <td class="atleta-nome-cell">${atleta.nome}</td>
                <td class="notas-validas-cell">${atleta.notasValidas.join(
                  " - "
                )}</td>
                <td class="total-cell">${atleta.total.toFixed(1)}</td>
            `;
      tbody.appendChild(row);
    });

    resultadoContainer.appendChild(table);
    dataGeracaoSpan.textContent = new Date().toLocaleString("pt-BR");
  };

  // "ESCUTADOR" DE MUDANÇAS NO LOCALSTORAGE
  // Este evento é disparado NESTA aba quando OUTRA aba modifica o localStorage
  window.addEventListener("storage", (event) => {
    // Verifica se a chave modificada é a que nos interessa
    if (event.key === "dadosPlacarFinal") {
      console.log("Dados recebidos da página principal. Atualizando placar...");
      renderizarPlacar(); // Re-desenha a tabela com os novos dados
    }
  });

  // RENDERIZAÇÃO INICIAL: Desenha a tabela quando a página é carregada pela primeira vez
  renderizarPlacar();
});
