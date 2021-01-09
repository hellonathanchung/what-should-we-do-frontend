// const activitiesURL = "http://localhost:3000/api/v1/activities";
const activitiesURL =
  "https://what-should-we-do-backend.herokuapp.com/api/v1/activities";
const activitiesContainer = document.getElementById("activity-container");
const mySidebar = document.getElementById("mySidebar");
const unlike = "♡";
const like = "♥";
let activityList = [];

fetchActivities();
async function fetchActivities() {
  const response = await fetch(activitiesURL);
  const activities = await response.json();

  activities.forEach((activity) => {
    appendActivities(activity);
  });
}

function appendActivities(activity) {
  const {
    id,
    name,
    address,
    city,
    state,
    description,
    image,
    category,
    likes,
  } = activity;
  const div = document.createElement("div");
  const h4 = document.createElement("h4");
  const h5 = document.createElement("h5");
  const img = document.createElement("img");
  const ul = document.createElement("ul");
  const heart = document.createElement("span");
  const likeText = document.createElement("span");
  const btn = document.createElement("button");
  btn.className = "infocard";
  btn.textContent = "click for info";

  div.className = `card ${category}`;
  div.id = id;
  h4.textContent = name;
  h5.textContent = category;
  img.src = image;
  heart.className = "like";
  heart.textContent = unlike;
  likeText.textContent = `${likes} likes`;

  div.append(heart, likeText, h4, btn, h5, img);
  activitiesContainer.appendChild(div);

  addToActivityList(activity);
  appendCategory(activity.category);
  addMarkers(activity);

  closeNav();
}
addToActivityList();

function addToActivityList(activity) {
  if (activity != undefined) {
    activityList.push(activity);
  }
}

function openNav() {
  mySidebar.style.width = "25%";
  document.getElementById("main").style.marginLeft = "25%";
  createNewActivity();
}

function closeNav() {
  mySidebar.style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

function createNewActivity() {
  const form = document.getElementById("new-Activity-Form");
  form.onsubmit = function (event) {
    event.preventDefault();
    const formFiled = event.target.children;

    const name = formFiled[0].value;
    const address = formFiled[1].value;
    const city = formFiled[2].value;
    const state = formFiled[3].value;
    const zipcode = formFiled[4].value;
    const description = formFiled[5].value;
    const image = formFiled[6].value;
    const category = formFiled[7].value;

    const body = {
      activity: {
        name,
        address,
        city,
        zipcode,
        state,
        description,
        image,
        category,
        comments: [],
        likes: 0,
        user_activities: [],
      },
    };

    const options = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    fetch(activitiesURL, options)
      .then((response) => response.json())
      .then((activity) => appendActivities(activity));

    formFiled[0].value = "";
    formFiled[1].value = "";
    formFiled[2].value = "";
    formFiled[3].value = "";
    formFiled[4].value = "";
    formFiled[5].value = "";
    formFiled[6].value = "";
    formFiled[7].value = "";
  };
}

listenforCardClickForMarkerPan();

function listenforCardClickForMarkerPan() {
  activitiesContainer.addEventListener("click", function () {
    let cardID = event.target.parentElement.id;
    let foundActivity = activityList.find((activity) => activity.id == cardID);
    let newLatLng = new google.maps.LatLng(
      foundActivity.latitude,
      foundActivity.longitude
    );
    let latLng = `${foundActivity.latitude},${foundActivity.longitude}`;
    map.panTo(newLatLng);
  });
}
