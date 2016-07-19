/**
 * Created by nick on 3/31/16.
 */

// controller
function create_interview_controller($scope, $http, $window, taggingService) {
    $scope.current_questions  = [];     // set the default search/filter term

    $scope.tags = ['Technical', 'Test', 'First', 'Last'];
    $scope.addTag = false;
    
    $scope.$on('current_position', function (event, data) {
        $scope.cur_pos = data.display;
    });
    $scope.$on('current_interviewee', function (event, data) {
        $scope.cur_int = data.item.first_name + " " + data.item.last_name;
    });

    $scope.addQuestion = function(question){
        if ($scope.current_questions.indexOf(question) < 0){
        $scope.current_questions.push(question.item);
    }};

    $scope.CreateInterview = function () {


        var par1 = {interviewee: $scope.cur_int, label: $scope.cur_pos};

        $http.post('/interview', par1).success(function (posted) {
            addQuestions(posted.interview.id);
            $window.location.href = './#li';

        })
    };

    var addQuestions = function(id){
        $scope.current_questions.forEach(q => $http.post('/interview/' + id + '/questions/' + q.id));
        $scope.current_questions.forEach(q => $http.post('/answer/',{interviewId : id, questionId: q.id}));
    };

    
    $scope.getTagCount = function(tag) {
        return taggingService.countTag(tag);
    }
    
    $("#myTags").tagit({
        beforeTagAdded: function(event, ui) {
            /*// do something special
            console.log(ui.tagLabel);
            //$scope.tags.push(ui.tagLabel);
            ui.tagLabel = $scope.getTagCount(ui.tagLabel) + " " + ui.tagLabel;
            if ($scope.addTag) {
                $("#myTags").tagit("createTag", ui.tagLabel);
                $scope.addTag = false;
                return true;
            }
            $scope.addTag = true;
            return false;*/
        }
    });
    taggingService.resetTags();
}

