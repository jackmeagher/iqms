function interpret_interview_controller($scope, $http, $routeParams, authService) {
    
    var interviewId = $routeParams.id;
    var savedFeedbacks;
    var savedQuestions = {};

    $scope.savedTags = {};
    $scope.selectedTag = "";
    $scope.selectedTagNotes = [];

    $scope.recs = [];

    var configureCharts = function() {
        configureMainChart();
        configureDifficultyChart();
        configureTagChart();
    };

    var configureMainChart = function() {
        $scope.overallResultsChart = {
            type: "PieChart",
            data: [
                ['Score', 'amount'],
                ['Good', 39],
                ['Poor', 5],
                ['Skipped', 3]
            ],
            options: {
                displayExactValues: true,
                height: 600,
                is3D: true,
                chartArea: {left:10,top:10,bottom:0,height:"100%"},
                colors: ['#5cb85c', '#d9534f', '#f5f5f5']
            }
        };
    };

    var configureDifficultyChart = function() {
        $scope.diffResultsChart = {
            type: "BarChart",
            data: {
                "cols": [
                    {id: "t", label: "Difficulty", type: "string"},
                    {id: "r", label: "Good", type: "number"},
                    {id: "w", label: "Poor", type: "number"},
                    {id: "s", label: "Skipped", type: "number"}
                ],
                "rows": [
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
                ]
            },
            options: {
                isStacked: 'percent',
                height: 600,
                legend: {position: 'top', maxLines: 3},
                hAxis: {
                    minValue: 0,
                    ticks: [0, .3, .6, .9, 1]
                },
                colors: ['#5cb85c', '#d9534f', '#f5f5f5']
            }
        };
    };

    var configureTagChart = function() {
        $scope.tagResultChart = {
            type: "BarChart",
            data: {
                "cols": [
                    {id: "t", label: "Difficulty", type: "string"},
                    {id: "r", label: "Good", type: "number"},
                    {id: "w", label: "Poor", type: "number"},
                    {id: "s", label: "Skipped", type: "number"}
                ],
                "rows": [
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
                ]
            },
            options: {
                isStacked: 'percent',
                height: 600,
                legend: {position: 'top', maxLines: 3},
                hAxis: {
                    minValue: 0,
                    ticks: [0, .3, .6, .9, 1]
                },
                colors: ['#5cb85c', '#d9534f', '#f5f5f5']
            }
        };
    };

    var queryInterview = function() {
        authService.getUserToken(function(idToken) {
            $http.get('../../interview/' + interviewId + "?idToken=" + idToken).then(function(interview) {
                updateInterview(interview.data.interview);
            });
        });
    };

    var updateInterview = function(interview) {
        for(var k in interview.recommendation) {
            if (interview.recommendation.hasOwnProperty(k)) {
                $scope.recs.push({name: k, recommendation: mapRecommendation(interview.recommendation[k].recommendation)});
            }
        }
    };

    var mapRecommendation = function(value) {
        if(value == -1)
            return "No";
        else if(value == 0)
            return "Maybe";
        else if(value == 1)
            return "Yes";
        return "No Response Given";
    };

    var queryDatabaseForFeedback = function() {
        authService.getUserToken(function(idToken) {
            $http.get('../../interview/' + interviewId + '/feedback/?idToken=' + idToken).then(function(feedbacks) {
                savedFeedbacks = feedbacks.data.feedbacks;
                updateOverallResults();
                queryDatabaseForQuestions(idToken);
            });
        });
    };

    var updateOverallResults = function() {
        var performance = {
            good: 0,
            poor: 0,
            skipped: 0
        };
        savedFeedbacks.forEach(function(f) {
            for (var k in f.data) {
                if (f.data.hasOwnProperty(k)) {
                    performance = checkPerformance(performance, f.data[k].rating);
                }
            }
        });
        $scope.overallResultsChart.data = [
            ['Score', 'amount'],
            ['Good', performance.good],
            ['Poor', performance.poor],
            ['Skipped', performance.skipped]
        ];
    };

    var checkPerformance = function(performance, rating) {
        if(rating == -2) {

        } else if(rating == -1) {
            performance.skipped++;
        } else if(rating <= 2) {
            performance.poor++;
        } else {
            performance.good++;
        }
        return performance;
    };

    var queryDatabaseForQuestions = function(idToken) {
        var questionPromises = [];
        var tagPromises = [];
        savedFeedbacks.forEach(function(f) {
            var questionPromise = $http.get('../../question/' + f.question_id + "?idToken=" + idToken).then(function(question) {
                savedQuestions[f.question_id] = question.data.question;
                if(savedQuestions[f.question_id]) {
                    tagPromises.push(queryDatabaseForTags(idToken, savedQuestions[f.question_id], f.question_id));
                }
            });
            questionPromises.push(questionPromise);
        });
        resolvePromises(questionPromises, tagPromises);
    };

    var queryDatabaseForTags = function(idToken, question, id) {
        question.tags = {};
        var tagPromise = $http.get('../../question/' + id + '/tags/?idToken=' + idToken).then(function(tags) {
            tags.data.tags.forEach(function(tag) {
                if (tag.name != "skills") {
                    question.tags[tag.name] = true;
                    $scope.savedTags[tag.name] = tag.name;
                    if($scope.selectedTag == "") {
                        $scope.selectedTag = tag.name;
                    }
                }
            });
        });
       return tagPromise;
    };

    var resolvePromises = function(questionPromises, tagPromises) {
        Promise.all(questionPromises).then(function() {
            updateDiffResults();
            Promise.all(tagPromises).then(function() {
                $scope.updateTagResult();
                $scope.$apply();
            });
        });
    };

    var updateDiffResults = function() {
        savedFeedbacks.forEach(function(f) {
            if(savedQuestions[f.question_id]) {
                var diff = mapDifficulty(savedQuestions[f.question_id].difficulty);
                for (var k in f.data) {
                    if (f.data.hasOwnProperty(k)) {
                        checkPerformanceBasedOnDifficulty($scope.diffResultsChart.data, diff, f.data[k].rating);
                    }
                }
            }
        });
    };

    var mapDifficulty = function(difficulty) {
        if(difficulty <= 3) {
            return 0;
        } else if(difficulty <= 6) {
            return 1;
        }
        return 2;
    };

    var checkPerformanceBasedOnDifficulty = function(chartData, difficulty, rating) {
        if (rating == -2) {

        } else if (rating == -1) {
            chartData.rows[difficulty].c[3].v++;
        } else if (rating <= 2) {
           chartData.rows[difficulty].c[2].v++;
        } else {
           chartData.rows[difficulty].c[1].v++;
        }
    };

    $scope.updateTagResult = function() {
        resetTagResult();
        updateTag();
    };

    var resetTagResult = function() {
        $scope.selectedTagNotes = {};
        $scope.tagResultChart.data.rows.forEach(function(row) {
            row.c[1].v = 0;
            row.c[2].v = 0;
            row.c[3].v = 0;
        });
    };

    var updateTag = function() {
        savedFeedbacks.forEach(function(f) {
            if(savedQuestions[f.question_id]) {
                if (savedQuestions[f.question_id].tags[$scope.selectedTag]) {
                    var diff = mapDifficulty(savedQuestions[f.question_id].difficulty);
                    for (var k in f.data) {
                        if (f.data.hasOwnProperty(k)) {
                            checkPerformanceBasedOnDifficulty($scope.tagResultChart.data, diff, f.data[k].rating);
                            if(f.data[k].note) {
                                collectTagNote(savedQuestions[f.question_id].text, k, f.data[k].note);
                            }
                        }
                    }
                }
            }
        });
    };

    var collectTagNote = function(questionText, user, note) {
        if(!$scope.selectedTagNotes[questionText]) {
            $scope.selectedTagNotes[questionText] = "";
        }
        $scope.selectedTagNotes[questionText] += user + ": " + note + "<br>";
     };

    configureCharts();
    queryInterview();
    queryDatabaseForFeedback();
    
}