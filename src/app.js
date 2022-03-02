import DataProvider from './dataProvider.js';
import First from './assets/first.png';
import Second from './assets/second.png';
import Third from './assets/third.png';
import NoPlace from './assets/noplace.png';

class App {
  scoreList = [];

  constructor() {
    this.dataProvider = new DataProvider();
  }

  async getDataFromProvider() {
    this.scoreList = await this.dataProvider.getScores();
  }

  async updateData() {
    const message = document.getElementById('message');
    message.textContent = 'Updating data...';
    message.classList.remove('hidden');
    this.getDataFromProvider().then(() => {
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
    let position = 1;
    let lastScore = 0;
    let index = 0;
    this.scoreList.forEach((task) => {
      let imageToUse = '';
      if (index === 0) position = 1;
      else if (lastScore > task.score) position += 1;
      if (position === 1) imageToUse = First;
      else if (position === 2) imageToUse = Second;
      else if (position === 3) imageToUse = Third;
      else imageToUse = NoPlace;
      taskListHtml += `
      <div class="score-card flex round-border-light align-center">
              <img src=${imageToUse} alt="" width="50" height="50" />
              <div>
                <p>${task.user}</p>
                <p>Points: ${task.score}</p>
              </div>
      </div>`;
      lastScore = task.score;
      index += 1;
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
    document.getElementById('reset').addEventListener('click', () => {
      const message = document.getElementById('message');
      message.textContent = 'Reseting scores...';
      message.classList.remove('hidden');
      const newKey = this.dataProvider.getNewGameKey();
      if (newKey === '') {
        message.textContent = 'Unable to reset the scores';
        setTimeout(() => {
          document.getElementById('message').classList.add('hidden');
        }, 1000);
      } else {
        message.classList.add('hidden');
        this.dataProvider.getScores();
        this.updateData();
      }
    });
  }
}

export default App;