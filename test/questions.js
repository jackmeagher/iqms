describe('Question Management', function() {

    var url = "http://localhost:3000/static/www/#/";

    var questionData = {
        text: "What is the difference between an abstract class and an interface? (TEST)",
        answer:"An abstract class can have implementation for a method but an interface cannot"
    };

    var login = {
        user: element(by.id('loginUser')),
        pass: element(by.id('loginPass')),
        button: element(by.id('loginButton')),
        userInfo: {
            name: 'bytecodedesigns@gmail.com',
            password: 'testpass1234'
        }
    };

    it('Should be able to enter all question parameters', function() {
        browser.get(url + 'cq');
        var questionTextBox = element(by.id('question_text'));

        var tags = {
            tagBox: element(by.css("md-autocomplete input#tagBox")),
            autoComplete: element(by.css('.md-autocomplete-suggestions li')),
            addTag: element(by.id("addTagButton")),
            list: ['Java', 'OOP', 'Inheritance'],
            collection: element.all(by.repeater('(key, value) in questionData.selectedTags'))
        };

        var difficulties = {
            junior: element(by.id('juniorDiff')),
            mid: element(by.id('midDiff')),
            senior: element(by.id('seniorDiff')),
            slider: element(by.id('modelValue'))
        };

        var answers = {
            add: element(by.id('addAnswerButton')),
            remove: element(by.id('removeAnswerButton')),
            collection: element.all(by.repeater('answer in questionData.answers')),
            box: element(by.id('questionDataanswer0'))
        };

        var submit = element(by.id('submitQuestion'));

        login.user.sendKeys(login.userInfo.name);
        login.pass.sendKeys(login.userInfo.password);
        login.button.click();
        browser.wait(function(){
            return questionTextBox.isPresent();
        });

        //Testing the text box
        questionTextBox.sendKeys(questionData.text);
        expect(questionTextBox.getAttribute('value')).toEqual(questionData.text);

        //Tag radio testing
        expect(tags.collection.last().getText()).toContain('Skills');
        element(by.id('inlineRadio1')).click();
        expect(tags.collection.last().getText()).toContain('Intro');
        element(by.id('inlineRadio2')).click();
        expect(tags.collection.last().getText()).toContain('Skills');
        element(by.id('inlineRadio3')).click();
        expect(tags.collection.last().getText()).toContain('Close');
        element(by.id('inlineRadio2')).click();

        //Tag testing
        tags.list.forEach(function(tag) {
            tags.tagBox.click();
            tags.tagBox.clear();
            tags.tagBox.sendKeys(tag);
            browser.executeScript(function() {
                $('#addTagButton').focus();
            }).then(function () {

            });
            tags.addTag.click();
            tags.tagBox.click();
            tags.autoComplete.click();
            expect(tags.collection.last().getText()).toContain(tag);
        });

        //Difficulty testing
        difficulties.junior.click();
        expect(difficulties.slider.getAttribute('value')).toEqual('0');
        difficulties.mid.click();
        expect(difficulties.slider.getAttribute('value')).toEqual('5');
        difficulties.senior.click();
        expect(difficulties.slider.getAttribute('value')).toEqual('10');
        difficulties.junior.click();
        expect(difficulties.slider.getAttribute('value')).toEqual('0');

        //Answer testing
        browser.executeScript(function() {
            $('#addAnswerButton').focus();
        }).then(function () {

        });

        expect(answers.collection.count()).toEqual(1);
        answers.add.click();
        answers.add.click();
        answers.add.click();
        expect(answers.collection.count()).toEqual(4);
        answers.remove.click();
        browser.waitForAngular();
        expect(answers.collection.count()).toEqual(3);
        answers.box.sendKeys(questionData.answer);
        expect(answers.box.getAttribute('value')).toEqual(questionData.answer);
        answers.remove.click();
        answers.remove.click();

        //Submitting testing
        submit.click();
    });

    it('Should be able to edit a question, change the information, and save it back', function() {
        var questionCollection = element.all(by.repeater('question in _question'));
        var questionTextBox = element(by.id('question_text'));
        var tags = {
            tagBox: element(by.css("md-autocomplete input#tagBox")),
            autoComplete: element(by.css('.md-autocomplete-suggestions li')),
            addTag: element(by.id("addTagButton")),
            list: ['Interfaces'],
            collection: element.all(by.id('subtopic-box'))
        };

        var difficulties = {
            junior: element(by.id('juniorDiff')),
            mid: element(by.id('midDiff')),
            senior: element(by.id('seniorDiff')),
            slider: element(by.id('modelValue'))
        };

        var submit = element(by.id('submitQuestion'));

        browser.get(url + 'qm');
        browser.wait(function(){
            return questionCollection.get(0);
        });

        questionCollection.last().element(by.className('edit-question')).click();
        browser.wait(function(){
            return questionTextBox.isPresent();
        });

        element(by.id('inlineRadio3')).click();
        expect(tags.collection.last().getText()).toContain('Close');
        element(by.id('inlineRadio2')).click();

        tags.list.forEach(function(tag) {
            tags.tagBox.click();
            tags.tagBox.clear();
            tags.tagBox.sendKeys(tag);
            browser.executeScript(function() {
                $('#addTagButton').focus();
            }).then(function () {

            });
            tags.addTag.click();
            tags.tagBox.click();
            tags.autoComplete.click();
            expect(tags.collection.last().getText()).toContain(tag);
        });

        difficulties.mid.click();
        expect(difficulties.slider.getAttribute('value')).toEqual('5');

        submit.click();
    });

    it('Should be able to find, sort, search, and delete new inputted question', function() {
        var questionCollection = element.all(by.repeater('question in _question'));
        var sortByID = element(by.id('byID'));
        var search = element(by.model('searchQuestion'));

        browser.get(url + 'qm');
        browser.wait(function(){
            return questionCollection.get(0);
        });

        sortByID.click();
        expect(questionCollection.first().getText()).toContain(questionData.text);
        sortByID.click();
        expect(questionCollection.last().getText()).toContain(questionData.text);
        search.click();
        search.sendKeys(questionData.text);
        expect(questionCollection.count()).toEqual(1);
        search.clear();
        questionCollection.last().element(by.className('delete-question')).click();
    });
});