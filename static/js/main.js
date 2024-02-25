function renderBook(imageSrc, title, description, author) {
  // Create a parent element
  const parentDiv = document.createElement("div");
  parentDiv.classList.add("max-w-sm", "bg-white", "border", "border-gray-200", "rounded-lg", "shadow",
    "dark:bg-gray-800", "dark:border-gray-700");

  // Create an anchor element for the image
  const imageLink = document.createElement("a");

  // Create the image element
  const image = document.createElement("img");
  image.classList.add("rounded-t-lg");
  image.src = imageSrc;
  image.alt = "mindreads-books";

  // Append the image to the anchor element
  imageLink.appendChild(image);

  // Append the anchor element to the parent element
  parentDiv.appendChild(imageLink);

  // Create a div element for the text content
  const textDiv = document.createElement("div");
  textDiv.classList.add("p-5");

  // Create an anchor element for the title
  const titleLink = document.createElement("a");

  // Create the title element
  const titleEl = document.createElement("h5");
  titleEl.classList.add("mb-2", "text-2xl", "font-bold", "tracking-tight", "text-gray-900", "dark:text-white");
  titleEl.textContent = title;

  // Append the title to the anchor element
  titleLink.appendChild(titleEl);

  // Append the anchor element to the text content div
  textDiv.appendChild(titleLink);

  // Create a paragraph element for the description
  const descriptionEl = document.createElement("p");
  descriptionEl.classList.add("mb-3", "font-normal", "text-gray-700", "dark:text-gray-400");
  descriptionEl.textContent = description;

  // Append the description to the text content div
  textDiv.appendChild(descriptionEl);

  // Create a span element for the author
  const authorSpan = document.createElement("span");
  authorSpan.textContent = author;

  // Create an h5 element for the author label and value
  const authorEl = document.createElement("h5");
  authorEl.classList.add("text-white");
  authorEl.textContent = "Author: ";

  // Append the author label and value to the text content div
  authorEl.appendChild(authorSpan);
  textDiv.appendChild(authorEl);

  // Append the text content div to the parent element
  parentDiv.appendChild(textDiv);

  // Add the parent element to the document
  document.getElementById('books').appendChild(parentDiv);
}

function callBook(data) {
  document.getElementById('books').innerHTML = null;
  document.getElementById('books-main').style.display = 'unset';
  document.getElementById("books-main").scrollIntoView();

  var db = firebase.firestore();
  const docRef = db.collection('tag').doc(data);

  docRef.get().then((doc) => {
    if (doc.exists) {
      var books = doc.data();
      console.log(books)
      for (let i = 1; i <= Object.keys(books).length; i++) {
        console.log(books[i].author)
        renderBook(
          books[i].src,
          books[i].title,
          books[i].desc,
          books[i].author)
      }
    } else {
      // doc.data() will be undefined in this case
      callBook("anxious")
    }
  }).catch((error) => {
    callBook("Emotional distress")
  });
}

$(document).ready(function () {
  $("#reqForm").on("submit", function (event) {
    event.preventDefault(); // prevent the default form submit action

    $.ajax({
      type: "POST",
      url: "/predict",
      data: $("#req").val(),
      async: true,
      success: function (data) {
        callBook(data)
      },
    });
  });
});
