const buildList = () => {
	let listCount = 0;
	let add = document.querySelector('#add');
	let list = document.querySelector('#list');

	let init = () => {
		_addList();
		_onClick();
	}

	let _addListElements = txt => {
		_appendToDOM({
			elems: {
				li: { elClass: 'item' }
			},
			to: list
		});

		let lastListChild = list.lastChild;
		let randomNum = Math.round(Math.random() * 1000000);

		_appendToDOM({
			elems: {
				button: { text: '-' },
				span: { text: `Random number #${txt}: ${randomNum}` }
			},
			to: lastListChild
		})
	}

	let _appendToDOM = props => {
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

	let _addList = () => {
		add.addEventListener('click', () => {
			listCount++;

			_addListElements(listCount);
		})
	}

	let _onClick = () => {
		list.addEventListener('click', event => {
			let isDeleteBtn = (event.target.tagName === 'BUTTON');

			if (isDeleteBtn) {
				event.target.parentNode.remove();
				listCount--;

				let allListItems = list.querySelectorAll('.item span');
				allListItems.forEach((elem, index) => {
					elem.textContent = elem.textContent.replace(/\#\d+/g, `#${index + 1}`);
				})
			} else {
				event.target.classList.toggle('alt-color');
			}
		})
	}

	return { init };
}

buildList().init();
