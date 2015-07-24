// NOTE: Change tobedefind to something else
describe("Filter Test -> filters.js -> ", function () {
        
    // list of task objects to test with
    var tasks = 
    [
	{
        name: "Monday",
        id: 4,
        joined: true,
        group_id: 23
	},
	{
        name: "Hello",
        id: 9,
        joined: false,
        group_id: 4
	},
	{
		name: "Dates",
        id: 7,
        joined: true,
        group_id: 23
	},
	{
		name: "Wednesday",
        id: 23,
        joined: false,
        group_id: 12
    },
        
	{
		name: "Hello",
        id: 7,
        joined: true,
        group_id: 43
    }
];

    var filterInstance;

    beforeEach(angular.mock.module("vmaFilterModule"));

// getsById
    beforeEach(angular.mock.inject(function ($filter) {
        getsById = $filter("getById");
    }));

    it("gets first post by id when given a correct id", function () {
   expect(getsById(tasks, 7)).toBe(tasks[2]);
    });
    
    
    it("returns null when post id is not found", function () {
   expect(getsById(tasks, 99)).toBe(null);
    });
 
// getByName
    beforeEach(angular.mock.inject(function ($filter) {
        getByName = $filter("getByName");
    }));

      it("gets first post by name when given correct name", function () {
   expect(getByName(tasks, "Hello")).toBe(tasks[1]);
    });
  
      it("returns null when wrong post name is entered", function () {
   expect(getByName(tasks, "James")).toBe(null);
    
      });
  
// getTasksByGroupId
    beforeEach(angular.mock.inject(function ($filter) {
        getTasksByGroupId = $filter("getTasksByGroupId");
    }));

    // var created to test after group_id = 23 is passed.
    var afterTasksAreGroupedUp = 
    [
	{
        name: "Monday",
        id: 4,
        joined: true,
        group_id: 23
	},{
		name: "Dates",
        id: 7,
        joined: true,
        group_id: 23
	}
];
    var empty= [];

     it("returns null when groupId doesn't exist", function () {
 expect(getTasksByGroupId(tasks, 239)).toEqual(empty);
    });
  
     it("returns all tasks related to the group id given", function () {
 expect(getTasksByGroupId(tasks, 23)).toEqual(afterTasksAreGroupedUp);
    });
    
    ///////////////////////////////// START FIXING HERE /////////////////////////////////////////////////////    
    
    
     it("returns all tasks related to group id given even though only one such post exists", function () {
 expect(getTasksByGroupId(tasks, 43)).toEqual(tasks[4]);
    });
    
// getByGroupId
    beforeEach(angular.mock.inject(function ($filter) {
        getByGroupId = $filter("getByGroupId");
    }));

    it("gets multiple posts when given correct group_id", function () {
   expect(getByGroupId(tasks, 23)).toBeDefined(afterTasksAreGrouped);
    });
    
    ///////////////////////////////////////////
    // angular.equals(
     it("returns one post with given group_id because it meets specification", function () {
 //expect(getTasksByGroupId(tasks, 4)).equals(tasks[23]);
//expect(getTasksByGroupId(tasks, 4)).toBeSimilarTo(tasks[2]);
    });
    
    

  
     it("returns null when group id is not found", function () {
 expect(getTasksByGroupId(tasks, 13)).toBeDefined(empty);
    });
    
// removeJoined
    beforeEach(angular.mock.inject(function ($filter) {
        removeJoined = $filter("removeJoined");
    }));

 // var created to test after joined = true is passed.
     var afterTasksAreGrouped = 
    [
	{
        name: "Monday",
        id: 4,
        joined: true,
        group_id: 23
	},
	{
		name: "Dates",
        id: 7,
        joined: true,
        group_id: 23
	},
	{
		name: "fds",
        id: 7,
        joined: false,
        group_id: 43
    }
];
    it("returns all groups where joined = true ", function () {
     // removeJoined(tasks, X) ----- can be any 'X' because it is not being used in the actual function
  expect(removeJoined(tasks, 23)).toBeDefined(tasks);
        console.log("external "+removeJoined(tasks, 23));
        console.log("internal " + afterTasksAreGrouped);
 //  expect(angular.equals(removeJoined(tasks, 23), afterTasksAreGrouped)).toBe(true);
        
         });
  
});






/*
beforeEach(angular.mock.inject(function ($filter) {
        getByGroupId = $filter("geupId");
    }));

    it("get post by id when given a correct id", function () {
   expect(getByGroupId(tasks, 7)).toBe(tasks[2]);
    });
    
*/











//
//		$$hashKey: "01L",
//        content: "SUNDAY",
//        creation_timestamp: 1434116497000,
//        group: Object,
//        group_id: 22,
//        id: 7,
//        latest_activity_timestamp: 1434136924000,
//        like_count: 0,
//        time: "Fri Jun 12 2015 8:41 AM",
//        user_id: 26	