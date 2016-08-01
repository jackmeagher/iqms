function interpret_interview_controller($scope, $http) {
    $scope.results = ['Overall', 30, 5, 2, ''];
    $scope.resultsByTag = {
        'Java': ['Java', 28, 3, 1, '']
    };
    
    $scope.resultsChart = {};
    
    $scope.resultsChart.type = "ColumnChart";
    
    $scope.onions = [
        {v: "Onions"},
        {v: 3},
    ];

    $scope.resultsChart.data = {"cols": [
        {id: "t", label: "Topping", type: "string"},
        {id: "s", label: "Slices", type: "number"}
    ], "rows": [
        {c: [
            {v: "Mushrooms"},
            {v: 3},
        ]},
        {c: $scope.onions},
        {c: [
            {v: "Olives"},
            {v: 31}
        ]},
        {c: [
            {v: "Zucchini"},
            {v: 1},
        ]},
        {c: [
            {v: "Pepperoni"},
            {v: 2},
        ]}
    ]};

    $scope.resultsChart.options = {
        'title': 'How Much Pizza I Ate Last Night'
    };
}