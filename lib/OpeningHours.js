var _ = require('lodash');

function getDate(d, minutes) {
    if (d && d instanceof Date) {
        var date = new Date(d);
        if (!minutes) {
            minutes = 0;
        }

        date.setMinutes(minutes % 60);
        date.setHours(minutes / 60);

        return date;

    } else {
        throw 'Parameter must be a date';
    }
}

/*
 * OpeningHours takes the deliveryTimeCollection of a store
 * It gives you the next Date when the delivery can be delivered
 */
var OpeningHours = function(deliveryTimeCollection) {
    this.deliveryTimeCollection = deliveryTimeCollection;
};

/*
 * Returns the next possible date when the store is delivering
 * If the deliveryTimeCollection of the store is empty it reutrns null
 */
OpeningHours.prototype.getNextDate = function(relativeDate, daysInFuture) {

    if (relativeDate && relativeDate instanceof Date) {
        daysInFuture = daysInFuture || 0;

        // filterFuntion to find the next delivery time
        var filterFunctionNext = function(obj, day, minutes) {
            if (day && minutes || minutes >= 0) {
                return obj.dayOfWeek === day && obj.startMinutes > minutes;
            } else {
                if (obj instanceof Array) {
                    return obj[0].startMinutes;
                } else {
                    return obj.startMinutes;
                }
            }
        };

        var nextDate = this._getThisDay(relativeDate, filterFunctionNext);

        if (!nextDate && daysInFuture > 0) {
            relativeDate = new Date(relativeDate);
            relativeDate.setDate(relativeDate.getDate() + 1);
            relativeDate.setMinutes(0);
            relativeDate.setHours(0);

            return this.getNextDate(relativeDate, --daysInFuture);
        } else {
            return nextDate;
        }
    } else {
        throw new Error('Parameter must be a date');
    }
};


OpeningHours.prototype.getPreviousDate = function(relativeDate, daysInFuture) {
    if (relativeDate && relativeDate instanceof Date) {
        daysInFuture = daysInFuture || 0;

        var filterFunctionPrevious = function(obj, day, minutes) {
            if (day && minutes || minutes >= 0) {
                return obj.dayOfWeek === day && obj.endMinutes < minutes;
            } else {
                if (obj instanceof Array) {
                    return obj[obj.length - 1].endMinutes;
                } else {
                    return obj.endMinutes;
                }
            }
        };

        var previousDate = this._getThisDay(relativeDate, filterFunctionPrevious);

        if (!previousDate && daysInFuture > 0) {
            relativeDate = new Date(relativeDate);
            relativeDate.setDate(relativeDate.getDate() - 1);
            relativeDate.setMinutes(59);
            relativeDate.setHours(23);

            return this.getPreviousDate(relativeDate, --daysInFuture);
        } else {
            return previousDate;
        }

    } else {
        throw new Error('Parameter must be a date');
    }

};
/*
 * This is a private helper method that checks if the delivery can be delivered that day
 * when not it returns null
 */
OpeningHours.prototype._getThisDay = function(date, filterFunction) {

    var min = date.getMinutes() + date.getHours() * 60;
    var day = date.getDay();

    // check if the store is delivering at the moment
    var isDelivering = _.any(this.deliveryTimeCollection, function(obj) {
        return obj.dayOfWeek === day && obj.startMinutes <= min && min <= obj.endMinutes;
    });

    if (!isDelivering) {
        // check if it delivers later that day
        var nextDeliveryTime = _(this.deliveryTimeCollection)
            .filter(function(obj) {
                return filterFunction(obj, day, min);
            })
            .sortBy(function(obj) {
                return filterFunction(obj);
            }).value();

        if (nextDeliveryTime.length > 0) {
            return getDate(date, filterFunction(nextDeliveryTime));
        } else {
            return null;
        }
    } else {
        return getDate(date, min);
    }

};

module.exports = OpeningHours;
