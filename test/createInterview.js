describe('Interview Post Mechanics', function() {

    var userBox = element(by.model('user.email'));
    var passBox = element(by.model('user.password'));;
    var userInfo = {
        name: 'bytecodedesigns@gmail.com',
        password: 'testpass1234'
    }

    var posBox = element(by.css("md-autocomplete input#positionBox"));
    var canBox = element(by.css("md-autocomplete input#canBox"));
    var dateBox = element(by.model('dateText'));
    var locationBox = element(by.model('locationText'));
    var intBox = element(by.css("md-autocomplete input#intBox"));
    var userList = element.all(by.repeater('user in addedList'));
    var tagbox = element(by.className('bootstrap-tagsinput')).element(by.css('input'));
    var submitButton = element(by.id('submitInterviewButton'));
    var interviewList = element.all(by.repeater('interview in interviews'));

    beforeEach(function() {
        browser.get('http://localhost:3000/static/www/#/');
    })

    it('should be able to enter all interview parameters', function() {
        userBox.sendKeys(userInfo.name);
        passBox.sendKeys(userInfo.password);
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


        browser.pause();
    });
});