// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || `HTTP error! status: ${response.status}`;
        throw new Error(message);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Users endpoints
  async getUsers() {
    return this.request('/users');
  }

  async getUserById(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }
  // Auth endpoints
async register(userData) {
  return this.request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

async login(credentials) {
  return this.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

async getCurrentUser(token) {
  return this.request('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Favorites endpoints
async getUserFavorites(userId, token) {
  return this.request(`/users/${userId}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async addFavoriteTeam(userId, teamId, token) {
  return this.request(`/users/${userId}/favorites`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ team_id: teamId }),
  });
}

async removeFavoriteTeam(userId, teamId, token) {
  return this.request(`/users/${userId}/favorites/${teamId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


// Obtener favoritos del usuario logueado
async getUserFavoritePlayers(token) {
  return this.request(`/favorite-players`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Agregar jugador favorito
async addFavoritePlayer(playerId, token) {
  return this.request(`/favorite-players`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId }),
  });
}

// Eliminar favorito por ID
async removeFavoritePlayer(favoriteId, token) {
  return this.request(`/favorite-players/${favoriteId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}





  // Teams endpoints
  async getTeams() {
    return this.request('/teams');
  }

  async getTeamById(id) {
    return this.request(`/teams/${id}`);
  }

  // Players endpoints
  async getPlayers() {
    return this.request('/players');
  }

  async getPlayerById(id) {
    return this.request(`/players/${id}`);
  }

  // Matches endpoints
  async getMatches() {
    return this.request('/matches');
  }

  async getMatchById(id) {
    return this.request(`/matches/${id}`);
  }

  // Competitions endpoints
  async getCompetitions() {
    return this.request('/competitions');
  }

  async getCompetitionById(id) {
    return this.request(`/competitions/${id}`);
  }

  async getCompetitionStandings(id) {
    return this.request(`/competitions/${id}/standings`);
  }

  async getTopScorers(id, season, limit = 10) {
    const params = new URLSearchParams();
    if (season) params.append('season', season);
    if (limit) params.append('limit', limit);
    return this.request(`/competitions/${id}/scorers?${params.toString()}`);
  }

  async getCompetitionMatches(id, jornada, page = 1, limit = 20) {
    const params = new URLSearchParams();
    if (jornada) params.append('jornada', jornada);
    params.append('page', page);
    params.append('limit', limit);
    return this.request(`/competitions/${id}/matches?${params.toString()}`);
  }

  // Match events endpoints
  async getMatchEvents() {
    return this.request('/match-events');
  }

  async getMatchEventById(id) {
    return this.request(`/match-events/${id}`);
  }

  // Articles endpoints
  async getArticles() {
    return this.request('/articles');
  }

  async getArticleById(id) {
    return this.request(`/articles/${id}`);
  }

  async createArticle(articleData) {
    return this.request('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async updateArticle(id, articleData) {
    return this.request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  }

  async deleteArticle(id) {
    return this.request(`/articles/${id}`, {
      method: 'DELETE',
    });
  }



}
  

export default new ApiService();