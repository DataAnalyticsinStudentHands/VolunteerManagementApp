Volunteer Management Application
==========

The code is based on the Ionic Framework.

###Getting started:

1. Run `ionic serve`. This uses `ionic.xml` and will serve as local node server. Live updates when you make changes to the code. This works with Phonegap Developer App.

2. `phonegap serve`
Works both in browser and with the Phone Gap developer app. Also updates when you make changes.

###Development Prerequisites:

bower `npm install -g bower`

gulp `npm install -g gulp`

npm packages `npm install`

###Starting Development:

1. Run `bower install`. Reads bower.json and installs local dependencies into the folder `www/bower_components`. ng-notify js has been modified and is in `dist/ngnotify`
2. Copy only necessary files to `www/dist` using the folder structure present in `www/bower_components`

##Unit Testing:

1. Testing is done with Jasmine and Karma running in node.js
2. To install nodejs: https://nodejs.org/download/
3. Open the nodejs console.
2. To install Karma: `npm install -g karma`
3. To install Jasmine: `npm install -g jasmine`
4. If the testing environment is already set up, navigate to root directory and run `karma start karma.config.js`. The unit tests are located in the 'tests' folder and named *.test.js.  
5. If the testing environment hasn't been created yet: 
   Create a new karma config file: `karma init my.config.js`
   Please ensure that the following content matches the questions the config file asks for.
    ```
    Which testing framework do you want to use ?
    Press tab to list possible options. Enter to move to the next question.
    > jasmine
    
    Do you want to use Require.js ?
    This will add Require.js plugin.
    Press tab to list possible options. Enter to move to the next question.
    > no
    
    Do you want to capture a browser automatically ?
    Press tab to list possible options. Enter empty string to move to the next question.
    > Chrome
    > 
    
    What is the location of your source and test files ?
    You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
    Enter empty string to move to the next question.
    > tests/required-files/angular.js
    > tests/required-files/angular-mocks.js
    > **/*.test.js
    > **/www/js/*.js 
    >
    
    Should any of the files included by the previous patterns be excluded ?
    You can use glob patterns, eg. "**/*.swp".
    Enter empty string to move to the next question.
    >
    
    Do you want Karma to watch all the files and run the tests on change ?
    Press tab to list possible options.
    > yes
```

####Reading material:
   1. Pro AngularJS. - Freeman, Adam. - ISBN: 978-1-4302-6448-4
   2. http://toddmotto.com/ultimate-guide-to-learning-angular-js-in-one-day/
   3. https://docs.angularjs.org/tutorial/step_02 (Read the sections entitled 'Tests')
   4. http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-karma.html
   
####Tips:
   1. Ensure that once the karma browser of choice is launched that you do not minimize said browser. This will substantially slow down testing time. 
   2. For headless browser testing try PhantomJS. 
