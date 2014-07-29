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
             $scope.passWordHashed = new String(CryptoJS.SHA512($scope.passWord + $scope.userName + $scope.salt));
             Auth.setCredentials($scope.userName, $scope.passWordHashed);
//             $scope.loginResult = $scope.Restangular.get();
             $scope.loginResultPromise = $scope.Restangular().all("users").getList();
             $scope.loginResultPromise.then(function(result) {
                $scope.loginResult = result;
                $scope.loginMsg = "You have logged in successfully! Status 200OK technomumbojumbo";
                $state.go("home.cfeed", {}, {reload: true});
//                alert("logged_in");
             }, function(error) {
                $scope.loginMsg = "Arghhh, matey! Check your username or password.";
                Auth.clearCredentials();
//                alert("credentials_cleared");
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
        {id:'5', content:"POST 5", time:"4:05", img: "img/temp_icon.png", author: "you", group: "postGroup", likes:"8", followers: "319"},
        {id:'5', content:"POST 5", time:"4:05", img: "img/temp_icon.png", author: "you", group: "postGroup", likes:"8", followers: "319"},
        {id:'5', content:"POST 5", time:"4:05", img: "img/temp_icon.png", author: "you", group: "postGroup", likes:"8", followers: "319"},
        {id:'5', content:"POST 5", time:"4:05", img: "img/temp_icon.png", author: "you", group: "postGroup", likes:"8", followers: "319"},
        {id:'5', content:"POST 5", time:"4:05", img: "img/temp_icon.png", author: "you", group: "postGroup", likes:"8", followers: "319"},
        {id:'5', content:"POST 5", time:"4:05", img: "img/temp_icon.png", author: "you", group: "postGroup", likes:"8", followers: "319"},
        {id:'6', content:"POST 6", time:"4:05", img: "img/temp_icon.png", author: "me", group: "postGroup", likes:"8", followers: "319"}
    ];
    
    $scope.carousel_images = [
        {id:'1', caption: "GROUP 1", image: "img/temp_icon.png"},
        {id:'2', caption: "GROUP 2", image: "img/temp_icon.png"},
        {id:'3', caption: "GROUP 3", image: "img/temp_icon.png"},
        {id:'4', caption: "GROUP 4", image: "img/temp_icon.png"},
        {id:'4', caption: "GROUP 4", image: "img/temp_icon.png"},
        {id:'4', caption: "GROUP 4", image: "img/temp_icon.png"},
        {id:'4', caption: "GROUP 4", image: "img/temp_icon.png"},
        {id:'4', caption: "GROUP 4", image: "img/temp_icon.png"},
        {id:'4', caption: "GROUP 4", image: "img/temp_icon.png"},
        {id:'4', caption: "GROUP 4", image: "img/temp_icon.png"},
        {id:'4', caption: "GROUP 4", image: "img/temp_icon.png"},
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

vmaControllerModule.controller('groupMessages', ['$scope', '$state', '$rootScope', 'snapRemote', function($scope, $state, $rootscope, snapRemote) {
    $scope.messages = [
        {id:'1', task: "TASK 1", preview_content:"Hi!", img: "img/temp_icon.png", preview_author: "you"},
        {id:'2', task: "TASK 2", preview_content:"Bye!", img: "img/temp_icon.png", preview_author: "me"},
        {id:'3', task: "TASK 3", preview_content:"That", img: "img/temp_icon.png", preview_author: "you"},
        {id:'4', task: "TASK 4", preview_content:"This", img: "img/temp_icon.png", preview_author: "me"},
        {id:'2', task: "TASK 2", preview_content:"Bye!", img: "img/temp_icon.png", preview_author: "me"},
        {id:'3', task: "TASK 3", preview_content:"That", img: "img/temp_icon.png", preview_author: "you"},
        {id:'4', task: "TASK 4", preview_content:"This", img: "img/temp_icon.png", preview_author: "me"},
        {id:'2', task: "TASK 2", preview_content:"Bye!", img: "img/temp_icon.png", preview_author: "me"},
        {id:'3', task: "TASK 3", preview_content:"That", img: "img/temp_icon.png", preview_author: "you"},
        {id:'4', task: "TASK 4", preview_content:"This", img: "img/temp_icon.png", preview_author: "me"},
        {id:'5', task: "TASK 5", preview_content:"msg content", img: "img/temp_icon.png", preview_author: "you"},
        {id:'6', task: "TASK 6", preview_content:"More stuff", img: "img/temp_icon.png", preview_author: "me"}
    ];
    
        $scope.displayMessages = function(click_id) {
//            $scope.pActiv = true;
//            $scope.tActiv = false;
//            console.log(click_id);
            $state.go('home.groupMessages.message', {id:click_id}, {reload: false});
            snapRemote.close();
        }
        
        
        $scope.settings = {
    //        element: null,
    //        dragger: null,
            disable: 'right',
//            addBodyClasses: true,
            hyperextensible: false,
//            resistance: 0.5,
//            flickThreshold: 50,
//            transitionSpeed: 0.3,
//            easing: 'ease',
    //        maxPosition: 266,
    //        minPosition: -266,
//            tapToClose: true,
//            touchToDrag: true,
//            slideIntent: 40,
//            minDragDistance: 5
        }

        var snapper = new Snap({
          element: document.getElementById('content')
        });

        snapRemote.getSnapper().then(function(snapper) {
            snapper.open('left');
        });
}]);

vmaControllerModule.controller('message', ['$scope', '$state', '$stateParams', '$location', '$anchorScroll', '$timeout', function($scope, $state, $stateParams, $location, $anchorScroll, $timeout) {
        $scope.id = $stateParams.id;
        $scope.groupMSGs = [
            {id:'1', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'2', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'3', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'4', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'5', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"},
            {id:'6', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: "BLAH BLAH"}
        ];
        $timeout(function() {
            $location.hash('bottom');
            $anchorScroll();
        });
        $scope.addMsg = function() {
            $scope.groupMSGs.push({id:'6', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: $scope.msg.message});
            $scope.msg = "";
            $timeout(function() {
                $location.hash('bottom');
                $anchorScroll();
            });
        }
}]);

vmaControllerModule.controller('groupFeed', ['$scope', '$state', '$modal', '$rootScope', 'snapRemote', function($scope, $state, $modal, $rootscope, snapRemote) {
    //OPENS THE SNAPPER TO DISPLAY DETAILS
        $scope.displayDetail = function(click_id) {
        $state.go('home.groupFeed.detail', {id:click_id}, {reload: false});
        snapRemote.close();
    }
    
    //ACCESSES SERVER AND UPDATES THE LIST OF GROUPS
        $scope.updateGroups = function() {
            var gProm = $scope.$parent.Restangular().all("groups").one("byMembership").getList();
            gProm.then(function(success) {
                $rootscope.groups = success;
            }, function(fail) {
    //            console.log(fail);
            });
            var gPromByMan = $scope.$parent.Restangular().all("groups").one("byManager").getList();
            gPromByMan.then(function(success) {
                $rootscope.manGroups = success;
            }, function(fail) {
    //            console.log(fail);
            });
        }

        $scope.updateGroups();
    
    //OPENING THE MODAL TO ADD A GROUP
        $scope.addGroup = function() {
            $scope.openAdd();
        }

        $scope.openAdd = function () {
            var modalInstance = $modal.open({
              templateUrl: 'partials/addGroup.html',
              controller: ModalInstanceCtrl,
              resolve: {
                  window_scope: function() {
                    return $scope;
                  }
              }
            });

            modalInstance.result.then(function (selectedItem) {
    //          $scope.selected = selectedItem;
            }, function () {
    //          What to do on dismiss
    //          $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //Controller for the Modal PopUp Add
        var ModalInstanceCtrl = function ($scope, $modalInstance, window_scope) {
            $scope.ok = function () {
                $scope.message = "ADD SUCCESS!";

                var promise = $scope.$parent.Restangular().all("groups").post({"name": $scope.name, "description": $scope.description});

                promise.then(function(success) {
                    console.log(success);
                    window_scope.updateGroups();
                    $modalInstance.close();
                }, function(fail) {
    //                console.log(fail);
                    $scope.message = "ADD FAILED";
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

    
    //OPENING THE MODAL TO DELETE A GROUP
        $scope.deleteGroup = function(id) {
            $scope.openDelete(id);
        }

        $scope.openDelete = function (id) {
            console.log(id);
            var modalInstance = $modal.open({
              templateUrl: 'partials/deleteGroup.html',
              controller: ModalInstanceCtrlDelete,
              resolve: {
                  deleteId: function() {
                      return id;
                  },
                  window_scope: function() {
                    return $scope;
                  }
              }
            });

            modalInstance.result.then(function (selectedItem) {
    //          $scope.selected = selectedItem;
            }, function () {
    //          What to do on dismiss
    //          $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //Controller for the Modal PopUp Delete
        var ModalInstanceCtrlDelete = function ($scope, $modalInstance, deleteId, window_scope) {
            $scope.ok = function () {
                var promise = $scope.$parent.Restangular().all("groups").all(deleteId).remove();

                promise.then(function(success) {
                    window_scope.updateGroups();
                    console.log(success);
                    $scope.message = "DELETE SUCCESS!";
    //                $rootscope.groups.push({name:$scope.name, description: $scope.description});
                    $modalInstance.close();
                }, function(fail) {
    //                console.log(fail);
                    $scope.message = "DELETE FAILED";
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
    
    //OPENING THE MODAL TO EDIT A GROUP
        $scope.editGroup = function(id) {
            $scope.openEdit(id);
        }

        $scope.openEdit = function (id) {
            console.log(id);
            var modalInstance = $modal.open({
              templateUrl: 'partials/editGroup.html',
              controller: ModalInstanceCtrlEdit,
              resolve: {
                  editId: function() {
                      return id;
                  },
                  window_scope: function() {
                    return $scope;
                  }
              }
            });

            modalInstance.result.then(function (selectedItem) {
        //          $scope.selected = selectedItem;
            }, function () {
        //          What to do on dismiss
        //          $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //Controller for the Modal PopUp Edit
        var ModalInstanceCtrlEdit = function ($scope, $filter, $modalInstance, editId, window_scope) {
            $scope.group = $filter('getById')($rootscope.groups, editId);
        //        console.log(found);
            $scope.ok = function () {
                var promise = $scope.$parent.Restangular().all("groups").all(editId).post($scope.group);

                promise.then(function(success) {
                    $scope.message = "EDIT SUCCESS!";
                    window_scope.updateGroups();
                    console.log(success);
        //                $rootscope.groups.push({name:$scope.name, description: $scope.description});
                    $modalInstance.close();
                }, function(fail) {
        //                console.log(fail);
                    $scope.message = "EDIT FAILED";
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
    
    //UI-SNAP SETTINGS
        $scope.settings = {
//        element: null,
//        dragger: null,
        disable: 'right',
//        addBodyClasses: true,
        hyperextensible: false,
//        resistance: 0.5,
//        flickThreshold: 50,
//        transitionSpeed: 0.3,
//        easing: 'ease',
//        maxPosition: 266,
//        minPosition: -266,
//        tapToClose: true,
//        touchToDrag: true,
//        slideIntent: 40,
//        minDragDistance: 5
    }
    
        var snapper = new Snap({
      element: document.getElementById('content')
    });
    
        snapRemote.getSnapper().then(function(snapper) {
            snapper.open('left');
        });
}]);

vmaControllerModule.controller('groupFeed.post', ['$scope', '$state', '$stateParams', '$modal', '$rootScope', function($scope, $state, $stateParams, $modal, $rootScope) {
//    console.log($stateParams);
    $scope.id = $stateParams.id;
    $scope.$parent.pActiv = true;
    $scope.posts = [
        {id:'1', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "you", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'2', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "me", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'3', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "you", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'4', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "me", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'3', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "you", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'4', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "me", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'3', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "you", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'4', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "me", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'3', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "you", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'4', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "me", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'3', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "you", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'4', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "me", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'5', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "you", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"},
        {id:'6', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "me", post: "This is content", comment_count: "43", likes: "3", time: "3:10AM", content: "THIS IS CONTENT"}
    ];
    
    $rootScope.posts = $scope.posts;
    
    $scope.addPost = function() {
        $scope.open();
    }
    
    $scope.open = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/addPost.html',
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
    //Controller for the Modal PopUp
    var ModalInstanceCtrl = function ($scope, $modalInstance) {
        $scope.ok = function () {
            $rootScope.posts.push({id:'6', avatar_img: "img/temp_icon.png", img: "img/temp_icon.png", author: "me", post: "This is content", comment_count: "12", likes: "3", time: "3:10AM", content: $scope.content});
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
}]);

vmaControllerModule.controller('groupFeed.task', ['$scope', '$state', '$stateParams', '$modal', '$rootScope', function($scope, $state, $stateParams, $modal, $rootScope) {
//    console.log($stateParams);
    $scope.id = $stateParams.id;
    $scope.$parent.pActiv = true;
    $scope.tasks =[
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"},
            {title: "TASK TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"}
    ];
    
    
    $rootScope.tasks = $scope.tasks;
    
    $scope.addTask = function() {
        $scope.open();
    }
    
    $scope.open = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/addTask.html',
          controller: ModalInstanceCtrl,
          size: size
        });

        modalInstance.result.then(function (selectedItem) {
//          $scope.selected = selectedItem;
        }, function () {
//          What to do on dismiss
//          $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    //Controller for the Modal PopUp
    var ModalInstanceCtrl = function ($scope, $modalInstance) {
//        console.log($scope.$parent);
        $scope.ok = function () {
            console.log($scope.newTask);
            $scope.$parent.tasks.push({title: $scope.newTask.name, date: "4/21 4:22PM", location: "39410 BLAH RD", duration: "2"});
            $modalInstance.close();
//            console.log($rootscope.groups);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
}]);

vmaControllerModule.controller('efforts', ['$scope', '$state', function($scope, $state) {
    $scope.tasks = [
        {id:'1', task_name: "SIGNED UP TASK 1", icon: "img/temp_icon.png"},
        {id:'2', task_name: "SIGNED UP TASK 2", icon: "img/temp_icon.png"},
        {id:'3', task_name: "SIGNED UP TASK 3", icon: "img/temp_icon.png"},
        {id:'4', task_name: "SIGNED UP TASK 4", icon: "img/temp_icon.png"},
        {id:'3', task_name: "SIGNED UP TASK 3", icon: "img/temp_icon.png"},
        {id:'4', task_name: "SIGNED UP TASK 4", icon: "img/temp_icon.png"},
        {id:'3', task_name: "SIGNED UP TASK 3", icon: "img/temp_icon.png"},
        {id:'4', task_name: "SIGNED UP TASK 4", icon: "img/temp_icon.png"},
        {id:'3', task_name: "SIGNED UP TASK 3", icon: "img/temp_icon.png"},
        {id:'4', task_name: "SIGNED UP TASK 4", icon: "img/temp_icon.png"},
        {id:'5', task_name: "SIGNED UP TASK 5", icon: "img/temp_icon.png"},
        {id:'6', task_name: "SIGNED UP TASK 6", icon: "img/temp_icon.png"}
    ];
    $scope.invites = [
        {id:'1', group_name: "GROUP 1", icon: "img/temp_icon.png"},
        {id:'2', group_name: "GROUP 2", icon: "img/temp_icon.png"},
        {id:'3', group_name: "GROUP 3", icon: "img/temp_icon.png"},
        {id:'4', group_name: "GROUP 4", icon: "img/temp_icon.png"},
        {id:'5', group_name: "GROUP 5", icon: "img/temp_icon.png"},
        {id:'3', group_name: "GROUP 3", icon: "img/temp_icon.png"},
        {id:'4', group_name: "GROUP 4", icon: "img/temp_icon.png"},
        {id:'5', group_name: "GROUP 5", icon: "img/temp_icon.png"},
        {id:'3', group_name: "GROUP 3", icon: "img/temp_icon.png"},
        {id:'4', group_name: "GROUP 4", icon: "img/temp_icon.png"},
        {id:'5', group_name: "GROUP 5", icon: "img/temp_icon.png"},
        {id:'3', group_name: "GROUP 3", icon: "img/temp_icon.png"},
        {id:'4', group_name: "GROUP 4", icon: "img/temp_icon.png"},
        {id:'5', group_name: "GROUP 5", icon: "img/temp_icon.png"},
        {id:'3', group_name: "GROUP 3", icon: "img/temp_icon.png"},
        {id:'4', group_name: "GROUP 4", icon: "img/temp_icon.png"},
        {id:'5', group_name: "GROUP 5", icon: "img/temp_icon.png"},
        {id:'6', group_name: "GROUP 6", icon: "img/temp_icon.png"}
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
        {id:'3', description: "BLAH BLAH"},
        {id:'4', description: "BLAH BLAH"},
        {id:'5', description: "BLAH BLAH"},
        {id:'3', description: "BLAH BLAH"},
        {id:'4', description: "BLAH BLAH"},
        {id:'5', description: "BLAH BLAH"},
        {id:'3', description: "BLAH BLAH"},
        {id:'4', description: "BLAH BLAH"},
        {id:'5', description: "BLAH BLAH"},
        {id:'6', description: "BLAH BLAH"}
    ];
    
}]);

vmaControllerModule.controller('task', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
    $scope.id = $stateParams.id;
    $scope.task =
        {title: "TITLE", date: "4/21 4:22PM", location: "39410 BLAH RD", description: "THIS IS A DESCRIPTION"};
    
    $scope.map = {
        sensor: true, //required
        size: '500x300',
        zoom: 15, //a low zoom number indicates a wider view of the world.
        center: $scope.task.location, //center location. it can be entered as a set of coordinates or a physical address.
        markers: [$scope.task.location], //marker locations
        mapevents: {redirect: true, loadmap: false}
        /* setting loadmap=true loads the map when clicked. loadmap=false will not load the map. 
        when the map is clicked on, the function(MAP_EVENTS), line 104 in adaptive-googlemaps.js is called.
        the function reads if (MAP_EVENTS.redirect) as true and it will evaluate the body of the if statement.
        */
    };
}]);

vmaControllerModule.controller('hours', ['$scope', '$state', '$stateParams', '$modal', '$rootScope', function($scope, $state, $stateParams, $modal, $rootScope) {
    $scope.entries = $rootScope.entries = [
        {title: "Name of Completed Task 1", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "4", badge_type: "1", approved: true},    
        {title: "Name of Completed Task 2", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "2", badge_type: "3", approved: false},
        {title: "Name of Completed Task 3", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "1", badge_type: "1", approved: false},
        {title: "Name of Completed Task 4", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "6", badge_type: "2", approved: true},
        {title: "Name of Completed Task 5", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "3", badge_type: "1", approved: true},
        {title: "Name of Completed Task 3", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "1", badge_type: "1", approved: false},
        {title: "Name of Completed Task 4", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "6", badge_type: "2", approved: true},
        {title: "Name of Completed Task 5", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "3", badge_type: "1", approved: true},
        {title: "Name of Completed Task 3", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "1", badge_type: "1", approved: false},
        {title: "Name of Completed Task 4", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "6", badge_type: "2", approved: true},
        {title: "Name of Completed Task 5", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "3", badge_type: "1", approved: true},
        {title: "Name of Completed Task 3", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "1", badge_type: "1", approved: false},
        {title: "Name of Completed Task 4", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "6", badge_type: "2", approved: true},
        {title: "Name of Completed Task 5", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "3", badge_type: "1", approved: true},
        {title: "Name of Completed Task 6", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "5", badge_type: "4", approved: false}
    ];
    
    
         
    $scope.addEntry = function() {
        $scope.open();
    }

    
    
  $scope.items = ['item1', 'item2', 'item3'];
    
    $scope.open = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/addHoursEntry.html',
          controller: ModalInstanceCtrl,
          size: size
        });

        modalInstance.result.then(function (selectedItem) {
//          $scope.selected = selectedItem;
        }, function () {
//          What to do on dismiss
//          $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    
    
    
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

    var ModalInstanceCtrl = function ($scope, $modalInstance) {
            $scope.ok = function () {
//                console.log($scope.name);
//                console.log($scope.duration);
                $rootScope.entries.push({title: $scope.name, start: "6/21 4:22PM", end: "6/21 7:22PM", duration: $scope.duration, badge_type: "4", approved: false});
                $modalInstance.close();
    //            console.log($rootscope.groups);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
    };
}]);

vmaControllerModule.controller('awards', function ($scope) {

    $scope.badges = [
        ["Badge1", 42],
        ["Badge2", 35],
        ["Badge3", 32],
        ["Badge4", 12],
        ["Badge5", 21]
    ];
    
    $scope.total_hours = 42 + 35 + 32 + 12 + 21;
    $scope.badge1_percent = Math.round($scope.badges[0][1]/$scope.total_hours * 100);
    $scope.badge2_percent = Math.round($scope.badges[1][1]/$scope.total_hours * 100);
    $scope.badge3_percent = Math.round($scope.badges[2][1]/$scope.total_hours * 100);
    $scope.badge4_percent = Math.round($scope.badges[3][1]/$scope.total_hours * 100);
    $scope.badge5_percent = Math.round($scope.badges[4][1]/$scope.total_hours * 100);

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false

            },
            title: {
                text: ''
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            }
        },
        series: [{
            type: 'pie',
            data: $scope.badges
        }],

        loading: false
    }

});

vmaControllerModule.controller('settings', ['$scope', '$state', 'Auth',
    function($scope, $state, Auth) {
//        console.log("HI");
      $scope.logOut = function() {
//          console.log('loggedout');
          Auth.clearCredentials();
          $state.go("home", {}, {reload: true});
      }
      
      $scope.deleteUser = function() {
          $scope.getUserPromise = $scope.Restangular().all("users").getList();
          $scope.getUserPromise.then(function(success) {
              $scope.Restangular().all("users").one(success[0].id.toString()).remove().then(
                  function(success) {
                      console.log(success); $state.go("home", {}, {reload: true});
                  }, function(failure) {
                      console.log(failure)
                  }
              );
          }, function(failure) {
              console.log(failure);
          });
      }
}]);

vmaControllerModule.controller('registerCtrl', ['$scope', '$state', 'Auth', '$timeout', '$rootScope', '$http', 
    function($scope, $state, Auth, $timeout, $rootScope, $http) {
      $scope.registerUser = function() {
            Auth.setCredentials("Visitor", "test");
            $scope.salt = "nfp89gpe";
            $scope.register.password = new String(CryptoJS.SHA512($scope.register.password + $scope.register.username + $scope.salt));
            $scope.$parent.Restangular().all("users").post($scope.register).then(
                function(success) {
                    Auth.clearCredentials();
                    console.log(success);
                    $state.go("home", {}, {reload: true});
                },function(fail) {
                    Auth.clearCredentials();
                    alert(fail.status + " " + fail.statusText);
                }
            );
          
            Auth.clearCredentials();
      }
}]);

//Not really used in the scope of the VMA app at this point, but still here. Will probably need soon.
vmaControllerModule.controller('menuCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.goBack = function() {
        window.history.back();
    };
    $scope.state = $state;
}]);

//Not really used in the scope of the VMA app at this point, but still here. Will probably need soon.
vmaControllerModule.controller('calendar', ['$scope', '$state', function($scope, $state) {
    console.log("test");
    myFunction();
}]);

vmaControllerModule.controller('lHelpCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
    $scope.msg = $stateParams.msg;
}]);