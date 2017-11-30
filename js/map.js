'use strict';


// Useful functions

var getValueInRange = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getUniqueValues = function (array) {
  var obj = {};
  var output = [];
  var j = 0;

  for (var i = 0; i < array.length; i++) {
    var item = array[i];
    if (obj[item] !== 1) {
      obj[item] = 1;
      output[j++] = item;
    }
  }

  return output;
};

// Prepare map

var map = document.querySelector('.map');
var tokyoPinMap = document.querySelector('.map__pins');

// Find template

var template = document.querySelector('template').content;

// Generate Pin from template

var mapPinTemplate = template.querySelector('.map__pin');
var pinWidth = 46;
var pinHeight = 64;

var generatePin = function (obj) {
  var pinElement = mapPinTemplate.cloneNode(true);
  pinElement.querySelector('img').src = obj.author.avatar;
  pinElement.style.left = (obj.houseLocation.x - (pinWidth / 2)) + 'px';
  pinElement.style.top = (obj.houseLocation.y + pinHeight) + 'px';

  return pinElement;
};

// Generate Card from template

var mapCard = template.querySelector('article.map__card');

var generateCard = function (obj) {
  var cardElement = mapCard.cloneNode(true);

  cardElement.querySelector('h3').textContent = obj.offer.title;
  cardElement.querySelector('p small').textContent = obj.offer.adress;
  cardElement.querySelector('.popup__price').innerHTML = obj.offer.price + '&#x20bd;/ночь';
  cardElement.querySelector('h4').textContent = getHouseType(obj.offer.type);
  cardElement.querySelector('h4 + p').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  cardElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
  cardElement.querySelector('.popup__features').innerHTML = addFeatureItem(obj.offer.features);
  cardElement.querySelectorAll('.popup__features > li').textContent = addItemClasses(cardElement, obj.offer.features);
  cardElement.querySelector('.popup__features + p').textContent = obj.offer.description;
  cardElement.querySelector('.popup__avatar').src = obj.author.avatar;
  cardElement.style.left = (obj.houseLocation.x - (pinWidth / 2)) + 'px';
  cardElement.style.top = (obj.houseLocation.y + pinHeight) + 'px';

  return cardElement;
};

var getHouseType = function (value) {
  if (value === 'flat') {
    return 'Квартира';
  } else if (value === 'bungalo') {
    return 'Бунгало';
  } else if (value === 'house') {
    return 'Дом';
  } else {
    return 'Неизвестно';
  }
};

var addFeatureItem = function (array) {
  var featuresListElements = [];

  for (var i = 0; i < array.length; i++) {
    featuresListElements[i] = '<li></li>';
  }

  var featuresList = featuresListElements.join(' ');

  return featuresList;
};

var addItemClasses = function (element, array) {

  var featureItems = element.querySelectorAll('.popup__features > li');

  for (var i = 0; i < array.length; i++) {
    featureItems[i].classList.add('feature');
    featureItems[i].classList.add('feature--' + array[i]);
  }

  return featureItems;
};

// Generate Ad parameters

var adParameters = {};
var ads = [];
var adsNumber = 8;
var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var minPrice = 1000;
var maxPrice = 1000000;
var houseTypes = ['flat', 'house', 'bungalo'];
var minRoomsNumber = 1;
var maxRoomsNumber = 5;
var checkTimes = ['12:00', '13:00', '14:00'];
var featuresArr = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var minX = 300;
var maxX = 900;
var minY = 100;
var maxY = 500;

var generateAuthor = function () {
  return {
    avatar: 'img/avatars/user0' + (i + 1) + '.png'
  };
};

var generateHouseLocation = function () {
  return {
    x: getValueInRange(minX, maxX),
    y: getValueInRange(minY, maxY)
  };
};

var generateOffer = function () {

  return {
    title: titles[i],
    adress: '' + houseLocation.x + ', ' + houseLocation.y,
    price: getValueInRange(minPrice, maxPrice),
    type: getRandomValue(houseTypes),
    rooms: getValueInRange(minRoomsNumber, maxRoomsNumber),
    guests: getValueInRange(minRoomsNumber, maxRoomsNumber) * 2,
    checkin: getRandomValue(checkTimes),
    checkout: getRandomValue(checkTimes),
    features: [],
    description: '',
    photos: []
  };
};

var getRandomFeatures = function () {
  var randomFeaturesLength = Math.round(Math.random() * featuresArr.length);

  for (var j = 0; j < randomFeaturesLength; j++) {
    offer.features[j] = getRandomValue(featuresArr);
  }

  return getUniqueValues(offer.features);

};

// Create fragments

var fragmentPins = document.createDocumentFragment();
var fragmentCards = document.createDocumentFragment();

// Create ADS array and append to fragment

for (var i = 0; i < adsNumber; i++) {

  var author = generateAuthor();

  var houseLocation = generateHouseLocation();

  var offer = generateOffer();

  offer.features = getRandomFeatures();

  adParameters = {author: author, offer: offer, houseLocation: houseLocation};
  ads[i] = adParameters;

  fragmentPins.appendChild(generatePin(ads[i]));
  fragmentCards.appendChild(generateCard(ads[i]));
}

