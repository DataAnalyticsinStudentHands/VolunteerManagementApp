'use strict';

var vmaServices = angular.module('vmaServicesModule', ['restangular']);
vmaServices.factory('vmaUserService', ['Restangular', '$q', '$filter', function(Restangular, $q, $filter) {
    var allUsers = [];
    var myUser = [];
    return {
        updateUsers:
            //ACCESSES SERVER AND UPDATES THE LIST OF GROUPS
            function() {
                var gProm = Restangular.all("users").getList();
                gProm.then(function(success) {
                    success = Restangular.stripRestangular(success);
                    allUsers = success;
                }, function(fail) {
        //            console.log(fail);
                });
                return gProm;
            },
        getAllUsers: 
            function() {
                return this.updateUsers().then(function(success) { return allUsers; });
            },
        getMyUser:
            function() {
                return Restangular.all("users").all("myUser").getList();
            },
        getUser:
            function(user_id) {
                return this.updateUsers().then(function(success) {
                    return $filter('getById')(allUsers, user_id);
                });
            },
        addUser:
            function(user) {
                return Restangular.all("users").post(user);
            },
        editUser:
            function(id, user) {
                 return Restangular.all("users").all(id).post(user);
            },
        deleteUser:
            function(uid) {
                return Restangular.all("users").all(uid).remove();
            },
    }
}]);

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
                console.log("GROUPS UPDATED");
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
                return this.updateGroups().then(function(success) {
                    var group = $filter('getById')(allGroups, group_id);
                    return group;
                });
            },
        getGroupMeta:
            function(group_id) {
                return this.updateGroups().then(function(success) {
                    var group = $filter('getById')(allGroups, group_id);
                    if($filter('getById')(memGroups.concat(manGroups), group_id)) {
                        group.joined = true;
                    } else {
                        group.joined = false;
                    }
                    return group;
                });
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
        isManager: function(gid) {
            return this.getManGroups().then(function(success) {
                var group = $filter('getById')(manGroups, gid);
                if(group) return true; else return false;
            }, function(fail) {
//                asdf
            });
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

vmaServices.factory('vmaTaskService', ['Restangular', '$q', '$filter', 'vmaGroupService', function(Restangular, $q, $filter, vmaGroupService) {
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
                    var result = [];
                    manTasks.forEach(function(obj){
                        obj.isManager = true;
                        result.push(obj);
                    });
                    memTasks.forEach(function(obj){
                        obj.isMember = true;
                        result.push(obj);
                    });
                    subTasks.forEach(function(obj){
                        obj.isTask = true;
                        result.push(obj);
                    });
                    metaTasks = result;
                    return result;
                });
            },
        getAllTasksGroup: 
            function(gid) {
                return this.updateTasks().then(function(success) {
                    var tasks = $filter('getTasksByGroupId')(allTasks, gid);
                    
                    tasks.forEach(function(task) {
                        if($filter('getById')(memTasks.concat(manTasks), task.id))
                           task.joined = true;
                    });
                    
                    return tasks;
                });
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
                    var manGroups = [];
                    return vmaGroupService.isManager(gid).then(function(isMan) {
                        var result = $filter('getTasksByGroupId')(success, gid);
                        //FORMATTING DATE/TIME
                        result.forEach(function(obj) {
                            if(obj.time) {
                                obj.datetime = new Date(obj.time).toDateString() + " " + new Date(obj.time).toLocaleTimeString().replace(/:\d{2}\s/,' ');
                            } else {
                                obj.time = "No Time Specified";
                            }
                        });
                        if(!isMan) {
                            return result;
                        } else {
                            result.forEach(function(obj) {
                                // SETTING PERMISSIONS METADATA
                                obj.isMember = false;
                                obj.isManager = false;
                                obj.isTask = false;
                                obj.isGroupManager = true;
                            });
                            return result;
                        }
                    }, function(error) {
                        console.log(error);
                    });
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
                        if(entry.time) {
                            var localoffset = (new Date(entry.time)).getTimezoneOffset();
                            // "unadjust" date
                            entry.time = new Date(entry.time.valueOf()/* - (localoffset * 60 * 1000)*/);
    //                        console.log(new Date(entry.time));
    //                        console.log(entry.id);
                            result.push({"title" : entry.name, "start": entry.time, "url": "viewTask(" + entry.id + ")"});
                        }
                    });
                    return result;
                });
            },
        getTask:
            function(task_id) {
                return this.updateTasks().then(function(success) {
                    var task = $filter('getById')(allTasks, task_id);
                    console.log(task);
                    return task;
                });
            },
        getTaskView:
            function(task_id) {
                var viewTask = $filter('getById')(allTasks, task_id);
                if(viewTask.time) {
                    viewTask.time = new Date(viewTask.time).toDateString() + " " + new Date(viewTask.time).toLocaleTimeString().replace(/:\d{2}\s/,' ');
                } else {
                    viewTask.time = "No Time Specified";
                }
                if(!viewTask.location) {
                    viewTask.show_map = false;
                } else {
                    viewTask.show_map = true;
                }
                return viewTask;
            },
        addTask:
            function(task) {
                return Restangular.all("tasks").post(task);
            },
        editTask:
            function(id, task) {
                 return Restangular.all("tasks").all(id).doPUT(task);
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

vmaServices.factory('vmaPostService', ['Restangular', '$q', '$filter', 'vmaGroupService', 'vmaUserService', 'vmaCommentService', function(Restangular, $q, $filter, vmaGroupService, vmaUserService, vmaCommentService) {
    var allPosts = [];
    var allPostsPlain = [];
    var myGroupPosts = [];
    var metaPosts = [];
    var refresh = true;
    return {
        updatePosts:
            //ACCESSES SERVER AND UPDATES THE LIST OF TASKS
            function() {
                if(refresh) {
                    console.log("POSTS UPDATED");
                    var gPromAll = Restangular.all("posts").getList();
                    gPromAll.then(function(success) {
                        success = Restangular.stripRestangular(success);
                        allPosts = success;
                    }, function(fail) {
            //            console.log(fail);
                    });
                    var gPromByMe = Restangular.all("posts").one("myPosts").getList();
                    gPromByMe.then(function(success) {
                        success = Restangular.stripRestangular(success);
                        myGroupPosts = success;
                    }, function(fail) {
            //            console.log(fail);
                    });
                    return $q.all([gPromAll, gPromByMe]);
                }
                else {
                    var deferred = $q.defer();
                    deferred.resolve("DONE");
                    return deferred.promise;                    
                }
            },
        getAllPosts: 
            function() {
                var updatePostPromise = this.updatePosts().then(function(success) {
                    var resultPosts = [];
                    allPosts.forEach(function(post) {
                        post.date =  new Date(post.creation_timestamp).toDateString() + " " + new Date(post.creation_timestamp).toLocaleTimeString().replace(/:\d{2}\s/,' ');
                        vmaGroupService.getGroup(post.group_id).then(function(success) { post.group = success });
                        vmaUserService.getUser(post.user_id).then(function(success) { post.user = success });
                        resultPosts.push(post);
                    });
                    return resultPosts;
                });
                return updatePostPromise;
            },
        getMyGroupPosts: 
            function() {
                return this.updatePosts().then(function(success) {
                    var resultPosts = [];
                    myGroupPosts.forEach(function(post) {
                        post.time =  new Date(post.creation_timestamp).toDateString() + " " + new Date(post.creation_timestamp).toLocaleTimeString().replace(/:\d{2}\s/,' ');
                        vmaGroupService.getGroup(post.group_id).then(function(success) { post.group = success });
                        vmaUserService.getUser(post.user_id).then(function(success) { post.user = success });
//                        console.log(post);
                        resultPosts.push(post);
                    });
                    return resultPosts;
                });
            },
        getGroupPostsPromise:
            function(numPosts, startindex, gid) {
                var gPromAll = Restangular.all("posts").getList({"numberOfPosts": numPosts, "startIndex": startindex, "group_id": gid});
                return gPromAll.then(function(success) {
                    success = Restangular.stripRestangular(success);
                    var resultPosts = [];
                    success.forEach(function(post) {
                        post.time =  new Date(post.creation_timestamp).toDateString() + " " + new Date(post.creation_timestamp).toLocaleTimeString().replace(/:\d{2}\s/,' ');
                        vmaGroupService.getGroup(post.group_id).then(function(success) { post.group = success });
                        vmaUserService.getUser(post.user_id).then(function(success) { post.user = success });
                        resultPosts.push(post);
                    });
                    return resultPosts;
                }, function(fail) {
        //            console.log(fail);
                });
            },
        getGroupPosts:
            function(num, ind, gid) {
                return this.getGroupPostsPromise(num, ind, gid).then(function(success) {
                    return success;
                });
            },
        getPostView:
            function(post_id) {
                return this.updatePosts().then(function(success) {
                    var post = $filter('getById')(allPosts, post_id);
                    post.date =  new Date(post.creation_timestamp).toDateString() + " " + new Date(post.creation_timestamp).toLocaleTimeString().replace(/:\d{2}\s/,' ');
                    vmaGroupService.getGroup(post.group_id).then(function(success) { post.group = success });
                    vmaUserService.getUser(post.user_id).then(function(success) { post.user = success });
                    vmaCommentService.getPostComments(null, null, post.id).then(function(success) { post.comments =success; });
                    console.log(post);
                    return post;
                });
            },
        getPost:
            function(post_id) {
                return this.updatePosts().then(function(success) {
                    return $filter('getById')(allPosts, post_id);
                });
            },
        addPost:
            function(post, uid) {
                post.user_id = uid;
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

vmaServices.factory('vmaCommentService', ['Restangular', '$q', '$filter', 'vmaUserService', function(Restangular, $q, $filter, vmaUserService) {
    var allComments = [];
    var allCommentsPlain = [];
    var myPostComments = [];
    var metaComments = [];
    var refresh = true;
    return {
        getPostCommentsPromise:
            function(numComments, startindex, pid) {
                var promAll = Restangular.all("comments").getList({"numberOfComments": numComments, "startIndex": startindex, "post_id": pid});
                return promAll.then(function(success) {
                    success = Restangular.stripRestangular(success);
                    allCommentsPlain = success;
//                    console.log(allCommentsPlain);
                    var resultComments = [];
                    success.forEach(function(comment) {
                        comment.time =   new Date(comment.creation_timestamp).toDateString() + " " + new Date(comment.creation_timestamp).toLocaleTimeString().replace(/:\d{2}\s/,' ');
                        vmaUserService.getUser(comment.user_id).then(function(success) { comment.user = success;});
                        comment.img = "img/temp_icon.png";
//                        console.log(comment);
                        resultComments.push(comment);
                    });
                    return resultComments;
                }, function(fail) {
                    
                });
             },
        getPostCommentsPlain:
            function(numComments, startindex, pid) {
                return Restangular.all("comments").getList({"numberOfComments": numComments, "startIndex": startindex, "post_id": pid});
            },
        getPostComments:
            function(num, ind, pid) {
                return this.getPostCommentsPromise(num, ind, pid).then(function(success) {
                    return success;
                });
            },
        getComment:
            function(comment_id) {
                return Restangular.all("comments").get(comment_id);
            },
        addComment:
            function(content, pid, uid) {
                var cmt = {"content" : content, "user_id": uid, "post_id": pid};
                console.log(cmt);
                return Restangular.all("comments").post(cmt);
            },
        editComment:
            function(id, comment) {
                 return Restangular.all("comments").all(id).post(comment);
            },
        deleteComment:
            function(cid) {
                return Restangular.all("comments").all(cid).remove();
            },
    }
}]);

vmaServices.factory('vmaMessageService', ['Restangular', '$q', '$filter', 'vmaTaskService', 'vmaUserService', function(Restangular, $q, $filter, vmaTaskService, vmaUserService) {
    var allMessages = [];
    var allMessagesPlain = [];
    var myTaskMessages = [];
    var metaMessages = [];
    var refresh = true;
    return {
        getTaskMessagesPromise:
            function(numMessages, startindex, tid) {
                var promAll = Restangular.all("messages").getList({"numberOfMessages": numMessages, "startIndex": startindex, "task_id": tid});
                return promAll.then(function(success) {
                    success = Restangular.stripRestangular(success);
                    allMessagesPlain = success;
//                    console.log(allMessagesPlain);
                    var resultMessages = [];
                    success.forEach(function(message) {
                        message.time =  new Date(message.creation_timestamp).toDateString() + " " + new Date(message.creation_timestamp).toLocaleTimeString().replace(/:\d{2}\s/,' ');
                        vmaUserService.getUser(message.sender_id).then(function(success) { message.user = success; message.username = success.username; });
                        message.img = "img/temp_icon.png";
//                        console.log(message);
                        resultMessages.push(message);
                    });
                    return resultMessages;
                }, function(fail) {
                    
                });
            },
        getTaskMessagesPlain:
            function(numMessages, startindex, tid) {
                return Restangular.all("messages").getList({"numberOfMessages": numMessages, "startIndex": startindex, "task_id": tid});
            },
        getTaskMessages:
            function(num, ind, tid) {
                return this.getTaskMessagesPromise(num, ind, tid).then(function(success) {
                    return success;
                });
            },
        getMessage:
            function(message_id, task_id) {
                return this.getTaskMessagesPlain(null, null, task_id).then(function(success) {
//                    success = success.stripRestangular(success);
                    var message = $filter('getById')(success, message_id);
                    console.log(message);
                    return Restangular.stripRestangular(message);
                });
            },
        addMessage:
            function(message, uid, tid) {
                var msg = {"content" : message.message, "sender_id": uid, "task_id": tid};
                return Restangular.all("messages").post(msg);
            },
        editMessage:
            function(id, message) {
                 return Restangular.all("messages").all(id).post(message);
            },
        deleteMessage:
            function(mid) {
                return Restangular.all("messages").all(mid).remove();
            },
    }
}]);