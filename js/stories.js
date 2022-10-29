"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
    storyList = await StoryList.getStories();
    $storiesLoadingMsg.remove();

    putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
    let liked = `far`
    let star = ''
    if (currentUser) {
        if (
            currentUser.favorites.map(e => e.storyId)
                .includes(story.storyId)) {
            liked = 'fas'
        }
        star = `<i class="fa-star ${liked}"></i>`
    }

    const hostName = story.getHostName();
    return $(`
      <li id="${story.storyId}">
      ${star}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
    console.debug("putStoriesOnPage");

    $allStoriesList.empty();
    if (currentUser) {
        console.log('favorites', currentUser.favorites)
    }
    // loop through all of our stories and generate HTML for them
    for (let story of storyList.stories) {
        const $story = generateStoryMarkup(story);
        if (currentUser) {
            $story.on('click', async function ({target}) {
                const {id} = this
                if (currentUser.favorites.map(({storyId}) => storyId).includes(id)) {
                    await currentUser.removeFavorite(story)
                } else {
                    await currentUser.addFavorite(story)
                }

                putStoriesOnPage()
            })
        }
        $allStoriesList.append($story);
    }
    $allStoriesList.show();
}

//clear inputs
const clearSubmitInputs = ($url) => {
    $storiesForm.find('input[type="text"]').val('')
    $url.val('http://')
}

$storiesForm.on('submit', async (e) => {
    e.preventDefault()
    console.debug("submitStory");

    //get components and values
    const $inputs = ['title', 'url', 'author'].map(x => $(`#stories-${x}`))
    const $url = $inputs[1]
    const [title, url, author] = $inputs.map($x => $x.val())

    //clear inputs
    clearSubmitInputs($url);

    //form validation
    if (!title) return alert('title is empty')
    if (!url) return alert('url is empty');
    if (!author) return alert('author is empty')

    //add new data
    await storyList.addStory(currentUser, {title, url, author})

    //renderings
    hidePageComponents()
    putStoriesOnPage()
})

