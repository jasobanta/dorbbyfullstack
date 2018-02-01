'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP
    || process.env.ip
    || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT
    || process.env.PORT
    || 8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URI
      || process.env.MONGOHQ_URL
      || process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME
      || 'mongodb://localhost/dorbbyfullstack'
  },
  paytm: {
    MID: 'Dorbby20257065377016',
		WEBSITE: 'DorbbyWEB',
    CHANNEL_ID: 'WEB',
    INDUSTRY_TYPE_ID: 'Retail109',
    MERCHANT_KEY : 'KrDnNC_wDs169HPb',
    url:'https://secure.paytm.in/oltp-web/processTransaction'
  }
};
