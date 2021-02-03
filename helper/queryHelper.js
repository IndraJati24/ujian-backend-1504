const util = require('util')
const database = require('../database')

module.exports = {
  generateQuery: (body) => {
    let result = "";
    for (let property in body) {
      result += ` ${property} = ${database.escape(body[property])} and`;
    }
    return result.slice(0, -3);
  },
  asyncQuery: util.promisify(database.query).bind(database)
};
