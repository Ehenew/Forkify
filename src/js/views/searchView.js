import { Fraction } from "fractional";

class SearchView {
  #parentElement = document.querySelector('.search');

  getQuery() {
    const query = this.#parentElement.querySelector('.search__field').value;
    this._clearInput(); // clearing the input filed
    return query;
  }

  _clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }

  // Publisher-Subscriber Pattern
  addHandlerSearch(handler) {
    // we listen for the parent element not the form so that we can listen for the button clicking event and for the enter key event at the same time
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault(); // to  avoid instant reloading of a page after a form has been submited
      handler();
    });
  }
}
export default new SearchView();