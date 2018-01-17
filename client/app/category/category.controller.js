'use strict';

export default class CategoryController {
  products: Object[];
  catename: String;
  catInfo: Object[];
  catId;
  $http;
  $scope;
  socket;
  $stateParams;
  price = [];
  color = [];
  size = [];
  menu = [];
  BannerImages = [];


  /*@ngInject*/
  constructor($http, $scope, socket, $stateParams) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;
    this.$stateParams = $stateParams;
    this.catename = this.$stateParams.catename;
  }
  $onInit() {
    this.$http.get(`/api/categories/getbyname/${this.catename}`)
    .then(res =>{
      this.catInfo = res.data;

      console.log(this.catInfo);
      if (this.$stateParams.subcates) {
        angular.forEach(this.catInfo.childs,function(childs,key){
          if(childs.name===this.$stateParams.subcates)
          this.catId = childs._id;
        },this);
      } else {
        this.catId = this.catInfo._id;
      }
//      console.log(this.catId);
    this.$http.get(`/api/products/${this.catId}/category/`)
      .then(response => {
      this.products = response.data;
      var products = this.products;
      angular.forEach(this.products,function(value,key){
        this.$http.get('/api/products/aggregrate/'+value.itemgroupcode)
        .then(res =>{
          var resdata = res.data;
          var variants={sizes:[],colors:[],images:[]};
          angular.forEach(resdata,function(v,k){
            if(variants.sizes.indexOf(v.size.name)===-1)
            variants.sizes.push(v.size.name);

            if(variants.colors.indexOf(v.color.name)===-1){
            variants.colors.push(v.color.name);
            }
            if(v.images.length){

              for(var i=0;i<v.images.length;i++)
              {
                variants.images[v.color.name]=v.images[i].logs;
              //  variants.images[v.color.name].push();
              }
            }
            //var colorname = v.color.name;
          },variants);
          variants.sizes.sort();
           value.variants = variants;
        });
      },this);

console.log(this.products);
    });
  });

    this.brand = [
      {name:'Chiktone',Productcount:'(1000)'},
      {name:'Chiktone',Productcount:'(1000)'},
      {name:'Chiktone',Productcount:'(1000)'},
      {name:'Chiktone',Productcount:'(1000)'},
      {name:'Chiktone',Productcount:'(1000)'},
      {name:'Chiktone',Productcount:'(1000)'},
      {name:'Chiktone',Productcount:'(1000)'},
      {name:'Chiktone',Productcount:'(1000)'},

    ];
    this.price = [
      {price:'599',pricecount:'(400)'},
      {price:'599',pricecount:'(400)'},
      {price:'599',pricecount:'(400)'},
      {price:'599',pricecount:'(400)'},
      {price:'599',pricecount:'(400)'},
      {price:'599',pricecount:'(400)'},
      {price:'599',pricecount:'(400)'}
    ];
    this.color = [
      {color:'red',colorname:'Red',colorcount:'(270)'},
      {color:'red',colorname:'Red',colorcount:'(270)'},
      {color:'red',colorname:'Red',colorcount:'(270)'},
      {color:'red',colorname:'Red',colorcount:'(270)'},
      {color:'red',colorname:'Red',colorcount:'(270)'},

    ];
    this.size = [
      {size:'XL'},
      {size:'XL'},
      {size:'XL'},
      {size:'XL'},
      {size:'XL'},
    ];
    this.menu = [
      {name:'Top Wear', count:'(1523)', url:'#'},
      {name:'Bottom Wear', count:'(1523)',url:'#'},
      {name:'Top Wear', count:'(1523)',url:'#'},
    ];
    this.BannerImages='/assets/images/banner-sale.jpg';


  }
}
