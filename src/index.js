// @todo: Импорты

import "./pages/index.css"; // добавьте импорт главного файла стилей
import {
  initialCards,
  createCard,
  deleteCard,
  handleLikeClick,
} from "./scripts/cards.js"; // импортируем массив с карточками
import { openModal, closeModal, handleOverlayClick } from "./scripts/modal.js"; // импортируем функции открытия и закрытия попапов

// @todo: Dom-элементы попапов, список карточек, формы

const popupEdit = document.querySelector(".popup_type_edit");
const popupAddCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");
const popupImageContent = popupImage.querySelector(".popup__image");
const popupImageTitle = popupImage.querySelector(".popup__caption");

const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");

const formElement = document.forms["edit-profile"];
const jobInput = formElement.elements["description"];
const nameInput = formElement.elements["name"];

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const addCardForm = document.forms["new-place"];
const cardNameInput = addCardForm.elements["place-name"];
const cardLinkInput = addCardForm.elements["link"];

const cardAllList = document.querySelector(".places__list");

// @todo: открытие и закрытие попапов

addButton.addEventListener("click", () => {
  openModal(popupAddCard);
});

editButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  openModal(popupEdit);
});

// @todo: функции формы, лайка и вызовы

function handleProfileFormSubmit(event) {
  event.preventDefault(); // предотвращаем перезагрузку страницы

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(popupEdit);
}

function handleAddCardSubmit(event) {
  event.preventDefault(); // предотвращаем перезагрузку страницы

  const cardElement = createCard(
    cardNameInput.value,
    cardLinkInput.value,
    deleteCard,
    handleLikeClick,
    handleImageClick
  );
  cardAllList.prepend(cardElement); // добавляем новую карточку в начало списка

  closeModal(popupAddCard);

  // Очищаем поля ввода после добавления карточки
  addCardForm.reset();
}

function handleImageClick(name, link) {
  popupImageContent.src = link;
  popupImageContent.alt = name; // устанавливаем alt для изображения
  popupImageTitle.textContent = name;
  openModal(popupImage);
}

formElement.addEventListener("submit", handleProfileFormSubmit);
addCardForm.addEventListener("submit", handleAddCardSubmit);

// Закртие попапов по клику на оверлей и кнопки закрытия

document.querySelectorAll(".popup").forEach((popup) => {
  const closeBtn = popup.querySelector(".popup__close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeModal(popup);
    });
  }

  popup.addEventListener("mousedown", handleOverlayClick);
});

// @todo: Вывести карточки из массива на страницу

initialCards.forEach((item) => {
  const cardElement = createCard(
    item.name,
    item.link,
    deleteCard,
    handleLikeClick,
    handleImageClick
  );
  cardAllList.append(cardElement);
});
