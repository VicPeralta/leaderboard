class DataProvider {
  initialGameKey = 'BEfD6yAIbHxFQG2vuO7V';

  baseURL = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/';

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
}
export default DataProvider;