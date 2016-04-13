/**
 * Created by nick on 4/10/16.
 */
/**
 * Created by nick on 4/1/16.
 */

function tag_auto_complete_controller ($scope,$http,$timeout, $q, $log,$window) {
    var self = this;
    // list of names to be displayed
    $scope.tags = [];
    loadTags();


    self.clear = function(tag){
        $scope.tags = $scope.tags.filter(e => e!==tag);

        //console.log(self.selectedItem);
        self.searchText = undefined;
        self.selectedItem = undefined;
    };

    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newTag = newTag;
    function newTag(tag) {
        alert("This functionality is yet to be implemented!");
    }
    function querySearch (query) {
        var results = query ? $scope.tags.filter( createFilterFor(query) ) : $scope.tags;
        return results;

    }
    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }

    function makeTags(tags){
        $scope.tags = tags;
    }

    //build list of names as map of key-value pairs
    function loadTags() {
        $http.get('/tag').success(function (data) {
            var tags = data.tags;

            //var allNames = 'Nick DeSisto, Jack Meagher, Ben Byrd, Laurene Huang, Claudio Sroka, Sherrill Rockett, Lisette Mora, Carey Orosco, Alvera Sherrell, Isaias Riedel, Russ Powe, Malia Simental, Shawna Spiker, Kathyrn Driver, Chas Defeo, Aileen Volz, Lea Dalke, Myesha Defore, Verlene Lobdell, Raven Wilbur, Weldon Elsworth, Margert Pedrick, Mariette Swart, Dionna Alday, Detra Kerley, Janice Poorman, Alphonso Quesinberry, Louise Whitmire, Rochelle Gorder, Forrest Frankel, Mervin Whipps, Lurlene Burts, Stasia Sakata, Micheal Colorado, Joselyn Littles, Charmaine Brust, Crysta Chartier, Shon Gaynor, Reatha Pinto, Donnetta Mcconn, Shemeka Fredrickson, Kurtis Toomer, Minna Bravo, Marilee Vides, Theola Mungia, Deangelo Dierks, Bao Molina, Nan Hocutt, Claude Kimbrel, Anton Mery, Rod Fricke, Marline Viloria, Mitchell Hensel, Yen Ulm, Reva Huggard, Marylee Kohnke, Julissa Eubank, Gwenn Ciccone, Twyla Holub, Randee Logsdon, Trinity Sibert, Meredith Kiger, Antonetta Plumley, Noma Adam, My Court, Douglas Klenke, Kacy Mccutcheon, Camie Gulotta, Thao Christina, Sharmaine Stallings, Linsey Novy, Donny Doxey, Danette Carnell, Ignacio Thornton, Virgil Broadus, Dorthea Ricker, Everette Botello, Angella Quintanar, Irene Bump, Collin Priolo, Bettina Tousignant, Camellia Esslinger, Steffanie Newbury, Jaimee Guerriero, Melany Rey, Gigi Kjos, Easter Wallner, Carli Wason, Marg Ferrante, Vito Simien, Ira Purtell, Doloris Treece, Corrinne Dy, Vickie Simmons, Kortney Desantis, Debbie Simmon, Dannielle Holt, Karena Rugh, Doretta Slocum, Tynisha Ohm, Isaias Ballou, Machelle Donelson, Milton Foskey';
            makeTags( tags.map( function (tag) {
                return {
                    value: tag.label.toLowerCase(),
                    display: tag.label,
                    item : tag
                };
            }));
        });

    }
    //filter function for search query
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(tag) {
            return (tag.value.indexOf(lowercaseQuery) > -1)

            //return (name.value.indexOf(lowercaseQuery) === 0);
        };
    }
}

