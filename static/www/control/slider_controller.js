function slider_controller($scope, $log) {
    $scope.options = {
        min: 0,
        max: 10,
        step: 1,
        precision: 1,
        orientation: 'horizontal',  // vertical
        handle: 'round', //'square', 'triangle' or 'custom'
        tooltip: 'always', //'hide','always'
        tooltipseparator: ':',
        tooltipsplit: true,
        enabled: true,
        naturalarrowkeys: false,
        range: true,
        ngDisabled: false,
        reversed: false
    };

    $scope.value = $scope.options.min;

    $scope.updateLimits = function() {
        if ($scope.value > 10) {
            $scope.value = 10;
        } else if ($scope.value < 0) {
            $scope.value = 0;
        }
    }
}