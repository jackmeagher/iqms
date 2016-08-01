function interpret_interview_controller($scope, $http, $routeParams) {
    
    var interviewId = $routeParams.id;
    var savedFeedbacks;
    var savedQuestions = {};
    
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
        width: 800,
        height: 600,
        is3D: true,
        chartArea: {left:10,top:10,bottom:0,height:"100%"},
        colors: ['#5cb85c', '#d9534f', '#f5f5f5']
    };
    
    $scope.tagResultsChart = {};
    $scope.tagResultsChart.type = "BarChart";
    $scope.tagResultsChart.data = {"cols": [
        {id: "t", label: "Tag", type: "string"},
        {id: "r", label: "Good", type: "number"},
        {id: "w", label: "Poor", type: "number"},
        {id: "s", label: "Skipped", type: "number"}
    ], "rows": [
        {c: [
            {v: "Java"},
            {v: 15},
            {v: 4},
            {v: 1}
        ]},
        {c: [
            {v: "OOP"},
            {v: 8},
            {v: 2},
            {v: 0}
        ]},
        {c: [
            {v: "Javascript"},
            {v: 24},
            {v: 1},
            {v: 2}
        ]}
    ]};
    $scope.tagResultsChart.options = {
        isStacked: 'percent',
        height: 600,
        legend: {position: 'top', maxLines: 3},
        hAxis: {
          minValue: 0,
          ticks: [0, .3, .6, .9, 1]
        },
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
    
    var updateTagResults = function() {
        
        
    }
    
    var updateDiffResults = function() {
        console.log(savedQuestions);
        savedFeedbacks.forEach(function(f, index) {
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
                    } else if (f.data[k].rating <= 2) {
                        $scope.diffResultsChart.data.rows[diff].c[2].v++;
                    } else {
                        $scope.diffResultsChart.data.rows[diff].c[1].v++;
                    }
                }
            }
        });
    }
    
    var queryDatabaseForFeedback = function() {
        $http.get('/interview/' + interviewId + '/feedback/').then(function(feedbacks) {
            savedFeedbacks = feedbacks.data.feedbacks;
            console.log(savedFeedbacks);
            updateOverallResults();
            queryDatabaseForQuestions();
        });
    }
    
    var queryDatabaseForQuestions = function() {
        var questionPromises = [];
        savedFeedbacks.forEach(function(f, index) {
            var questionPromise = $http.get('/question/' + f.question_id).then(function(question) {
                savedQuestions[f.question_id] = question.data.question;
            });
            questionPromises.push(questionPromise);
        });
        Promise.all(questionPromises).then(function(result) {
            updateDiffResults();
        });
    }
    
    queryDatabaseForFeedback();
}