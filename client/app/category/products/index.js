'use strict';

import angular from 'angular';

//import routes from './product.routes';
import ProductController from './product.controller';

//export default angular.module('dorbbyfullstackApp.product', ['ui.router', product])
export default angular.module('dorbbyfullstackApp.product',[])
 // .config(routes)
  .controller('ProductController', ProductController)
  .name;
