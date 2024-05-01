
function sortCurrentOrders() {
  const elements = document.getElementsByClassName("r5f")
  var elementsArr = Array.prototype.slice.call(elements)
  elementsArr.sort((a, b) => {
    const [aDate, bDate] = [getDateDelivery(a), getDateDelivery(b)]
    if (aDate == null) return -1
    if (bDate == null) return +1
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
    var delivery_string = Array.prototype.slice.call(e.querySelectorAll(".er0")).at(-1).innerHTML.split(":")[1]
    if (!delivery_string) {
      return null
    }
    delivery_string = delivery_string.trim().split(" ").slice(0, 2)
    if (!parseInt(delivery_string[2])) {
      delivery_string[2] = (new Date()).getFullYear()
    }
    delivery_string[1] = datesMap[delivery_string[1].toLowerCase()] || delivery_string[1]
    const delivery_date =  new Date(delivery_string)
    return delivery_date == "Invalid Date" ? undefined : delivery_date
  }
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes('chrome://')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: sortCurrentOrders
    })
  }
})
