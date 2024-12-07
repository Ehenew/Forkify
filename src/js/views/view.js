import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  /**
   ///JSDoc comment
   * Renders the received Object to the DOM
   * @param {Object | Object[]} data The data to be rendred (e.g. recipe)
   * @param {boolean} [render=true] If false, create a markup string instead of rendering to the DOM 
   * @returns {undefined | String} A markup string is returned if render is false
   * @this {Object} View instance
   * @author Ehenew Amogne
   * @todo Finish implementation
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) // when we enter invalid id data returns [] and so to handle such condition we use this guard clause
      return this.renderError();
    
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup
    
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // we are going to create a new markup and then compare it with the current markup and then only change the texts and attributes that have changed from the old versions to new versions.
    //!? But how can we compare? Well, we can convert the the markup string to a DOM object living in memory and then we can use it to compare with the actual DOM that is on the page

    const newDOM = document.createRange().createContextualFragment(newMarkup); // this will convert the string into a real DOM node object( a virtual DOM that lives only in the memory but not on the page)

    const newElements = Array.from(newDOM.querySelectorAll('*')); // will return a NodeList containing all the elemnts that are contained in the DOM and then we converted it to an array
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[ i ];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // if (!newEl.isEqualNode(curEl)) {
      //   curEl.textContent = newEl.textContent // however, this has a problem of replacing the entire element, we want to change elements that only contain  texts not the entire element(refer MDN documentation about nodevalue)
      // }

      // Updates changes TEXT
      if (!newEl.isEqualNode(curEl) &&
        newEl.firstChild?.textContent.trim() !== '') {
        // console.log(newEl.firstChild?.textContent.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changes ATTRIBUTE
      if (!newEl.isEqualNode(curEl)) {
        // console.log(newEl.attributes); // newEl.attributes returns object of attributes
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });

      }
    });

  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner = function () {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${ icons }#icon-loader"></use>
      </svg>
    </div>
  `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${ icons }#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${ message }</p>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${ icons }#icon-smile"></use>
          </svg>
        </div>
        <p>${ message }</p>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

