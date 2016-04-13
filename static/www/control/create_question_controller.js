/**
 * Created by nick on 4/6/16.
 */

function create_question_controller ($scope,$location,$http,$window) {
        $scope.qt = $location.search().qt;
    $scope.current_tags = [];

    $scope.addTag = function(tag){
        if ($scope.current_tags.indexOf(tag) < 0){
            $scope.current_tags.push(tag);
            console.log(tag);
        }};


    self.clear = function(tag){
        $scope.tags = $scope.tag.filter(e => e!==tag);

        //console.log(self.selectedItem);
        self.searchText = undefined;
        self.selectedItem = undefined;
    };



    $scope.CreateQuestion = function () {
        qt = document.getElementById("question_text").value;
        diff = document.getElementById("difficulty").value;

        console.log(qt);
        var par1 = {question_text: qt,difficulty : diff};

        $http.post('/question',par1).success(function(created){
                qid = created.question.id;
                $scope.current_tags.forEach(tag => $http.post('/question/' + qid + '/tags/' + tag.item.id ))
                $window.location.href = './#qm';

            });

    }


}

