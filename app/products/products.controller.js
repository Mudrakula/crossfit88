'use strict';

angular.module('crossfit88App')
  .controller('ProductsCtrl', function($scope, $http) {
    $scope.products = [];
    $scope.currentProduct = null;
    $scope.pagesCount = 1;
    $scope.search = {
      query: '',
      limit: 10,
      page: 0
    };

    $scope.getProducts = keepPage => {
      if (! keepPage)
        $scope.search.page = 0;

      let queryString = _.reduce($scope.search, (result, value, key) => result + key + '=' + value + '&', '?');
      $http.get('/api/products'+queryString).then(res => {
        $scope.products = res.data.products;
        $scope.pagesCount = Math.ceil(res.data.count / $scope.search.limit);
      });
    };

    $scope.deleteProduct = id => {
      swal({
        title: 'Are you sure?',
        type: 'warning',
        showCancelButton: true
      }, () => {
        $http.post('/api/products/delete', {
          id: id
        }).then(res => {
          if (res.status != 200)
            return console.log(res);

          $scope.products = _.filter($scope.products, product => product._id != id);
        });
      });
    };

    $scope.showProductModal = product => {
      $scope.currentProduct = product;
      angular.element('#product-modal').modal();
    };

    $scope.updateProduct = (product) => {
      $http.post('/api/products/update', product).then(res => {
        if (res.status != 200)
          return console.log(res);

        if (product._id) {
          let index = _.findIndex($scope.products, {_id: product._id});
          $scope.products.splice(index, 1, res.data);
        } else {
          $scope.products.push(res.data);
        }

        product = null;
        angular.element('#product-modal').modal('hide');
      });
    };

    $scope.changeCount = (product, count) => {
      let resultCount = product.saleCount + count;
      
      if (resultCount < 1 || resultCount > product.count)
        return false;

      product.saleCount = resultCount;
    };

    $scope.buy = product => {
      $http.post('/api/sales/create', {
        type: 'product',
        title: product.title,
        cost: product.cost,
        count: product.saleCount,
        purchaseCount: product.purchaseCount,
        date: moment().format('x')
      }).then(res => {
        if (res.status != 200)
          return console.log(res);

        swal({
          title: 'Sold!',
          type: 'success',
          timer: 1000,
          showConfirmButton: false
        });
        product.saleCount = 1;
      });
    }

    $scope.gotoPage = page => {
      $scope.search.page = page;
      $scope.getProducts(true);
    };

    $scope.getProducts();
  });