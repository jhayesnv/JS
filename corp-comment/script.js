// global selectors
const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks')
const submitBtnEl = document.querySelector('.submit-btn')


// counter component
const inputHandler = () => {
    // determine maximum number of characters
    const maxChars = 150;

    // determine number of characters currently typed
    const charsTyped = textareaEl.value.length;

    // calculate number of characters remaining (max - currently typed)
    const charsRemaining = maxChars - charsTyped;

    // show number of characters remaining
    counterEl.textContent = charsRemaining;
}

textareaEl.addEventListener('input', inputHandler);


// form component
const submitHandler = (e) => {
    // prevent default browser action on submit
    e.preventDefault();

    // get text from textarea
    const text = textareaEl.value;

    // validate text (e.g. check if # present, and text is long enough)
    if (text.includes('#') && text.length > 4) {
        // show valid indicator
        formEl.classList.add('form--valid');
        // remove valid indicator
        setTimeout(() => {
            formEl.classList.remove('form--valid');
        }, 2000);
    } else {
        // show invalid indicator
        formEl.classList.add('form--invalid');
        // remove invalid indicator
        setTimeout(() => {
            formEl.classList.remove('form--invalid');
        }, 2000);
        // focus textarea
        textareaEl.focus();
        // stop function execution
        return;
    }

    // extract info from valid text
    const hashtag = text.split(' ').find(word => word.includes('#'));
    const company = hashtag.substring(1);
    const badgeLetter = company.substring(0, 1).toUpperCase();
    const upVoteCount = 0;
    const daysAgo = 1;

    // new feedback item HTML
    const feedbackItemHTML = `
        <li class="feedback">
            <button class="upvote">
                <i class="fa-solid fa-caret-up upvote__icon"></i>
                <span class="upvote__count">${upVoteCount}</span>
            </button>
            <section class="feedback__badge">
                <p class="feedback__letter">${badgeLetter}</p>
            </section>
            <div class="feedback__content">
                <p class="feedback__company">${company}</p>
                <p class="feedback__text">${text}</p>
            </div>
            <p class="feedback__date">${daysAgo === 0 ? 'NEW' : daysAgo + 'd'}</p>
        </li>
    `;

    // insert new feedback item into list
    feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);

    // clear textarea
    textareaEl.value = '';

    // blur submit button
    submitBtnEl.blur();

    // reset counter
    counterEl.textContent = '150';
}

formEl.addEventListener('submit', submitHandler);