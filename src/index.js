import './pages/index.css'; // добавьте импорт главного файла стилей 
import { initialCards } from './scripts/cards.js' // импортируем массив с карточками

// @todo: Темплейт карточки

//прописан в функции createCard

// @todo: DOM узлы
const addButton = document.querySelector('.profile__add-button')
const addCardPopup = document.querySelector('.popup_type_new-card')
const cardPopupButton = document.querySelector('.popup__button')
const closeButtonPopup = addCardPopup.querySelector('.popup__close')
const cardAllList = document.querySelector('.places__list')

addButton.addEventListener('click', () => {
	addCardPopup.classList.add('popup_is-opened')
})

closeButtonPopup.addEventListener('click', () => {
	addCardPopup.classList.remove('popup_is-opened')
})

// @todo: Функция создания карточки

function createCard(name, link, deleteCard) {
	const cardTemplate = document.querySelector('#card-template').content
	const cardElement = cardTemplate.querySelector('.card').cloneNode(true)

	const cardName = cardElement.querySelector('.card__title')
	const cardImage = cardElement.querySelector('.card__image')
	const cardDeleteButton = cardElement.querySelector('.card__delete-button')

	cardName.textContent = name
	cardImage.src = link
	cardImage.alt = name // Дублируем название в alt

	cardDeleteButton.addEventListener('click', () => {
		deleteCard(cardElement)
	})

	return cardElement
}

// @todo: Функция удаления карточки

function deleteCard(cardElement) {
	cardElement.remove()
}

// @todo: Вывести карточки на страницу

initialCards.forEach(item => {
	const cardElement = createCard(item.name, item.link, deleteCard)
	cardAllList.append(cardElement)
})
