/**
 * Created by nick on 4/1/16.
 */


function question_auto_complete_controller ($scope,$http,$timeout, $q, $log) {
    var self = this;
    // list of questions to be displayed
    $scope.names = [];
    loadQuestions();


    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newQuestion = newQuestion;
    function newQuestion(question) {
        alert("This functionality is yet to be implemented!");
    }
    function querySearch (query) {
        var results = query ? $scope.questions.filter( createFilterFor(query) ) : $scope.questions;//, deferred;
        return results;
        }

    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }
    //build list of questions as map of key-value pairs
    function makeQuestions(questions){
        $scope.questions = questions;
    }

    //build list of names as map of key-value pairs
    function loadQuestions() {
        $http.get('/question').success(function (data) {
            var question = data.questions;
            var allNames = '';

            for(var i = 0;i<question.length;i++){
                allNames += question[i].question_text
                allNames += ', '
            }
            allNames = allNames.substr(0,allNames.length-2);

            //var allNames = 'Nick DeSisto, Jack Meagher, Ben Byrd, Laurene Huang, Claudio Sroka, Sherrill Rockett, Lisette Mora, Carey Orosco, Alvera Sherrell, Isaias Riedel, Russ Powe, Malia Simental, Shawna Spiker, Kathyrn Driver, Chas Defeo, Aileen Volz, Lea Dalke, Myesha Defore, Verlene Lobdell, Raven Wilbur, Weldon Elsworth, Margert Pedrick, Mariette Swart, Dionna Alday, Detra Kerley, Janice Poorman, Alphonso Quesinberry, Louise Whitmire, Rochelle Gorder, Forrest Frankel, Mervin Whipps, Lurlene Burts, Stasia Sakata, Micheal Colorado, Joselyn Littles, Charmaine Brust, Crysta Chartier, Shon Gaynor, Reatha Pinto, Donnetta Mcconn, Shemeka Fredrickson, Kurtis Toomer, Minna Bravo, Marilee Vides, Theola Mungia, Deangelo Dierks, Bao Molina, Nan Hocutt, Claude Kimbrel, Anton Mery, Rod Fricke, Marline Viloria, Mitchell Hensel, Yen Ulm, Reva Huggard, Marylee Kohnke, Julissa Eubank, Gwenn Ciccone, Twyla Holub, Randee Logsdon, Trinity Sibert, Meredith Kiger, Antonetta Plumley, Noma Adam, My Court, Douglas Klenke, Kacy Mccutcheon, Camie Gulotta, Thao Christina, Sharmaine Stallings, Linsey Novy, Donny Doxey, Danette Carnell, Ignacio Thornton, Virgil Broadus, Dorthea Ricker, Everette Botello, Angella Quintanar, Irene Bump, Collin Priolo, Bettina Tousignant, Camellia Esslinger, Steffanie Newbury, Jaimee Guerriero, Melany Rey, Gigi Kjos, Easter Wallner, Carli Wason, Marg Ferrante, Vito Simien, Ira Purtell, Doloris Treece, Corrinne Dy, Vickie Simmons, Kortney Desantis, Debbie Simmon, Dannielle Holt, Karena Rugh, Doretta Slocum, Tynisha Ohm, Isaias Ballou, Machelle Donelson, Milton Foskey';
            makeQuestions( allNames.split(/, +/g).map( function (name) {
                return {
                    value: name.toLowerCase(),
                    display: name
                };
            }));
        });

    }
    //filter function for search query
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(question) {
            return (question.value.indexOf(lowercaseQuery) > -1)
            //return (question.value.indexOf(lowercaseQuery) === 0);
        };
    }
}