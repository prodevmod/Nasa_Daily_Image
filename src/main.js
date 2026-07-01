const API_KEY = import.meta.env.VITE_NASA_API_KEY;

document.querySelector("#app").innerHTML = "<p>loading...</p>";

fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Received an invalid response format from the server.");
    }
    
    return response.json();
  })
  .then(data => {
    let media;

    if (data.media_type === "image") {
      media = `<img  src="${data.url}" alt="${data.title}"/>`;
    } else if (data.url.includes("youtube")){
      media = `<iframe style="width:100%; src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      media = `<video  src="${data.url}" controls></video>`;
    }

    document.querySelector("#app").innerHTML = `
      <h1>${data.title}</h1>
      ${media}
      <p>${data.explanation}</p>
    `;
  })
  .catch(err => {
    document.querySelector("#app").innerHTML = `
      <p>
        <strong>NASA API Error:</strong> ${err.message}<br>
        <small>Please try refreshing the page in a few moments.</small>
      </p>
    `;
  });