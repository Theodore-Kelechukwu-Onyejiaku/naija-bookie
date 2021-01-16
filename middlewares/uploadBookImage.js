const multer = require("multer");
var storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "public/bookImages");
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) =>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { //If the file uploaded is not any of this file type
        return cb(new Error("You can upload only image files"), false);
    }
    cb(null, true)
};

//Here we configure what our storage and filefilter will be. And it is storage and imageFileFilter we created above
exports.upload = multer({storage: storage, fileFilter: imageFileFilter})
