const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

AWS.config.region = process.env.AWS_REGION;
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETKEY,
});

const s3 = new AWS.S3();
const services = {};

services.upload = (name, path) => {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path);
        },
        filename(req, file, cb) {
            const mimetypearray = file.mimetype.split('/');
            const mimetype = mimetypearray[1];
            cb(null, `${file.fieldname}-${Date.now()}.${mimetype}`);
        },
    });
    return multer({ storage }).single(name);
};

services.tempStorage = (name) => {
    const storage = multer.memoryStorage();
    return multer({ storage }).array(name);
};

services.s3MulterUpload = (name) => {
    const storage = multerS3({
        s3,
        bucket: process.env.S3_BUCKET,
        acl: 'public-read',
        key(req, file, cb) {
            const mimetypearray = file.mimetype.split('/');
            const mimetype = mimetypearray[1];
            cb(null, `${file.fieldname}-${_.sortid()}.${mimetype}`);
        },
    });
    return multer({ storage }).single(name);
};

services.kycUpload = (name) => {
    const storage = multerS3({
        s3,
        bucket: process.env.KYC_S3_BUCKET,
        acl: 'public-read',
        key(req, file, cb) {
            const mimetypearray = file.mimetype.split('/');
            const mimetype = mimetypearray[1];
            cb(null, `${file.fieldname}-${_.sortid()}.${mimetype}`);
        },
    });
    return multer({ storage }).fields(name);
};

services.avatarUpload = (name) => {
    const storage = multerS3({
        s3,
        bucket: process.env.AVATAR_S3_BUCKET,
        acl: 'public-read',
        key(req, file, cb) {
            const mimetypearray = file.mimetype.split('/');
            const mimetype = mimetypearray[1];
            cb(null, `${file.fieldname}-${_.sortid()}.${mimetype}`);
        },
    });
    return multer({ storage }).single(name);
};

services.deafaultAvatarUpload = (file, callback) => {
    const params = {
        Body: file.blob,
        Bucket: process.env.S3_AVATAR_BUCKET,
        ACL: 'public-read',
        Key: file.filename,
        ContentType: `application/octet-stream`,
    };
    s3.putObject(params, callback);
};

services.s3Delete = (url) => {
    const [, , , ...filenameSplited] = url.split('/');
    const params = {
        Bucket: process.env.AVATAR_S3_BUCKET,
        Key: filenameSplited.join('/'),
    };
    s3.deleteObject(params, function (err, data) {
        if (data) {
            log.red('File deleted successfully');
        } else {
            log.green(`Check if you have sufficient permissions : ${err}`);
        }
    });
};

services.s3AvatarDelete = (url) => {
    const [, , , ...filenameSplited] = url.split('/');
    const params = {
        Bucket: process.env.AVATAR_S3_BUCKET,
        Key: filenameSplited.join('/'),
    };
    s3.deleteObject(params, function (err, data) {
        if (data) {
            log.red('File deleted successfully');
        } else {
            log.green(`Check if you have sufficient permissions : ${err}`);
        }
    });
};

module.exports = services;
