import View from "./view.js";
import icons from 'url:../../img/icons.svg';


class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto; // converting to a number
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    const curPage = this._data.page;

    // console.log(numPages);
    // 1. Page 1, and there are pages
    if (curPage === 1 && numPages > 1) {
      return `
        <button data-goto="${ curPage + 1 }" class="btn--inline pagination__btn--next">
          <span>Page ${ curPage + 1 }</span>
          <svg class="search__icon">
            <use href="${ icons }#icon-arrow-right"></use>
          </svg>
        </button>      
      `;
    }

    // 2. Last page
    if (curPage === numPages && numPages > 1) {
      return `
        <button data-goto="${ curPage - 1 }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${ icons }#icon-arrow-left"></use>
          </svg>
          <span>Page ${ curPage - 1 }</span>
        </button>
      `;
    }

    // 3. Other pages
    if (curPage < numPages && curPage > 1) {
      return `
        <button data-goto="${ curPage - 1 }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${ icons }#icon-arrow-left"></use>
          </svg>
          <span>Page ${ curPage - 1 }</span>
        </button>
        <button data-goto="${ curPage + 1 }" class="btn--inline pagination__btn--next">
          <span>Page ${ curPage + 1 }</span>
          <svg class="search__icon">
            <use href="${ icons }#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    // 4. Page 1, and there NO are pages
    return '';
  }
}
export default new PaginationView();