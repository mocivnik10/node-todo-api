const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var pass = '123abc!'

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(pass, salt, (err, hash) => {
//     console.log(hash)
//   })
// })

var hashedPassword = '$2a$10$0XRGsVa/XM/LHjnvoAdaSO7chBQqLH7I5uXcYOi3thKDFBl3rLo8O'

bcrypt.compare(pass, hashedPassword, (err, result) => {
  console.log(result)
})

// var data = {
//   id: 10
// }

// var token = jwt.sign(data, '123abc')
// console.log(`coded: ${token}`)

// var decoded = jwt.verify(token, '123abc')
// console.log('decoded:', decoded)

// var message = 'I am user number 3'
// var hash = SHA256(message).toString()

// console.log(`Message: ${message}`)
// console.log(`hash: ${hash}`)

// var data = {
//   id: 4
// };
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()

// if (resultHash === token.hash) {
//   console.log('Data was not changed')
// } else {
//   console.log('Data was changed. Do not trust')
// }