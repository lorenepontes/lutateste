document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os elementos da página de espelho
  const elements = {
    areaLuta: document.getElementById("areluta"),
    timer: document.getElementById("main-timer"),
    aka: {
      nome: document.getElementById("nome-espelhored"),
      pontos: document.getElementById("pontos-espelhored"),
      penalties: {
        hansoku: [
          document.querySelector(".ph1-red"),
          document.querySelector(".ph2-red"),
          document.querySelector(".ph3-red"),
        ],
        jogai: [
          document.querySelector(".pj1-red"),
          document.querySelector(".pj2-red"),
          document.querySelector(".pj3-red"),
        ],
        mubobi: [
          document.querySelector(".pm1-red"),
          document.querySelector(".pm2-red"),
          document.querySelector(".pm3-red"),
        ],
      },
    },
    shiro: {
      nome: document.getElementById("nome-espelhoblue"),
      pontos: document.getElementById("pontos-espelhoblue"),
      penalties: {
        hansoku: [
          document.querySelector(".ph1-blue"),
          document.querySelector(".ph2-blue"),
          document.querySelector(".ph3-blue"),
        ],
        jogai: [
          document.querySelector(".pj1-blue"),
          document.querySelector(".pj2-blue"),
          document.querySelector(".pj3-blue"),
        ],
        mubobi: [
          document.querySelector(".pm1-blue"),
          document.querySelector(".pm2-blue"),
          document.querySelector(".pm3-blue"),
        ],
      },
    },
  };

  // Função para atualizar a tela com base nos dados recebidos
  function updateDisplay(state) {
    if (!state) return;
    // Atualiza Área
    elements.areaLuta.textContent = state.area || "1";

    // Atualiza Timer
    elements.timer.textContent = state.timer || "0:00";

    // Atualiza dados do AKA (Vermelho)
    elements.aka.nome.textContent = state.aka.nome;
    elements.aka.pontos.textContent = state.aka.pontos;
    updatePenaltyIndicators(
      elements.aka.penalties.hansoku,
      state.aka.penalties.hansoku
    );
    updatePenaltyIndicators(
      elements.aka.penalties.jogai,
      state.aka.penalties.jogai
    );
    updatePenaltyIndicators(
      elements.aka.penalties.mubobi,
      state.aka.penalties.mubobi
    );

    // Atualiza dados do SHIRO (Azul)
    elements.shiro.nome.textContent = state.shiro.nome;
    elements.shiro.pontos.textContent = state.shiro.pontos;
    updatePenaltyIndicators(
      elements.shiro.penalties.hansoku,
      state.shiro.penalties.hansoku
    );
    updatePenaltyIndicators(
      elements.shiro.penalties.jogai,
      state.shiro.penalties.jogai
    );
    updatePenaltyIndicators(
      elements.shiro.penalties.mubobi,
      state.shiro.penalties.mubobi
    );
  }

  // Função auxiliar para mostrar/esconder os indicadores de penalidade
  function updatePenaltyIndicators(indicatorElements, statusArray) {
    statusArray.forEach((isChecked, index) => {
      if (isChecked) {
        indicatorElements[index].classList.add("active");
      } else {
        indicatorElements[index].classList.remove("active");
      }
    });
  }

  // Event Listener para quando outra aba/janela modificar o localStorage
  window.addEventListener("storage", (event) => {
    // Verifica se a chave modificada é a que nos interessa
    if (event.key === "karatePlacarState") {
      const newState = JSON.parse(event.newValue);
      updateDisplay(newState);
    }
  });

  // --- INICIALIZAÇÃO ---
  // Tenta carregar o estado atual assim que a página é aberta
  const initialState = localStorage.getItem("karatePlacarState");
  if (initialState) {
    updateDisplay(JSON.parse(initialState));
  }
});
