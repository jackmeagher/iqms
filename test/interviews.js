describe('Interview Management', function() {

    var url = "http://localhost:3000/static/www/#/";

    var interviewData = {
        candidate: "Name (test)",
        position: "Job (test)",
        description: "Description (test)",
        location: 'Charleston, SC',
        date: '12/12/2016 11:30AM',
        users: ['bytecodedesigns@gmail.com'],
        tags: ['Intro', 'Skills', 'Close']
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

    it('Should be able to create an interview', function() {
        var position = {
            box: element(by.css("md-autocomplete input#positionBox")),
            button: element(by.id('addPositionButton')),
            auto: element.all(by.css('.md-autocomplete-suggestions li')),
            dialog: element(by.model('dialog.result')),
            submit: element.all(by.css('.md-button'))
        };

        var candidate = {
            box: element(by.css("md-autocomplete input#canBox")),
            button: element(by.id('addCandidateButton')),
            auto: element.all(by.css('.md-autocomplete-suggestions li'))
        };

        var date = element(by.model('dateText'));
        var location = element(by.model('locationText'));

        var interviewers = element(by.css("md-autocomplete input#intBox"));
        var userList = element.all(by.repeater('user in addedList'));

        var tagbox = element(by.className('bootstrap-tagsinput')).element(by.css('input'));

        var submit = element(by.id('submitInterviewButton'));
        var interviewList = element.all(by.repeater('interview in interviews'));

        browser.get(url + 'ci');

        //Position
        position.box.click();
        position.box.clear();
        position.box.sendKeys(interviewData.position);
        browser.executeScript(function() {
            $('#addPositionButton').focus();
        }).then(function () {

        });
        position.button.click();
        position.dialog.sendKeys(interviewData.description);
        position.submit.get(1).click();
        position.box.click();
        expect(position.box.getAttribute('value')).toContain(interviewData.position);

        //Candidate
        candidate.box.click();
        candidate.box.clear();
        candidate.box.sendKeys(interviewData.candidate);
        browser.executeScript(function() {
            $('#addCandidateButton').focus();
        }).then(function () {

        });
        candidate.button.click();
        candidate.box.click();
        expect(candidate.box.getAttribute('value')).toContain(interviewData.candidate);

        //Date
        date.click();
        date.clear();
        date.sendKeys(interviewData.date);
        expect(date.getAttribute('value')).toEqual(interviewData.date);

        //Location
        location.click();
        location.clear();
        location.sendKeys(interviewData.location);
        expect(location.getAttribute('value')).toEqual(interviewData.location);

        //Users
        interviewData.users.forEach(function(user) {
            interviewers.click();
            interviewers.clear();
            interviewers.sendKeys(user);
            element.all(by.css('.md-autocomplete-suggestions li')).get(2).click();
            expect(interviewers.getAttribute('value')).toContain(user);
        });

        expect(userList.last().getText()).toContain('bytecodedesigns@gmail.com');
        userList.first().element(by.className('btn')).click();

        interviewData.users.forEach(function(user) {
            interviewers.click();
            interviewers.clear();
            interviewers.sendKeys(user);
            element.all(by.css('.md-autocomplete-suggestions li')).forEach(function(box))
            element.all(by.css('.md-autocomplete-suggestions li')).get(2).click();
            expect(interviewers.getAttribute('value')).toContain(user);
        });

        //Tags
        interviewData.tags.forEach(function(tag) {
            tagbox.sendKeys(tag);
            tagbox.sendKeys('\n');
        });

        submit.click();

       /* login.user.sendKeys(login.userInfo.name);
        login.pass.sendKeys(login.userInfo.password);
        browser.wait(function(){
            return element(by.id('tagbox')).isPresent();
        });



        //Position Box
        posBox.click();
        posBox.clear();
        posBox.sendKeys('Database Admin');
        element.all(by.css('.md-autocomplete-suggestions li')).get(0).click();
        expect(posBox.getAttribute('value')).toContain('Database Admin');

        //Candidate Box
        canBox.click();
        canBox.clear();
        canBox.sendKeys('Good Admin');
        element.all(by.css('.md-autocomplete-suggestions li')).get(1).click();
        expect(canBox.getAttribute('value')).toContain('Good Admin');

        //Date Box
        dateBox.sendKeys('9/6/2016 4:30 PM');
        expect(dateBox.getAttribute('value')).toBe('9/6/2016 4:30 PM');

        //Location Box
        locationBox.sendKeys('1535 Hobby St # 103, North Charleston, SC 29405');
        expect(locationBox.getAttribute('value')).toBe('1535 Hobby St # 103, North Charleston, SC 29405');

        //Interviewer Box
        intBox.click();
        intBox.clear();
        intBox.sendKeys('guitargodd97@gmail.com');
        element.all(by.css('.md-autocomplete-suggestions li')).get(2).click();
        expect(intBox.getAttribute('value')).toContain('guitargodd97@gmail.com');
        intBox.clear();
        intBox.sendKeys('bytecodedesigns@gmail.com');
        element.all(by.css('.md-autocomplete-suggestions li')).get(2).click();
        expect(intBox.getAttribute('value')).toContain('bytecodedesigns@gmail.com');

        //User list
        expect(userList.first().getText()).toContain('guitargodd97@gmail.com');
        expect(userList.last().getText()).toContain('bytecodedesigns@gmail.com');
        userList.first().element(by.className('btn')).click();

        //Tagbox
        tagbox.sendKeys('Database\n');

        //Submit
        submitButton.click();

        browser.driver.sleep(1500);

        expect(interviewList.last().getText()).toContain('Good Admin');
        expect(interviewList.last().getText()).toContain('Database Admin');
        interviewList.last().element(by.className('plan-interview')).click();

        tagbox.sendKeys('SQL\n');

        submitButton.click();

        browser.driver.sleep(1500);

        expect(interviewList.last().getText()).toContain('Good Admin');
        expect(interviewList.last().getText()).toContain('Database Admin');
        interviewList.last().element(by.className('delete-interview')).click();


        browser.pause();*/
    });
});