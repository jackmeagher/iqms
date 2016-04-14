/**
 * Created by nick on 4/1/16.
 */


function question_auto_complete_controller ($scope,$http,$timeout, $q, $log,$window) {
    var self = this;
    // list of questions to be displayed
    $scope.questions = [];
    loadQuestions();


    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newQuestion = newQuestion;


    self.clear = function(question){
        $scope.questions = $scope.questions.filter(e => e!==question );

        //console.log(self.selectedItem);
        self.searchText = undefined;
        self.selectedItem = undefined;
    };
    self.addback = function(question){
        $scope.questions.push(question);
        console.log('didididididt');

    };

    function newQuestion(question) {
        $window.location.href = '#';

    }
    function querySearch (query) {
        var results = query ? $scope.questions.filter( createFilterFor(query) ) : $scope.questions;//, deferred;
        return results;
        }

    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }
    //build list of questions as map of key-value pairs
    function makeQuestions(questions){
        $scope.questions = questions;
    }

    //build list of names as map of key-value pairs
    function loadQuestions() {
        $http.get('/question').success(function (data) {
            var question = data.questions;
            question.forEach(q => $http.get('/question/' + q.id + '/tags').success(function(tags){
                the_tags = tags.tags;
                q.tags = '';
                console.log(the_tags.length);
                if (the_tags.length > 1){
                    for(var i = 0;i < the_tags.length-1;i++){
                        q.tags += the_tags[0].label;
                        q.tags += ', '
                    }
                    q.tags += the_tags[i].label;

                }else if(the_tags.length == 1){
                    q.tags = the_tags[0].label;
                }

            }));
            makeQuestions( question.map( function (q) {
                return {
                    value: q.question_text.toLowerCase(),
                    display: q.question_text,
                    item : q
                };
            }));
        });

    }
    //filter function for search query
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(question) {
            return (question.value.indexOf(lowercaseQuery) > -1)
            //return (question.value.indexOf(lowercaseQuery) === 0);
        };
    }
}