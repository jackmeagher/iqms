/**
 * Created by nick on 4/6/16.
 */

function create_question_controller ($scope,$location,$http,$window) {
        $scope.qt = $location.search().qt;

    $scope.CreateQuestion = function () {
        qt = document.getElementById("question_text").value;
        diff = document.getElementById("difficulty").value;

        console.log(qt);
        var par1 = {question_text: qt,difficulty : diff};

        $http.post('/question',par1);
        $window.location.href = './#qm';

    }


}

