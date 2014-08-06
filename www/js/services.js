'use strict';

var vmaServices = angular.module('vmaServicesModule', ['restangular']);

vmaServices.factory('vmaGroupService', ['Restangular', '$q', '$filter', function(Restangular, $q, $filter) {
    var allGroups = [];
    var manGroups = [];
    var memGroups = [];
    var subGroups = [];
    var metaGroups = [];
    return {
        updateGroups:
            //ACCESSES SERVER AND UPDATES THE LIST OF GROUPS
            function() {
                var gProm = Restangular.all("groups").one("byMembership").getList();
                gProm.then(function(success) {
                    success = Restangular.stripRestangular(success);
                    memGroups = success;
                }, function(fail) {
        //            console.log(fail);
                });
                var gPromByMan = Restangular.all("groups").one("byManager").getList();
                gPromByMan.then(function(success) {
                    success = Restangular.stripRestangular(success);
                    manGroups = success;
                }, function(fail) {
        //            console.log(fail);
                });
                var gPromMaster = Restangular.all("groups").getList();
                gPromMaster.then(function(success) {
                    success = Restangular.stripRestangular(success);
                    allGroups = success;
                }, function(fail) {
        //            console.log(fail);
                });
                return $q.all([gProm, gPromByMan, gPromMaster]);
            },
        getAllGroups: 
            function() {
                return this.updateGroups().then(function(success) { return allGroups; });
            },
        getManGroups: 
            function() {
                return this.updateGroups().then(function(success) { return manGroups; });
            },
        getMemGroups:
            function() {
                return this.updateGroups().then(function(success) { return memGroups; });
            },
        getSubtractedGroups:
            function() {
                return this.updateGroups().then(function(success) {
                    var assignedGroupsIds = {};
                    var groupsIds = {};
                    var result = [];

                    var assignedGroups = manGroups.concat(memGroups);
                    var groups = allGroups;

                    assignedGroups.forEach(function (el, i) {
                        assignedGroupsIds[el.id] = assignedGroups[i];
                    });

                    groups.forEach(function (el, i) {
                        groupsIds[el.id] = groups[i];
                    });

                    for (var i in groupsIds) {
                        if (!assignedGroupsIds.hasOwnProperty(i)) {
                            result.push(groupsIds[i]);
                        }
                    }
                    subGroups = result;
                    return result;
                });
            },
        getMetaGroups:
            function() {
                return this.getSubtractedGroups().then(function(success) {
                    var result = [];
                    subGroups.forEach(function(obj){
                        obj.isGroup = true;
                        result.push(obj);
                    });
                    memGroups.forEach(function(obj){
                        obj.isMember = true;
                        result.push(obj);
                    });
                    manGroups.forEach(function(obj){
                        obj.isManager = true;
                        result.push(obj);
                    });
                    metaGroups = result;
                    return result;
                });
            },
        getMetaJoinedGroups:
            function() {
                return this.getSubtractedGroups().then(function(success) {
                    var result = [];
                    manGroups.forEach(function(obj){
                        obj.isManager = true;
                        result.push(obj);
                    });
                    memGroups.forEach(function(obj){
                        obj.isMember = true;
                        result.push(obj);
                    });
                    metaGroups = result;
                    return result;
                });
            },
        getGroup:
            function(group_id) {
                return $filter('getById')(allGroups, group_id);
            },
        addGroup:
            function(group) {
                return Restangular.all("groups").post(group);
            },
        editGroup:
            function(id, group) {
                 return Restangular.all("groups").all(id).post(group);
            },
        deleteGroup:
            function(gid) {
                return Restangular.all("groups").all(gid).remove();
            },
        joinGroup:
            function(gid, uid) {
                return Restangular.all("groups").all(gid).all("MEMBER").all(uid).post();
            },
        leaveGroupManager:
            function(gid, uid) {
                 return Restangular.all("groups").all(gid).all("MANAGER").all(uid).remove().then(function(success) {});
            },
        leaveGroupMember:
            function(gid, uid) {
                return this.leaveGroupManager(gid, uid).then(function(success) {
                    return Restangular.all("groups").all(gid).all("MEMBER").all(uid).remove().then(function(success) {});
                });
            }
    }
}]);

