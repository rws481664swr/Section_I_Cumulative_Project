"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}


function navSubmitClick(e) {
  console.debug("navSubmitClick", e);
  hidePageComponents();
  $storiesForm.show();
}

$navFavs.on('click',function(){
  hidePageComponents()
  putFavoritesOnPage()
})

$navSubmit.on('click',navSubmitClick)

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $navLogin.hide();


  [$(".main-nav-links"),
  $navFavs,
  $navSubmit,
  $navLogOut,
  $navUserProfile.text(`${currentUser.username}`)]
      .forEach(e=>e.show())




}

