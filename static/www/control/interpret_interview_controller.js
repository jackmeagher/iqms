function interpret_interview_controller($scope, $http) {
    
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
            {v: 25},
            {v: 1},
            {v: 1}
        ]},
        {c: [
            {v: "Mid"},
            {v: 8},
            {v: 2},
            {v: 0}
        ]},
        {c: [
            {v: "Senior"},
            {v: 4},
            {v: 9},
            {v: 2}
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
}