class buildList {
	constructor() {
		this.listCount = 0;
		this.add = document.querySelector('#add');
		this.list = document.querySelector('#list');

		this.runEvents();
	}

	runEvents() {
		this.addList();
		this.onClick();
	}

	addToList(txt) {
		this.appendToDOM({
			elems: {
				li: { elClass: 'item' }
			},
			to: this.list
		});

		let lastListChild = this.list.lastChild;
		let randomNum = Math.round(Math.random() * 1000000);

		this.appendToDOM({
			elems: {
				button: { text: '-' },
				span: { text: `Random number #${txt}: ${randomNum}` }
			},
			to: lastListChild
		})
	}

	appendToDOM(props) {
		for (let key in props.elems) {
			let el = props.elems[key];
			let newEl = document.createElement(key);

			if ('text' in el) {
				let newElText = document.createTextNode(el.text);
				newEl.appendChild(newElText);
			}

			if ('elClass' in el) {
				newEl.className = el.elClass;
			}

			props.to.appendChild(newEl);
		}
	}

	addList() {
		this.add.addEventListener('click', () => {
			this.listCount++;

			this.addToList(this.listCount);
		})
	}

	onClick() {
		this.list.addEventListener('click', event => {
			let isDeleteBtn = (event.target.tagName === 'BUTTON');

			if (isDeleteBtn) {
				event.target.parentNode.remove();
				this.listCount--;

				let allListItems = this.list.querySelectorAll('.item span');
				allListItems.forEach((elem, index) => {
					elem.textContent = elem.textContent.replace(/\#\d+/g, `#${index + 1}`);
				})
			} else {
				event.target.classList.toggle('alt-color');
			}
		})
	}

}

new buildList();
