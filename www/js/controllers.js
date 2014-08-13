'use strict';
/* Controllers */
var vmaControllerModule = angular.module('vmaControllerModule', []);

vmaControllerModule.controller('loginCtrl', ['$scope', 'Auth', '$state', 'ngNotify', '$timeout', function($scope, Auth, $state, ngNotify, $timeout) {
     if($scope.isAuthenticated() === true) {
         //Point to logged in page of app
         $state.go('home');
     }
     $scope.salt = "nfp89gpe"; //PENDING - NEED TO GET ACTUAL SALT
     $scope.submit = function() {
         if ($scope.userName && $scope.passWord) {
             $timeout(function() {
                 document.activeElement.blur();
                 $scope.passWordHashed = new String(CryptoJS.SHA512($scope.passWord + $scope.userName + $scope.salt));
                 Auth.setCredentials($scope.userName, $scope.passWordHashed);
                 $scope.userName = '';
                 $scope.passWord = '';
                 $scope.loginResultPromise = $scope.Restangular().all("users").all("myUser").getList();
                 $scope.loginResultPromise.then(function(result) {
                    $scope.loginResult = result;
                    $scope.loginMsg = "You have logged in successfully!";
                    $state.go("home.cfeed", {}, {reload: true});
                    ngNotify.set($scope.loginMsg, 'success');
                 }, function(error) {
                    $scope.loginMsg = "Incorrect username or password.";
                    ngNotify.set($scope.loginMsg, {position: 'top', type: 'error'});
                    Auth.clearCredentials();
                 });
             }, 250);
         } else {
             $scope.loginMsg = "Please enter a username or password.";
             ngNotify.set($scope.loginMsg, {position: 'top', type: 'error'});
         }
     };
 }]);

vmaControllerModule.controller('registerCtrl', ['$scope', '$state', 'Auth', 'ngNotify', function($scope, $state, Auth, ngNotify) {
      $scope.registerUser = function() {
            Auth.setCredentials("Visitor", "test");
            $scope.salt = "nfp89gpe";
            $scope.register.password = new String(CryptoJS.SHA512($scope.register.password + $scope.register.username + $scope.salt));
            $scope.$parent.Restangular().all("users").post($scope.register).then(
                function(success) {
                    Auth.clearCredentials();
                    ngNotify.set("User account created. Please login!", {position: 'top', type: 'success'});
                    $state.go("home", {}, {reload: true});
                },function(fail) {
                    Auth.clearCredentials();
                    ngNotify.set(fail.data.message, {position: 'top', type: 'error'});
                }
            );
          
            Auth.clearCredentials();
      }
}]);

vmaControllerModule.controller('settings', ['$scope', '$state', 'Auth', '$modal', function($scope, $state, Auth, $modal) {
    $scope.out = function() {
        Auth.clearCredentials();
        console.log("HERE");
        $state.go("home", {}, {reload: true});
//        ngNotify.set("Successfully logged out!", {"type" : "success", "position" : "top" });
    }
    
    //OPENING THE MODAL TO LOG OUT A USER
    $scope.logOutUser = function(id) {
        $scope.openLogOut(id);
    }

    $scope.openLogOut = function () {
        var modalInstance = $modal.open({
          templateUrl: 'partials/logOutUser.html',
          controller: ModalInstanceCtrlLogOut,
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
        });
    };

    //Controller for the Modal PopUp Delete
    var ModalInstanceCtrlLogOut = function ($scope, $modalInstance, window_scope) {
        $scope.ok = function () {
            $modalInstance.close();
            window_scope.out();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };                
//        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
//            console.log("SCOPE - $stateChangeStart");
//            $modalInstance.dismiss('cancel');
//            //Prevents the switching of the state
//            event.preventDefault();
//        });
    };
    
    //DELETE THE USER
    $scope.delUser = function() {
        $scope.Restangular().all("users").one($scope.uid).remove().then(
                function(success) {
                    $state.go("home", {}, {reload: true});
                }, function(failure) {
                    console.log(failure)
                }
        );
    }

    //OPENING THE MODAL TO DELETE A USER
    $scope.deleteUser = function(id) {
        $scope.openDelete(id);
    }

    $scope.openDelete = function () {
        var modalInstance = $modal.open({
          templateUrl: 'partials/deleteUser.html',
          controller: ModalInstanceCtrlDelete,
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
        });
    };

    //Controller for the Modal PopUp Delete
    var ModalInstanceCtrlDelete = function ($scope, $modalInstance, window_scope) {
        $scope.ok = function () {
            window_scope.delUser();
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };                
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    };
}]);

