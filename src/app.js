class App {
  scoreList = [];

  async getDataFromFile() {
    this.scoreList = await fetch('../data.json').then((data) => data.json());
  }

  async updateData() {
    document.getElementById('message').classList.remove('hidden');
    this.getDataFromFile().then(() => {
      document.getElementById('message').classList.add('hidden');
      this.updateList();
    });
  }

  updateList() {
    const scoresContainer = document.getElementById('score-container');
    scoresContainer.innerHTML = '';
    let taskListHtml = '';
    if (this.scoreList.length > 0) {
      this.scoreList.sort((first, second) => {
        if (first.score < second.score) return 1;
        if (first.score > second.score) return -1;
        return 0;
      });
    }
    this.scoreList.forEach((task) => {
      taskListHtml += `
      <div class="score-row flex">
              <span class="user flex-1">${task.user}</span>
              <span class="score flex-1">${task.score}</span>
      </div>`;
    });
    scoresContainer.innerHTML = taskListHtml;
  }

  addScore(user, score) {
    this.scoreList.push({ user, score: Number(score) });
  }

  processInput() {
    const user = document.getElementById('user');
    const score = document.getElementById('score');
    if (!user.checkValidity()) {
      user.reportValidity();
      return;
    }
    if (!score.checkValidity()) {
      score.reportValidity();
      return;
    }
    this.addScore(user.value, score.value);
    this.updateList();
    user.value = '';
    score.value = '';
    user.focus();
  }

  addListeners() {
    document.getElementById('submit').addEventListener('click', () => {
      this.processInput();
    });
    document.getElementById('score').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.processInput();
    });
  }
}

export default App;