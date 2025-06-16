document.addEventListener("DOMContentLoaded", () => {
  // --- SELEÇÃO DE ELEMENTOS DO DOM ---
  const elements = {
    liveClock: document.getElementById("live-clock"),
    pnlKumite: document.getElementById("pnl-kumite"),
    pnlKata: document.getElementById("pnl-kata"),
    btnKumite: document.getElementById("button-kumite"),
    btnKata: document.getElementById("button-kata"),
    btnexternokata: document.getElementById("gerar-espelho"),
    btnexternokumite: document.getElementById("gerar-kumite"),
  };

  function updateLiveClock() {
    elements.liveClock.textContent = new Date().toLocaleTimeString("pt-BR");
  }

  // --- 3. FUNÇÃO REUTILIZÁVEL PARA TROCAR DE PAINEL ---
  function switchPanel(panelToShow) {
    // Primeiro, esconde todos os painéis
    elements.pnlKumite.style.display = "none";
    elements.pnlKata.style.display = "none";

    elements.btnexternokata.style.display = "none";
    elements.btnexternokumite.style.display = "none";

    // Remove a classe 'active' de ambos os botões
    elements.btnKumite.classList.remove("active");
    elements.btnKata.classList.remove("active");
    elements.btnexternokata.classList.remove("active");
    elements.btnexternokumite.classList.remove("active");

    // Agora, mostra o painel e ativa o botão correto
    if (panelToShow === "kumite") {
      elements.pnlKumite.style.display = "flex"; // Usando 'flex' conforme o seu código
      elements.btnKumite.classList.add("active");

      elements.btnexternokata.style.display = "none";
      elements.btnexternokumite.style.display = "flex";
      elements.btnexternokumite.classList.add("active");
    } else if (panelToShow === "kata") {
      elements.pnlKata.style.display = "flex";
      elements.btnKata.classList.add("active");

      elements.btnexternokata.style.display = "flex";
      elements.btnexternokata.classList.add("active");
      elements.btnexternokumite.style.display = "none";
    }
  }

  // --- 4. ADICIONA OS EVENTOS DE CLIQUE AOS BOTÕES ---
  elements.btnKumite.addEventListener("click", () => {
    switchPanel("kumite"); // Chama a função para mostrar o painel Kumite
  });

  elements.btnKata.addEventListener("click", () => {
    switchPanel("kata"); // Chama a função para mostrar o painel Kata
  });

  // --- INICIALIZAÇÃO ---
  setInterval(updateLiveClock, 1000);
  updateLiveClock(); // Chamada inicial

  // Define o estado inicial: Kumite visível ao carregar a página
  switchPanel("");
});
