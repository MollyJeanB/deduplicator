
//npm package to handle reading and writing files
fs = require('fs');
const file = "./leads.json"

fs.readFile(file, "utf8", function(err, data) {

//parse data to object
let parsedData = JSON.parse(data)
const initialLength = parsedData.leads.length

  if (err) {
  return console.log(err);
}

let newData = processData(parsedData.leads)

let recordsRemoved = initialLength - newData.leads.length

//write file with new data, split and rejoin to add line spacing
fs.writeFile("leads-deduplicate.json", JSON.stringify(newData).split(",").join(",\n"), err => console.error(err))
//log message
console.log(`De-duplication has finished! ${recordsRemoved} duplicate records have been removed. leads-deduplicate.json has been created in this directory`);
});



//count how many times recursive function has run
let loopCount = 0

function processData(leadsList) {

  //create new data object
  let newFileData = {
    leads : []
  }

 //value to pass to recursive function to determine when it returns final array
  const target = leadsList.length - 1
  const newLeadsArray = checkDuplicates(leadsList, target)

  newFileData.leads = newLeadsArray

  return newFileData
}


function checkDuplicates(array, target) {

  let newArray = []
  //remove first object in array to compare to remaining objects
  const checker = array.shift()
  //track number of duplicates
  let dupsCount = 0

  array.forEach(lead => {
    if (lead._id === checker._id || lead.email === checker.email) {
      dupsCount++
      newArray.push(compareDates(lead, checker))
    } else {
      newArray.push(lead)
    }
  })

//if no duplicates in checker, push to array
  if (dupsCount === 0) {
    newArray.push(checker)
  }

//if loop has run the target number of times, return the array
if (loopCount === target) {
  return newArray

//if not, check the array for duplicates and increment the count
} else {
  loopCount++
  return checkDuplicates(newArray, target)
}

}

//compares the dates of duplicate objects and returns the object with the later date. If dates are identical, the first argument is returned (which is listed later in the original data file)
function compareDates(lead, checker) {
  const leadDate = Date.parse(lead.entryDate)
  const checkerDate = Date.parse(checker.entryDate)

  if (leadDate >= checkerDate) {
    return lead
  } else {
    return checker
  }
}
