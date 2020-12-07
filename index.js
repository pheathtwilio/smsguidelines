const { JSDOM } = require("jsdom")
const axios = require('axios')

const TWILIO_HOME = "https://twilio.com"
const MAIN_URL = "https://www.twilio.com/guidelines/sms"


const UNORDERED_LIST = "body > main > div > section:nth-child(4) > div > div > ul"
const COUNTRY_SUMMARY_TABLE = "body > main > div > section.section.sms-section.pt-5 > div:nth-child(1) > div:nth-child(1) > table > tbody"
const GUIDELINES_TABLE = "body > main > div > section.section.sms-section.pt-5 > div:nth-child(1) > div:nth-child(2) > table > tbody"
const PHONE_NUMBERS_TABLE = ""

let htmlString = ""

const stripTags = (dirtyHTML) => {
  return dirtyHTML.replace( /(<([^>]+)>)/ig, '')
}

const getCountrySummary = async (country) => {

  let countrySummaries = []

  try {

    const { data } = await axios.get(TWILIO_HOME + country.link)
    const dom = new JSDOM(data);
    const { document } = dom.window;
    const countrySummaryTable = document.querySelector(COUNTRY_SUMMARY_TABLE)

    if(countrySummaryTable.hasChildNodes){
      countrySummaryTable.childNodes.forEach((countrySummary) => {

        let heading = countrySummary.childNodes[0].innerHTML
        let summary = countrySummary.childNodes[1].innerHTML

        countrySummaries.push({
          heading: stripTags(heading), 
          summary: stripTags(summary)
        })

      })
    }

    return countrySummaries

  } catch (e) {
    throw (e)
  }

}


const getGuidelines = async (country) => {

  let guidelines = []
  
  try {
      
    const { data } = await axios.get(TWILIO_HOME + country.link)
    const dom = new JSDOM(data);
    const { document } = dom.window;
    const guidelinesTable = document.querySelector(GUIDELINES_TABLE)


    if(guidelinesTable.hasChildNodes){
      guidelinesTable.childNodes.forEach((guideline) => {

        let heading = guideline.childNodes[0].innerHTML
        let summary = guideline.childNodes[1].innerHTML

        guidelines.push({
          heading: stripTags(heading), 
          summary: stripTags(summary)
        })

      })
    }

    return guidelines
    
  } catch (e) {
    throw (e)
  }

}

const getPhoneNumbers = async (country) => {

    let phoneNumbers = []

    try {

      const { data } = await axios.get(TWILIO_HOME + country.link)
      const dom = new JSDOM(data);
      const { document } = dom.window;
      const phoneNumbersTable = document.querySelector(GUIDELINES_TABLE)

    } catch (e) {
      throw (e)
    }



}

const getGrid = async () => {
    const { data } = await axios.get(MAIN_URL)
    const dom = new JSDOM(data);
    const { document } = dom.window;
    const unorderedList = document.querySelector(UNORDERED_LIST)
    let countries = []
  
    try {
      // get all country links
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

        // get all country summaries
        getCountrySummary(country).then((summaries) => {
          country = {name: country.name, link: country.link, summaries: summaries}

          // get all guidelines
          getGuidelines(country).then((guidelines) => {
            country = {name: country.name, link: country.link, summaries: country.summaries, guidelines: guidelines}

            htmlString += country.name + "<br/>" + country.link + "<br/>"
            
            country.summaries.forEach((summary) => {
              htmlString += summary.heading + "<br/>" + summary.summary + "<br/>"
            })

            country.guidelines.forEach((guideline) => {
              htmlString += guideline.heading + "<br/>" + guideline.summary + "<br/>"
            })

            htmlString += "<br/><br/>"

            // console.log(country)
            // get all phone numbers and sender id's

            // get HTML output
            var fs = require('fs');

            var fileName = './index.html';
            var stream = fs.createWriteStream(fileName);

            stream.once('open', function(fd) {
              stream.end(htmlString);
            });

          })
          .catch((e) => {
            console.log(e)
          })

        })
        .catch((e) => {
          console.log(e)
        })
        
      })

      return countries

    } catch (e) {
      throw (e)
    }
}

getGrid().then((countries) => {
  console.log("lets go")
})
.catch()
