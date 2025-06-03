// @todo: Импорты

import "./pages/index.css"; // добавьте импорт главного файла стилей
import { createCard, deleteCard, handleLikeClick } from "./scripts/cards.js"; // импортируем массив с карточками
import { openModal, closeModal, handleOverlayClick } from "./scripts/modal.js"; // импортируем функции открытия и закрытия попапов
import { enableValidation, clearValidation } from "./scripts/validation.js"; // импортируем функцию валидации форм
import {
  getInitialCards,
  getUserInfo,
  setUserInfo,
  addNewCard,
  updateAvatar,
} from "./scripts/api.js"; // импортируем функции для работы с API

// @todo: Dom-элементы попапов, список карточек, формы

let currentUserId;

const popupEdit = document.querySelector(".popup_type_edit");
const popupAddCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");
const popupImageContent = popupImage.querySelector(".popup__image");
const popupImageTitle = popupImage.querySelector(".popup__caption");
const popupAvatar = document.querySelector(".popup_type_avatar");

const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const saveEditProfileButton = popupEdit.querySelector(".popup__button");
const saveAddCardButton = popupAddCard.querySelector(".popup__button");
const saveUpdateAvatarButton = popupAvatar.querySelector(".popup__button");

const formAvatar = document.forms["avatar-form"];
const formElement = document.forms["edit-profile"];
const jobInput = formElement.elements["description"];
const nameInput = formElement.elements["name"];

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const addCardForm = document.forms["new-place"];
const cardNameInput = addCardForm.elements["place-name"];
const cardLinkInput = addCardForm.elements["link"];

const cardAllList = document.querySelector(".places__list");

const configValidation = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// @todo: открытие и закрытие попапов

addButton.addEventListener("click", () => {
  clearValidation(addCardForm, configValidation); // очищаем ошибки валидации перед открытием попапа
  addCardForm.reset();
  openModal(popupAddCard);
});

editButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  clearValidation(formElement, configValidation); // очищаем ошибки валидации перед открытием попапа
  openModal(popupEdit);
});

profileAvatar.addEventListener("click", () => {
  clearValidation(formAvatar, configValidation); // очищаем ошибки валидации перед открытием попапа
  formAvatar.reset();
  openModal(popupAvatar); // открываем попап редактирования профиля по клику на аватар
});

// @todo: функции формы, лайка и вызовы

function renderLoading(isLoading, buttonElement, defaultText = "Сохранить") {
  buttonElement.textContent = isLoading ? "Сохранение..." : defaultText;
}

function handleProfileFormSubmit(event) {
  event.preventDefault(); // предотвращаем перезагрузку страницы

  const name = nameInput.value;
  const about = jobInput.value;

  renderLoading(true, saveEditProfileButton); // показываем индикатор загрузки

  setUserInfo(name, about)
    .then((updatedUser) => {
      profileTitle.textContent = updatedUser.name; // обновляем имя пользователя
      profileDescription.textContent = updatedUser.about; // обновляем описание пользователя
      closeModal(popupEdit); // закрываем попап редактирования профиля
    })
    .catch((error) => {
      console.error("Ошибка при обновлении профиля:", error);
    })
    .finally(() => {
      renderLoading(false, saveEditProfileButton); // скрываем индикатор загрузки
    });
}

function handleAddCardSubmit(event) {
  event.preventDefault(); // предотвращаем перезагрузку страницы

  const name = cardNameInput.value;
  const link = cardLinkInput.value;

  renderLoading(true, saveAddCardButton);

  addNewCard(name, link)
    .then((newCard) => {
      console.log("Новая карточка с сервера:", newCard);

      const cardElement = createCard(
        newCard,
        currentUserId,
        deleteCard,
        handleLikeClick,
        handleImageClick
      );
      cardAllList.prepend(cardElement); // добавляем новую карточку в начало списка
      addCardForm.reset();
      closeModal(popupAddCard); // закрываем попап добавления карточки
    })
    .catch((error) => {
      console.error("Ошибка при добавлении карточки:", error);
    })
    .finally(() => {
      renderLoading(false, saveAddCardButton); // скрываем индикатор загрузки
    });
}

function handleUpdateAvatar(event) {
  event.preventDefault(); // предотвращаем перезагрузку страницы

  const avatarLink = formAvatar.elements["avatar"].value;

  renderLoading(true, saveUpdateAvatarButton);

  updateAvatar(avatarLink)
    .then((updatedUser) => {
      console.log("Новый аватар пользователя:", updatedUser.avatar);
      profileAvatar.style.backgroundImage = `url(${updatedUser.avatar})`;
      formAvatar.reset();
      closeModal(popupAvatar);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении аватара:", error);
    })
    .finally(() => {
      renderLoading(false, saveUpdateAvatarButton); // скрываем индикатор загрузки
    });
}

function handleImageClick(name, link) {
  popupImageContent.src = link;
  popupImageContent.alt = name; // устанавливаем alt для изображения
  popupImageTitle.textContent = name;
  openModal(popupImage);
}

formElement.addEventListener("submit", handleProfileFormSubmit);
addCardForm.addEventListener("submit", handleAddCardSubmit);
formAvatar.addEventListener("submit", handleUpdateAvatar);

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

// @todo: Вывести карточки и профиль по api на страницу

Promise.all([getInitialCards(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id; // сохраняем userId в переменную

    // Мои данные пользователя
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    console.log("Данные пользователя:", userData);

    // Выводим карточки на страницу
    cards.forEach((item) => {
      const cardElement = createCard(
        item,
        currentUserId,
        deleteCard,
        handleLikeClick,
        handleImageClick
      );
      cardAllList.append(cardElement);
    });
  })
  .catch((error) => {
    console.error("Ошибка при загрузке карточек:", error);
  });

enableValidation(configValidation);
