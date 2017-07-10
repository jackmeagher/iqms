describe('Interview Post Mechanics', function() {

    var userBox = element(by.model('user.email'));
    var passBox = element(by.model('user.password'));
    var userInfo = {
        name: 'bytecodedesigns@gmail.com',
        password: 'testpass1234'
    };

    var userList = element.all(by.repeater('user in users'));

    beforeEach(function() {
        browser.get('http://localhost:3000/static/www/#/');
    });

    it('should be able to enter all interview parameters', function() {
        userBox.sendKeys(userInfo.name);
        passBox.sendKeys(userInfo.password);
        browser.wait(function(){
            return element(by.id('user-title')).isPresent();
        });

        expect(userList.last().getText()).toContain('hunter.scott.heidenreich@gmail.com');
        expect(userList.last().getText()).toContain('Manager');
        userList.last().element(by.cssContainingText('option', 'Admin')).click();

        browser.driver.sleep(500);

        expect(userList.last().getText()).toContain('Admin')
        userList.last().element(by.cssContainingText('option', 'Manager')).click();

        browser.driver.sleep(500);

        expect(userList.last().getText()).toContain('Manager')

        browser.pause();
    });
});