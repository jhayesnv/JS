import { jobListSearchEl, jobDetailsContentEl, BASE_API_URL, getData, state, RESULTS_PER_PAGE } from "../common.js";
import renderJobDetails from "./JobDetails.js";
import renderSpinner from "./Spinner.js";

const renderJobList = () => {
    // remove previous job items
    jobListSearchEl.innerHTML = '';

    // display job items
    state.searchJobItems.slice(state.currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE, state.currentPage * RESULTS_PER_PAGE).forEach(item => {
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
                    <time class="job-item__time">${item.daysAgo}d</time>
                </div>
            </a>
        </li>`;
        jobListSearchEl.insertAdjacentHTML('beforeend', newJobItemHTML);
        });
}

// job list component
const clickHandler = async e => {
    e.preventDefault();

    // get clicked job item element
    const jobItemEl = e.target.closest('.job-item');

    // remove the active class from previously active job item
    document.querySelector('.job-item--active')?.classList.remove('job-item--active');

    // add active class
    jobItemEl.classList.add('job-item--active');

    // empty the job details section
    jobDetailsContentEl.innerHTML = '';

    // render spinner
    renderSpinner('job-details');

    // get the id
    const id = jobItemEl.children[0].getAttribute('href');

    // fetch job item data
    try {
        const data = await getData(`${BASE_API_URL}/jobs/${id}`);

        const { jobItem } = data;
        // remove spinner
        renderSpinner('job-details');
        // render job details
        jobDetailsContentEl.innerHTML = renderJobDetails(jobItem);

    } catch (error) {
        renderSpinner('job-details');
        renderError(err.message);
    }
};

jobListSearchEl.addEventListener('click', clickHandler);

export default renderJobList;