vmaServices.factory('vmaTaskService', ['Restangular', '$q', '$filter', function(Restangular, $q, $filter) {
    var allTasks = [];
    var manTasks = [];
    var memTasks = [];
    var subTasks = [];
    var metaTasks = [];
    var refresh = true;
    return {
        updateTasks:
            //ACCESSES SERVER AND UPDATES THE LIST OF TASKS
            function() {
                if(refresh) {
//                    refresh = !refresh;
                    console.log("TASKS UPDATED");
                    var gProm = Restangular.all("tasks").one("byMembership").getList();
                    gProm.then(function(success) {
                        success = Restangular.stripRestangular(success);
                        memTasks = success;
                    }, function(fail) {
            //            console.log(fail);
                    });
                    var gPromByMan = Restangular.all("tasks").one("byManager").getList();
                    gPromByMan.then(function(success) {
                        success = Restangular.stripRestangular(success);
                        manTasks = success;
                    }, function(fail) {
            //            console.log(fail);
                    });
                    var gPromMaster = Restangular.all("tasks").getList();
                    gPromMaster.then(function(success) {
                        success = Restangular.stripRestangular(success);
                        allTasks = success;
                    }, function(fail) {
            //            console.log(fail);
                    });
                    return $q.all([gProm, gPromByMan, gPromMaster]);
                } else {
                    var deferred = $q.defer();
                    deferred.resolve("DONE");
                    return deferred.promise;                    
                }
            },
        getAllTasks: 
            function() {
                return this.updateTasks().then(function(success) { return allTasks; });
            },
        getManTasks: 
            function() {
                return this.updateTasks().then(function(success) { return manTasks; });
            },
        getMemTasks:
            function() {
                return this.updateTasks().then(function(success) { return memTasks; });
            },
        getSubtractedTasks:
            function() {
                return this.updateTasks().then(function(success) {
                    var assignedGroupsIds = {};
                    var groupsIds = {};
                    var result = [];

                    var assignedGroups = manTasks.concat(memTasks);
                    var groups = allTasks;

                    assignedGroups.forEach(function (el, i) {
                        assignedGroupsIds[el.id] = assignedGroups[i];
                    });

                    groups.forEach(function (el, i) {
                        groupsIds[el.id] = groups[i];
                    });

                    for (var i in groupsIds) {
                        if (!assignedGroupsIds.hasOwnProperty(i)) {
                            result.push(groupsIds[i]);
                        }
                    }
                    subTasks = result;
                    return result;
                });
            },
        getMetaTasks:
            function() {
                return this.getSubtractedTasks().then(function(success) {
//                    console.log(success);
                    var result = [];
                    manTasks.forEach(function(obj){
                        obj.isManager = true;
//                        console.log(obj);
                        result.push(obj);
                    });
                    memTasks.forEach(function(obj){
                        obj.isMember = true;
//                        console.log(obj);
                        result.push(obj);
                    });
                    subTasks.forEach(function(obj){
                        obj.isTask = true;
//                        console.log(obj);
                        result.push(obj);
                    });
//                    console.log(result);
                    metaTasks = result;
                    return result;
//                  return $filter('getTasksByGroupId')(memTasks, gid);
                });
            },
        getAllTasksGroup: 
            function(gid) {
                return this.updateTasks().then(function(success) { return $filter('getTasksByGroupId')(allTasks, gid);});
            },
        getManTasksGroup: 
            function(gid) {
                return this.updateTasks().then(function(success) { return $filter('getTasksByGroupId')(manTasks, gid);});
            },
        getMemTasksGroup:
            function(gid) {
                return this.updateTasks().then(function(success) { return $filter('getTasksByGroupId')(memTasks, gid);});
            },
        getSubtractedTasksGroup:
            function(gid) {
                return this.updateTasks().then(function(success) {
                    var assignedGroupsIds = {};
                    var groupsIds = {};
                    var result = [];

                    var assignedGroups = manTasks.concat(memTasks);
                    var groups = allTasks;

                    assignedGroups.forEach(function (el, i) {
                        assignedGroupsIds[el.id] = assignedGroups[i];
                    });

                    groups.forEach(function (el, i) {
                        groupsIds[el.id] = groups[i];
                    });

                    for (var i in groupsIds) {
                        if (!assignedGroupsIds.hasOwnProperty(i)) {
                            result.push(groupsIds[i]);
                        }
                    }
                    var result = $filter('getTasksByGroupId')(result, gid);
                    return result;
                });
            },
        getMetaTasksGroup:
            function(gid) {
                return this.getMetaTasks().then(function(success) {
//                    console.log(success);
                    return $filter('getTasksByGroupId')(success, gid);
                });
            },
        getJoinTasks:
            function() {
                return this.updateTasks().then(function(success) {
                    return memTasks.concat(manTasks);
                });
            },
        getCalTasks:
            function() {
                return this.getJoinTasks().then(function(success) {
                    console.log(success);
                    var result = [];
                    success.forEach(function(entry) {
//                        console.log(new Date(entry.time));
                        var localoffset = (new Date(entry.time)).getTimezoneOffset();
                        // "unadjust" date
                        entry.time = new Date(entry.time.valueOf()/* - (localoffset * 60 * 1000)*/);
//                        console.log(new Date(entry.time));
//                        console.log(entry.id);
                        result.push({"title" : entry.name, "start": entry.time, "url": "viewTask(" + entry.id + ")"});
                    });
                    return result;
                });
            },
        getTask:
            function(task_id) {
                return $filter('getById')(allTasks, task_id);
            },
        getTaskView:
            function(task_id) {
                var viewTask = $filter('getById')(allTasks, task_id);
                if(viewTask.time) {
                    viewTask.time = new Date(viewTask.time).toDateString() + " " + new Date(viewTask.time).getHours() + ":" + new Date(viewTask.time).getMinutes();
                } else {
                    viewTask.time = "No Time Specified";
                }
                if(!viewTask.location) {
                    viewTask.show_map = false;
                } else {
                    viewTask.show_map = true;
                }
                console.log(viewTask);
                return viewTask;
            },
        addTask:
            function(task) {
                return Restangular.all("tasks").post(task);
            },
        editTask:
            function(id, task) {
                 return Restangular.all("tasks").all(id).post(task);
            },
        deleteTask:
            function(tid) {
                return Restangular.all("tasks").all(tid).remove();
            },
        joinTask:
            function(tid, uid) {
                return Restangular.all("tasks").all(tid).all("MEMBER").all(uid).post();
            },
        leaveTaskManager:
            function(tid, uid) {
                 return Restangular.all("tasks").all(tid).all("MANAGER").all(uid).remove().then(function(success) {});
            },
        leaveTaskMember:
            function(tid, uid) {
                return this.leaveTaskManager(tid, uid).then(function(success) {
                    return Restangular.all("tasks").all(tid).all("MEMBER").all(uid).remove().then(function(success) {});
                });
            }
    }
}]);

