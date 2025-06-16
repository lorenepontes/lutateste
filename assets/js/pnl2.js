document.addEventListener("DOMContentLoaded", () => {
  // SELEÇÃO DOS ELEMENTOS PRINCIPAIS
  const gerarLinhasBtn = document.getElementById("gerar-linhas");
  const limparTabelaBtn = document.getElementById("limpar-tabela");
  const exportarTxtBtn = document.getElementById("exportar-txt");
  const quantidadeAtletasInput = document.getElementById("quantidade-atletas");
  const categoriaInput = document.getElementById("categoria");
  const tabelaContainer = document.getElementById("tabela-container");

  // FUNÇÃO PARA GERAR A TABELA
  const gerarTabela = () => {
    const numAtletas = parseInt(quantidadeAtletasInput.value) || 0;
    const nomecat = categoriaInput.value;

    console.log(nomecat);

    if (nomecat === "") {
      //console.log("erro");

      categoriaInput.style.backgroundColor = "#fcba03";
      categoriaInput.focus();
      alert("Insira o nome da Categoria.");
      return; // Coloca o cursor de volta no campo de input
    } else {
      categoriaInput.style.backgroundColor = "#f1f1f1";
    }

    if (numAtletas <= 0) {
      alert("Por favor, insira uma quantidade válida de atletas.");
      return;
    }

    tabelaContainer.innerHTML = ""; // Limpa tabela anterior
    const table = document.createElement("table");
    table.innerHTML = `
            <thead>
                <tr>
                    <th>Atleta</th>
                    <th>Nota 1</th>
                    <th>Nota 2</th>
                    <th>Nota 3</th>
                    <th>Nota 4</th>
                    <th>Nota 5</th>
                    <th>Total</th>
                    <th>Colocação</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

    const tbody = table.querySelector("tbody");
    for (let i = 0; i < numAtletas; i++) {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td><input type="text" class="atleta-nome" placeholder="Nome do Atleta"></td>
                <td><input type="number" class="nota-input" min="0" max="10" step="0.1"></td>
                <td><input type="number" class="nota-input" min="0" max="10" step="0.1"></td>
                <td><input type="number" class="nota-input" min="0" max="10" step="0.1"></td>
                <td><input type="number" class="nota-input" min="0" max="10" step="0.1"></td>
                <td><input type="number" class="nota-input" min="0" max="10" step="0.1"></td>
                <td class="total-cell">0.0</td>
                <td class="placement-cell"></td>
            `;
      tbody.appendChild(row);
    }

    tabelaContainer.appendChild(table);
  };

  // FUNÇÃO PARA CALCULAR TUDO: NOTAS, TOTAIS E CLASSIFICAÇÃO
  const calcularTudo = () => {
    const rows = tabelaContainer.querySelectorAll("tbody tr");
    const atletasData = [];

    rows.forEach((row, index) => {
      const notasInputs = row.querySelectorAll(".nota-input");
      const notas = [];

      // Pega as notas e reseta o estilo
      notasInputs.forEach((input) => {
        notas.push(parseFloat(input.value) || 0);
        input.classList.remove("discarded-note");
        atualizarDadosEspelho();
      });

      // Calcula o total descartando a maior e a menor nota
      if (notas.filter((n) => n > 0).length >= 3) {
        const sortedNotas = [...notas].sort((a, b) => a - b);
        const notaMin = sortedNotas[0];
        const notaMax = sortedNotas[sortedNotas.length - 1];

        const total =
          notas.reduce((sum, nota) => sum + nota, 0) - notaMin - notaMax;
        row.querySelector(".total-cell").textContent = total.toFixed(1);

        // Marca as notas descartadas
        let minMarked = false;
        let maxMarked = false;
        notasInputs.forEach((input) => {
          const val = parseFloat(input.value) || 0;
          if (val === notaMin && !minMarked) {
            input.classList.add("discarded-note");
            minMarked = true;
          }
          if (val === notaMax && !maxMarked) {
            input.classList.add("discarded-note");
            maxMarked = true;
          }
        });

        atletasData.push({ index, total });
      } else {
        row.querySelector(".total-cell").textContent = "0.0";
        atletasData.push({ index, total: 0 });
      }
    });

    // Classifica os atletas
    atletasData.sort((a, b) => b.total - a.total);

    // Atualiza a coluna de colocação
    atletasData.forEach((atleta, rank) => {
      const row = rows[atleta.index];
      const placementCell = row.querySelector(".placement-cell");
      placementCell.textContent = rank + 1;

      // Aplica estilos para 1º, 2º e 3º lugar
      placementCell.classList.remove("gold", "silver", "bronze");
      if (atleta.total > 0) {
        if (rank === 0) placementCell.classList.add("gold");
        else if (rank === 1) placementCell.classList.add("silver");
        else if (rank === 2) placementCell.classList.add("bronze");
      } else {
        placementCell.textContent = "-";
      }
    });
    atualizarDadosEspelho();
  };

  // FUNÇÃO PARA LIMPAR TUDO
  const limparTudo = () => {
    tabelaContainer.innerHTML = "";
    quantidadeAtletasInput.value = "1";
    categoriaInput.value = "";
    atualizarDadosEspelho();
  };

  // FUNÇÃO PARA EXPORTAR PARA .TXT
  const exportarParaTxt = () => {
    const rows = tabelaContainer.querySelectorAll("tbody tr");
    if (rows.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }

    let content = `Relatório da Categoria: ${
      categoriaInput.value || "Não especificada"
    }\n`;
    content += "===========================================================\n";
    content +=
      "Colocação\tAtleta\t\tNota 1\tNota 2\tNota 3\tNota 4\tNota 5\tTotal\n";
    content += "-----------------------------------------------------------\n";

    const atletasData = [];
    rows.forEach((row) => {
      const atletaNome = row.querySelector(".atleta-nome").value || "S/ Nome";
      const notas = Array.from(row.querySelectorAll(".nota-input")).map(
        (input) => input.value || "0"
      );
      const total = row.querySelector(".total-cell").textContent;
      const colocacao = row.querySelector(".placement-cell").textContent;
      atletasData.push({ colocacao, atletaNome, notas, total });
    });

    // Ordena pelo ranking para o arquivo de texto
    atletasData.sort((a, b) => a.colocacao - b.colocacao);

    atletasData.forEach((atleta) => {
      content += `${atleta.colocacao}\t\t${atleta.atletaNome.padEnd(
        10
      )}\t${atleta.notas.join("\t")}\t${atleta.total}\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `resultado_${(categoriaInput.value || "competicao").replace(
      /\s+/g,
      "_"
    )}.txt`;
    link.click();
  };

  // EVENT LISTENERS
  gerarLinhasBtn.addEventListener("click", gerarTabela);
  limparTabelaBtn.addEventListener("click", limparTudo);
  exportarTxtBtn.addEventListener("click", exportarParaTxt);

  // Event Delegation: escuta por mudanças na tabela inteira
  tabelaContainer.addEventListener("input", (event) => {
    if (event.target.classList.contains("nota-input")) {
      calcularTudo();
    }
  });

  // ... (todo o seu código existente vem antes)

  // SELECIONE O NOVO BOTÃO
  const gerarEspelhoBtn = document.getElementById("gerar-espelho");

  const abrirPaginaEspelho = () => {
    // Apenas abre a página. Os dados já estarão no localStorage.
    window.open("placar_final.html", "placarEspelho");
    // window.open("/assets/pages/resultKata.html", "placar_final");
    // Dê um nome à janela para evitar abrir múltiplas abas
  };

  gerarEspelhoBtn.addEventListener("click", abrirPaginaEspelho);

  // FUNÇÃO PARA PREPARAR E EXPORTAR DADOS PARA A PÁGINA ESPELHO
  const exportarParaPaginaEspelho = () => {
    const rows = tabelaContainer.querySelectorAll("tbody tr");
    // if (rows.length === 0) {
    //   alert("Não há dados para gerar a página espelho.");
    //   return;
    // }

    const categoria = categoriaInput.value || "Categoria Não Definida";
    const atletasParaExportar = [];

    rows.forEach((row) => {
      const nome = row.querySelector(".atleta-nome").value || "Atleta S/ Nome";
      const total =
        parseFloat(row.querySelector(".total-cell").textContent) || 0;
      const colocacao =
        parseInt(row.querySelector(".placement-cell").textContent) || 0;

      const notasInputs = row.querySelectorAll(".nota-input");
      const todasAsNotas = Array.from(notasInputs).map(
        (input) => parseFloat(input.value) || 0
      );

      // Lógica para encontrar apenas as notas válidas (excluindo a maior e a menor)
      let notasValidas = [];
      if (todasAsNotas.filter((n) => n > 0).length >= 3) {
        const sorted = [...todasAsNotas].sort((a, b) => a - b);
        const notaMin = sorted[0];
        const notaMax = sorted[sorted.length - 1];

        // Remove a primeira ocorrência da nota mínima e máxima
        const indexMin = todasAsNotas.indexOf(notaMin);
        const indexMax = todasAsNotas.lastIndexOf(notaMax);

        notasValidas = todasAsNotas.filter(
          (nota, index) => index !== indexMin && index !== indexMax
        );
      }

      if (colocacao > 0) {
        atletasParaExportar.push({
          nome,
          total,
          colocacao,
          notasValidas,
        });
      }
    });

    const dadosParaPaginaEspelho = {
      categoria,
      atletas: atletasParaExportar,
    };

    // Salva os dados no localStorage como uma string JSON
    localStorage.setItem(
      "dadosPlacarFinal",
      JSON.stringify(dadosParaPaginaEspelho)
    );

    // Abre a nova página em uma nova aba
    // window.open("assets/pages/resultKata.html", "placarEspelho");
    // window.open("placar_final.html", "_blank");
  };

  // ADICIONE O EVENT LISTENER PARA O NOVO BOTÃO
  gerarEspelhoBtn.addEventListener("click", exportarParaPaginaEspelho);

  // ... (o final do seu script, se houver mais alguma coisa)

  // NOVA FUNÇÃO: Prepara e salva os dados no localStorage para a página espelho
  const atualizarDadosEspelho = () => {
    const rows = tabelaContainer.querySelectorAll("tbody tr");
    //  if (rows.length === 0) return; // Não faz nada se não houver linhas

    const categoria = categoriaInput.value || "Categoria Não Definida";
    const atletasParaExportar = [];

    rows.forEach((row) => {
      const nome = row.querySelector(".atleta-nome").value || "Atleta S/ Nome";
      const total =
        parseFloat(row.querySelector(".total-cell").textContent) || 0;
      const colocacao =
        parseInt(row.querySelector(".placement-cell").textContent) || 0;

      const notasInputs = row.querySelectorAll(".nota-input");
      const todasAsNotas = Array.from(notasInputs).map(
        (input) => parseFloat(input.value) || 0
      );

      let notasValidas = [];
      if (todasAsNotas.filter((n) => n > 0).length >= 3) {
        const sorted = [...todasAsNotas].sort((a, b) => a - b);
        notasValidas = sorted.slice(1, -1); // Pega as 3 notas do meio
      }

      if (colocacao > 0) {
        atletasParaExportar.push({
          nome,
          total,
          colocacao,
          notasValidas,
        });
      }
    });

    const dadosParaPaginaEspelho = {
      categoria,
      atletas: atletasParaExportar,
      timestamp: new Date().getTime(), // Adiciona um timestamp para garantir que o evento 'storage' dispare
    };

    localStorage.setItem(
      "dadosPlacarFinal",
      JSON.stringify(dadosParaPaginaEspelho)
    );
  };
});
