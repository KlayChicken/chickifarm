const axios = require('axios');
const fs = require('fs');

// db
const connection = require('../database/dbSetup.js');

// aws
const s3 = require('../aws/awsSetup.js');

const super_image_change = async (_id) => {
    try {
        const [row1, fields1] = await connection.query(
            "SELECT * FROM super_chickiz WHERE chickiz_id=?", [Number(_id)])

        if (row1.length > 0) {
            return 'already'
        }

        // aws start
        // image
        const params_basic = { Bucket: "api.klaychicken.com", Key: `v2super/${_id}.png` };
        const params_full = { Bucket: "api.klaychicken.com", Key: `v2superfull/${_id}.png` };
        const params_small = { Bucket: "api.klaychicken.com", Key: `v2supersmall/${_id}.png` };

        const image_basic = await s3.getObject(params_basic).promise();
        const image_full = await s3.getObject(params_full).promise();
        const image_small = await s3.getObject(params_small).promise();

        const new_param_image_basic = {
            'Bucket': 'api.klaychicken.com',
            'Key': `v2/image/${_id}.png`,
            'Body': image_basic.Body,
            'ContentType': 'image/png',
            'Tagging': 'public=yes'
        }

        const new_param_image_full = {
            'Bucket': 'api.klaychicken.com',
            'Key': `v2full/${_id}.png`,
            'Body': image_full.Body,
            'ContentType': 'image/png',
            'Tagging': 'public=yes'
        }

        const new_param_image_small = {
            'Bucket': 'api.klaychicken.com',
            'Key': `v2small/${_id}.png`,
            'Body': image_small.Body,
            'ContentType': 'image/png',
            'Tagging': 'public=yes'
        }

        const [result1, result2, result3] = await Promise.all([
            s3.upload(new_param_image_basic).promise(),
            s3.upload(new_param_image_full).promise(),
            s3.upload(new_param_image_small).promise()
        ])

        // meta
        const params_meta = { Bucket: "api.klaychicken.com", Key: `v2/meta/${_id}.json` };

        const meta_old = await s3.getObject(params_meta).promise();

        const newData = JSON.parse(meta_old.Body.toString());
        const attrArray = newData.attributes;
        attrArray.unshift({ trait_type: 'super', value: 'super' })
        newData.attributes = attrArray;

        const metaBuff = Buffer.from(JSON.stringify(newData))

        const newMetaParam = {
            'Bucket': 'api.klaychicken.com',
            'Key': `v2/meta/${_id}.json`,
            'Body': metaBuff,
            'ContentType': 'application/json',
            'Tagging': 'public=yes'
        }

        const result4 = await s3.upload(newMetaParam).promise();

        await connection.query(
            "INSERT INTO super_chickiz(chickiz_id) VALUES(?)", [Number(_id)])

        return 'done'
    } catch (err) {
        console.error(err);
        return 'error'
    }
}


module.exports = {
    super_image_change: super_image_change,
}