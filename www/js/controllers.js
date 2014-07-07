'use strict';

/* Controllers */

var vmaControllerModule = angular.module('vmaControllerModule', []);

vmaControllerModule.controller('loginCtrl', ['$scope', 'Auth', '$state',
 function($scope, Auth, $state) {
     if($scope.isAuthenticated() === true) {
         //Point 'em to logged in page of app
         $state.go('home');
     }
     
     //we need to put the salt on server + client side and it needs to be static
     $scope.salt = "nfp89gpe"; //PENDING
     
     $scope.submit = function() {
         if ($scope.userName && $scope.passWord) {
             //$scope.passWordHashed = new String(CryptoJS.SHA512($scope.passWord + $scope.userName + $scope.salt));
//             console.log($scope.passWordHashed);
             Auth.setCredentials($scope.userName, $scope.passWord);
//             $scope.loginResult = $scope.Restangular.get();
             $scope.loginResultPromise = $scope.Restangular().all("users").get("2");
             $scope.loginResultPromise.then(function(result) {
                $scope.loginResult = result;
                $scope.loginMsg = "You have logged in successfully! Status 200OK technomumbojumbo";
                $state.go('home');
             }, function(error) {
                $scope.loginMsg = "Arghhh, matey! Check your username or password.";
                Auth.clearCredentials();
             });
             $scope.userName = '';
             $scope.passWord = '';
         } else if(!$scope.userName && !$scope.passWord) {
             $scope.loginMsg = "You kiddin' me m8? No username or password?";
         } else if (!$scope.userName) {
             $scope.loginMsg = "No username? Tryina hack me?";
             $scope.loginResult = "";
         } else if (!$scope.passWord) {
             $scope.loginMsg = "What? No password!? Where do you think you're going?";
             $scope.loginResult = "";
         }
     };
 }]);

vmaControllerModule.controller('communityFeedController', ['$scope', '$state', function($scope, $state) {
    $scope.posts = [
        {id:'1', content:"POST 1", time:"4:05", img: "img/temp_icon.png", author: "you", group: "postGroup", likes:"8", followers: "319"},
        {id:'2', content:"POST 2", time:"4:05", img: "img/temp_icon.png", author: "me", group: "postGroup", likes:"8", followers: "319"},
        {id:'3', content:"POST 3", time:"4:05", img: "img/temp_icon.png", author: "you", group: "postGroup", likes:"8", followers: "319"},
        {id:'4', content:"POST 4", time:"4:05", img: "img/temp_icon.png", author: "me", group: "postGroup", likes:"8", followers: "319"},
        {id:'5', content:"POST 5", time:"4:05", img: "img/temp_icon.png", author: "you", group: "postGroup", likes:"8", followers: "319"},
        {id:'6', content:"POST 6", time:"4:05", img: "img/temp_icon.png", author: "me", group: "postGroup", likes:"8", followers: "319"}
    ];
    
    $scope.carousel_images = [
        {id:'1', caption: "GROUP 1", image: "img/temp_icon.png"},
        {id:'2', caption: "GROUP 2", image: "img/temp_icon.png"},
        {id:'3', caption: "GROUP 3", image: "img/temp_icon.png"},
        {id:'4', caption: "GROUP 4", image: "img/temp_icon.png"},
        {id:'5', caption: "GROUP 5", image: "img/temp_icon.png"},
        {id:'6', caption: "GROUP 6", image: "img/temp_icon.png"}
    ];
    
      var slides = $scope.slides = [];
      $scope.addSlide = function() {
        var newWidth = 600 + slides.length;
        slides.push({
          image: 'img/image13.png',
          text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
            ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
        });
      };
      for (var i=0; i<4; i++) {
        $scope.addSlide();
      }
    
}]);

vmaControllerModule.controller('groupMessages', ['$scope', '$state', function($scope, $state) {
    $scope.messages = [
        {id:'1', task: "TASK 1", preview_content:"Hi!", img: "img/temp_icon.png", preview_author: "you"},
        {id:'2', task: "TASK 2", preview_content:"Bye!", img: "img/temp_icon.png", preview_author: "me"},
        {id:'3', task: "TASK 3", preview_content:"That", img: "img/temp_icon.png", preview_author: "you"},
        {id:'4', task: "TASK 4", preview_content:"This", img: "img/temp_icon.png", preview_author: "me"},
        {id:'5', task: "TASK 5", preview_content:"msg content", img: "img/temp_icon.png", preview_author: "you"},
        {id:'6', task: "TASK 6", preview_content:"More stuff", img: "img/temp_icon.png", preview_author: "me"}
    ];
}]);

