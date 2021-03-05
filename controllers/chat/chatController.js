const User = require("../../models/user");
const Chat = require("../../models/chat");

exports.getChats = async (req, res, next) =>{
    try {
        let result = await Chat.find({"sender": req.user._id, "receiver": req.params.id}).exec()
        console.log(result);
        if(result == null){
           return res.json({
                result
            })
        }

        return res.end(result);
    } catch (error) {
        res.json({
            error: error.message
        })
    }
}