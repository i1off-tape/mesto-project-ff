// @todo: Функция создания карточки c API

import { config, deleteCardById, changeLikeCardStatus } from "./api.js";

function createCard(
  cardData,
  currentUserId,
  deleteCard,
  handleLikeClick,
  handleImageClick
) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardName = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardLikeCount = cardElement.querySelector(".card__like-count");

  cardName.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name; // Дублируем название в alt
  cardLikeCount.textContent = cardData.likes.length;

  if (cardData.owner._id !== currentUserId) {
    cardDeleteButton.remove(); // Удаляем кнопку удаления, если карточка не принадлежит текущему пользователю
  }

  if (cardData.likes.some((like) => like._id === currentUserId)) {
    cardLikeButton.classList.add("card__like-button_is-active"); // Активируем лайк, если текущий пользователь уже лайкнул карточку
  }
  cardDeleteButton.addEventListener("click", () => {
    deleteCard(cardElement, cardData._id);
  });

  cardLikeButton.addEventListener("click", () => {
    handleLikeClick(cardData, cardLikeButton, cardLikeCount);
  });

  cardImage.addEventListener("click", () => {
    handleImageClick(cardData.name, cardData.link);
  });

  return cardElement;
}

// @todo: Функция удаления карточки c API

function deleteCard(cardElement, cardId) {
  deleteCardById(cardId)
    .then(() => {
      cardElement.remove();
      console.log("Карточка успешно удалена");
    })
    .catch((error) => {
      console.error("Ошибка при удалении карточки:", error);
    });
}

// @todo: Функция обработки клика по лайку с API

function handleLikeClick(cardData, likeButton, likeCountElement) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  changeLikeCardStatus(cardData._id, isLiked)
    .then((data) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likeCountElement.textContent = data.likes.length;
    })
    .catch((error) => {
      console.error("Ошибка при обработке лайка:", error);
    });
}

export { createCard, deleteCard, handleLikeClick };
