import json2xml from 'json2xml'

const jsonObj = {
  name: 'Garage',
  cars: [
    { color: 'red', maxSpeed: 120, age: 2 },
    { color: 'blue', maxSpeed: 100, age: 3 },
    { color: 'green', maxSpeed: 130, age: 2 },
  ],
}

const json = JSON.stringify(jsonObj)
const xml = json2xml(json)

console.log(xml)
