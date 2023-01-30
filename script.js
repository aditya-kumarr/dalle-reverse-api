const { default: axios } = require("axios");
const fs = require("fs");

const start = {
  prompt: "big moon from mountains in a rainy night by Pablo Picasso",
  filename: "Moon-Pablo-Picasso",
};
//1. make the API request and store the result in an object that has images propery
async function callCraiyonAPI(prompt) {
  const config = {
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(percentCompleted);
    },
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const { data } = await axios.post(
      "https://backend.craiyon.com/generate",
      {
        prompt: prompt,
      },
      config
    );
    return data.images;
  } catch (error) {
    console.warn(error.message);
    process.exit(1);
  }
}

//2. create a function that takes a base64 and stores a corresponding image to a given directory with name
async function b64ToImg(file, b64, i) {
  const buffer = Buffer.from(b64, "base64");
  fs.writeFileSync(`${file}/${file}${i}.png`, buffer);
}
//3. pipe the result of the api to this function

main(start);

async function main(options) {
  const imageArr = await callCraiyonAPI(options.prompt);
  fs.mkdirSync(options.filename);
  imageArr.forEach((b64str, i) => b64ToImg(options.filename, b64str, i));
}
