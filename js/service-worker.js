
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
  var parent = document.querySelector('[data-widget="orderList"]')

  elementsArr.sort((a, b) => {
    const [aDate, bDate] = [getDateDelivery(a), getDateDelivery(b)]
    return +(aDate > bDate) | -(aDate < bDate)
  })

  elementsArr.forEach(element => {
    const substrings = [
        'В пути',
        'Ожидает получения',
        'В сборке',
        'Передаётся в доставку'
      ]
    if (substrings.some(sub => element.textContent.includes(sub))) {
      parent.append(element)
    }
    else {
      element.remove()
    }
  })
    
  function getDateDelivery(e) {
      var dates_arr = []
      Array.prototype.slice.call(e.querySelectorAll(date_class_name)).forEach(element => {
        const text = element.innerText.toLocaleLowerCase()
        if (text.includes("дата") & !text.includes("отмен")) {
          var delivery_string = text.split(":")[1].trim().split(" ").slice(0, 2)
          delivery_string[2] = (new Date()).getFullYear()
          delivery_string[1] = datesMap[delivery_string[1]] || delivery_string[1]
          dates_arr.push(new Date(delivery_string))
        }
      })
      if (dates_arr.length > 0) {
        return new Date(Math.min(...dates_arr.map(d => d.getTime())))
      } else {
        return new Date()
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
