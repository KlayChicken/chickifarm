const AWS = require('aws-sdk');
const AWSConf = require('../../key/aws/awsInfo.json');

AWS.config.update({
    accessKeyId: AWSConf.accessKeyId,
    secretAccessKey: AWSConf.secretAccessKey,
    region: AWSConf.region
});

const s3 = new AWS.S3();

module.exports = s3;