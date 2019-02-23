const SMSClient = require('@alicloud/sms-sdk')

const {
  SMS_KEY,
  SMS_SECRET
} = process.env

/**
 * 文档 https://help.aliyun.com/document_detail/57458.html?spm=a2c4g.11186623.6.572.ONkvFj
 */
const smsClient = new SMSClient({accessKeyId: SMS_KEY, secretAccessKey: SMS_SECRET})

module.exports = smsClient
