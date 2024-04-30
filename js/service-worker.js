
function cleanupPage() {
  const elements = document.getElementsByClassName("r5f")
  var elementsArr = Array.prototype.slice.call(elements)
  elementsArr.sort((a, b) => {
    const [aDate, bDate] = [getDateDelivery(a), getDateDelivery(b)]
    return +(aDate > bDate) | -(aDate < bDate)
  })

  var parent = document.querySelector(".rf6")
  elementsArr.forEach(element => {
    parent.append(element)
  })

  function getDateDelivery(e) {
    const datesMap = {
      "января": "January",
      "февраля": "February",
      "марта": "March",
      "апреля": "April",
      "мая": "May",
      "июня": "June",
      "июля": "July",
      "августа": "August",
      "сентября": "September",
      "октября": "October",
      "ноября": "November",
      "декабря": "December",
    }
    var delivery_string = Array.prototype.slice.call(e.querySelectorAll(".er0")).at(-1).innerHTML.split(":")[1].trim().split(" ").slice(0, 2)
    if (!parseInt(delivery_string[2])) {
      delivery_string[2] = (new Date()).getFullYear()
    }
    delivery_string[1] = datesMap[delivery_string[1].toLowerCase()] || delivery_string[1]
    return new Date(delivery_string)
  }
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes('chrome://')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: cleanupPage
    })
  }
})
