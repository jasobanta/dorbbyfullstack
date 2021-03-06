'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // Server port
  port: process.env.PORT || 4000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // paging data for all api
  itempPerPage: 20,
  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'dorbbyfullstack-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
    /*  db: {
        safe: true
      }*/
      useMongoClient: true
    }
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '739837842694308',
    clientSecret: process.env.FACEBOOK_SECRET || 'afbac5e0a56f2b759695d016ccea7af8',
    callbackURL: `${process.env.DOMAIN || ''}/auth/facebook/callback`
  },

  twitter: {
    clientID: process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/twitter/callback`
  },

  google: {
    clientID: process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/google/callback`
  },
  paytm: {
    MID: '',
		WEBSITE: '',
    CHANNEL_ID: '',
    INDUSTRY_TYPE_ID: '',
    MERCHANT_KEY : '',
    CALLBACK_URL:'',
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require(`./${process.env.NODE_ENV}.js`) || {});
