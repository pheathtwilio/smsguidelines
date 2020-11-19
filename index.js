const { JSDOM } = require("jsdom")
const axios = require('axios')

const MAIN_URL = "https://www.twilio.com/guidelines/sms"
const UNORDERED_LIST = "body > main > div > section:nth-child(4) > div > div > ul"

const getDom = async () => {
  try {
    const { data } = await axios.get(MAIN_URL)
    const dom = new JSDOM(data);
    const { document } = dom.window;
    

    const unorderedList = document.querySelector(UNORDERED_LIST)

    const countries = []

    unorderedList.childNodes.forEach((node) => {
      if(node.hasChildNodes){
        let link = node.childNodes[0].href.trim()
        if(node.childNodes[0].hasChildNodes){
          let name = node.childNodes[0].childNodes[1].innerHTML.trim()
          let country = {
            name: name,
            link: link
          }
          countries.push(country)
        }
      } 
    })

    countries.forEach((country) => {
      console.log(country.name)
    })

    return "successful";
  } catch (error) {
    throw error;
  }
};

getDom().then(msg => console.log(msg));
