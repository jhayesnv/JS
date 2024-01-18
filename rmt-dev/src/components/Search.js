import {searchInputEl, searchFormEl, jobListSearchEl, numberEl, BASE_API_URL } from "../common.js";
import renderError from "./Error.js";
import renderJobList from "./JobList.js";
import renderSpinner from "./Spinner.js";

// search component
const submitHandler = (e) => {
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

    // render spinner
    renderSpinner('search');

    // fetch search results
    fetch(`${BASE_API_URL}/jobs?search=${searchText}`)
        .then(res => {
            if (!res.ok) {
                console.log('Something went wrong');
                return;
            }
            return res.json();
        })
        .then(data => {
            // extract job items
            const { jobItems } = data;

            // remove spinner
            renderSpinner('search');

            // render number of results
            numberEl.textContent = jobItems.length;

            // render job items in search job list
            renderJobList(jobItems);
        })
        .catch(err => console.log(err));
}

searchFormEl.addEventListener('submit', submitHandler);