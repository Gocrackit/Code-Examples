//Following document provides ready to use code for uploading object on aws bucket.
//install following dependencies express,multer and 
//Setup AWS SDK by running "npm i aws-sdk"
//For more information about package https://www.npmjs.com/package/aws-sdk
const express = require('express');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
const multer = require("multer");
const upload = multer();
var AWS = require("aws-sdk");
// Set the AWS region
AWS.config.update({
  accessKeyId: "your key",
  secretAccessKey: "your secret key",
  signatureVersion: 'v4',
  region:'your region,
});
const putObjectAws = async (bucketName,data,objectKey,content,) => {
  try {
    // Set the parameters.
    const uploadParams = {
      Bucket: bucketName,
      Key: objectKey,
      Body: data,
      ContentType: content,
    };
    var uploadPromise = new AWS.S3().putObject(uploadParams).promise();
    return uploadPromise.then(
      function(data) {
        return true;
      }).catch((err)=>false);
  } catch (err) {
      console.log(err);
    return false;
  }
};
//setting up api url that will accept the object
app.post("/api/aws/uploadObject", upload.single("objectKeyName"), async (req, res, next) => {
  try {
    let objectKey = req.body.keyName + req.file.originalname;
    let bucketName = req.body.bucketName;
    let result=await putObjectAws(
      bucketName,
      req.file.buffer,
      objectKey,
      req.file.mimetype
    );
    if(result ===false){
        res.json({
          status:false,
        });
    }else{
        res.json({
            status:true
        });
    }
  } catch (err) {
    res.json({
        status:false,
      });
  }
});
app.listen(3000);
