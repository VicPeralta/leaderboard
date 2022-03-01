import DataProvider from './dataProvider.js';

class App {
  scoreList = [];

  constructor() {
    this.dataProvider = new DataProvider();
  }

  async getDataFromFile() {
    this.scoreList = await this.dataProvider.getScores();
  }

  async updateData() {
    const message = document.getElementById('message');
    message.textContent = 'Updating data...';
    message.classList.remove('hidden');
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

  async addScore(user, score) {
    const message = document.getElementById('message');
    message.textContent = 'Sending score...';
    message.classList.remove('hidden');
    const result = await this.dataProvider.putScore(user, score);
    if (result) {
      message.classList.add('hidden');
      this.scoreList.push({ user, score: Number(score) });
      this.updateList();
    } else {
      message.textContent = 'Unable to update the score';
      setTimeout(() => {
        document.getElementById('message').classList.add('hidden');
      }, 1000);
    }
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
    document.getElementById('refresh').addEventListener('click', () => {
      this.updateData();
    });
  }
}

export default App;