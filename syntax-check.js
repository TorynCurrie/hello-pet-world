// This file is used to check the JavaScript syntax of the embedded script in index.html
// Extracted script for syntax validation

"use strict";

const pets = [
  { id: "biscuit", name: "Biscuit", type: "dog", breed: "Corgi", age: "3 years", personality: "Sunny, loyal, and a little bit wiggly", activity: "Chasing bubbles in the garden", emoji: "🐶", color: "bg-peach" },
  { id: "milo", name: "Milo", type: "dog", breed: "Beagle", age: "5 years", personality: "Curious, gentle, and an excellent listener", activity: "Sniffing out hidden treats", emoji: "🐕", color: "bg-blue" },
  { id: "pepper", name: "Pepper", type: "dog", breed: "Dalmatian", age: "2 years", personality: "Playful, brave, and full of bounce", activity: "A game of fetch at the park", emoji: "🐩", color: "bg-lilac" },
  { id: "pudding", name: "Pudding", type: "cat", breed: "Calico", age: "4 years", personality: "Sweet, clever, and quietly adventurous", activity: "Watching birds from a sunny window", emoji: "🐈", color: "bg-yellow" },
  { id: "tofu", name: "Tofu", type: "cat", breed: "Maine Coon", age: "6 years", personality: "Fluffy, thoughtful, and wonderfully patient", activity: "Napping in a warm laundry basket", emoji: "🐈‍⬛", color: "bg-mint" },
  { id: "sprout", name: "Sprout", type: "cat", breed: "Tabby", age: "1 year", personality: "Bouncy, chatty, and always up for a game", activity: "Pouncing on a feather toy", emoji: "😺", color: "bg-pink" }
];

const favorites = new Set();
let activeFilter = "all";
let selectedPetId = null;

const petGrid = document.getElementById("pet-grid");
const favoriteTotal = document.getElementById("favorite-total");
const petTotal = document.getElementById("pet-total");
const emptyState = document.getElementById("empty-state");
const petDialog = document.getElementById("pet-dialog");

function renderPets() {
  const visiblePets = pets.filter((pet) => activeFilter === "all" || pet.type === activeFilter);
  petGrid.replaceChildren();

  visiblePets.forEach((pet) => {
    const card = document.createElement("article");
    card.className = "pet-card";

    const openButton = document.createElement("button");
    openButton.className = "pet-open";
    openButton.type = "button";
    openButton.setAttribute("aria-label", `Meet ${pet.name}, ${pet.type} ${pet.breed}`);

    const portrait = document.createElement("span");
    portrait.className = `pet-portrait ${pet.color}`;
    portrait.setAttribute("aria-hidden", "true");
    portrait.textContent = pet.emoji;

    const info = document.createElement("span");
    info.className = "pet-info";

    const meta = document.createElement("span");
    meta.className = "pet-meta";
    const name = document.createElement("span");
    name.className = "pet-name";
    name.textContent = pet.name;
    const type = document.createElement("span");
    type.className = `pet-type${pet.type === "cat" ? " cat" : ""}`;
    type.textContent = pet.type;
    meta.append(name, type);

    const breed = document.createElement("span");
    breed.className = "pet-breed";
    breed.textContent = pet.breed;
    info.append(meta, breed);
    openButton.append(portrait, info);
    openButton.addEventListener("click", () => openPetDetails(pet));

    const favoriteButton = document.createElement("button");
    favoriteButton.className = "favorite-button";
    favoriteButton.type = "button";
    favoriteButton.setAttribute("aria-label", `${favorites.has(pet.id) ? "Remove" : "Add"} ${pet.name} ${favorites.has(pet.id) ? "from" : "to"} favourites`);
    favoriteButton.setAttribute("aria-pressed", String(favorites.has(pet.id)));
    favoriteButton.textContent = favorites.has(pet.id) ? "♥" : "♡";
    favoriteButton.addEventListener("click", () => toggleFavorite(pet.id));

    card.append(openButton, favoriteButton);
    petGrid.append(card);
  });

  petTotal.textContent = `${visiblePets.length} ${visiblePets.length === 1 ? "friendly face" : "friendly faces"}`;
  emptyState.style.display = visiblePets.length ? "none" : "block";
}

function toggleFavorite(petId) {
  if (favorites.has(petId)) favorites.delete(petId);
  else favorites.add(petId);
  favoriteTotal.textContent = String(favorites.size);
  renderPets();

  if (selectedPetId === petId && petDialog.open) updateDialogFavoriteButton();
}

function openPetDetails(pet) {
  selectedPetId = pet.id;
  document.getElementById("dialog-portrait").className = `pet-portrait dialog-portrait ${pet.color}`;
  document.getElementById("dialog-portrait").textContent = pet.emoji;
  document.getElementById("dialog-type").textContent = `A lovely ${pet.type}`;
  document.getElementById("dialog-name").textContent = pet.name;
  document.getElementById("dialog-breed").textContent = pet.breed;
  document.getElementById("dialog-age").textContent = pet.age;
  document.getElementById("dialog-personality").textContent = pet.personality;
  document.getElementById("dialog-activity").textContent = pet.activity;
  updateDialogFavoriteButton();
  petDialog.showModal();
}

function updateDialogFavoriteButton() {
  const isFavorite = favorites.has(selectedPetId);
  const button = document.getElementById("dialog-favorite");
  button.textContent = isFavorite ? "Remove from favourites" : "Add to favourites";
  button.setAttribute("aria-pressed", String(isFavorite));
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((filterButton) => {
      filterButton.setAttribute("aria-pressed", String(filterButton === button));
    });
    renderPets();
  });
});

document.getElementById("dialog-close").addEventListener("click", () => petDialog.close());
document.getElementById("dialog-favorite").addEventListener("click", () => toggleFavorite(selectedPetId));
petDialog.addEventListener("click", (event) => {
  if (event.target === petDialog) petDialog.close();
});

document.getElementById("recommend-button").addEventListener("click", () => {
  const pet = pets[Math.floor(Math.random() * pets.length)];
  const result = document.getElementById("recommendation-result");
  result.replaceChildren();
  const label = document.createElement("span");
  label.textContent = `${pet.emoji} Today's pick:`;
  const link = document.createElement("button");
  link.type = "button";
  link.textContent = pet.name;
  link.setAttribute("aria-label", `View ${pet.name}'s details`);
  link.addEventListener("click", () => openPetDetails(pet));
  result.append(label, link);
  result.classList.add("is-visible");
});

renderPets();
