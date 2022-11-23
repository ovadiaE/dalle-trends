const googleTrends = require('google-trends-api')

 async function getDaily () {
  
  try 
  {
    let result = await googleTrends.dailyTrends ({
      trendDate: new Date(),
      geo: 'US',
    })
    
    let queriesArray = parseQueries(JSON.parse(result).default.trendingSearchesDays[0].trendingSearches);

    queriesArray = setPrompt(queriesArray)

    return queriesArray;
  }
 
  catch(err) 
  {
    console.log(err)
  }
}

function parseQueries (queries) {
 
  let prompt = []
  
  for(let i = 0; i < queries.length; i++)
  {
    if(!prompt.includes(queries[i]))
    {
      prompt[i] = queries[i].title.query
    }
  }
  return prompt
}

function setPrompt(queriesArray){
  let prompt = []
  let length = 0
  
  queriesArray.length < 5 ? length = queriesArray.length : length = 5

  for(let i = 0; i < length; i++)
  {
    let index = Math.floor(Math.random() * queriesArray.length)
    
    if(!prompt.includes(queriesArray[index]))
    {
      prompt.push(queriesArray[index])
    }
  }
 return prompt.join(' ');
}

exports.getDaily = getDaily