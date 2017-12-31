'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './enquiry.events';

var EnquirySchema = new mongoose.Schema({
  sellername: String,
  emailaddress: String,
  mobilenumber: Number,
  brand: String,
  companyname: String,
  remark: String,
  etype: String,
});

registerEvents(EnquirySchema);
export default mongoose.model('Enquiry', EnquirySchema);
