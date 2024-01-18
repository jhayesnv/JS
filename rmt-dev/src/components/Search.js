import {searchInputEl, searchFormEl, jobListSearchEl, numberEl } from "../common.js";
import renderError from "./Error.js";
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
    fetch(`https://bytegrad.com/course-assets/js/2/api/jobs?search=${searchText}`)
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
            jobItems.slice(0, 7).forEach(item => {
                const newJobItemHTML = `
                <li class="job-item">
                    <a class="job-item__link" href="${item.id}">
                        <div class="job-item__badge">${item.badgeLetters}</div>
                        <div class="job-item__middle">
                            <h3 class="third-heading">${item.title}</h3>
                            <p class="job-item__company">${item.company}</p>
                            <div class="job-item__extras">
                                <p class="job-item__extra"><i class="fa-solid fa-clock job-item__extra-icon"></i> ${item.duration}</p>
                                <p class="job-item__extra"><i class="fa-solid fa-money-bill job-item__extra-icon"></i> ${item.salary}</p>
                                <p class="job-item__extra"><i class="fa-solid fa-location-dot job-item__extra-icon"></i> ${item.location}</p>
                            </div>
                        </div>
                        <div class="job-item__right">
                            <i class="fa-solid fa-bookmark job-item__bookmark-icon"></i>
                            <time class="job-item__time">${item.daysAgo}</time>
                        </div>
                    </a>
                </li>
            `;
            jobListSearchEl.insertAdjacentHTML('beforeend', newJobItemHTML);
            });
        })
        .catch(err => console.log(err));
}

searchFormEl.addEventListener('submit', submitHandler);