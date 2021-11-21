function createElement(
  type,
  { attributes = {}, classNames = [], events = {} },
  ...children
) {
  const elem = document.createElement(type);
  for (const [attrName, attrValue] of Object.entries(attributes)) {
    elem.setAttribute(attrName, attrValue);
  }
  for (const [eventType, eventHandler] of Object.entries(events)) {
    elem.addEventListener(eventType, eventHandler);
  }
  elem.classList.add(...classNames);
  elem.append(...children);
  return elem;
}

const rootCards = document.getElementById('cardsContainer');
fetch('./data.json')
  .then((promise) => promise.json())
  .then((data) => {
    data.forEach((user) => {
      checkData(user);
      let { id, firstName, lastName, profilePicture, contacts } = user;
      firstName = checkName(firstName);
      lastName = checkName(lastName);
      const card = createElement(
        'li',
        {
          attributes: { info: `${firstName} ${lastName}` },
          classNames: ['cardWrapper'],
          events: { click: selectorActors },
        },
        createElement(
          'acticle',
          { attributes: {}, classNames: ['cardContainer'], events: {} },
          createElement(
            'div',
            { attributes: {}, classNames: ['cardImageWrapper'], events: {} },
            createElement(
              'div',
              {
                attributes: {
                  src: profilePicture,
                  style: `background-color: ${stringToColour(
                    firstName + ' ' + lastName
                  )}`,
                },
                classNames: ['initials'],
                events: {},
              },
              getInitials(firstName, lastName),
              createElement('img', {
                attributes: { src: profilePicture },
                classNames: ['cardImage'],
                events: { error: imgHandlerErrEvent },
              })
            )
          ),
          createElement(
            'h2',
            { attributes: {}, classNames: ['cardName'], events: {} },
            `${firstName ? firstName : '?'} ${lastName ? lastName : '?'}`
          ),
          createElement(
            'section',
            {
              attributes: {},
              classNames: ['contactsWrapper'],
              events: {},
            },
            ...contacts.map((link) =>
              createElement(
                'a',
                {
                  attributes: { target: '_blank', href: link },
                  classNames: ['contactLink'],
                },
                createElement('img', {
                  attributes: { src: contactsMap.get(new URL(link).host) },
                  classNames: ['contactImage'],
                  events: {},
                })
              )
            )
          )
        )
      );
      rootCards.append(card);
    });
  })
  .catch((error) => {
    console.log(error);
  });

function checkName(name) {
  return name !== '' ? name : '?';
}

const rootSelectedActors = document.getElementById('selectedActors');
const selectedActors = new Set();
function selectorActors({ currentTarget }) {
  const item = currentTarget.getAttribute('info');
  if (!selectedActors.has(item)) {
    selectedActors.add(item);
    rootSelectedActors.append(
      createElement('span', { classNames: ['selectedItem'] }, item)
    );
  }
}

function imgHandlerErrEvent({ target }) {
  target.remove();
}

const contactsMap = new Map();
contactsMap.set('www.facebook.com', '/assets/images/facebook.svg');
contactsMap.set('twitter.com', '/assets/images/twitter.svg');
contactsMap.set('www.instagram.com', '/assets/images/instagram.svg');

function checkData({ id, firstName, lastName, profilePicture, contacts }) {
  if (typeof id !== 'number') {
    throw new TypeError(`ID=${id} - id must be an integer`);
  }
  if (typeof firstName !== 'string') {
    throw new TypeError(`ID=${id} - firstName must be a string`);
  }
  if (typeof lastName !== 'string') {
    throw new TypeError(`ID=${id} - lastName must be a string`);
  }
  if (!(profilePicture === null || typeof profilePicture === 'string')) {
    throw new TypeError(`ID=${id} - profilePicture must be a string or null`);
  }
  if (
    !(contacts instanceof Array) ||
    contacts.some((item) => typeof item !== 'string')
  ) {
    throw new TypeError(`ID=${id} - contacts must be an array of strings`);
  }
}

function getInitials(firstName, lastName) {
  let initials = '';
  if (firstName.length > 0 && lastName.length > 0) {
    initials = firstName[0] + lastName[0];
  }
  return initials;
}

function stringToColour(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}
