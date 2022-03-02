class DataProvider {
  baseURL = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/';

  initialGameKey = 'BEfD6yAIbHxFQG2vuO7V';

  constructor() {
    const key = window.localStorage.getItem('GameKey');
    if (key) this.initialGameKey = key;
  }

  /*
    This function return a promise
  */
  async getScores() {
    const socket = new XMLHttpRequest();
    socket.open('GET', `${this.baseURL}${this.initialGameKey}/scores`, false);
    socket.setRequestHeader('Credentials', 'omit');
    socket.setRequestHeader('Acept', 'application/json');
    socket.setRequestHeader('Content-Type', 'text/plain');
    socket.send();
    if (socket.status === 200) return JSON.parse(socket.response).result;
    return [];
  }

  getNewGameKey() {
    const socket = new XMLHttpRequest();
    socket.open('POST', `${this.baseURL}`, false);
    socket.setRequestHeader('Credentials', 'omit');
    socket.setRequestHeader('Acept', 'application/json');
    socket.setRequestHeader('Content-Type', 'application/json');
    socket.send(`{ 
      "name": "Victor's Game" 
    }`);
    if (socket.status === 201) {
      const response = JSON.parse(socket.response).result;
      this.initialGameKey = response.substr(14, 20);
      window.localStorage.setItem('GameKey', this.initialGameKey);
      return this.initialGameKey;
    }
    return '';
  }

  async putScore(user, score) {
    const socket = new XMLHttpRequest();
    socket.open('POST', `${this.baseURL}${this.initialGameKey}/scores`, false);
    socket.setRequestHeader('Credentials', 'omit');
    socket.setRequestHeader('Acept', 'application/json');
    socket.setRequestHeader('Content-Type', 'application/json');
    const body = `{"user":"${user}", "score":${Number(score)}}`;
    socket.send(body);
    if (socket.status === 201) {
      const response = JSON.parse(socket.response).result;
      if (response === 'Leaderboard score created correctly.') return true;
      return false;
    }
    return false;
  }

  async putScoreFetch(user, score) {
    const response = await fetch(`${this.baseURL}${this.initialGameKey}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        score: Number(score),
      }),
    });
    const final = response.json();
    return final;
  }
}
export default DataProvider;