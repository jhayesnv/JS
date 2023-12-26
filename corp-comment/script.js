// global selectors
const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks')
const submitBtnEl = document.querySelector('.submit-btn')
const spinnerEl = document.querySelector('.spinner')


const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api/'

const renderFeedbackItem = (item) => {
    // new feedback item HTML
    const feedbackItemHTML = `
        <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${item.upvoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${item.badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${item.company}</p>
                <p class="feedback__text">${item.text}</p>
            </div>
            <p class="feedback__date">${item.daysAgo === 0 ? 'NEW' : item.daysAgo + 'd'}</p>
        </li>
    `;

    // insert new feedback item into list
    feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);
}


// counter component
const inputHandler = () => {
    // determine number of characters currently typed
    const charsTyped = textareaEl.value.length;

    // calculate number of characters remaining (max - currently typed)
    const charsRemaining = MAX_CHARS - charsTyped;

    // show number of characters remaining
    counterEl.textContent = charsRemaining;
}

textareaEl.addEventListener('input', inputHandler);


// form component
const showVisualIndicator = (cl) => {
     // show valid indicator
     formEl.classList.add(cl);
     // remove valid indicator
     setTimeout(() => {
         formEl.classList.remove(cl);
     }, 2000);
};

const submitHandler = (e) => {
    // prevent default browser action on submit
    e.preventDefault();

    // get text from textarea
    const text = textareaEl.value;

    // validate text (e.g. check if # present, and text is long enough)
    if (text.includes('#') && text.length > 4) {
        showVisualIndicator('form--valid');
    } else {
        showVisualIndicator('form--invalid');
        // focus textarea
        textareaEl.focus();
        // stop function execution
        return;
    }

    // extract info from valid text
    const hashtag = text.split(' ').find(word => word.includes('#'));
    const company = hashtag.substring(1);
    const badgeLetter = company.substring(0, 1).toUpperCase();
    const upvoteCount = 0;
    const daysAgo = 0;

    const feedbackItem = {
        upvoteCount,
        badgeLetter,
        company,
        text,
        daysAgo
    }

    // render feedback item in list
    renderFeedbackItem(feedbackItem);

    // send feedback item to server
    fetch(BASE_API_URL + 'feedbacks', {
        method: 'POST',
        body: JSON.stringify(feedbackItem),
        headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) {
            console.log('Something went wrong')
            return
        }
        console.log('Successfully submitted')
    })
    .catch(err => {
        return console.log(err.message)
    })

    // clear textarea
    textareaEl.value = '';

    // blur submit button
    submitBtnEl.blur();

    // reset counter
    counterEl.textContent = MAX_CHARS;
}

formEl.addEventListener('submit', submitHandler);


// feedback list component
fetch(BASE_API_URL + 'feedbacks')
    .then(res => res.json())
    .then(data => {
        // remove spinner
        spinnerEl.remove();
        // for each item in the request feedback array, render in the feedback list
        data.feedbacks.forEach(resultItem => {
            renderFeedbackItem(resultItem);
       });
    })
    .catch(err => {
        feedbackListEl.textContent = `Failed to fetch feedback items. Error message: ${err.message}`;
   });
