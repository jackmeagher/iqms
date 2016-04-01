/**
 * Created by nick on 4/1/16.
 */


function question_auto_complete_controller ($timeout, $q, $log) {
    var self = this;
    self.simulateQuery = false;
    self.isDisabled    = false;
    // list of questions to be displayed
    self.questions        = loadQuestions();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newQuestion = newQuestion;
    function newQuestion(question) {
        alert("This functionality is yet to be implemented!");
    }
    function querySearch (query) {
        var results = query ? self.questions.filter( createFilterFor(query) ) : self.questions, deferred;
        if (self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () {
                deferred.resolve( results );
            },
                Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }
    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }
    //build list of questions as map of key-value pairs
    function loadQuestions($http) {

            $http.get('/question').success(function (data) {
                question_json = data;
            });
        console.log(question_json);
        var allQuestions = 'Laurene Huang, Claudio Sroka, Sherrill Rockett, Lisette Mora, Carey Orosco, Alvera Sherrell, Isaias Riedel, Russ Powe, Malia Simental, Shawna Spiker, Kathyrn Driver, Chas Defeo, Aileen Volz, Lea Dalke, Myesha Defore, Verlene Lobdell, Raven Wilbur, Weldon Elsworth, Margert Pedrick, Mariette Swart, Dionna Alday, Detra Kerley, Janice Poorman, Alphonso Quesinberry, Louise Whitmire, Rochelle Gorder, Forrest Frankel, Mervin Whipps, Lurlene Burts, Stasia Sakata, Micheal Colorado, Joselyn Littles, Charmaine Brust, Crysta Chartier, Shon Gaynor, Reatha Pinto, Donnetta Mcconn, Shemeka Fredrickson, Kurtis Toomer, Minna Bravo, Marilee Vides, Theola Mungia, Deangelo Dierks, Bao Molina, Nan Hocutt, Claude Kimbrel, Anton Mery, Rod Fricke, Marline Viloria, Mitchell Hensel, Yen Ulm, Reva Huggard, Marylee Kohnke, Julissa Eubank, Gwenn Ciccone, Twyla Holub, Randee Logsdon, Trinity Sibert, Meredith Kiger, Antonetta Plumley, Noma Adam, My Court, Douglas Klenke, Kacy Mccutcheon, Camie Gulotta, Thao Christina, Sharmaine Stallings, Linsey Novy, Donny Doxey, Danette Carnell, Ignacio Thornton, Virgil Broadus, Dorthea Ricker, Everette Botello, Angella Quintanar, Irene Bump, Collin Priolo, Bettina Tousignant, Camellia Esslinger, Steffanie Newbury, Jaimee Guerriero, Melany Rey, Gigi Kjos, Easter Wallner, Carli Wason, Marg Ferrante, Vito Simien, Ira Purtell, Doloris Treece, Corrinne Dy, Vickie Simmons, Kortney Desantis, Debbie Simmon, Dannielle Holt, Karena Rugh, Doretta Slocum, Tynisha Ohm, Isaias Ballou, Machelle Donelson, Milton Foskey';
        return allQuestions.split(/, +/g).map( function (question) {
            return {
                value: question.toLowerCase(),
                display: question
            };
        });
    }
    //filter function for search query
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(question) {
            return (question.value.indexOf(lowercaseQuery) === 0);
        };
    }
}