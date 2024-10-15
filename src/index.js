import * as d3 from "d3";
import { MtgService } from "./mtgservice";
import { ManaCost } from "./widgets/manaCost";
import { ManaColor } from "./widgets/manaColor";

document.addEventListener("DOMContentLoaded", setup);

const selectedCards = []; // Store selected cards
let allCards = []; // Store all cards

function setup() {
    const mtg = new MtgService();
    mtg.loadCards().then(cards => {
        allCards = cards; // Store all cards
        populateCardList(cards);
    });
}

function populateCardList(cards) {
    const cardListContainer = document.getElementById("cardListContainer");
    cardListContainer.innerHTML = "";
    const list = document.createElement("ul");

    cards.forEach(card => {
        const listItem = document.createElement("li");
        listItem.innerHTML = card.name;

        // Add click event to display card details
        listItem.addEventListener("click", () => {
            showCardDetails(card);
        });

        // Check if the card has been selected, if so, do not add it again
        if (!selectedCards.includes(card)) {
            list.appendChild(listItem);
        }
    });

    cardListContainer.appendChild(list);
    updateManaStats(); // Update spell power statistics
}

function showCardDetails(card) {
    const cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = `
        <h2>${card.name}</h2>
        <img src="${card.imageUrl}" alt="${card.name}" style="width: 200px; height: auto;"/> 
        <p>${card.text}</p> 
        <button id="addCardButton">Add to deck</button>
    `;

    // Add button event to add cards to deck
    document.getElementById("addCardButton").addEventListener("click", () => {
        addCardToDeck(card);
    });
}

function addCardToDeck(card) {
    if (!selectedCards.includes(card)) { // Prevent duplicate addition of identical cards
        selectedCards.push(card); // Add cards to the selected card array
        updateDeckView();
        populateCardList(allCards); // Update card list
    }
}

function updateDeckView() {
    const deckContainer = document.querySelector(".deckContainer");
    deckContainer.innerHTML = "<h3>deck</h3>";

    selectedCards.forEach((card, index) => {
        const cardItem = document.createElement("div");
        cardItem.innerHTML = `
            ${card.name} <button class="removeCardButton" data-index="${index}">remove</button>
        `;
        deckContainer.appendChild(cardItem);
    });

    // Add click events for each removal button
    document.querySelectorAll(".removeCardButton").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            removeCardFromDeck(index);
        });
    });

    updateManaStats(); // Update spell power and color statistics
}

function removeCardFromDeck(index) {
    const cardToRemove = selectedCards[index];
    selectedCards.splice(index, 1); // Remove cards from the selected card array
    updateDeckView();
    populateCardList(allCards); // Update the card list and display it again
}

function updateManaStats() {
    const manaCost = new ManaCost();
    const manaCostContainer = document.getElementById("manaCostWidgetContainer");
    const manaCostData = getManaCostData();
    manaCost.build(manaCostData, manaCostContainer);

    const manaColor = new ManaColor();
    const manaColorContainer = document.getElementById("manaColorWidgetContainer");
    const manaColorData = getManaColorData();
    manaColor.build(manaColorData, manaColorContainer);
}

function getManaCostData() {
    const manaCostCount = {};

    selectedCards.forEach(card => {
        const cost = card.manaCost || 0;
        manaCostCount[cost] = (manaCostCount[cost] || 0) + 1;
    });

    return Object.keys(manaCostCount).map(cost => ({
        cost: cost,
        count: manaCostCount[cost]
    }));
}

function getManaColorData() {
    const manaColorCount = {};

    selectedCards.forEach(card => {
        const colorCodes = card.colors || ["C"];

        colorCodes.forEach(code => {
            const colors = code.split("");
            colors.forEach(color => {
                manaColorCount[color] = (manaColorCount[color] || 0) + 1;
            });
        });
    });

    if (Object.keys(manaColorCount).length === 0) {
        return [{ color: 'None', count: 1 }];
    }

    const colorMapping = {
        "W": "White",
        "U": "Blue",
        "B": "Black",
        "R": "Red",
        "G": "Green",
        "C": "Colorless"
    };

    return Object.keys(manaColorCount).map(code => ({
        color: colorMapping[code],
        count: manaColorCount[code]
    }));
}



