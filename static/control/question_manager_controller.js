function question_manager_controller($scope, $http, $location, taggingService, authService) {
    $scope.sortType     = 'id'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchQuestion   = '';     // set the default search/filter term

    var mainTags = ['intro', 'skills', 'close', 'inline'];

    $scope.loadQuestion = function(index) {
        $location.path('/ce')
                 .hash(index);
    };

    $scope.deleteQuestion = function (index, question) {
        authService.getUserToken(function(idToken) {
            $http.delete('../../question/' + question.id + '/tags/?idToken=' + idToken).success(function(){});
            $http.delete('../../question/' + question.id + "?idToken=" + idToken).success(function() {
                loadAllQuestions(idToken);
            });
        });
    };

    var loadAllQuestions = function(idToken) {
        $http.get('../../question?idToken=' + idToken).success(function(data){
            $scope._question = data.questions;
            $scope._question.forEach(function(q) {
                stringifyTags(q, idToken);
            });
        });
    };

    var stringifyTags = function(question, idToken) {
        question.taglist = "";
        $http.get('../../question/' + question.id + '/tags/?idToken=' + idToken).success(function(data) {
           data.tags.forEach(function(tag) {
              console.log(tag.name);
                question.taglist += tag.name + ", ";
           });
           question.taglist = question.taglist.substring(0, question.taglist.length - 2);
        });
    };

    var loadAllTags = function(idToken) {
        var tags = {};
        $http.get('../../tag?idToken=' + idToken).success(function (data) {
            data.tags.forEach(function(tag) {
                tags[tag.name] = tag;
            });
            addMissingTags(tags);
        });
    };

    var addMissingTags = function(tags) {
        mainTags.forEach(function(tag) {
           if(!tags[tag]) {
               taggingService.createNewTag(tag);
           }
        });
    };

    authService.getUserToken(function(idToken) {
        loadAllQuestions(idToken);
        loadAllTags(idToken);
    });
};
