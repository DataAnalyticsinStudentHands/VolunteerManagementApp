'use strict';
/* VMA Controllers Module */
var vmaControllerModule = angular.module('vmaControllerModule', []);

vmaControllerModule.controller('loginCtrl', ['$scope', 'Auth', '$state', 'ngNotify', '$timeout', '$ionicLoading', function($scope, Auth, $state, ngNotify, $timeout, $ionicLoading) {
     if($scope.isAuthenticated() === true) {
         //IF SUCCESSFULLY AUTH-ED USER IS TRYING TO GO TO LOGIN PAGE => SEND TO HOME PAGE OF APP
         $state.go('home');
     }
     $scope.salt = "nfp89gpe"; //PENDING - NEED TO GET ACTUAL SALT
     $scope.submit = function() {
         console.log("SUBMIT");
         if ($scope.userName && $scope.passWord) {
             document.activeElement.blur();
             $timeout(function() {
                 $ionicLoading.show();
                 $scope.passWordHashed = new String(CryptoJS.SHA512($scope.passWord + $scope.userName + $scope.salt));
                 Auth.setCredentials($scope.userName, $scope.passWordHashed);
                 $scope.userName = '';
                 $scope.passWord = '';
                 $scope.loginResultPromise = $scope.Restangular().all("users").all("myUser").getList();
                 $scope.loginResultPromise.then(function(result) {
                    $scope.loginResult = result;
                    $scope.loginMsg = "You have logged in successfully!";
                    Auth.confirmCredentials();
                    $state.go("home.cfeed", {}, {reload: true});
                    ngNotify.set($scope.loginMsg, 'success');
                    $ionicLoading.hide();
                 }, function(error) {
                    $scope.loginMsg = "Incorrect username or password.";
                    ngNotify.set($scope.loginMsg, {position: 'top', type: 'error'});
                    Auth.clearCredentials();
                    $ionicLoading.hide();
                 });
             }, 500);
         } else {
             $scope.loginMsg = "Please enter a username and password.";
             ngNotify.set($scope.loginMsg, {position: 'top', type: 'error'});
         }
     };
 }]);

vmaControllerModule.controller('registerCtrl', ['$scope', '$state', 'Auth', 'ngNotify', function($scope, $state, Auth, ngNotify) {
    $scope.registerUser = function() {
        Auth.setCredentials("Visitor", "test");
        $scope.salt = "nfp89gpe";
        $scope.register.password = new String(CryptoJS.SHA512($scope.register.password + $scope.register.username + $scope.salt));
        console.log($scope.register);
        $scope.$parent.Restangular().all("users").post($scope.register).then(
            function(success) {
                Auth.clearCredentials();
                ngNotify.set("User account created. Please login!", {position: 'top', type: 'success'});
                $state.go("home", {}, {reload: true});
            },function(fail) {
                Auth.clearCredentials();
                ngNotify.set(fail.data.message, {position: 'top', type: 'error'});
        });

        Auth.clearCredentials();
    }
}]);

vmaControllerModule.controller('settings', ['$scope', '$state', 'Auth', '$ionicModal', '$ionicPopup', function($scope, $state, Auth, $ionicModal, $ionicPopup) {
    //OPENING THE MODAL TO LOG OUT A USER
    $scope.logOutUser = function(id) {
        $scope.openLogOut(id);
    }
    $scope.openLogOut = function () {
        var confirmPopup = $ionicPopup.confirm({
                title: 'Log Out',
                template: 'Are you sure you would like to log out?'
            });
                confirmPopup.then(function(res) {
            if(res) {
                 $scope.ok();
            } else {

            }
        });
        $scope.ok = function () {
            $scope.out();
        };
    };
    $scope.out = function() {
        Auth.clearCredentials();
        console.log("HERE");
        $state.go("home", {}, {reload: true});
    }
}]);