vmaControllerModule.controller('groupFeed', ['$scope', '$state', '$modal', function($scope, $state, $modal) {
    $scope.isCollapsed = false;
    
    $scope.displayPosts = function(click_id) {
        $scope.isCollapsed = !$scope.isCollapsed;
        $state.go('groupFeed.post', {id:click_id}, {reload: false});
    }    
    $scope.addGroup = function() {
        $scope.open();
    }
    
    $scope.open = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/addGroup.html',
          controller: ModalInstanceCtrl,
          size: size
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
//          What to do on dismiss
//          $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    $scope.groups = [
        {id:'1', group_name: "GROUP 1", icon: "img/temp_icon.png"},
        {id:'2', group_name: "GROUP 2", icon: "img/temp_icon.png"},
        {id:'3', group_name: "GROUP 3", icon: "img/temp_icon.png"},
        {id:'4', group_name: "GROUP 4", icon: "img/temp_icon.png"},
        {id:'5', group_name: "GROUP 5", icon: "img/temp_icon.png"},
        {id:'6', group_name: "GROUP 6", icon: "img/temp_icon.png"}
    ];
    
    
    //Controller for the Modal PopUp
    var ModalInstanceCtrl = function ($scope, $modalInstance) {
        $scope.ok = function () {
        $modalInstance.close();
        };

        $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        };
    };
}]);

vmaControllerModule.controller('groupFeed.post', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
    $scope.id = $stateParams.id;
    $scope.posts = [
        {id:'1', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "you", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'2', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "me", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'3', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "you", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'4', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "me", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'5', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "you", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'6', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "me", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"}
    ];
}]);

vmaControllerModule.controller('efforts', ['$scope', '$state', function($scope, $state) {
    $scope.groups = [
        {id:'1', group_name: "GROUP 1", icon: "img/temp_icon.png"},
        {id:'2', group_name: "GROUP 2", icon: "img/temp_icon.png"},
        {id:'3', group_name: "GROUP 3", icon: "img/temp_icon.png"},
        {id:'4', group_name: "GROUP 4", icon: "img/temp_icon.png"},
        {id:'5', group_name: "GROUP 5", icon: "img/temp_icon.png"},
        {id:'6', group_name: "GROUP 6", icon: "img/temp_icon.png"}
    ];
    $scope.invites = [
        {id:'1', group_name: "GROUP 1", icon: "img/temp_icon.png"},
        {id:'2', group_name: "GROUP 2", icon: "img/temp_icon.png"},
        {id:'3', group_name: "GROUP 3", icon: "img/temp_icon.png"},
        {id:'4', group_name: "GROUP 4", icon: "img/temp_icon.png"},
        {id:'5', group_name: "GROUP 5", icon: "img/temp_icon.png"},
        {id:'6', group_name: "GROUP 6", icon: "img/temp_icon.png"}
    ];
}]);

vmaControllerModule.controller('message', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
    console.log("hi");
    console.log($stateParams);
    $scope.groupMSGs = [
        {id:'1', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
        {id:'2', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
        {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
        {id:'4', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
        {id:'5', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
        {id:'6', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"}
    ];
}]);
vmaControllerModule.controller('group', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
    $scope.title = "TITLE OF GROUP/EFFORT";
    $scope.effort = {description: "WE HAVE TO DO THINGS"};
    $scope.tasks = [
        {id:'1', description: "BLAH BLAH"},
        {id:'2', description: "BLAH BLAH"},
        {id:'3', description: "BLAH BLAH"},
        {id:'4', description: "BLAH BLAH"},
        {id:'5', description: "BLAH BLAH"},
        {id:'6', description: "BLAH BLAH"}
    ];
    
}]);

vmaControllerModule.controller('task', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
    $scope.task = 
        {title: "TITLE",
        date: "4/21 4:22PM",
        location: "39410 BLAH RD",
        description: "THIS IS A DESCRIPTION"};
    console.log($scope.task.title);
}]);



//Not really used in the scope of the VMA app at this point, but still here. Will probably need soon.
vmaControllerModule.controller('menuCtrl', ['$scope', '$state',
    function($scope, $state) {
        console.log("HI");
        $scope.goBack = function() {
            window.history.back();
        };
    }]);

vmaControllerModule.controller('lHelpCtrl', ['$scope', '$state', '$stateParams',
 function($scope, $state, $stateParams) {
     $scope.msg = $stateParams.msg;
 }]);