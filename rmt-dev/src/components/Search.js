import {searchInputEl, searchFormEl, jobListSearchEl, numberEl, BASE_API_URL, getData, state, sortingBtnRecentEl, sortingBtnRelevantEl } from "../common.js";
import renderError from "./Error.js";
import renderJobList from "./JobList.js";
import { renderPaginationButtons } from "./Pagination.js";
import renderSpinner from "./Spinner.js";

// search component
const submitHandler = async e => {
    // prevent default behavior
    e.preventDefault();

    // get search text
    const searchText = searchInputEl.value;

    // validation with regex
    const forbiddenPattern = /[0-9]/;
    const patternMatch = forbiddenPattern.test(searchText);
    if (patternMatch) {
        renderError('Your search may not contain numbers');
        return;
    }

    // blue input
    searchInputEl.blur();

    // remove previous job items
    jobListSearchEl.innerHTML = '';

    // reset sorting buttons
    sortingBtnRelevantEl.classList.add('sorting__button--active');
    sortingBtnRecentEl.classList.remove('sorting__button--active');

    // render spinner
    renderSpinner('search');

    // fetch search results
    try {
        const data = await getData(`${BASE_API_URL}/jobs?search=${searchText}`);

        // extract job items
        const { jobItems } = data;

        // update state
        state.searchJobItems = jobItems;
        state.currentPage = 1;

        // remove spinner
        renderSpinner('search');

        // render number of results
        numberEl.textContent = jobItems.length;

        // reset pagination buttons
        renderPaginationButtons();

        // render job items in search job list
        renderJobList();

    } catch (error) {
        renderSpinner('search');
        renderError(error.message);
    }
}

searchFormEl.addEventListener('submit', submitHandler);