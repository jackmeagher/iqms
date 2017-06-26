function create_position_controller($scope, $rootScope, $location, $http, taggingService, authService) {

    $scope.positionData = {
       tags:[],
       selectedTags: {},
       text: ' ',
       date: ' ',
       location:' ',
       
    }
    $scope.positions = {};
    $scope.selectedPosition = null;
    $scope.positionText = "";

    $scope.dateText = "";
    $scope.locationText = "";

    $scope.taglist = [];
    $scope.selectedTag = null;
    $scope.tagText = "";

    $scope.userRole = userService.getUserRole();

    var loadScreen = function() {
        authService.getUserToken(function(idToken) {
            flaggingService.clearQuestions();
            loadPositions(idToken);

        });
    };

    var loadPositions = function(idToken) {
        $http.get('../../position?idToken=' + idToken).success(function(data) {
            data.positions.forEach(function(position, index) {
                var fullName = position.name + getPositionID({
                    type: "Internal",
                    info: position
                });
                loadTags(idToken);
                $scope.positions[fullName] = position;
                $scope.positions[fullName].name = fullName;
            });
        });
    };

    var getPositionID = function(options) {
        switch (options.type) {
            default:
                case ("Internal"):
                var year = options.info.createdAt.substr(0, 4);
            return formatID(options.info.id, year);
        }
    };

    var loadTags = function(idToken) {
        $http.get('../../position/' + interviewID + '/tags?idToken=' + idToken).success(function(data) {
          console.log(data);
            data.tags.forEach(function(tag) {
              console.log(tag);
                $('#tagbox').tagsinput('add', tag.name);
            });
        })
    };

    $scope.addPosition = function(position) {
        if (position && !$scope.positions[position]) {
            $scope.positions[position] = {
                name: position,
                description: ""
            };
            popupService.init("Description", "Add job description for " + position, "", "");
            popupService.showPrompt(this, function() {
                $scope.positions[position].description = popupService.getResult();
                $scope.selectedPosition = position;
                savePosition(position);
            });
        }
    };

    var savePosition = function(position) {
        authService.getUserToken(function(idToken) {
            $http.post('../../position?idToken=' + idToken, $scope.positions[position]).success(function(created) {
                var fullName = position + getPositionID({
                    type: "Internal",
                    info: created.data
                });
                $scope.positions[fullName] = created.data;
                $scope.positions[fullName].name = fullName;
                $scope.selectedPosition = fullName;
                delete $scope.positions[position];
            });
        });
    };

    $scope.queryPosition = function(query) {
        var pos = $.map($scope.positions, function(value) {
            return value.name;
        });

        return $scope.queryFunction(query, pos);
    };

    $scope.queryFunction = function(query, data) {
        if (query == null) {
            query = "";
        }

        text = query.toLowerCase();
        var ret = data.filter(function(d) {
            var test = d.toLowerCase();
            return test.startsWith(text);
        });
        return ret;
    };

    $scope.positionItemChange = function(item) {
        if (item) {
            $scope.selectedPosition = item;
        }
    };

    var addTagToPosition = function(idToken, positionID, tag) {
        $http.post('../../tag/' + tag + '/position/' + positionID + "?idToken=" + idToken).success(function(created) {});
    };

    $scope.tagItemChange = function(item) {
        if (item) {
            $scope.selectedTag = item;
            $('#tagbox').tagsinput('add', $scope.selectedTag);
            $scope.selectedTag = null;
            $scope.tagText = "";
        }
    };

    var removeMainTags = function(t) {
        var mainTags = ['intro', 'skills', 'close', 'inline'];
        mainTags.forEach(function(tag) {
            if (t) {
                if (t.indexOf(tag) > -1) {
                    t.splice(t.indexOf(tag), 1);
                }
            }
        });
        return t;
    };

    var removeSelectedTags = function(t) {
        $scope.taglist.forEach(function(tag) {
            if (t.indexOf(tag) > -1) {
                t.splice(t.indexOf(tag), 1);
            }
        });
        return t;
    };

    var beforeTagAdd = function(event) {
        event.item = event.item.toLowerCase();
        event.itemValue = taggingService.countTag(event.item);
        event.itemText = event.item + " (" + event.itemValue + ")";
        $scope.taglist.push(event.item);
    };

    var beforeTagRemove = function(event) {
        if (interviewID > 0) {
            authService.getUserToken(function(idToken) {
                $http.delete('../../tag/' + event.item +
                    '/interview/' + interviewID + "?idToken=" + idToken).success(function(created) {});
            });
        }
        if ($scope.taglist.indexOf(event.item) > -1) {
            $scope.taglist.splice($scope.taglist.indexOf(event.item), 1);
        }
    };

    $scope.cancel = function() {
        $location.path('/li');
    };

    $rootScope.$on('tagNotification', function() {
        $('#tagbox').on('beforeItemAdd', beforeTagAdd);
        $('#tagbox').on('beforeItemRemove', beforeTagRemove);
        $scope.tagList = taggingService.getTags();
    });

    taggingService.resetTags();
    loadScreen();

    $('#tagbox').on('beforeItemAdd', function(event) {});

    $('#tagbox').on('beforeItemRemove', function(event) {});
}
var formatID = function(id, year) {
    var formatted = " (#" + year + "-";

    if (id < 10) {
        formatted += "000" + id;
    } else if (id < 100) {
        formatted += "00" + id;
    } else if (id < 1000) {
        formatted += "0" + id;
    } else {
        formatted += id;
    }

    formatted += ")";

    return formatted;
};

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}
