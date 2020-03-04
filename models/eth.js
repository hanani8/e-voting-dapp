var mongoose = require('mongoose');
const schema = mongoose.Schema;

var ethSchema = new schema({
  email: {
    type: String,
    required: true
  },
  ethaddress: {
    type: String,
    required: true,

  } 
});

module.exports = mongoose.model("ethereum", ethSchema);