vmaControllerModule.controller('communityFeed', ['$scope', '$state', 'vmaPostService', function($scope, $state, vmaPostService) {
    $scope.posts = [];
    $scope.updatePosts = function() {
        var gProm = vmaPostService.getAllPosts();
        gProm.then(function(success) {
            $scope.posts = success;
        }, function(fail) {
            console.log(fail);
        });
    }
    $scope.updatePosts();

    $scope.carousel_images = [
        {id:'1', caption: "GROUP 1", image: "img/image13.png"},
        {id:'2', caption: "GROUP 2", image: "http://hdwallpaper.freehdw.com/0009/cars_widewallpaper_honda-fc-high-res_83370.jpg"},
        {id:'3', caption: "GROUP 3", image: "img/image13.png"},
        {id:'6', caption: "GROUP 6", image: "img/image13.png"}
    ];
    
    var slides = $scope.slides = [];
    $scope.addSlide = function(post) {
        var newWidth = 600 + slides.length;
        slides.push({
            image: post.image,
            text: post.caption
        });
    };
    $scope.carousel_images.forEach(function(imgPost) {
        $scope.addSlide(imgPost);
    });
}]);

vmaControllerModule.controller('groupMessages', ['$scope', '$state', 'snapRemote', 'vmaTaskService', function($scope, $state, snapRemote, vmaTaskService) {
    $scope.updateTasks = function() {
        vmaTaskService.getJoinTasks($scope.id).then(function(success) { $scope.joinTasks = success; });
    }
    $scope.updateTasks();

    $scope.displayMessages = function(click_id) {
        $state.go('home.groupMessages.message', {id:click_id}, {reload: false});
        snapRemote.close();
    }

    $scope.settings = {
//        element: null,
//        dragger: null,
        disable: 'right',
//            addBodyClasses: true,
        hyperextensible: false
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

        
    $scope.popover = {
        "title": "Carl",
        "content": "<B> BADGES </B> <BR/> MEMBER SINCE"
    };
    
    
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
            $location.hash('messaging_input');
            $anchorScroll();
        });
        $scope.addMsg = function() {
            $scope.groupMSGs.push({id:'6', img: "img/temp_icon.png", time: "4:00AM", author: "me", content: $scope.msg.message});
            $scope.msg = "";
            $scope.scrollToAdd();
        }

        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if(userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
            $scope.scrollTo = function() { }
            $scope.scrollToAdd = function() { }
        }
        else if(userAgent.match(/Android/i)) {        
            $scope.scrollToAdd = function() {
                $timeout(function() {
                    $location.hash('messaging_input');
                    $anchorScroll();
                });
            }
            $scope.scrollTo = function() {
                $timeout(function() {
                    $location.hash('messaging_input');
                    $anchorScroll();
                }, 500);
                $timeout(function() {
                    $location.hash('messaging_input');
                    $anchorScroll();
                }, 2000);
            }
        } else {        
            $scope.scrollToAdd = function() {
                $timeout(function() {
                    $location.hash('messaging_input');
                    $anchorScroll();
                });
            }
            $scope.scrollTo = function() {
                $timeout(function() {
                    $location.hash('messaging_input');
                    $anchorScroll();
                }, 500);
                $timeout(function() {
                    $location.hash('messaging_input');
                    $anchorScroll();
                }, 2000);
            }
        }
}]);

