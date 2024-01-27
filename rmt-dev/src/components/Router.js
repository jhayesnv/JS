import {
    jobDetailsContentEl,
    BASE_API_URL,
    getData,
    state
} from '../common.js';

import renderSpinner from './Spinner.js';
import renderJobDetails from './JobDetails.js';
import renderError from './Error.js';

const loadHashChangeHandler = async () => {
    // get id from url
    const id = window.location.hash.substring(1);

    if (id) {
        // remove previous job details content
        jobDetailsContentEl.innerHTML = '';

        // add spinner
        renderSpinner('job-details');

        try {
            const data = await getData(`${BASE_API_URL}/jobs/${id}`);

            const { jobItem } = data;
            // update state
            state.activeJobItem = jobItem;
            // remove spinner
            renderSpinner('job-details');
            // render job details
            jobDetailsContentEl.innerHTML = renderJobDetails(jobItem);

        } catch (error) {
            renderSpinner('job-details');
            renderError(err.message);
        }
    }
};

window.addEventListener('DOMContentLoaded', loadHashChangeHandler);
window.addEventListener('hashchange', loadHashChangeHandler);