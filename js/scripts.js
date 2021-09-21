const searchContainer = document.querySelector('.search-container');
const galleryDiv = document.getElementById('gallery');
let people;

fetch('https://randomuser.me/api/?results=12&nat=us')
	.then(res => res.json())
	.then(data => {
		people = data.results;
		createCards(people);
	});

function createCards(people) {
	people.forEach(person => {
		const card = document.createElement('div');
		card.className = 'card';
		card.id = person.name.first + person.name.last;
		card.innerHTML = `
      <div class="card-img-container">
        <img class="card-img" src="${person.picture.thumbnail}">
      </div>
      <div class="card-info-container">
        <h3 class="card-name cap">${person.name.first} ${person.name.last}</h3>
        <p class="card-text">${person.email}</p>
        <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
      </div>
    `;
		galleryDiv.appendChild(card);

		card.addEventListener('click', () => createModal(person));
	});
}

// modal

  // modal overlay
const modalContainer = document.createElement('div');
modalContainer.classList.add('modal-container', 'hide');
modalContainer.innerHTML = `
  <div class="modal">
    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>&times;</strong></button>

    <div class="modal-info-container" id="modal-info-container">
      <!-- info window goes here -->
    </div>
  </div>
`;

document.body.insertBefore(modalContainer, document.body.lastElementChild);

const closeBtn = document.getElementById('modal-close-btn');

  // close modal
closeBtn.addEventListener('click', () => modalContainer.classList.add('hide'));

modalContainer.addEventListener('click', e => {
	if (
		!e.target.classList.contains('modal-info-container') &&
		!e.target.parentElement.classList.contains('modal-info-container') &&
		!e.target.classList.contains('btn')
	) {
		modalContainer.classList.add('hide');
	}
});

  // create modal
function createModal(person) {
	const container = document.getElementById('modal-info-container');

	/**
	 * removes non-numeric characters then converts to an array of numbers
	 * @returns array
	 *  phone()[0]: unformatted 10 digit number
	 *  phone()[1]: first 3 digits
	 *  phone()[2]: next 3 digits
	 *  phone()[3]: last 4 digits
	 */
	const phone = () => {
		const num = person.cell.replace(/\D/g, '');
		if (num.length !== 10 || !+num) {
			return null;
		}
		return num.match(/^(\d{3})(\d{3})(\d{4})$/);
	};

	modalContainer.classList.remove('hide');

	const isFirst =
		person.name.first + person.name.last === galleryDiv.firstElementChild.id;
	const isLast =
		person.name.first + person.name.last === galleryDiv.lastElementChild.id;

	container.innerHTML = `
    <img class="modal-img" src="${person.picture.medium}" alt="profile picture">
		<h3 class="modal-name cap">
      ${person.name.first} ${person.name.last}
    </h3>
		<p class="modal-text">${person.email}</p>
		<p class="modal-text cap">${person.location.city}</p>
		<hr>
		<p class="modal-text">(${phone()[1]}) ${phone()[2]}-${phone()[3]}</p>
		<p class="modal-text">
      ${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state}  ${person.location.postcode}
    </p>
		<p class="modal-text">
      Birthday: ${new Date(person.dob.date).toLocaleDateString()}
    </p>

    <div class="modal-btn-container">
			<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
			<button type="button" id="modal-next" class="modal-next btn">Next</button>
		</div>
	</div>
  `;

	const prevBtn = document.getElementById('modal-prev');
	const nextBtn = document.getElementById('modal-next');

	if (isFirst) {
		prevBtn.setAttribute('disabled', '');
	} else {
		prevBtn.removeAttribute('disabled');
	}
	if (isLast) {
		nextBtn.setAttribute('disabled', '');
	} else {
		nextBtn.removeAttribute('disabled');
	}

	[nextBtn, prevBtn].forEach(button => {
		button.addEventListener('click', e => {
			toggleModal(e.target.textContent, person);
		});
	});
}

/**
 * Pages through people's detailed info, displaying in a modal
 * @param {string} action - 'next' or 'prev' to page forward/backward
 * @param {object} person - Currently-displayed person object
 */
function toggleModal(action, person) {
	action = action.toLowerCase();

	if (action === 'next') {
		person = people[people.indexOf(person) + 1];
	} else if (action === 'prev') {
		person = people[people.indexOf(person) - 1];
	}

	createModal(person);
}

// search
const searchForm = document.createElement('form');
searchForm.action = '#';
searchForm.method = 'get';
searchForm.id = 'search-form';

searchForm.innerHTML = `
  <input type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
`;

searchContainer.appendChild(searchForm);
const searchInput = document.getElementById('search-input');

  // search event listeners
searchInput.addEventListener('keyup', () => {
	galleryDiv.innerHTML = '';
	createCards(findName(searchInput.value));
});

searchForm.addEventListener('submit', e => {
	e.preventDefault();
	galleryDiv.innerHTML = '';
	createCards(findName(searchInput.value));
});

/**
 * Finds names in the 'people' array that match a search string, then adds the associated objects to a new array
 * @param {string} search - Value to search for
 * @returns {array} - Array of person objects whose names match search string
 */
function findName(search) {
	search = search.replace(' ', '').toLowerCase();
	const filteredPeople = [];
	people.forEach(person => {
		const fullName = person.name.first + person.name.last;
		if (fullName.toLowerCase().includes(search)) {
			filteredPeople.push(person);
		}
	});
	return filteredPeople;
}
