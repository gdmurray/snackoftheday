// @ts-ignore
const fetch = require("node-fetch")
const parser = require("node-html-parser")
const DataStore = require("nedb")
const sanitize = require("sanitize-html")
const db = new DataStore({ filename: "./snacks.db", autoload: true })

// @ts-ignore
String.prototype.toCapitalize = function() {
  return this.toLowerCase().replace(/^.|\s\S/g, function(a) {
    return a.toUpperCase()
  })
}

function formatCategory(category) {
  category = category.replace("&amp;", "")
  category = category.replace(/  +/g, " ")
  category = category.replace(/[^a-zA-Z ]/g, "")
  category = category.replace(/\s+/g, "-").toLowerCase()
  return category
}

function formatCount(count) {
  count = count.replace(/[{()}]/g, "")
  return parseInt(count, 10)
}

const snacksHomePage = "https://www.walmart.ca/browse/grocery/chips-snacks/10019-6000194328523"
const excludeCategories = ["dips-salsa", "ice-cream-cones-toppings"]

function dissectCategory() {
  const splitPage = snacksHomePage.split("/")
  const categoryId = splitPage[splitPage.length - 1]
  splitPage.pop()
  return {
    baseURL: splitPage.join("/"),
    categoryId: categoryId
  }
}

function cleanProductName(nameNode) {
  let name = nameNode.innerText.toCapitalize()
  name = name.replace(/&amp;/g, "&")
  name = sanitize(name)
  return name
}

function processPageData(data) {
  const children = data.childNodes
  const pageData = []
  for (let i = 0; i < children.length; i += 1) {
    const node = children[i].firstChild
    const productId = node.getAttribute("data-product-id")
    const productName = cleanProductName(node.querySelector("p[data-automation=\"name\"]"))
    const productImageNode = node.querySelector("img[data-automation=\"image\"]")
    const productImage = productImageNode.getAttribute("src").replace("Thumbnails", "Large")
    pageData.push({
      id: productId,
      name: productName,
      image: productImage
    })
  }
  return pageData
}

async function getPageResults(url, pageNum) {
  const pageUrl = pageNum === 1 ? url : `${url}?p=${pageNum}`
  const basePage = await fetch(pageUrl)
  const text = await basePage.text()
  const parsed = parser.parse(text)
  const data = parsed.querySelector("div[data-automation=\"product-results\"]")
  return Promise.resolve(data)
}


function getPageCount(text) {
  return parseInt(text.replace(/\D/g, ""))
}

//?p=2
async function processCategory(category) {
  const { baseURL, categoryId } = dissectCategory()
  const categoryURL = `${baseURL}/${category.name}/${categoryId}-${category.id}`
  const basePage = await fetch(categoryURL)
  const text = await basePage.text()
  const parsed = parser.parse(text)
  const firstPageData = await getPageResults(categoryURL, 1)
  const pageData = [firstPageData]
  const paginationRoot = parsed.querySelector("div[data-automation=\"pagination-root\"]")

  if (paginationRoot) {
    const maxPages = paginationRoot.firstChild.lastChild.textContent
    const pageCount = getPageCount(maxPages)
    for (let pageNum = 2; pageNum <= pageCount; pageNum += 1) {
      const data = await getPageResults(categoryURL, pageNum)
      pageData.push(data)
    }
  }

  const results = await Promise.all(pageData.map(data => processPageData(data)))
  const allEntries = results.reduce((acc, val) => acc.concat(val.map(entry => {
    return {
      _id: entry.id,
      ...entry
    }
  })), [])

  console.log(`${category.name}`)
  console.log(allEntries[0])
  console.log("Entries: ", allEntries.length)
  for (let i = 0; i < allEntries.length; i += 1) {
    const entry = allEntries[i]
    db.insert({ _id: entry.id, ...entry })
  }

  return Promise.resolve()

}

async function getCategories() {
  const result = await fetch("https://www.walmart.ca/browse/grocery/chips-snacks/10019-6000194328523")
  const text = await result.text()
  const parsed = parser.parse(text)
  const parentCategory = parsed.querySelector("div[data-automation=\"parent-category\"]")
  const categoryList = parentCategory.nextSibling
  const categories = []
  for (let i = 0; i < categoryList.childNodes.length; i += 1) {
    const childNode = categoryList.childNodes[i]
    const category = childNode.firstChild
    const categoryId = category.getAttribute("data-automation").replace("category-item-name-", "")
    const categoryName = category.textContent
    const categoryCount = childNode.lastChild.textContent
    categories.push({
      name: formatCategory(categoryName),
      count: formatCount(categoryCount),
      id: categoryId
    })
  }

  return Promise.resolve(categories)
}

db.loadDatabase(function(err) {
  if (!err) {
    getCategories().then((categories) => {
      const filteredCategories = categories.filter(category => excludeCategories.indexOf(category.name) !== -1)

      for (let i = 0; i < filteredCategories.length; i += 1) {
        const category = filteredCategories[i]
        processCategory(category)
      }
    })
  }
})


// https://i5.walmartimages.ca/images/Large/885/262/6000202885262.jpg
// https://i5.walmartimages.ca/images/Thumbnails/885/262/6000202885262.jpg

// color=$( convert filename.png -format "%[pixel:p{0,0}]" info:- )
// convert filename.png -alpha off -bordercolor $color -border 1 \
// \( +clone -fuzz 30% -fill none -floodfill +0+0 $color \
//        -alpha extract -geometry 200% -blur 0x0.5 \
//        -morphology erode square:1 -geometry 50% \) \
//     -compose CopyOpacity -composite -shave 1 outputfilename.png