document.addEventListener("DOMContentLoaded", () => {
  // --- SELEÇÃO DE ELEMENTOS DO DOM ---
  const elements = {
    areaNumber: document.getElementById("area-number"),
    nomeBlue: document.getElementById("nomeAtl-blue"),
    nomeRed: document.getElementById("nomeAtl-red"),
    liveClock: document.getElementById("live-clock"),
    mainTimer: document.getElementById("main-timer"),
    startStopBtn: document.getElementById("start-stop-btn"),
    resetTimerBtn: document.getElementById("reset-timer-btn"),
    resetScoreboardBtn: document.getElementById("reset-scoreboard-btn"),
    fightTimeInput: document.getElementById("fight-time"),
    scoreButtons: document.querySelectorAll(".btn-plus, .btn-minus"),
    shiro: {
      ippon: document.getElementById("shiro-ippon"),
      wazaari: document.getElementById("shiro-wazaari"),
      points: document.getElementById("shiro-points"),
      penalties: {
        hansoku: [
          document.getElementById("phblue1"),
          document.getElementById("phblue2"),
          document.getElementById("phblue3"),
        ],
        jogai: [
          document.getElementById("joblue1"),
          document.getElementById("joblue2"),
          document.getElementById("joblue3"),
        ],
        mubobi: [
          document.getElementById("mublue1"),
          document.getElementById("mublue2"),
          document.getElementById("mublue3"),
        ],
      },
    },
    aka: {
      ippon: document.getElementById("aka-ippon"),
      wazaari: document.getElementById("aka-wazaari"),
      points: document.getElementById("aka-points"),
      penalties: {
        hansoku: [
          document.getElementById("phred1"),
          document.getElementById("phred2"),
          document.getElementById("phred3"),
        ],
        jogai: [
          document.getElementById("jored1"),
          document.getElementById("jored2"),
          document.getElementById("jored3"),
        ],
        mubobi: [
          document.getElementById("mured1"),
          document.getElementById("mured2"),
          document.getElementById("mured3"),
        ],
      },
    },
    allPenaltyCheckboxes: document.querySelectorAll(
      '.penalties input[type="checkbox"]'
    ),
    kumiteEspelhoBtn: document.getElementById("gerar-kumite"),
  };

  // --- VARIÁVEIS DE ESTADO ---
  let timerInterval = null;
  let timeRemaining = parseTimeToSeconds(elements.fightTimeInput.value);

  // --- FUNÇÕES ---

  // Função central para reunir todos os dados e enviá-los ao localStorage
  function updateAndBroadcastState() {
    const state = {
      area: elements.areaNumber.value,
      timer: elements.mainTimer.textContent,
      aka: {
        nome: elements.nomeRed.value || "Atleta 2",
        pontos: elements.aka.points.textContent,
        penalties: {
          hansoku: [
            elements.aka.penalties.hansoku[0].checked,
            elements.aka.penalties.hansoku[1].checked,
            elements.aka.penalties.hansoku[2].checked,
          ],
          jogai: [
            elements.aka.penalties.jogai[0].checked,
            elements.aka.penalties.jogai[1].checked,
            elements.aka.penalties.jogai[2].checked,
          ],
          mubobi: [
            elements.aka.penalties.mubobi[0].checked,
            elements.aka.penalties.mubobi[1].checked,
            elements.aka.penalties.mubobi[2].checked,
          ],
        },
      },
      shiro: {
        nome: elements.nomeBlue.value || "Atleta 1",
        pontos: elements.shiro.points.textContent,
        penalties: {
          hansoku: [
            elements.shiro.penalties.hansoku[0].checked,
            elements.shiro.penalties.hansoku[1].checked,
            elements.shiro.penalties.hansoku[2].checked,
          ],
          jogai: [
            elements.shiro.penalties.jogai[0].checked,
            elements.shiro.penalties.jogai[1].checked,
            elements.shiro.penalties.jogai[2].checked,
          ],
          mubobi: [
            elements.shiro.penalties.mubobi[0].checked,
            elements.shiro.penalties.mubobi[1].checked,
            elements.shiro.penalties.mubobi[2].checked,
          ],
        },
      },
    };
    // Usamos JSON.stringify para converter o objeto em uma string
    localStorage.setItem("karatePlacarState", JSON.stringify(state));
  }

  function parseTimeToSeconds(timeStr) {
    if (!timeStr.includes(":")) return parseInt(timeStr, 10) || 0;
    const [minutes, seconds] = timeStr.split(":").map(Number);
    return minutes * 60 + seconds;
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  function updateLiveClock() {
    elements.liveClock.textContent = new Date().toLocaleTimeString("pt-BR");
  }

  function updateTimerDisplay() {
    elements.mainTimer.textContent = formatTime(timeRemaining);
    updateAndBroadcastState(); // Envia o tempo atualizado
  }

  function handleTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      elements.startStopBtn.textContent = "INICIAR";
      elements.startStopBtn.classList.remove("running");
    } else {
      elements.startStopBtn.textContent = "PAUSAR";
      elements.startStopBtn.classList.add("running");
      timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
          timeRemaining--;
          elements.mainTimer.style.display = "flex";
          elements.fightTimeInput.style.display = "none";
          updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          timerInterval = null;
          elements.startStopBtn.textContent = "INICIAR";
          elements.startStopBtn.classList.remove("running");
        }
      }, 1000);
    }
  }

  function calculateTotalPoints(competitor) {
    const ipponCount = parseInt(elements[competitor].ippon.textContent, 10);
    const wazaariCount = parseInt(elements[competitor].wazaari.textContent, 10);
    // Pontuação WKF: Ippon = 3 pontos, Waza-ari = 2 pontos, Yuko = 1 ponto.
    // Ajustando para o seu placar que só tem Ippon e Waza-ari:
    // Vou assumir a pontuação mais comum: Ippon = 3, Waza-ari = 2. Ajuste se necessário.
    const totalPoints = ipponCount * 2 + wazaariCount * 1;
    elements[competitor].points.textContent = totalPoints;
    updateAndBroadcastState(); // Envia os pontos atualizados
  }

  function handleScoreChange(event) {
    const targetId = event.target.dataset.target;
    const [competitor, type] = targetId.split("-");
    const scoreElement = elements[competitor][type];
    let currentValue = parseInt(scoreElement.textContent, 10);

    if (event.target.classList.contains("btn-plus")) {
      currentValue++;
    } else if (
      event.target.classList.contains("btn-minus") &&
      currentValue > 0
    ) {
      currentValue--;
    }
    scoreElement.textContent = currentValue;
    calculateTotalPoints(competitor);
  }

  function resetTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      elements.startStopBtn.textContent = "INICIAR";
      elements.startStopBtn.classList.remove("running");
    }
    timeRemaining = parseTimeToSeconds(elements.fightTimeInput.value);
    elements.mainTimer.style.display = "none";
    elements.fightTimeInput.style.display = "flex";
    updateTimerDisplay();
  }

  function resetScoreboard() {
    ["shiro", "aka"].forEach((c) => {
      elements[c].ippon.textContent = "0";
      elements[c].wazaari.textContent = "0";
      calculateTotalPoints(c);
    });
    elements.nomeBlue.value = "";
    elements.nomeRed.value = "";
    elements.allPenaltyCheckboxes.forEach((cb) => (cb.checked = false));
    resetTimer();
    updateAndBroadcastState(); // Envia o estado zerado
  }

  const abrirKumiteEspelho = () => {
    window.open("placar_fight.html", "placarEspelhoKumite");
  };

  // --- EVENT LISTENERS ---
  elements.startStopBtn.addEventListener("click", handleTimer);
  elements.resetTimerBtn.addEventListener("click", resetTimer);
  elements.resetScoreboardBtn.addEventListener("click", resetScoreboard);
  elements.scoreButtons.forEach((button) =>
    button.addEventListener("click", handleScoreChange)
  );
  elements.fightTimeInput.addEventListener("change", resetTimer);
  elements.kumiteEspelhoBtn.addEventListener("click", abrirKumiteEspelho);

  // Novos Listeners para atualização em tempo real
  elements.nomeRed.addEventListener("input", updateAndBroadcastState);
  elements.nomeBlue.addEventListener("input", updateAndBroadcastState);
  elements.areaNumber.addEventListener("input", updateAndBroadcastState);
  elements.allPenaltyCheckboxes.forEach((cb) => {
    cb.addEventListener("change", updateAndBroadcastState);
  });

  // --- INICIALIZAÇÃO ---
  setInterval(updateLiveClock, 1000);
  updateLiveClock();
  updateTimerDisplay();
  calculateTotalPoints("shiro");
  calculateTotalPoints("aka");
  updateAndBroadcastState(); // Envia o estado inicial ao carregar a página
});
