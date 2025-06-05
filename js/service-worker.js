
function sortCurrentOrders() {
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

  const date_class_name = '.' + document.evaluate("//p[contains(text(),'дата')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.className
  const elements = document.querySelectorAll('[data-widget="orderList"] > div')
  var elementsArr = Array.prototype.slice.call(elements)

  elementsArr.sort((a, b) => {
    const [aDate, bDate] = [getDateDelivery(a), getDateDelivery(b)]
    if (aDate == null) return -1
    if (bDate == null) return +1
    return +(aDate > bDate) | -(aDate < bDate)
  })

  var parent = document.querySelector('[data-widget="orderList"]')
  elementsArr.forEach(element => {
    const txtcont = element.textContent
    if (!txtcont.includes('В пути')) {
      element.remove()
    }
    else {
      parent.append(element)
    }
  })


  function getDateDelivery(e) {
    try {
      var delivery_string = Array.prototype.slice.call(e.querySelectorAll(date_class_name)).at(-1).innerHTML.split(":")[1]
      console.log(delivery_string)
      if (!delivery_string) {
        return null
      }
      delivery_string = delivery_string.trim().split(" ").slice(0, 2)
      if (!parseInt(delivery_string[2])) {
        delivery_string[2] = (new Date()).getFullYear()
      }
      if (delivery_string[1]) {
        delivery_string[1] = datesMap[delivery_string[1].toLowerCase()] || delivery_string[1]
        const delivery_date = new Date(delivery_string)
        return delivery_date == "Invalid Date" ? undefined : delivery_date
      }
      else {
        return undefined
      }
    } catch (error) {
      console.error(error)
      return undefined
    }
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