vmaServices.factory('vmaPostService', ['Restangular', '$q', '$filter', function(Restangular, $q, $filter) {
    var allPosts = [];
    var manPosts = [];
    var memPosts = [];
    var subPosts = [];
    var metaPosts = [];
    var refresh = true;
    return {
        updatePosts:
            //ACCESSES SERVER AND UPDATES THE LIST OF TASKS
            function() {
                if(refresh) {
//                    refresh = !refresh;
                    console.log("TASKS UPDATED");
                    var gProm = Restangular.all("posts").one("byMembership").getList();
                    gProm.then(function(success) {
                        success = Restangular.stripRestangular(success);
                        memPosts = success;
                    }, function(fail) {
            //            console.log(fail);
                    });
                    var gPromByMan = Restangular.all("posts").one("byManager").getList();
                    gPromByMan.then(function(success) {
                        success = Restangular.stripRestangular(success);
                        manPosts = success;
                    }, function(fail) {
            //            console.log(fail);
                    });
                    var gPromMaster = Restangular.all("posts").getList();
                    gPromMaster.then(function(success) {
                        success = Restangular.stripRestangular(success);
                        allPosts = success;
                    }, function(fail) {
            //            console.log(fail);
                    });
                    return $q.all([gProm, gPromByMan, gPromMaster]);
                }
                else {
                    var deferred = $q.defer();
                    deferred.resolve("DONE");
                    return deferred.promise;                    
                }
            },
        getAllPosts: 
            function() {
                return this.updatePosts().then(function(success) { return allPosts; });
            },
        getManPosts: 
            function() {
                return this.updatePosts().then(function(success) { return manPosts; });
            },
        getMemPosts:
            function() {
                return this.updatePosts().then(function(success) { return memPosts; });
            },
        getSubtractedPosts:
            function() {
                return this.updatePosts().then(function(success) {
                    var assignedGroupsIds = {};
                    var groupsIds = {};
                    var result = [];

                    var assignedGroups = manPosts.concat(memPosts);
                    var groups = allPosts;

                    assignedGroups.forEach(function (el, i) {
                        assignedGroupsIds[el.id] = assignedGroups[i];
                    });

                    groups.forEach(function (el, i) {
                        groupsIds[el.id] = groups[i];
                    });

                    for (var i in groupsIds) {
                        if (!assignedGroupsIds.hasOwnProperty(i)) {
                            result.push(groupsIds[i]);
                        }
                    }
                    subPosts = result;
                    return result;
                });
            },
        getMetaPosts:
            function() {
                return this.getSubtractedPosts().then(function(success) {
//                    console.log(success);
                    var result = [];
                    manPosts.forEach(function(obj){
                        obj.isManager = true;
//                        console.log(obj);
                        result.push(obj);
                    });
                    memPosts.forEach(function(obj){
                        obj.isMember = true;
//                        console.log(obj);
                        result.push(obj);
                    });
                    subPosts.forEach(function(obj){
                        obj.isPost = true;
//                        console.log(obj);
                        result.push(obj);
                    });
//                    console.log(result);
                    metaPosts = result;
                    return result;
//                  return $filter('getPostsByGroupId')(memPosts, gid);
                });
            },
        getAllPostsGroup: 
            function(gid) {
                return this.updatePosts().then(function(success) { return $filter('getPostsByGroupId')(allPosts, gid);});
            },
        getManPostsGroup: 
            function(gid) {
                return this.updatePosts().then(function(success) { return $filter('getPostsByGroupId')(manPosts, gid);});
            },
        getMemPostsGroup:
            function(gid) {
                return this.updatePosts().then(function(success) { return $filter('getPostsByGroupId')(memPosts, gid);});
            },
        getSubtractedPostsGroup:
            function(gid) {
                return this.updatePosts().then(function(success) {
                    var assignedGroupsIds = {};
                    var groupsIds = {};
                    var result = [];

                    var assignedGroups = manPosts.concat(memPosts);
                    var groups = allPosts;

                    assignedGroups.forEach(function (el, i) {
                        assignedGroupsIds[el.id] = assignedGroups[i];
                    });

                    groups.forEach(function (el, i) {
                        groupsIds[el.id] = groups[i];
                    });

                    for (var i in groupsIds) {
                        if (!assignedGroupsIds.hasOwnProperty(i)) {
                            result.push(groupsIds[i]);
                        }
                    }
                    var result = $filter('getPostsByGroupId')(result, gid);
                    return result;
                });
            },
        getMetaPostsGroup:
            function(gid) {
                return this.getMetaPosts().then(function(success) {
//                    console.log(success);
                    return $filter('getPostsByGroupId')(success, gid);
                });
            },
        getPost:
            function(post_id) {
                return $filter('getById')(allPosts, post_id);
            },
        addPost:
            function(post) {
                return Restangular.all("posts").post(post);
            },
        editPost:
            function(id, post) {
                 return Restangular.all("posts").all(id).post(post);
            },
        deletePost:
            function(pid) {
                return Restangular.all("posts").all(pid).remove();
            },
    }
}]);