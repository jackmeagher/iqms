/**
* created by James 4/14/16
*/

function repeat_interview_controller($scope) {
  $http.get('/interview').success(function (data) {
      $scope._interviews = data.interviews;
      $scope._interviews.forEach(q => $http.get('/interview/' + q.id + '/questions').success(function(data){
          the_questions = data.questions;
          q.questions = '';
          console.log(the_questions.length);
          if (the_questions.length > 1){
              for(var i = 0;i < the_questions.length-1;i++){
                  q.questions += the_questions[0].question_text;
                  q.questions += ','
              }
              q.questions += the_questions[i].question_text;

          }else if(the_questions.length == 1){
              q.questions = the_questions[0].questions_text;
          }

      }));
  });
}
