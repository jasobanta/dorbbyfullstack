'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class AdminMenuComponent {
  menu = [{
    title: 'Admin Settings',
    state: 'admin',
    class: 'fa fa-cog',
    submenu: [
      {title: 'Add Masters', state: 'mastersetting-add'},
      {title: 'Master Configuration List', state: 'mastersetting'}
  ]
},
{
  title: 'Category Management',
  state: 'category',
  class: 'fa fa-folder',
  submenu: [
    {title: 'Add New Main Categories', state: 'addrootcat'},
    {title: 'List All Main Categories', state: 'rootcatlist'},
    {title: 'Add New Sub Categories', state: 'addsubcategory'},
    {title: 'List All Sub Categories', state: 'subcategorylist'},
    {title: 'Add New Item Categories', state: 'additemcategory'},
    {title: 'List All Item Categories', state: 'itemcategorylist'},
    {title: 'Add New Item Sub Categories', state: 'additemsubcategory'},
    {title: 'List All Item Sub Categories', state: 'itemsubcategorylist'},
    {title: 'Add New Type Categories', state: 'addtypecategory'},
    {title: 'List All Type Categories', state: 'typecategorylist'}
]
},
{
  title: 'Order Management',
  state: 'order',
  class: 'fa fa-file',
  submenu: [
    {title: 'List of Orders', state: 'orderslist'},
]
}
];
  isLoggedIn: Function;
  isAdmin: Function;
  getCurrentUser: Function;
  isCollapsed = true;
  $state;
  $currentstate;
  menustate = '';

  constructor(Auth, $state) {
    'ngInject';
    this.$state = $state;
    this.currentstate = this.$state.current.name;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    //console.log();

  }
  $onInit(){
    var currentstate = this.currentstate;
    var menustate = '';
    if(['addrootcat', 'addrootcatlist', 'addsubcategory', 'subcategorylist',
     'itemcategorylist', 'additemcategory', 'additemsubcategory', 'itemsubcategorylist',
      'rootcatlist', 'addtypecategory', 'typecategorylist', 'mastersetting', 'mastersetting-add'].indexOf(this.currentstate)!==-1) {
      this.isCollapsed = false;
    }
    angular.forEach(this.menu,function(values,keys){
      var submenu = values.submenu;
      var valuestate = values.state;
      console.log('currentstate'+currentstate);
      console.log(values);
      angular.forEach(submenu, function(value, key){
        console.log('currentstate'+currentstate);
        console.log(value);
        if (currentstate === value.state) {
          menustate = values.state;
        }
      });
    });
    this.menustate = menustate;
  }

}

export default angular.module('directives.adminmenu', [])
  .component('adminmenu', {
    template: require('./admin.html'),
    controller: AdminMenuComponent
  })
  .name;
