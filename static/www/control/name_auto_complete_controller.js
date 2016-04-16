/**
 * Created by nick on 4/1/16.
 */

function name_auto_complete_controller ($rootScope,$scope,$http,$timeout, $q, $log,$window) {
    var self = this;
    // list of names to be displayed
    $scope.names = [];
    loadNames();

    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newName = newName;
    function newName(name) {
        alert("This functionality is yet to be implemented!");
    }
    function querySearch (query) {
        var results = query ? $scope.names.filter( createFilterFor(query) ) : $scope.names;
        return results;

    }
    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
        $rootScope.$broadcast('current_interviewee', item);


    }

    function makeNames(names){
        $scope.names = names;
    }

    //build list of names as map of key-value pairs
    function loadNames() {
        $http.get('/user').success(function (data) {
            var users = data.users;

        //var allNames = 'Nick DeSisto, Jack Meagher, Ben Byrd, Laurene Huang, Claudio Sroka, Sherrill Rockett, Lisette Mora, Carey Orosco, Alvera Sherrell, Isaias Riedel, Russ Powe, Malia Simental, Shawna Spiker, Kathyrn Driver, Chas Defeo, Aileen Volz, Lea Dalke, Myesha Defore, Verlene Lobdell, Raven Wilbur, Weldon Elsworth, Margert Pedrick, Mariette Swart, Dionna Alday, Detra Kerley, Janice Poorman, Alphonso Quesinberry, Louise Whitmire, Rochelle Gorder, Forrest Frankel, Mervin Whipps, Lurlene Burts, Stasia Sakata, Micheal Colorado, Joselyn Littles, Charmaine Brust, Crysta Chartier, Shon Gaynor, Reatha Pinto, Donnetta Mcconn, Shemeka Fredrickson, Kurtis Toomer, Minna Bravo, Marilee Vides, Theola Mungia, Deangelo Dierks, Bao Molina, Nan Hocutt, Claude Kimbrel, Anton Mery, Rod Fricke, Marline Viloria, Mitchell Hensel, Yen Ulm, Reva Huggard, Marylee Kohnke, Julissa Eubank, Gwenn Ciccone, Twyla Holub, Randee Logsdon, Trinity Sibert, Meredith Kiger, Antonetta Plumley, Noma Adam, My Court, Douglas Klenke, Kacy Mccutcheon, Camie Gulotta, Thao Christina, Sharmaine Stallings, Linsey Novy, Donny Doxey, Danette Carnell, Ignacio Thornton, Virgil Broadus, Dorthea Ricker, Everette Botello, Angella Quintanar, Irene Bump, Collin Priolo, Bettina Tousignant, Camellia Esslinger, Steffanie Newbury, Jaimee Guerriero, Melany Rey, Gigi Kjos, Easter Wallner, Carli Wason, Marg Ferrante, Vito Simien, Ira Purtell, Doloris Treece, Corrinne Dy, Vickie Simmons, Kortney Desantis, Debbie Simmon, Dannielle Holt, Karena Rugh, Doretta Slocum, Tynisha Ohm, Isaias Ballou, Machelle Donelson, Milton Foskey';
        makeNames(users.map( function (user) {
            var n = user.first_name + ' ' + user.last_name + ' (' + user.username + ')';
            return {
                value: n.toLowerCase(),
                display: n,
                item : user
            };
        }));
        });

    }
    //filter function for search query
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(name) {
            return (name.value.indexOf(lowercaseQuery) > -1)

            //return (name.value.indexOf(lowercaseQuery) === 0);
        };
    }
}

