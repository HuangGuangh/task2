class MtgService {
    constructor(baseUrl = "https://api.magicthegathering.io/v1") {
        this.baseUrl = baseUrl;
    }

    loadCards() {
        return fetch(this.baseUrl + "/cards")
            .then(response => response.json())
            .then(json => json.cards);
    }

    loadCard(id) {
        return fetch(`${this.baseUrl}/cards/${id}`)
            .then(response => response.json())
            .then(json => json.card);
    }
}

export { MtgService };