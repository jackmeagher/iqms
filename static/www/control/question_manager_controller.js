/**
 * Created by nick on 4/5/16.
 */

function question_manager_controller($scope, $http, taggingService, authService) {
    $scope.sortType     = 'id'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchQuestion   = '';     // set the default search/filter term

    authService.getUserToken(function(idToken) {
        $http.get('/question?idToken=' + idToken).success(function (data) {
            $scope._question = data.questions;
            $scope._question.forEach(function(q, index) {
                $scope.stringifyTags(q, idToken);
            });
            var tags = {};

            $http.get('/tag').success(function (data) {
                data.tags.forEach(function(tag, index) {
                    tags[tag.name] = tag;
                });

                if (!tags['Skills']) {
                    taggingService.createNewTag('Skills');
                }

                if(!tags['Intro']) {
                    taggingService.createNewTag('Intro');
                }

                if(!tags['Close']) {
                    taggingService.createNewTag('Close');
                }

                if(!tags['Inline']) {
                    taggingService.createNewTag('Inline');
                }
            });
        });
    });

    $scope.loadQuestion = function(index) {
        window.location.href = "#ce#" + index;
    }

    $scope.DeleteQuestion = function (index, question) {
        authService.getUserToken(function(idToken) {
            $http.delete('/question/' + question.id + '/tags/?idToken=' + idToken).success(function() {
            });
            $http.delete('/question/' + question.id + "?idToken=" + idToken).success(function() {
                $http.get('/question?idToken=' + idToken).success(function(data){
                    $scope._question = data.questions;
                    $scope._question.forEach(function(q, index) {
                        $scope.stringifyTags(q, idToken);
                    });
                })
            });
        });
    };

    
    $scope.stringifyTags = function(question, idToken) {
        question.taglist = "";
        $http.get('/question/' + question.id + '/tags/?idToken=' + idToken).success(function(data) {
           data.tags.forEach(function(tag, index) {
                question.taglist += tag.name + ", ";
           });
           question.taglist = question.taglist.substring(0, question.taglist.length - 2);
        });
    }
};

