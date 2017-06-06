function slider_controller($scope, $log) {
    $scope.options = {
        min: 0,
        max: 10,
        step: 1,
        precision: 1,
        orientation: 'horizontal',  // vertical
        handle: 'square', //'square', 'triangle' or 'custom'
        tooltip: 'always', //'hide','always'
        tooltipseparator: ':',
        tooltipsplit: true,
        enabled: true,
        naturalarrowkeys: false,
        range: true,
        ngDisabled: false,
        reversed: false,
        onSlide: $scope.updateLimits
    };

    $scope.value = $scope.options.min;

    $scope.updateLimits = function() {
        $scope.value = $("#modelValue").val();
        if ($scope.value > 10) {
            $scope.value = 10;
        } else if ($scope.value < 0) {
            $scope.value = 0;
        }
        $("#modelValue").attr('title', $scope.value).tooltip('fixTitle').tooltip('show');

    }
    
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
}