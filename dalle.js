const trends = require('./trends.js')
const post = require('./post.js')
const axios = require('axios') 
require("dotenv").config();

let url = "https://labs.openai.com/api/labs";
let prompt = ' '
let images = []

const getId = async () => {
  prompt = await trends.getDaily()
  
  let taskObject = {
    task_type: "text2im",
    prompt: {
      caption: prompt,
      batch_size: 4,
    }
 }

  let authHeader = {
    headers: {
      'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
    }
  }
  
  let task = await axios.post(`${url}/tasks`, taskObject, authHeader)  
  
  return task.data.id

}

const getImage = async (taskId) => {
  return await axios.get(`${url}/tasks/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
    },
  })
}

const setImages = (image) => {
  image.generations.data.map(i => images.push(i.generation.image_path));
}

const handleReject = (image) => {
  console.log(image)
}

const dalle = async () => {
  const taskId = await getId();     
  
  const refreshIntervalId = setInterval(async () => {
  
    let image = await getImage(taskId)
   
    switch(image.data.status)
    {
        case "succeeded":
          clearInterval(refreshIntervalId);
          setImages(image.data);
          return image.data;
        case "rejected":
          handleReject(image.data)
        case "pending":
    }
  }, 2000)
 }

 dalle()
 
 setTimeout(()=> {post.postToInsta(prompt, images[0])}, 10000)