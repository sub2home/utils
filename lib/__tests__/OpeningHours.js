jest.dontMock('lodash');
jest.dontMock('./OpeningHoursData.js');
jest.dontMock('../OpeningHours.js');

var testData = require('./OpeningHoursData');
var OpeningHours = require('../OpeningHours');

describe('OpeningHours', function() {

    var getDate = function(date, hours, minutes) {
        var d = new Date(date);
        d.setHours(hours);
        d.setMinutes(minutes);
        return d;
    };

    var monday = new Date('2014-12-22');
    var tuesday = new Date('2014-12-23');
    var friday = new Date('2014-12-26');
    var saturday = new Date('2014-12-27');

    describe('getNextDate', function() {
        it('Case 1:', function() {
            var now = getDate(monday, 10, 0);
            var result = getDate(monday, 11, 30);

            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getNextDate(now, 7)).toEqual(result);
        });

        it('Case 2:', function() {
            var now = getDate(monday, 12, 0);
            var result = getDate(monday, 12, 0);

            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getNextDate(now, 7)).toEqual(result);
        });

        it('Case 3:', function() {
            var now = getDate(monday, 13, 30);
            var result = getDate(monday, 13, 30);

            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getNextDate(now, 7)).toEqual(result);
        });

        it('Case 4:', function() {
            var now = getDate(monday, 13, 50);
            var result = getDate(monday, 13, 50);

            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getNextDate(now, 7)).toEqual(result);
        });

        it('Case 5:', function() {
            var now = getDate(monday, 14, 30);
            var result = getDate(monday, 17, 30);

            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getNextDate(now, 7)).toEqual(result);
        });

        it('Case 6:', function() {
            var now = getDate(monday, 19, 0);
            var result = getDate(monday, 19, 0);


            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getNextDate(now, 7)).toEqual(result);
        });

        it('Case 7:', function() {
            var now = getDate(monday, 23, 0);
            var result = getDate(tuesday, 11, 30);

            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getNextDate(now, 7)).toEqual(result);
        });

        it('Case 8:', function() {
            var now = getDate(saturday, 0, 30);
            var result = getDate(saturday, 0, 30);

            var openingHours = new OpeningHours(testData.oberhausenDeliveryTimeCollection);
            expect(openingHours.getNextDate(now, 7)).toEqual(result);

        });

        it('Case 9:', function() {
            var now = getDate(monday, 23, 30);

            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getNextDate(now, 0)).toBeNull();

        });
    });

    describe('getPreviousDate', function() {
        it('Case1: go back to the day before today', function() {
            var now = getDate(tuesday, 11, 25);
            var result = getDate(monday, 21, 50);

            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getPreviousDate(now, 7)).toEqual(result);
        });

        it('Case2: is delivering in the second time slot of the day', function() {
            var now = getDate(monday, 18, 0);
            var result = getDate(monday, 18, 0);

            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getPreviousDate(now, 7)).toEqual(result);
        });

        it('Case3: is delivering in the first time slot of the day', function() {
            var now = getDate(monday, 12, 30);
            var result = getDate(monday, 12, 30);

            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getPreviousDate(now, 7)).toEqual(result);
        });

        it('Case4: get previous time slot on the same day', function() {
            var now = getDate(monday, 15, 0);
            var result = getDate(monday, 13, 50);

            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getPreviousDate(now, 7)).toEqual(result);
        });

        it('Case5: is delivering in the first time slot of the day', function() {
            var now = getDate(monday, 11, 30);
            var result = getDate(monday, 11, 30);

            var openingHours = new OpeningHours(testData.memmingenDeliveryTimeCollection);
            expect(openingHours.getPreviousDate(now, 7)).toEqual(result);
        });
    });


});