vmaControllerModule.controller('groupFeed', ['$scope', '$state', '$modal', 'snapRemote', 'vmaGroupService', '$timeout', 'ngNotify', function($scope, $state, $modal, snapRemote, vmaGroupService, $timeout, ngNotify) {
    //OPENS THE SNAPPER TO DISPLAY DETAILS
    $scope.displayDetail = function(click_id, detail_bool) {
        console.log(detail_bool);
        $state.go('home.groupFeed.detail', {id: click_id, detail: detail_bool}, {reload: false});
        snapRemote.close();
    }

    $scope.state = $state;

    var updateGroups = $scope.updateGroups = function() {
        vmaGroupService.getMetaGroups().then(function(success) { $scope.metaGroups = success; });
        vmaGroupService.getMetaJoinedGroups().then(function(success) { $scope.metaJoinedGroups = success; });
    }

    $timeout(function() { updateGroups(); }, 5);

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
    var ModalInstanceCtrl = function ($scope, $modalInstance, window_scope, vmaGroupService) {
        $scope.ok = function () {
            var promise = vmaGroupService.addGroup($scope.newGroup);
            console.log($scope.newGroup);
            promise.then(function(success) {
                window_scope.updateGroups();
                $modalInstance.close();
                ngNotify.set("Group created successfully!", 'success');
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
                        
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
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
    var ModalInstanceCtrlDelete = function ($scope, $modalInstance, deleteId, window_scope, vmaGroupService) {
        $scope.ok = function () {
            var promise = vmaGroupService.deleteGroup(deleteId);
            promise.then(function(success) {
                window_scope.updateGroups();
                ngNotify.set("Group deleted successfully!", 'success');
                $modalInstance.close();
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };                
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    };

    //OPENING THE MODAL TO EDIT A GROUP
    $scope.editGroup = function(id) {
        $scope.openEdit(id);
    }

    $scope.openEdit = function (id) {
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
    var ModalInstanceCtrlEdit = function ($scope, $filter, $modalInstance, editId, window_scope, vmaGroupService) {
        vmaGroupService.getGroup(editId).then(function(success) { $scope.group = success });
        $scope.ok = function () {
            var promise = vmaGroupService.editGroup(editId, $scope.group);
            promise.then(function(success) {
                ngNotify.set("Group edited successfully!", 'success');
                window_scope.updateGroups();
                console.log(success);
                $modalInstance.close();
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };                
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    };

    //OPENING THE MODAL TO LEAVE A GROUP
    $scope.leaveGroup = function(id) {
        $scope.openLeave(id);
    }

    $scope.openLeave = function (id) {
        console.log(id);
        var modalInstance = $modal.open({
          templateUrl: 'partials/leaveGroup.html',
          controller: ModalInstanceCtrlLeave,
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

    //Controller for the Modal PopUp Leave
    var ModalInstanceCtrlLeave = function ($scope, $modalInstance, deleteId, window_scope, vmaGroupService) {
        $scope.ok = function () {
            var promise = vmaGroupService.leaveGroupMember(deleteId, $scope.uid);

            promise.then(function(success) {
                window_scope.updateGroups();
                ngNotify.set("Group left successfully!", 'success');
                console.log(success);
                $modalInstance.close();
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };                
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    };

    $scope.joinGroup = function(id) {
        var jProm = vmaGroupService.joinGroup(id, $scope.uid);
        jProm.then(function(success) {
            $scope.updateGroups();
            ngNotify.set("Group joined successfully!", 'success');
        }, function(fail) {
            console.log(fail);
            ngNotify.set(fail.data.message, 'error');
        });
    }

    //UI-SNAP SETTINGS
    $scope.settings = {
//        element: null,
//        dragger: null,
        disable: 'right',
//        addBodyClasses: true,
        hyperextensible: false
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

vmaControllerModule.controller('groupFeed.post', ['$scope', '$state', '$stateParams', '$modal', 'vmaPostService', 'ngNotify', function($scope, $state, $stateParams, $modal, vmaPostService, ngNotify) {
    $scope.id = $stateParams.id;
    $scope.detail = $stateParams.detail;
    $scope.$parent.pActiv = true;
    
    if($scope.id) {
        $scope.updatePosts = function() {
            var gProm = vmaPostService.getGroupPosts(null, null, $scope.id);
            gProm.then(function(success) {
//                console.log(success);
                $scope.posts = success;
            }, function(fail) {
//                console.log(fail);
            });
        }
    } else {
        $scope.updatePosts = function() {
            var gProm = vmaPostService.getMyGroupPosts();
            gProm.then(function(success) {
//                console.log(success);
                $scope.posts = success;
            }, function(fail) {
//                console.log(fail);
            });
        }
    }

    $scope.updatePosts();

    //OPEN ADD
    $scope.addPost = function() {
        $scope.open();
}

    $scope.open = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/addPost.html',
          controller: ModalInstanceCtrl,
          size: size,
          resolve: {
              group_id: function() {
                  return $scope.id;
              },
              window_scope: function() {
                  return $scope;
              }
          }  
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
    //          What to do on dismiss
    //          $log.info('Modal dismissed at: ' + new Date());
        });
};
    //Controller for the Modal PopUp
    var ModalInstanceCtrl = function ($scope, $modalInstance, group_id, window_scope) {
        $scope.group_id = group_id;
        $scope.ok = function () {
            $scope.post["group_id"] = $scope.group_id;
            var prom = vmaPostService.addPost($scope.post, $scope.uid);
            prom.then(function(success) {
                console.log(success);
                window_scope.updatePosts();
                ngNotify.set("Posted successfully!", 'success');
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };             
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    };

    //OPEN EDIT
    $scope.editPost = function(pid) {
        $scope.openEdit(pid);
    }

    $scope.openEdit = function (pid) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/addPost.html',
          controller: ModalInstanceCtrlEdit,
          resolve: {
              group_id: function() {
                  return $scope.id;
              },
              window_scope: function() {
                  return $scope;
              },
              post_id: function() {
                  return pid;
              }
          }  
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
    //          What to do on dismiss
    //          $log.info('Modal dismissed at: ' + new Date());
        });
};
    //Controller for the Modal PopUp
    var ModalInstanceCtrlEdit = function ($scope, $modalInstance, group_id, window_scope, post_id) {
    //        $scope.group_id = group_id;
        var getPostProm = vmaPostService.getPost(post_id);
        getPostProm.then(function(success) {
            $scope.post = success;});
        $scope.ok = function () {
            var prom = vmaPostService.editPost(post_id, $scope.post);
            prom.then(function(success) {
                ngNotify.set("Post edited successfully!", 'success');
                window_scope.updatePosts();
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };    
        
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    };

    //OPEN DELETE
    $scope.deletePost = function(pid) {
        $scope.openDelete(pid);
    }

    $scope.openDelete = function (pid) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/deletePost.html',
          controller: ModalInstanceCtrlDelete,
          resolve: {
              group_id: function() {
                  return $scope.id;
              },
              window_scope: function() {
                  return $scope;
              },
              post_id: function() {
                  return pid;
              }
          }  
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
    //          What to do on dismiss
    //          $log.info('Modal dismissed at: ' + new Date());
        });
};
    //Controller for the Modal PopUp
    var ModalInstanceCtrlDelete = function ($scope, $modalInstance, group_id, window_scope, post_id) {
        $scope.ok = function () {
            var prom = vmaPostService.deletePost(post_id);
            prom.then(function(success) {
                $modalInstance.close();
                window_scope.updatePosts();
                ngNotify.set("Post deleted successfully!", 'success');
            }, function(fail) {
//                console.log(fail)
                ngNotify.set(fail.data.message, 'error');
            });
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };                
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    };
}]);

vmaControllerModule.controller('groupFeed.task', ['$scope', '$state', '$stateParams', '$modal', 'vmaTaskService', 'ngNotify', function($scope, $state, $stateParams, $modal, vmaTaskService, ngNotify) {
    $scope.id = $stateParams.id;
//    console.log($stateParams.detail);
    $scope.detail = $stateParams.detail;
    $scope.$parent.pActiv = true;

    //ACCESSES SERVER AND UPDATES THE LIST OF TASKS
    $scope.updateTasks = function() {
        vmaTaskService.getMetaTasksGroup($scope.id).then(function(success) { $scope.metaTasks = success; console.log(success); });
    }
    $scope.updateTasks();

    //OPENING THE MODAL TO ADD A TASK
    $scope.addTask = function() {
        $scope.openAdd();
    }

    $scope.openAdd = function () {
    var modalInstance = $modal.open({
      templateUrl: 'partials/addTask.html',
      controller: ModalInstanceCtrlAdd,
      resolve: {
          group_id: function() {
              return $scope.id;
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

    //Controller for the Modal PopUp Add
    var ModalInstanceCtrlAdd = function ($scope, $modalInstance, window_scope, group_id, vmaTaskService) {
          $scope.showTime = true;
          $scope.today = function() {
            $scope.mytime = new Date();
            $scope.dt = new Date();
          };
          $scope.today();
          $scope.toggleMin = function() {
              $scope.minDate = $scope.minDate ? null : new Date();
          };
          $scope.toggleMin();
        
          $scope.hstep = 1;
          $scope.mstep = 5;

          $scope.ismeridian = true;

          $scope.changed = function () {
            console.log('Time changed to: ' + $scope.mytime);
          };

          $scope.clear = function() {
            $scope.showTime = !$scope.showTime;
            $scope.mytime = null;
            $scope.dt = null;
          };

          // Disable weekend selection
          $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
          };

          $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
          };
          $scope.toggleMin();

          $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
          };

          $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };

          $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          $scope.format = $scope.formats[0];

        $scope.ok = function () {            
            $scope.newTask.group_id = group_id;
            $scope.newTask.time = $scope.mytime;

            var promise = vmaTaskService.addTask($scope.newTask);

            promise.then(function(success) {
                $scope.message = "ADD SUCCESS!";
                    console.log(success);
                    window_scope.updateTasks();
                    $modalInstance.close();
                    ngNotify.set("Task added successfully", "success");
                }, function(fail) {
                    ngNotify.set(fail.data.message, 'error');
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    };

    //OPENING THE MODAL TO DELETE A TASK
    $scope.deleteTask = function(task_id) {
        console.log(task_id);
        $scope.openDelete(task_id);
    }

    $scope.openDelete = function (task_id) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/deleteTask.html',
          controller: ModalInstanceCtrlDelete,
          resolve: {
              task_id: function() {
                  return task_id;
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
    var ModalInstanceCtrlDelete = function ($scope, $modalInstance, window_scope, task_id, vmaTaskService) {
        $scope.ok = function () {
            var promise = vmaTaskService.deleteTask(task_id);
            promise.then(function(success) {
                    console.log(success);
                    window_scope.updateTasks();
                    $modalInstance.close();
                    ngNotify.set("Task deleted successfully", "success");
                }, function(fail) {
                    ngNotify.set(fail.data.message, 'error');
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
                
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    };

    //OPENING THE MODAL TO EDIT A TASK
    $scope.editTask = function(task_id) {
        $scope.openEdit(task_id);
    }

    $scope.openEdit = function (task_id) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/editTask.html',
          controller: ModalInstanceCtrlEdit,
          resolve: {
              task_id: function() {
                  return task_id;
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
    var ModalInstanceCtrlEdit = function ($scope, $modalInstance, window_scope, task_id, vmaTaskService) {
        var setup = function(st) {
            $scope.showTime = st;
            $scope.today = function() {
                $scope.mytime = new Date($scope.editTask.time);
            };
            $scope.today();
            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.hstep = 1;
            $scope.mstep = 5;

            $scope.ismeridian = true;

            $scope.changed = function () {
                console.log('Time changed to: ' + $scope.mytime);
            };

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
        }
        vmaTaskService.getTask(task_id).then(function(success) {
            $scope.editTask = success;
            console.log($scope.editTask.time);
            if(!$scope.editTask.time) {
                console.log("SHOWTIME = FALSE");
                $scope.showTime = false;
            } else {
                console.log("SHOWTIME = TRUE");
                $scope.showTime = true;
            }
            setup($scope.showTime);
        });

        $scope.ok = function () {
            if($scope.showTime)
                $scope.editTask.time = new Date($scope.mytime).toISOString();
            else {
                $scope.editTask.time = null;
            }
            console.log($scope.editTask);
            var promise = vmaTaskService.editTask(task_id, $scope.editTask);

            promise.then(function(success) {
                    ngNotify.set("Task edited successfully", "success");
                    window_scope.updateTasks();
                    $modalInstance.close();
                }, function(fail) {
                    ngNotify.set(fail.data.message, 'error');
            });
        };

        $scope.clear = function() {
            $scope.showTime = !$scope.showTime;
            if($scope.showTime) $scope.editTask.time = new Date(); else $scope.editTask.time = null;
            console.log($scope.showTime);
            setup($scope.showTime);
        };
        
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    };

    //OPENING THE MODAL TO VIEW A TASK
    $scope.viewTask = function(click_id) {
        var task = vmaTaskService.getTaskView(click_id);
        $scope.openView(task);
    }

    $scope.openView = function (task) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/efforts.task.html',
          controller: ModalInstanceCtrlView,
          resolve: {
              task: function() {
                  return task;
              }
          }
        });
    };

    //Controller for the Modal PopUp View
    var ModalInstanceCtrlView = function($scope, task, vmaTaskService, $modalInstance) {
        $scope.task = task;
        $scope.map = {
            sensor: true,
            size: '500x300',
            zoom: 15,
            center: $scope.task.location,
            markers: [$scope.task.location], //marker locations
            mapevents: {redirect: true, loadmap: false}
        };
        $scope.ok = function () {
            $modalInstance.close();
        };
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    }

    //JOINING A TASK
    $scope.joinTask = function(task_id) {
        var promise = vmaTaskService.joinTask(task_id, $scope.uid);

        promise.then(function(success) {
                $scope.updateTasks();
                ngNotify.set("Task joined successfully", "success");
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
        });
    }

    //LEAVING A TASK
    $scope.leaveTask = function(task_id) {
        var promise = vmaTaskService.leaveTaskMember(task_id, $scope.uid);
        promise.then(function(success) {
                $scope.updateTasks();
                ngNotify.set("Task left successfully", "success");
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
        });
    }
}]);

vmaControllerModule.controller('efforts', ['$scope', '$state', '$stateParams', '$modal', 'vmaTaskService', function($scope, $state, $stateParams, $modal, vmaTaskService) {
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

    //ACCESSES SERVER AND UPDATES THE LIST OF TASKS
    $scope.updateTasks = function() {
        vmaTaskService.getJoinTasks().then(function(success) { $scope.joinTasks = success; });
    }
    $scope.updateTasks();

    //OPENING THE MODAL TO VIEW A TASK
    $scope.viewTask = function(click_id) {
        var task = vmaTaskService.getTaskView(click_id);
        $scope.openView(task);
    }

    $scope.openView = function (task) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/efforts.task.html',
          controller: ModalInstanceCtrlView,
          resolve: {
              task: function() {
                  return task;
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

    //Controller for the Modal PopUp View
    var ModalInstanceCtrlView = function($scope, task, $modalInstance) {
        $scope.task = task;
        $scope.map = {
            sensor: true,
            size: '500x300',
            zoom: 15,
            center: $scope.task.location,
            markers: [$scope.task.location], //marker locations
            mapevents: {redirect: true, loadmap: false}
        };
        $scope.ok = function () {
            $modalInstance.close();
        };
        
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    }

    //LEAVING A TASK
    $scope.leaveTask = function(task_id) {
        var promise = $scope.$parent.Restangular().all("tasks").all(task_id).all("MANAGER").all($scope.uid).remove();

        promise.then(function(success) {
                console.log(success);
                $scope.updateTasks();
            }, function(fail) {
//                $scope.message = "DELETE FAILED";
        });
    }
}]);

vmaControllerModule.controller('group', ['$scope', '$state', '$stateParams', 'ngNotify', 'vmaGroupService', 'vmaTaskService', '$modal', function($scope, $state, $stateParams, ngNotify, vmaGroupService, vmaTaskService, $modal) {
    $scope.id = $stateParams.id;
    $scope.update = function(){
        vmaGroupService.getGroupMeta($scope.id).then(function(success) { $scope.group = success; });
        vmaTaskService.getAllTasksGroup($scope.id).then(function(success) { $scope.tasks = success; });
    }
    $scope.update();
    
    //JOINING A GROUP
    $scope.joinGroup = function() {
        vmaGroupService.joinGroup($scope.id, $scope.uid).then(function(success) {
            $scope.update();
            ngNotify.set("Group joined successfully", "success");
        }, function(fail) {
            ngNotify.set(fail.data.message, 'error');
        });
    }    
    //LEAVE A GROUP
    $scope.leaveGroup = function() {
        vmaGroupService.leaveGroupMember($scope.id, $scope.uid).then(function(success) {
            $scope.update();
            ngNotify.set("Group left successfully", "success");
        }, function(fail) {
            ngNotify.set(fail.data.message, 'error');
        });
    }
    
    //JOINING A TASK
    $scope.joinTask = function(task_id) {
        var promise = vmaTaskService.joinTask(task_id, $scope.uid);

        promise.then(function(success) {
                $scope.update();
                ngNotify.set("Task joined successfully", "success");
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
        });
    }
    
    //LEAVING A TASK
    $scope.leaveTask = function(task_id) {
        var promise = vmaTaskService.leaveTaskMember(task_id, $scope.uid);
        promise.then(function(success) {
                $scope.update();
                ngNotify.set("Task left successfully", "success");
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
        });
    }
    
    //OPENING THE MODAL TO VIEW A TASK
    $scope.viewTask = function(click_id) {
        var task = vmaTaskService.getTaskView(click_id);
        $scope.openView(task);
    }

    $scope.openView = function (task) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/efforts.task.html',
          controller: ModalInstanceCtrlView,
          resolve: {
              task: function() {
                  return task;
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

    //Controller for the Modal PopUp View
    var ModalInstanceCtrlView = function($scope, task, $modalInstance) {
        $scope.task = task;
        $scope.map = {
            sensor: true,
            size: '500x300',
            zoom: 15,
            center: $scope.task.location,
            markers: [$scope.task.location], //marker locations
            mapevents: {redirect: true, loadmap: false}
        };
        $scope.ok = function () {
            $modalInstance.close();
        };
        
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    }
    
}]);

vmaControllerModule.controller('hours', ['$scope', '$state', '$stateParams', '$modal', '$rootScope', 'ngNotify', function($scope, $state, $stateParams, $modal, $rootScope, ngNotify) {
    if(!$rootScope.entries)
    $rootScope.entries = [
        {title: "Name of Completed Task 1", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "4", badge_type: "1", approved: true},    
        {title: "Name of Completed Task 2", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "2", badge_type: "3", approved: false},
        {title: "Name of Completed Task 3", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "1", badge_type: "1", approved: false},
        {title: "Name of Completed Task 4", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "6", badge_type: "2", approved: true},
        {title: "Name of Completed Task 6", start: "6/21 4:22PM", end: "6/21 7:22PM", duration: "5", badge_type: "4", approved: false}
    ];
    
    $scope.ok = function() {
        $rootScope.entries.unshift({title: $scope.entry.name, start: "6/21 4:22PM", end: "6/21 7:22PM", duration: $scope.entry.duration, approved: false});
        $scope.entry = [];
    }
    
    $scope.checkIn = function() {
        $scope.checkInTime = new Date();
        $scope.checkInTimeDisplay = new Date().toLocaleDateString() + new Date().toLocaleTimeString();
        console.log($scope.checkInTime);
        ngNotify.set("Successfully checked in!", "success");
    }
    
    $scope.checkOut = function() {
        if(!$scope.entry) $scope.entry = [];
        $scope.checkOutTime = new Date();
        $scope.checkOutTimeDisplay = new Date().toLocaleDateString() + new Date().toLocaleTimeString();
        console.log($scope.checkOutTime);
        $scope.entry.duration = ($scope.checkOutTime - $scope.checkInTime)/1000/60;
        console.log($scope.entry.duration);
        ngNotify.set("Successfully checked out!", "success");
    }
}]);

vmaControllerModule.controller('awards', function ($scope) {
//    PULL THIS IN FROM USER_DATA
    $scope.badges = [
        ["Grunt Badge", 42],
        ["Other Badge", 35],
        ["Other Badge", 32],
        ["Other Badge", 12],
        ["Other Badge", 21]
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

vmaControllerModule.controller('calendar', ['$scope', '$state', 'vmaTaskService', '$compile', '$modal', function($scope, $state, vmaTaskService, $compile, $modal) {
    //ACCESSES SERVER AND UPDATES THE LIST OF TASKS
    $scope.updateTasksAndDisplayCalendar = function() {
        var gPromMemb = vmaTaskService.getCalTasks($scope.id);
        gPromMemb.then(function(success) {
            $scope.calTasks = success;
            displayFullCalendar($scope.calTasks);
            $compile($('#calendar'))($scope);
        }, function(fail) {
            //console.log(fail);
        });
    }
    
    $scope.updateTasksAndDisplayCalendar();
    
    //OPENING THE MODAL TO VIEW A TASK
    $scope.viewTask = function(click_id) {
        var task = vmaTaskService.getTaskView(click_id);
        $scope.openView(task);
    }

    $scope.openView = function (task) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/efforts.task.html',
          controller: ModalInstanceCtrlView,
          resolve: {
              task: function() {
                  return task;
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

    //Controller for the Modal PopUp View
    var ModalInstanceCtrlView = function($scope, task, $modalInstance) {
        $scope.task = task;
//        console.log($scope.task.time);
        $scope.map = {
            sensor: true,
            size: '500x300',
            zoom: 15,
            center: $scope.task.location,
            markers: [$scope.task.location], //marker locations
            mapevents: {redirect: true, loadmap: false}
        };
        $scope.ok = function () {
            $modalInstance.close();
        };                
        $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("SCOPE - $stateChangeStart");
            $modalInstance.dismiss('cancel');
            //Prevents the switching of the state
            event.preventDefault();
        });
    }
}]);

vmaControllerModule.controller('menuCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.state = $state;
}]);