vmaControllerModule.controller('postController', ['$scope', '$state', 'vmaPostService', 'ngNotify', '$ionicModal', '$stateParams', '$ionicPopup', '$filter', '$ionicPopover', '$ionicLoading', function($scope, $state, vmaPostService, ngNotify, $ionicModal, $stateParams, $ionicPopup, $filter, $ionicPopover, $ionicLoading) {
    $scope.posts = [];
    $scope.notReachedEnd = true;
    $ionicLoading.show();
    var state = $state.current.name;
    switch(state) {
        case "home.cfeed":
            $scope.updatePosts = function() {
                var loadSize = 10;
                if($scope.posts.length != 0){
                    loadSize = $scope.posts.length;
                    console.log(loadSize);
                }
                var gProm = vmaPostService.getGroupPosts(loadSize, null, null);
                gProm.then(function(success) {
                    $scope.posts = success;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $ionicLoading.hide();
                    if($scope.posts.length == 0)
                        $scope.notReachedEnd = false;
                }, function(fail) {
                    console.log(fail);
                });
            };
            $scope.loadMore = function() {
                console.log("LOADING");
                if($scope.posts && $scope.posts.length>0)
                vmaPostService.getGroupPosts(10, $scope.posts[$scope.posts.length -1].id, null).then(
                    function(success) {
                        $scope.posts = $scope.posts.concat(success);
                        console.log($scope.posts);
                        if(success.length > 0)
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        else
                            $scope.notReachedEnd = false;
                    }, function(fail) {
                    }
                );
            };
            break;
        case "home.group.posts":
            $scope.id = $stateParams.id;
            $scope.updatePosts = function() {
                var loadSize = 10;
                if($scope.posts.length != 0){
                    loadSize = $scope.posts.length;
                    console.log(loadSize);
                }
                if(loadSize < 10) loadSize = 10;
                var gProm = vmaPostService.getGroupPosts(loadSize, null, $scope.id);
                gProm.then(function(success) {
                    $scope.posts = success;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $ionicLoading.hide();
                }, function(fail) {
    //                console.log(fail);
                });
                if($scope.posts.length == 0)
                    $scope.notReachedEnd = false;
            };
            $scope.loadMore = function() {
                console.log("LOADING");
                if($scope.posts && $scope.posts.length>0)
                vmaPostService.getGroupPosts(10, $scope.posts[$scope.posts.length -1].id, $scope.id).then(
                function(success) {
                    $scope.posts = $scope.posts.concat(success);
                    console.log($scope.posts);
                    if(success.length > 0)
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    else
                        $scope.notReachedEnd = false;
                }, function(fail) {
                    //console.log(fail);
                    });
                };
            break;
        case "home.groupFeed":
            $scope.updatePosts = function() {
                var loadSize = 10;
                if($scope.posts.length != 0){
                    loadSize = $scope.posts.length;
                    console.log(loadSize);
                }
                var gProm = vmaPostService.getMyGroupPosts(loadSize, null);
                gProm.then(function(success) {
                    $scope.posts = success;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $ionicLoading.hide();
                    if($scope.posts.length == 0)
                        $scope.notReachedEnd = false;
                }, function(fail) {
    //                console.log(fail);
                });
            };
            $scope.loadMore = function() {
                if($scope.posts && $scope.posts.length>0)
                vmaPostService.getMyGroupPosts(10, $scope.posts[$scope.posts.length -1].id).then(
                function(success) {
                    console.log("loading");
                    $scope.posts = $scope.posts.concat(success);
                    console.log($scope.posts);
                    if(success.length > 0)
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    else
                        $scope.notReachedEnd = false;
                }, function(fail) {
                    //console.log(fail);
                });
            };
            break;
        default:
            $scope.updatePosts = function(){};
            $scope.loadMore = function(){};
            console.log("ERROR: UNCAUGHT STATE: ", state);
            return true;
    }

    $scope.updatePosts();

    //VIEW POST
    $scope.viewPost = function(pid) {
        $state.go("home.group.posts.comments", {"post_id" : pid}, [{reload: false}]);
    }

    //OPEN EDIT FUNCTION AND OPEN MODAL
    $scope.editPost = function(pid) {
        $scope.openEdit(pid);
    }
    $scope.openEdit = function(pid) {
        // callback for ng-click 'modal'- open Modal dialog to add a new course
        $ionicModal.fromTemplateUrl('partials/addPost.html', {
            scope : $scope
        }).then(function (modal) {
            $scope.modal = modal;

            $scope.modal.show();
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.ok = function () {
            var prom = vmaPostService.editPost(pid, $scope.post);
            prom.then(function(success) {
                ngNotify.set("Post edited successfully!", 'success');
                $scope.updatePosts();
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
            $scope.modal.remove();
        };
        var getPostProm = vmaPostService.getPost(pid);
        getPostProm.then(function(success) {
            $scope.post = success;
        });
    };

    //OPEN ADD FUNCTION AND DELETE
    $scope.addPost = function() {
        $scope.openAdd();
    }
    $scope.openAdd = function() {
        // callback for ng-click 'modal'- open Modal dialog to add a new course
        $ionicModal.fromTemplateUrl('partials/addPost.html', {
            scope : $scope
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.post = {};
            $scope.modal.show();
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.ok = function () {
            $scope.post["group_id"] = $scope.id;
            var prom = vmaPostService.addPost($scope.post, $scope.uid);
            prom.then(function(success) {
                $scope.updatePosts();
                ngNotify.set("Posted successfully!", 'success');
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
            $scope.modal.remove();
        };
    };

    //OPEN DELETE FUNCTION AND DELETE
    $scope.deletePost = function(pid) {
        $scope.openDelete(pid);
    };
    $scope.openDelete = function(pid) {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Delete Post',
         template: 'Are you sure you want delete this post?'
       });
       confirmPopup.then(function(res) {
         if(res) {
             $scope.ok();
         } else {

         }
       });

        $scope.ok = function () {
            var prom = vmaPostService.deletePost(pid);
            prom.then(function(success) {
                ngNotify.set("Post deleted successfully!", 'success');
                $scope.updatePosts();
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
        };
    };

    //PERMISSIONS
    $scope.generateActions = function(post_id) {
        var postActionObj = $filter('getById')($scope.posts, post_id);
        var ionicActionArray = [];
        if(postActionObj.user_id == $scope.uid ||$scope.isMod || $scope.isAdm) {
            ionicActionArray = [
                { text: 'Edit' },
                { text: 'Delete' }
            ];
        }

        return ionicActionArray;
    };

    //PERMISSION SHOW CHECK
    $scope.actionCount = function(post_id) {
        return ($scope.generateActions(post_id).length > 0);
    };


    $ionicPopover.fromTemplateUrl('partials/popoverOptsArray.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    //ACTION SHEET
    $scope.showActions = function(post_id, event0) {
        var ionicActions = $scope.ionicActions = $scope.generateActions(post_id);
        $scope.popOverStyle = {width:'150px', height: $scope.ionicActions.length*50 + "px"};
        $scope.popover.show(event0);
        $scope.popOverClick = function(action) {
            switch(action) {
                case "Edit":
                    $scope.editPost(post_id);
                    break;
                case "Delete":
                    $scope.deletePost(post_id);
                    break;
                default:
                    return true;
            }
            $scope.popover.hide();
            return true;
        };
    }

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if($scope.modal && $scope.modal.isShown()) {
            $scope.modal.remove();
            event.preventDefault();
        }
    });
}]);

vmaControllerModule.controller('groupController', ['$scope', '$state', '$ionicModal', 'vmaGroupService', '$timeout', 'ngNotify', '$rootScope', 'vmaTaskService', '$stateParams', '$filter', '$ionicActionSheet', '$ionicPopover', '$ionicPopup', '$ionicLoading', function($scope, $state, $ionicModal, vmaGroupService, $timeout, ngNotify, $rootScope, vmaTaskService, $stateParams, $filter, $ionicActionSheet, $ionicPopover, $ionicPopup, $ionicLoading) {
    $ionicLoading.show();
    var state = $state.current.name;
    switch(state) {
        case "home.myGroups":
            $scope.update = function(update) {
                vmaGroupService.getMetaJoinedGroups(update).then(function(success) { $scope.groups = success; $ionicLoading.hide(); });
            };
            break;
        case "home.joinGroups":
            $scope.update = function(update) {
                vmaGroupService.getMetaGroups(update).then(function(success) {
                    $scope.groups = success;
                    $filter('removeJoined')($scope.groups);
                    $ionicLoading.hide();
                });
            };
            break;
        case "home.group":
            $scope.id = $stateParams.id;
            $scope.update = function(update){
                vmaGroupService.getGroupMeta($scope.id, update).then(function(success) { $scope.group = success; $ionicLoading.hide(); console.log(success);});
            };
            break;
        default:
            $scope.update = function(){};
            console.log("ERROR: UNCAUGHT STATE: ", state);
            return true;
    }
    $scope.updateGroups = $scope.update;
    $scope.update(true);

    //OPENING MODAL TO ADD A GROUP
    $scope.addGroup = function() {
        $scope.openAdd();
    };
    $scope.openAdd = function () {
        // callback for ng-click 'modal'- open Modal dialog to add a new course
        $ionicModal.fromTemplateUrl('partials/addGroup.html', {
            scope : $scope
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.newGroup = {};
            $scope.modal.show();
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.ok = function () {
            var promise = vmaGroupService.addGroup($scope.newGroup);
            promise.then(function(success) {
                $scope.updateGroups(false);
                $scope.closeModal();
                ngNotify.set("Group created successfully!", 'success');
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
        };
    };

    //OPENING THE MODAL TO DELETE A GROUP
    $scope.deleteGroup = function(id) {
        $scope.openDelete(id);
    }
    $scope.openDelete = function (id) {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Delete Group',
         template: 'Are you sure you want delete this group?'
       });
       confirmPopup.then(function(res) {
         if(res) {
             $scope.ok();
         } else {

         }
       });
       $scope.ok = function () {
            var promise = vmaGroupService.deleteGroup(id);
            promise.then(function(success) {
                $scope.updateGroups();
                ngNotify.set("Group deleted successfully!", 'success');
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
        };
    };

    //OPENING THE MODAL TO EDIT A GROUP
    $scope.editGroup = function(id) {
        $scope.openEdit(id);
    }
    $scope.openEdit = function (id) {
        // callback for ng-click 'modal'- open Modal dialog to add a new course
        $ionicModal.fromTemplateUrl('partials/editGroup.html', {
            scope : $scope
        }).then(function (modal) {
            $scope.modal = modal;
            vmaGroupService.getGroup(id).then(function(success) { $scope.editGroupNew = success; console.log(success)});
            $scope.modal.show();
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        $scope.ok = function () {
            console.log($scope.editGroupNew);
            var promise = vmaGroupService.editGroup(id, $scope.editGroupNew);
            promise.then(function(success) {
                ngNotify.set("Group edited successfully!", 'success');
                $scope.updateGroups(true);
                $scope.closeModal();
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
        };
    };

    //OPENING THE MODAL TO LEAVE A GROUP
    $scope.leaveGroup = function(id) {
        $scope.openLeave(id);
    }
    $scope.openLeave = function (id) {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Leave Group',
         template: 'Are you sure you want to leave this group?'
       });
       confirmPopup.then(function(res) {
         if(res) {
             $scope.ok();
         } else {

         }
       });
       $scope.ok = function () {
            var promise = vmaGroupService.leaveGroupMember(id, $scope.uid);
            promise.then(function(success) {
                $scope.updateGroups(true);
                ngNotify.set("Group left successfully!", 'success');
                console.log(success);
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
        };
    };

    //JOINING A GROUP
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

    //VIEW POSTS
    $scope.viewPost = function(pid) {
        $state.go("home.group.posts.comments", {"post_id" : pid}, [{reload: false}]);
    }

    //VIEW GROUP
    $scope.viewGroup = function(gid) {
        $state.go("home.group", {"id" : gid});
    }

    //PERMISSIONS
    $scope.generateActions = function(id) {
        var actionObj = $filter('getById')($scope.groups, id);
        var ionicActionArray = [];
        if(actionObj.isManager || $scope.isAdm || $scope.isMod) {
            ionicActionArray.push(
                { text: 'Edit' },
                { text: 'Delete' },
                { text: 'Leave' }
            );
        } else if(actionObj.isMember){
            ionicActionArray.push(
                { text: 'Leave' }
            );
        } else {
            ionicActionArray.push(
                { text: 'Join' }
            );
        }
        return ionicActionArray;
    };

    //PERMISSION SHOW CHECK
    $scope.actionCount = function(id) {
        if($scope.generateActions(id).length > 0) return true; else return false;
    }

    $ionicPopover.fromTemplateUrl('partials/popoverOptsArray.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    //ACTION SHEET
    $scope.showActions = function(id, event0) {
        var ionicActions = $scope.ionicActions = $scope.generateActions(id);
        $scope.popOverStyle = {width:'150px', height: $scope.ionicActions.length*55 + "px"};
        $scope.popover.show(event0);
        $scope.popOverClick = function(action) {
            switch(action) {
                case "Edit":
                    $scope.editGroup(id);
                    break;
                case "Delete":
                    $scope.deleteGroup(id);
                    break;
                case "Leave":
                    $scope.leaveGroup(id);
                    break;
                default:
                    return true;
            }
            $scope.popover.hide();
            return true;
        }
    };


    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
//        console.log("HERE");
        if($scope.modal && $scope.modal.isShown()) {
            console.log("HERE");
//            $scope.modal.remove();
            event.preventDefault();
        }
    });
}]);

vmaControllerModule.controller('taskController', ['$scope', '$state', '$ionicModal', 'vmaGroupService', '$timeout', 'ngNotify', '$rootScope', 'vmaTaskService', '$stateParams', '$filter', '$ionicActionSheet', '$ionicPopup', '$ionicPopover', '$ionicLoading', function($scope, $state, $ionicModal, vmaGroupService, $timeout, ngNotify, $rootScope, vmaTaskService, $stateParams, $filter, $ionicActionSheet, $ionicPopup, $ionicPopover, $ionicLoading) {
    var state = $state.current.name;
    $ionicLoading.show();
    switch(state) {
        case "home.myTasks":
            $scope.updateTasks = function(refresh) {
                vmaTaskService.getJoinTasks(refresh).then(function(success) {
                    $scope.tasks = success; $ionicLoading.hide();
                });
            };
            break;
        case "home.group":
            $scope.updateTasks = function(update){
                vmaTaskService.getAllTasksGroup($scope.id, update).then(function(success) {
                    $scope.tasks = success; $ionicLoading.hide();
                    var tasks_temp = $scope.tasks;
                    $scope.tasks = [];
                    tasks_temp.forEach(function(task) {
                        if(!task.finished || task.finished != 1) $scope.tasks.push(task);
                    });
                });
            };
            break;
        case "home.group.tasks":
            $scope.id = $stateParams.id;
            $scope.updateTasks = function(update) {
                vmaTaskService.getMetaTasksGroup($scope.id, update).then(function(success) {
                    $scope.tasks = success; $ionicLoading.hide();
                    var tasks_temp = $scope.tasks;
                    $scope.tasks = [];
                    tasks_temp.forEach(function(task) {
                        if(!task.finished || task.finished != 1) $scope.tasks.push(task);
                    });
                });
            };
            break;
        default:
            $scope.update = $scope.updateTasks = function(){};
            $ionicLoading.hide();
            console.log("ERROR: UNCAUGHT STATE: ", state);
            break;
    }
    $scope.updateTasks();

    //VIEW A TASK
    $scope.viewTask = function(click_id) {
        vmaTaskService.getTaskView(click_id).then(function(success){
            $state.go("home.task", {"task" : JSON.stringify(success)}, [{reload: false}]);
        });
    };

    //VIEW MESSAGES
    $scope.displayMessages = function(click_id) {
        $state.go('home.message', {id:click_id}, {reload: false});
    };

    //OPENING THE MODAL TO ADD A TASK
    $scope.addTask = function () {
        $scope.openAdd();
    };
    $scope.openAdd = function () {
        $scope.newTask = {};
        $scope.badgeOptions = $scope.badgeConfig;
        $scope.chosenBadge = {};
        $scope.chosenBadge.name = $scope.badgeOptions[4];

        $ionicModal.fromTemplateUrl('partials/addTask.html', {
            scope : $scope
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.newGroup = {};
            $scope.modal.show();
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        $scope.ok = function () {
            $scope.newTask.group_id = $scope.id;
            $scope.newTask.badge_id = $scope.badgeOptions.indexOf($scope.chosenBadge.name);
            var promise = vmaTaskService.addTask($scope.newTask);
            promise.then(function(success) {
                $scope.message = "ADD SUCCESS!";
                    $scope.updateTasks(true);
                    $scope.closeModal();
                    ngNotify.set("Task added successfully", "success");
                }, function(fail) {
                    ngNotify.set(fail.data.message, 'error');
            });
        };
    };

    //OPENING THE MODAL TO EDIT A TASK
    $scope.editTaskFunction = function (task_id) {
        $scope.openEdit(task_id);
    };
    $scope.openEdit = function (task_id) {
        // callback for ng-click 'modal'- open Modal dialog to add a new course
        $ionicModal.fromTemplateUrl('partials/editTask.html', {
            scope : $scope
        }).then(function (modal) {
            $scope.modal = modal;
            vmaTaskService.getTaskPure(task_id).then(function(success) {
                $scope.editTask = success;
                if($scope.editTask.time)
                    $scope.editTask.time = new Date($scope.editTask.time);
                else
                    $scope.editTask.time = null;
            });
            $scope.modal.show();
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        $scope.ok = function () {
            var promise = vmaTaskService.editTask(task_id, $scope.editTask);
            promise.then(function(success) {
                    ngNotify.set("Task edited successfully", "success");
                    $scope.updateTasks(true);
                    $scope.closeModal();
                }, function(fail) {
                    ngNotify.set(fail.data.message, 'error');
            });
        };
    };

    //OPENING THE MODAL TO DELETE A TASK
    $scope.deleteTask = function (task_id) {
        $scope.openDelete(task_id);
    };
    $scope.openDelete = function (task_id) {
        var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Task',
                template: 'Are you sure you want delete this task?'
            });
        confirmPopup.then(function(res) {
            if(res) {
                 $scope.ok();
            } else {

            }
        });

        $scope.ok = function () {
            var promise = vmaTaskService.deleteTask(task_id);
            promise.then(function(success) {
                    console.log(success);
                    $scope.updateTasks(true);
                    ngNotify.set("Task deleted successfully", "success");
                }, function(fail) {
                    ngNotify.set(fail.data.message, 'error');
            });
        };
    };

    //JOINING A TASK
    $scope.joinTask = function(task_id) {
        var promise = vmaTaskService.joinTask(task_id, $scope.uid);
        promise.then(function(success) {
                $scope.updateTasks(true);
                ngNotify.set("Task joined successfully", "success");
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
        });
    };

    //LEAVING A TASK
    $scope.leaveTask = function(task_id) {
        var promise = vmaTaskService.leaveTaskMember(task_id, $scope.uid);
        promise.then(function(success) {
                $scope.updateTasks(true);
                ngNotify.set("Task left successfully", "success");
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
        });
    };

    $scope.markFinished = function(task_id) {
        $ionicLoading.show();
        vmaTaskService.markFinished(task_id).then(function(){
            $timeout(function(){
                $scope.updateTasks(true);
            }, 500);
            ngNotify.set("Task marked complete successfully", "success");
            $ionicLoading.hide();
        });
    };

    $scope.markUnFinished = function(task_id) {
        $ionicLoading.show();
        vmaTaskService.markUnFinished(task_id).then(function(){
            $timeout(function(){
                $scope.updateTasks(true);
            }, 500);
            ngNotify.set("Task marked incomplete successfully", "success");
            $ionicLoading.hide();
        });
    };

    //OPENING DATE/TIME PICKER
    $scope.openDatePicker = function () {
        $scope.tmp = {};
        $scope.tmp.newDate = $scope.newTask.time;
        $ionicPopup.show({
            template: '<datetimepicker data-ng-model="tmp.newDate"></datetimepicker>',
            title: "Task Date & Time",
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        $scope.newTask.time = $scope.tmp.newDate;
                    }
                }
            ]
        });
    };

    //OPENING DATE/TIME PICKER
    $scope.openDatePickerEdit = function () {
        $scope.tmp = {};
        $scope.tmp.newDate = $scope.editTask.time;
        $ionicPopup.show({
            template: '<datetimepicker data-ng-model="tmp.newDate"></datetimepicker>',
            title: "Task Date & Time",
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        $scope.editTask.time = $scope.tmp.newDate;
                    }
                }
            ]
        });
    };

    //PERMISSIONS
    $scope.generateActions = function(id) {
        var actionObj = $filter('getById')($scope.tasks, id);
        var ionicActionArray = [];
        if(actionObj.isManager || actionObj.isMember) {
            ionicActionArray.push(
                { text: 'Leave' }
            );
        }
        if(actionObj.isManager || actionObj.isGroupManager || $scope.isAdm || $scope.isMod) {
            ionicActionArray.push(
                { text: 'Edit' },
                { text: 'Delete' }
            );

            if(!actionObj.finished)
                ionicActionArray.push({text: 'Complete'});
            else
                ionicActionArray.push({text: 'Incomplete'});
        }
        if(!actionObj.isManager && !actionObj.isMember) {
            ionicActionArray.push(
                { text: 'Join' }
            );
        }
        return ionicActionArray;
    };

    //PERMISSION SHOW CHECK
    $scope.actionCount = function(id) {
        if($scope.generateActions(id).length > 0) return true; else return false;
    }

    $ionicPopover.fromTemplateUrl('partials/popoverOptsArray.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    //ACTION POPUP
    $scope.showActions = function(id, event0) {
        var ionicActions = $scope.ionicActions = $scope.generateActions(id);
        $scope.popOverStyle = {width:'150px', height: $scope.ionicActions.length*55 + "px"};
        $scope.popover.show(event0);
        $scope.popOverClick =  function(action) {
            switch(action) {
                case "Edit":
                    $scope.editTaskFunction(id);
                    break;
                case "Delete":
                    $scope.deleteTask(id);
                    break;
                case "Leave":
                    $scope.leaveTask(id);
                    break;
                case "Join":
                    $scope.joinTask(id);
                    break;
                case "Complete":
                    $scope.markFinished(id);
                    break;
                case "Incomplete":
                    $scope.markUnFinished(id);
                    break;
                default:
                    console.log("BUG");
                    return true;
            }
            $scope.popover.hide();
            return true;
        };
    };

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if($scope.modal && $scope.modal.isShown()) {
            $scope.modal.remove();
            event.preventDefault();
        }
    });
}]);

vmaControllerModule.controller('message', ['$scope', '$state', '$stateParams', '$location', '$anchorScroll', '$timeout', '$ionicModal', 'vmaMessageService', 'ngNotify', 'vmaTaskService', '$ionicActionSheet', '$ionicPopup', '$ionicPopover', '$filter', '$ionicScrollDelegate', '$interval', function($scope, $state, $stateParams, $location, $anchorScroll, $timeout, $ionicModal, vmaMessageService, ngNotify, vmaTaskService, $ionicActionSheet, $ionicPopup, $ionicPopover, $filter, $ionicScrollDelegate, $interval) {
    $scope.id = $stateParams.id;

    vmaTaskService.getTask($scope.id).then(function(success) {
        $scope.task = success;
    });
    $scope.groupMSGs = [];

    $scope.updateMessages = function(startId) {
        var prom = vmaMessageService.getTaskMessages(1000000, startId, $scope.id);
        prom.then(function(success) {
            $scope.groupMSGs = success;
            $ionicScrollDelegate.scrollBottom(true);
        }, function(fail) {

        });
    };
    $scope.updateMessages();

    $scope.refreshMessages = function(startId) {
        var prom = vmaMessageService.getTaskMessages(1000000, startId, $scope.id);
        prom.then(function(success) {
            //$scope.groupMSGs.concat(success);
            //if(success.length>0)
            //    $ionicScrollDelegate.scrollBottom(true);
            if(success.length != $scope.groupMSGs.length){
                $scope.groupMSGs = success;
                $ionicScrollDelegate.scrollBottom(true);
            }
        }, function(fail) {

        });
    };

    $interval(function() {
        if($scope.groupMSGs && $scope.groupMSGs.length>0)
            //console.log($scope.groupMSGs[$scope.groupMSGs.length-1]);
            //$scope.refreshMessages($scope.groupMSGs[$scope.groupMSGs.length-1].id);
            $scope.refreshMessages();
    }, 5000);

    $scope.addMsg = function() {
        if($scope.msg != undefined)
        vmaMessageService.addMessage($scope.msg, $scope.uid, $scope.id).then(function(success) {
            $scope.updateMessages()
        });
        $scope.msg = "";
    };

    //OPENING THE MODAL TO DELETE A MESSAGE
    $scope.deleteMessage = function(id) {
        $scope.openDelete(id);
    };
    $scope.openDelete = function (id) {
        var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Message',
                template: 'Are you sure you want delete this message?'
            });
                confirmPopup.then(function(res) {
            if(res) {
                 $scope.ok();
            } else {

            }
        });

        $scope.ok = function () {
            var promise = vmaMessageService.deleteMessage(id);
            promise.then(function(success) {
                $scope.updateMessages();
                ngNotify.set("Message deleted successfully!", 'success');
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
        };
    };

    //OPENING THE MODAL TO EDIT A MESSAGE
    $scope.editMessage = function(id) {
        $scope.openEdit(id);
    };
    $scope.openEdit = function (id) {
        // callback for ng-click 'modal'- open Modal dialog to add a new course
        $ionicModal.fromTemplateUrl('partials/editMessage.html', {
            scope : $scope
        }).then(function (modal) {
            $scope.modal = modal;
            vmaMessageService.getMessage(id, $scope.id).then(function(success) { $scope.message_edit = success; });
            $scope.modal.show();
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.ok = function () {
            var promise = vmaMessageService.editMessage(id, $scope.message_edit);
            promise.then(function(success) {
                ngNotify.set("Message edited successfully!", 'success');
                $scope.updateMessages();
                $scope.closeModal()
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
        };
    };

    var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.inputUp = function() {
        if (isIOS) $scope.data.keyboardHeight = 216;
        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true);
        }, 1000);
    };
    $scope.inputDown = function() {
        if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
    };

    //PERMISSIONS
    $scope.generateActions = function(id) {
        var actionObj = $filter('getById')($scope.groupMSGs, id);
        var ionicActionArray = [];
        if(actionObj.sender_id == $scope.uid || $scope.isMod || $scope.isAdm){
            ionicActionArray = [
                { text: 'Edit' },
                { text: 'Delete' }
            ];
        }
        return ionicActionArray;
    };

    $scope.actionCount = function(post_id) {
        return ($scope.generateActions(post_id).length > 0);
    };

    $ionicPopover.fromTemplateUrl('partials/popoverOptsArray.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    //ACTION POPUP
    $scope.showActions = function(id, event0) {
        var ionicActions = $scope.ionicActions = $scope.generateActions(id);
        $scope.popOverStyle = {width:'150px', height: $scope.ionicActions.length*55 + "px"};
        $scope.popover.show(event0);
        $scope.popOverClick =   function(action) {
            switch(action) {
                case "Edit":
                    $scope.editMessage(id);
                    break;
                case "Delete":
                    $scope.deleteMessage(id);
                    break;
                default:
                    return true;
            }
            $scope.popover.hide();
            return true;
        }
    };

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if($scope.modal && $scope.modal.isShown()) {
            $scope.modal.remove();
            event.preventDefault();
        }
    });
}]);

vmaControllerModule.controller('comments', ['$scope', '$state', '$stateParams', '$ionicModal', 'vmaPostService', 'vmaCommentService', 'ngNotify', '$ionicActionSheet', '$ionicPopup', '$ionicPopover', '$filter', function($scope, $state, $stateParams, $ionicModal, vmaPostService, vmaCommentService, ngNotify, $ionicActionSheet, $ionicPopup, $ionicPopover, $filter) {
    var post_id = $stateParams.post_id;
    $scope.updateComments = function() {
        if($scope.post) { var count = $scope.post.comments.length; } else { var count = 10; }
        if(count <10 ) count = 10;
        vmaPostService.getPostView(count, null, post_id).then(function(success) { $scope.post = success; });
    };
    $scope.loadMore = function() {
        vmaCommentService.getPostComments(10, $scope.post.comments[$scope.post.comments.length -1].id, post_id).then(
            function(success) { $scope.post.comments = $scope.post.comments.concat(success); }
        );
    };
    $scope.updateComments();

    $scope.addComment = function() {
        if($scope.comment && $scope.comment.content!= "")
            vmaCommentService.addComment($scope.comment.content, post_id, $scope.uid).then(function(success) {
            $scope.updateComments();
            $scope.comment.content = "";
            document.activeElement.blur();
            ngNotify.set("Commented successfully!", "success");
        }, function(fail) {
            ngNotify.set(fail.data.message, 'error');
        });
    };

    $scope.editComment = function(cid) {
        $scope.openEdit(cid);
    };
    $scope.openEdit = function (cid) {
        // callback for ng-click 'modal'- open Modal dialog to add a new course
        $ionicModal.fromTemplateUrl('partials/editComment.html', {
            scope : $scope
        }).then(function (modal) {
            $scope.modal = modal;
            vmaCommentService.getComment(cid).then(function(success) { $scope.comment = success; });
            $scope.modal.show();
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        $scope.ok = function () {
            var prom = vmaCommentService.editComment(cid, $scope.comment);
            prom.then(function(success) {
                ngNotify.set("Comment edited successfully!", 'success');
                $scope.comment = null;
                $scope.updateComments();
            }, function(fail) {
                ngNotify.set(fail.data.message, 'error');
            });
            $scope.closeModal();
        };
    };

    //OPEN DELETE
    $scope.deleteComment = function(cid) {
        $scope.openDelete(cid);
    };
    $scope.openDelete = function (cid) {
        var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Comment',
                template: 'Are you sure you want delete this comment?'
            });
                confirmPopup.then(function(res) {
            if(res) {
                 $scope.ok();
            } else {

            }
        });
        $scope.ok = function () {
            var prom = vmaCommentService.deleteComment(cid);
            prom.then(function(success) {
                $scope.updateComments();
                ngNotify.set("Comment deleted successfully!", 'success');
            }, function(fail) {
//                console.log(fail)
                ngNotify.set(fail.data.message, 'error');
            });
        };
    };

    //PERMISSIONS
    $scope.generateActions = function(id) {
        var actionObj = $filter('getById')($scope.post.comments, id);
        var ionicActionArray = [];
        if(actionObj.user_id == $scope.uid || $scope.isMod || $scope.isAdm){
            ionicActionArray = [
                { text: 'Edit' },
                { text: 'Delete' }
            ];
        }
        return ionicActionArray;
    };

    $ionicPopover.fromTemplateUrl('partials/popoverOptsArray.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.actionCount = function(post_id) {
        return ($scope.generateActions(post_id).length > 0);
    };
    //ACTION POPUP
    $scope.showActions = function(id, event0) {
        var ionicActions = $scope.ionicActions = $scope.generateActions(id);
        $scope.popOverStyle = {width:'150px', height: $scope.ionicActions.length*55 + "px"};
        $scope.popover.show(event0);
        $scope.popOverClick = function(action) {
            switch(action) {
                case "Edit":
                    $scope.editComment(id);
                    break;
                case "Delete":
                    $scope.deleteComment(id);
                    break;
                default:
                    console.log("BUG");
                    return true;
            }
            $scope.popover.hide();
            return true;
        }
    };

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if($scope.modal && $scope.modal.isShown()) {
            $scope.modal.remove();
            event.preventDefault();
        }
    });
}]);

vmaControllerModule.controller('task', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
    console.log(JSON.parse($stateParams.task));
    $scope.task = JSON.parse($stateParams.task);
    $scope.map = {
        sensor: true,
        size: '500x300',
        zoom: 15,
        center: $scope.task.location,
        markers: [$scope.task.location], //marker locations
        mapevents: {redirect: true, loadmap: false}
    };
    console.log($scope.task.isManager, $scope.isAdm, $scope.isMod);
}]);

vmaControllerModule.controller('efforts', ['$scope', 'ngNotify', function($scope, ngNotify) {
    $scope.invites = [
        {id:'3', group_name: "GROUP 3", icon: "img/temp_icon.png"},
        {id:'4', group_name: "GROUP 4", icon: "img/temp_icon.png"},
        {id:'5', group_name: "GROUP 5", icon: "img/temp_icon.png"},
        {id:'6', group_name: "GROUP 6", icon: "img/temp_icon.png"}
    ];
}]);

vmaControllerModule.controller('hours.moderation', ['$scope', '$state', '$stateParams', '$ionicModal', '$rootScope', 'ngNotify', 'vmaTaskService', 'vmaHourService', '$ionicLoading', function($scope, $state, $stateParams, $modal, $rootScope, ngNotify, vmaTaskService, vmaHourService, $ionicLoading) {
    //$scope.notReachedEnd = true;
    $scope.pending = true;
    $scope.query = "";
    $scope.update = function() {
        console.log($scope.pending);
        $ionicLoading.show();
        vmaHourService.getHours(1000000000, null, $stateParams.group_id, $scope.pending).then(function(success) {
            $scope.entries = success;
            $ionicLoading.hide();
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
    $scope.switchAndUpdate = function() {
        $scope.pending = !$scope.pending;
        $scope.update();
    };
    //$scope.loadMore = function() {
    //    if ($scope.entries && $scope.entries.length > 0) {
    //    console.log($scope.entries[$scope.entries.length - 1].id);
    //    vmaHourService.getHours(10, $scope.entries[$scope.entries.length - 1].id, $stateParams.group_id, true).then(
    //        function (success) {
    //            console.log("HERE");
    //            $scope.entries = $scope.entries.concat(success);
    //            if (success.length > 0)
    //                $scope.$broadcast('scroll.infiniteScrollComplete');
    //            else
    //                $scope.notReachedEnd = false;
    //        }, function (fail) {
    //            console.log(fail);
            //});
        //}
    //};
    $scope.update();

    $scope.entry = [];

    $scope.approve = function(h_id) {
        vmaHourService.approveHour(h_id).then(function(){ngNotify.set("Hour approved successfully", "success"); $scope.update();});
    };

    $scope.deny = function(h_id) {
        vmaHourService.denyHour(h_id).then(function(){ngNotify.set("Hour disapproved successfully", "success"); $scope.update();});
    }
}]);

vmaControllerModule.controller('hoursController', ['$scope', '$state', '$stateParams', '$ionicModal', '$rootScope', 'ngNotify', 'vmaTaskService', 'vmaHourService', '$ionicPopup', '$filter', function($scope, $state, $stateParams, $ionicModal, $rootScope, ngNotify, vmaTaskService, vmaHourService, $ionicPopup, $filter) {
    $scope.update = function() {
        vmaTaskService.getJoinTasks().then(function(success) {
            //$scope.joinTasks = success;
            var tasks_temp = success;
            $scope.joinTasks = [];
            tasks_temp.forEach(function(task) {
                if(task.finished != 1) $scope.joinTasks.push(task);
            });
        });
        vmaHourService.getMyHours(100000, null, null, false).then(function(success) { $scope.entries = success;});
    };
    $scope.update();

    $scope.entry = [];
    $scope.entry.name = "Other";
    $scope.ok = function() {
        if($scope.entry.name != "Other") {
            var taskSelected = $filter('getByName')($scope.joinTasks, $scope.entry.name);
            $scope.hourEntry = {user_id: $rootScope.uid, title: $scope.entry.name, start_time: $scope.entry.inTime, duration: Math.ceil($scope.entry.duration), task_id: taskSelected.id};
        } else {
            $scope.hourEntry = {user_id: $rootScope.uid, title: $scope.entry.customName, start_time: $scope.entry.inTime, duration: Math.ceil($scope.entry.duration)};
        }
        console.log($scope.hourEntry);
        if($scope.hourEntry.title && $scope.hourEntry.duration)
        vmaHourService.addHours($scope.hourEntry).then(function(success) {
            $scope.update();
            $scope.entry = [];
            $scope.entry.name = "Other";
            ngNotify.set("Successfully submitted hour entry!", "success");
        },function(fail){
            ngNotify.set("Error :(", "error");
        });
        else
        ngNotify.set("Please fill required fields", "error");
    };
    $scope.$watch('entry.name', function(taskName) {
        if(taskName != "Other")
        vmaTaskService.getTaskByName(taskName).then(function(success){
            console.log(success);
            if(success) {
                if (success.time) {
                    if(!$scope.tmp)
                        $scope.tmp = {};
                    $scope.tmp.newDate = $scope.entry.inTime = new Date(success.time);
                }
                if (success.duration)
                    $scope.entry.duration = success.duration;
            }
        })
    });
    $scope.checkIn = function() {
        $scope.entry.inTime = new Date();
        $scope.checkInTimeDisplay = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
        console.log($scope.entry.inTime);
        ngNotify.set("Successfully checked in!", "success");
    };

    $scope.checkOut = function() {
        console.log($scope.entry.inTime);
        $scope.checkOutTime = new Date();
        $scope.checkOutTimeDisplay = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
        $scope.entry.duration = Math.ceil(($scope.checkOutTime - $scope.entry.inTime)/1000/60);
        ngNotify.set("Successfully checked out!", "success");
    };

    //OPENING THE MODAL TO DELETE A MESSAGE
    $scope.delete = function(h_id) {
        $scope.openDelete(h_id);
    };
    $scope.openDelete = function (id) {
        console.log(id);
        var modalInstance = $modal.open({
          templateUrl: 'partials/deleteHour.html',
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
            var promise = vmaHourService.deleteHour(deleteId);
            promise.then(function(success) {
                window_scope.update();
                ngNotify.set("Hour entry deleted successfully!", 'success');
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

    $scope.openDatePicker = function () {
        if(!$scope.tmp)
            $scope.tmp = {};
//        $scope.tmp.newDate = $scope.newTask.time;
        $ionicPopup.show({
            template: '<datetimepicker data-ng-model="tmp.newDate"></datetimepicker>',
            title: "Task Date & Time",
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        $scope.entry.inTime = $scope.tmp.newDate;
                    }
                }
            ]
        });
    };
}]);

vmaControllerModule.controller('awards', ['$scope', 'tasks', function ($scope, tasks) {
//    PULL THIS IN FROM USER_DATA
    $scope.badges = [
        [$scope.badgeConfig[0], tasks[0]],
        [$scope.badgeConfig[1], tasks[1]],
        [$scope.badgeConfig[2], tasks[2]],
        [$scope.badgeConfig[3], tasks[3]],
        [$scope.badgeConfig[4], tasks[4]]
    ];
//    console.log(tasks);

    $scope.total_hours = tasks[0] + tasks[1] + tasks[2] + tasks[3] + tasks[4];
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
                        enabled: true
                    },
                    showInLegend: false
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Hours',
            data: $scope.badges
        }],
        loading: false
    }

}]);

vmaControllerModule.controller('calendar', ['$scope', '$state', 'vmaTaskService', '$compile', '$ionicModal', function($scope, $state, vmaTaskService, $compile, $modal) {
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
    };


    $scope.updateTasksAndDisplayCalendar();

    $scope.$watch(function() {
//        console.log($('#calendar'));
        return $('#calendar').length;
    }, function() {
        console.log("compiling");
        $compile($('#calendar'))($scope);
        //element.html($parse(attr.content)(scope));
        //$compile(element.contents())(scope);
    }, true);
    //VIEW A TASK
    $scope.viewTask = function(click_id) {
        $scope.task = vmaTaskService.getTaskView(click_id);
        $state.go("home.task", {"task" : JSON.stringify($scope.task)}, [{reload: false}]);
    }
}]);

vmaControllerModule.controller('menuCtrl', ['$scope', '$state', '$ionicSideMenuDelegate', function($scope, $state, $ionicSideMenuDelegate) {
    $scope.state = $state;
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
}]);
