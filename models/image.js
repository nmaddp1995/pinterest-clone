const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const imageSchema = new Schema({
    userID : String ,
    url : String ,
    description : String ,
    userAvatar : String ,
    listUserLike : [{
        userID : String
    }]
});
const modelClass= mongoose.model("image",imageSchema);
module.exports = modelClass;