// Hide Cards

var filtersContainer = map.querySelector('.map__filters-container');

var cardsArr = fragmentCards.querySelectorAll('.popup');

var addClassToAll = function (array, classname) {
  for (var j = 0; j < array.length; j++) {
    array[j].classList.add(classname);
  }
};

addClassToAll(cardsArr, 'hidden');

// Map and form activation

var mainPin = map.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form');
var noticeFieldsets = noticeForm.querySelectorAll('fieldset');

var removeElementsAttribute = function (arr, attribute) {
  for (var j = 0; j < arr.length; j++) {
    arr[j].removeAttribute(attribute);
  }
};

var mainPinMouseupHandler = function () {
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  tokyoPinMap.appendChild(fragmentPins);
  map.insertBefore(fragmentCards, filtersContainer);

  removeElementsAttribute(noticeFieldsets, 'disabled');
};

mainPin.addEventListener('mouseup', mainPinMouseupHandler);

// Add functions show/hide card

var mapPinsArr = fragmentPins.querySelectorAll('.map__pin');
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;


var mapPinsClickHandler = function (evt) {
  for (var j = 0; j < mapPinsArr.length; j++) {
    if (evt.currentTarget === mapPinsArr[j] || evt.keyCode === ENTER_KEYCODE) {
      mapPinsArr[j].classList.add('map__pin--active');
      cardsArr[j].classList.remove('hidden');
    }

    if (evt.currentTarget !== mapPinsArr[j] && mapPinsArr[j].classList.contains('map__pin--active')) {
      mapPinsArr[j].classList.remove('map__pin--active');
      cardsArr[j].classList.add('hidden');
    }
  }
};

var popupCloseClickHandler = function () {
  for (var j = 0; j < cardsArr.length; j++) {
    if (!cardsArr[j].classList.contains('hidden') && mapPinsArr[j].classList.contains('map__pin--active')) {
      cardsArr[j].classList.add('hidden');
      mapPinsArr[j].classList.remove('map__pin--active');
    }
  }
};

var popupEnterCloseHandler = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    popupCloseClickHandler();
  }
};

var popupEscCloseHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    popupCloseClickHandler();
  }
};

// Add event listeners

var popupClose = null;


for (var j = 0; j < mapPinsArr.length; j++) {
  mapPinsArr[j].addEventListener('click', mapPinsClickHandler);

  popupClose = cardsArr[j].querySelector('.popup__close');
  popupClose.addEventListener('click', popupCloseClickHandler);
  popupClose.addEventListener('keydown', popupEnterCloseHandler);
}

window.addEventListener('keydown', popupEscCloseHandler);

// Validation form

var selectTimeIn = noticeForm.querySelector('#timein');
var selectTimeOut = noticeForm.querySelector('#timeout');

var synchronizeSelectsValues = function (selectGet, selectSet) {
  if (selectGet.value === '12:00') {
    selectSet.value = '12:00';
  } else if (selectGet.value === '13:00') {
    selectSet.value = '13:00';
  } else if (selectGet.value === '14:00') {
    selectSet.value = '14:00';
  }
};

selectTimeIn.addEventListener('change', function () {
  synchronizeSelectsValues(selectTimeIn, selectTimeOut);
});

selectTimeOut.addEventListener('change', function () {
  synchronizeSelectsValues(selectTimeOut, selectTimeIn);
});


var inputTypeHouse = noticeForm.querySelector('#type');
var inputPrice = noticeForm.querySelector('#price');

// Set default min attribute
inputPrice.setAttribute('min', '1000');

var synchronizeTypeAndPriceHandler = function () {
  if (inputTypeHouse.value === 'bungalo') {
    inputPrice.setAttribute('min', 0);
  } else if (inputTypeHouse.value === 'flat') {
    inputPrice.setAttribute('min', 1000);
  } else if (inputTypeHouse.value === 'house') {
    inputPrice.setAttribute('min', 5000);
  } else if (inputTypeHouse.value === 'palace') {
    inputPrice.setAttribute('min', 10000);
  }
};

inputTypeHouse.addEventListener('change', synchronizeTypeAndPriceHandler);


var inputRoomNumber = noticeForm.querySelector('#room_number');
var inputCapacity = noticeForm.querySelector('#capacity');
// var inputCapacityOptions = inputCapacity.querySelectorAll('option');

// Set default capacity value
inputCapacity.value = '1';

inputRoomNumber.addEventListener('change', function () {
  if (inputRoomNumber.value === '1') {
    inputCapacity.value = '1';
  } else if (inputRoomNumber.value === '2') {
    inputCapacity.value = '2';
  } else if (inputRoomNumber.value === '3') {
    inputCapacity.value = '3';
  } else if (inputRoomNumber.value === '100') {
    inputCapacity.value = '0';
  }
});

// Add validation test on address field

var inputAddress = noticeForm.querySelector('#address');

var checkRequiredField = function (element, event) {
  if (!element.value) {
    event.preventDefault();
    element.focus();
  }
};

noticeForm.addEventListener('submit', function (evt) {
  checkRequiredField(inputAddress, evt);
});
