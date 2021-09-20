const searchContainer = document.querySelector('.search-container');
const galleryDiv = document.getElementById('gallery');

fetch('https://randomuser.me/api/?results=12&nat=us')
	.then(res => res.json())
	.then(data => createCards(data.results));

function createCards(people) {
	console.log(people);
	people.forEach(person => {
		const card = document.createElement('div');
		card.className = 'card';
		card.innerHTML = `
      <div class="card-img-container">
          <img class="card-img" src="${person.picture.thumbnail}">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
          <p class="card-text">${person.email}</p>
				  <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        </div>
      </div>
    `;
		galleryDiv.appendChild(card);
	});
}

// searchbar HTML
searchContainer.insertAdjacentHTML(
	'beforeend',
	`
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`
);
