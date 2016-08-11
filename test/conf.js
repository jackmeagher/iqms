/**
 * Created by hunterheidenreich on 8/10/16.
 */
exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['questions.js'],
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            
        }
    }
}