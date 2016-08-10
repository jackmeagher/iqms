function interpret_interview_controller($scope, $http, $routeParams, authService) {
    
    var interviewId = $routeParams.id;
    var savedFeedbacks;
    var savedQuestions = {};

    $scope.savedTags = {};
    $scope.selectedTag = "";
    $scope.selectedTagNotes = [];
    
    $scope.interview;
    $scope.recs = [];
    
    $scope.overallResultsChart = {};
    $scope.overallResultsChart.type = "PieChart";
    $scope.overallResultsChart.data = [
        ['Score', 'amount'],
        ['Good', 39],
        ['Poor', 5],
        ['Skipped', 3]
    ];
    $scope.overallResultsChart.options = {
        displayExactValues: true,
        height: 600,
        is3D: true,
        chartArea: {left:10,top:10,bottom:0,height:"100%"},
        colors: ['#5cb85c', '#d9534f', '#f5f5f5']
    };
    
    $scope.diffResultsChart = {};
    $scope.diffResultsChart.type = "BarChart";
    $scope.diffResultsChart.data = {"cols": [
        {id: "t", label: "Difficulty", type: "string"},
        {id: "r", label: "Good", type: "number"},
        {id: "w", label: "Poor", type: "number"},
        {id: "s", label: "Skipped", type: "number"}
    ], "rows": [
        {c: [
            {v: "Junior"},
            {v: 0},
            {v: 0},
            {v: 0}
        ]},
        {c: [
            {v: "Mid"},
            {v: 0},
            {v: 0},
            {v: 0}
        ]},
        {c: [
            {v: "Senior"},
            {v: 0},
            {v: 0},
            {v: 0}
        ]}
    ]};
    $scope.diffResultsChart.options = {
        isStacked: 'percent',
        height: 600,
        legend: {position: 'top', maxLines: 3},
        hAxis: {
          minValue: 0,
          ticks: [0, .3, .6, .9, 1]
        },
        colors: ['#5cb85c', '#d9534f', '#f5f5f5']
    };

    $scope.tagResultChart = {};
    $scope.tagResultChart.type = "BarChart";
    $scope.tagResultChart.data = {"cols": [
        {id: "t", label: "Difficulty", type: "string"},
        {id: "r", label: "Good", type: "number"},
        {id: "w", label: "Poor", type: "number"},
        {id: "s", label: "Skipped", type: "number"}
    ], "rows": [
        {c: [
            {v: "Junior"},
            {v: 0},
            {v: 0},
            {v: 0}
        ]},
        {c: [
            {v: "Mid"},
            {v: 0},
            {v: 0},
            {v: 0}
        ]},
        {c: [
            {v: "Senior"},
            {v: 0},
            {v: 0},
            {v: 0}
        ]}
    ]};
    $scope.tagResultChart.options = {
        isStacked: 'percent',
        height: 600,
        legend: {position: 'top', maxLines: 3},
        hAxis: {
            minValue: 0,
            ticks: [0, .3, .6, .9, 1]
        },
        colors: ['#5cb85c', '#d9534f', '#f5f5f5']
    };
    
    var updateOverallResults = function() {
        var good = 0;
        var poor = 0;
        var skipped = 0;
        
        savedFeedbacks.forEach(function(f, index) {
            for (var k in f.data) {
                if (f.data.hasOwnProperty(k)) {
                    if (f.data[k].rating == -1) {
                        skipped++;
                    } else if (f.data[k].rating <= 2) {
                        poor++;
                    } else {
                        good++;
                    }

                    if(f.data[k].note) {
                        console.log(k + ": " + f.data[k].note);
                    }
                }
            }
        });
        $scope.overallResultsChart.data = [
            ['Score', 'amount'],
            ['Good', good],
            ['Poor', poor],
            ['Skipped', skipped]
        ];
    }

    $scope.updateTagResult = function() {
        $scope.selectedTagNotes = {};
        $scope.tagResultChart.data.rows.forEach(function(row, index) {
            row.c[1].v = 0;
            row.c[2].v = 0;
            row.c[3].v = 0;
        });

        savedFeedbacks.forEach(function(f, index) {
            if(savedQuestions[f.question_id]) {
                if (savedQuestions[f.question_id].tags[$scope.selectedTag]) {
                    var diff = savedQuestions[f.question_id].difficulty;
                    if (diff <= 3) {
                        diff = 0;
                    } else if (diff <= 6) {
                        diff = 1;
                    } else {
                        diff = 2;
                    }
                    for (var k in f.data) {
                        if (f.data.hasOwnProperty(k)) {
                            if (f.data[k].rating == -1) {
                                $scope.tagResultChart.data.rows[diff].c[3].v++;
                            } else if (f.data[k].rating == -2) {

                            } else if (f.data[k].rating <= 2) {
                                $scope.tagResultChart.data.rows[diff].c[2].v++;
                            } else {
                                $scope.tagResultChart.data.rows[diff].c[1].v++;
                            }

                            if(f.data[k].note) {
                                if(!$scope.selectedTagNotes[savedQuestions[f.question_id].text]) {
                                    $scope.selectedTagNotes[savedQuestions[f.question_id].text] = "";
                                }
                                $scope.selectedTagNotes[savedQuestions[f.question_id].text] += k + ": " + f.data[k].note + "\n";
                            }
                        }
                    }
                }
            }
        });
    }
    
    var updateDiffResults = function() {
        savedFeedbacks.forEach(function(f, index) {
            if(savedQuestions[f.question_id]) {
                var diff = savedQuestions[f.question_id].difficulty;
                if (diff <= 3) {
                    diff = 0;
                } else if (diff <= 6) {
                    diff = 1;
                } else {
                    diff = 2;
                }
                for (var k in f.data) {
                    if (f.data.hasOwnProperty(k)) {
                        if (f.data[k].rating == -1) {
                            $scope.diffResultsChart.data.rows[diff].c[3].v++;
                        } else if (f.data[k].rating == -2) {

                        } else if (f.data[k].rating <= 2) {
                            $scope.diffResultsChart.data.rows[diff].c[2].v++;
                        } else {
                            $scope.diffResultsChart.data.rows[diff].c[1].v++;
                        }
                    }
                }
            }
        });
    }
    
    var queryInterview = function() {
        $http.get('/interview/' + interviewId).then(function(interview) {
           console.log(interview);
           $scope.interview = interview.data.interview;
           updateInterview();
        });
    }
    
    var updateInterview = function() {
        var rec = $scope.interview.recommendation;
        for(var k in rec) {
            var obj = {};
            if (rec.hasOwnProperty(k)) {
                obj.name = k;
                if (rec[k].recommendation == -1) {
                    obj.recommendation = "No";
                } else if (rec[k].recommendation == 0) {
                    obj.recommendation = "Maybe";
                } else {
                    obj.recommendation = "Yes";
                }
                $scope.recs.push(obj);
            }
        }
        $scope.interview.recommendation = rec;
    }
    
    var queryDatabaseForFeedback = function() {
        $http.get('/interview/' + interviewId + '/feedback/').then(function(feedbacks) {
            savedFeedbacks = feedbacks.data.feedbacks;
            updateOverallResults();
            queryDatabaseForQuestions();
        });
    }
    
    var queryDatabaseForQuestions = function() {
        authService.getUserToken(function(idToken) {
            var questionPromises = [];
            var tagPromises = [];
            savedFeedbacks.forEach(function(f, index) {
                var questionPromise = $http.get('/question/' + f.question_id + "?idToken=" + idToken).then(function(question) {
                    savedQuestions[f.question_id] = question.data.question;
                    if(savedQuestions[f.question_id]) {
                        savedQuestions[f.question_id].tags = {};
                        var tagPromise = $http.get('/question/' + f.question_id + '/tags/?idToken=' + idToken).then(function(tags) {
                            tags.data.tags.forEach(function(tag, index) {
                                if (tag.name != "Intro" && tag.name != "Skills" && tag.name != "Close") {
                                    savedQuestions[f.question_id].tags[tag.name] = true;
                                    $scope.savedTags[tag.name] = tag.name;
                                }
                            });
                        });
                        tagPromises.push(tagPromise);
                    }
                });
                questionPromises.push(questionPromise);

            });
            Promise.all(questionPromises).then(function(result) {
                updateDiffResults();
                Promise.all(tagPromises).then(function(result) {
                    console.log("Tag promises completed: ");
                    $scope.updateTagResult();
                    $scope.$apply();
                });
            });
        });
    }
    
    queryInterview();
    queryDatabaseForFeedback();
    
}