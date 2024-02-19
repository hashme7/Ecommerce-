const dateCheck = (data, filter) => {
    try {
        if (filter === 'Weekly') {
            console.log('Weekly')
            if (isInCurrentWeek(data.orderedDate)) {
                return data;
            }
        } else if (filter === 'Monthly') {
            if (isInCurrentMonth(data.orderedDate)) {
                return data;
            }
        } else if (filter === 'Yearly') {
            console.log('yearly')
            if (isInCurrentYear(data.orderedDate)) {
                return data;
            }
        } else if (filter === 'Daily') {
            console.log('Daily')
            if (isInCurrentDay(data.orderedDate)) {
                return data
            }
        } else if (filter === 'ALL') {
            console.log("All")
            return data
        } else {
            console.log("else")
            if (isInCustomDate(data.orderedDate, filter)) {
                return data;
            }

        }
    } catch (error) {
        console.log(error)
    }
}
function isInCurrentYear(date) {
    const currentDate = new Date().getFullYear();
    return date.getFullYear() == currentDate;
};

function isInCurrentWeek(date) {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDay);
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    currentWeekEnd.setHours(23, 59, 59, 999);
    return date >= currentWeekStart && date <= currentWeekEnd;
}

function isInCurrentMonth(date) {
    const currentDate = new Date();
    return (
        currentDate.getMonth() === date.getMonth() &&
        currentDate.getFullYear() === date.getFullYear()
    );
}

function isInCurrentDay(dateString) {
    const currentDate = new Date();
    return (
        currentDate.getMonth() === dateString.getMonth() &&
        currentDate.getFullYear() === dateString.getFullYear() &&
        currentDate.getDay() === dateString.getDay()
    );
}

function isInCustomDate(date, filter) {
    const customDate = new Date(filter);
    const dateString = new Date(date);
    console.log("customDate:", customDate, "dateString:", dateString);

    return (
        customDate.getMonth() === dateString.getMonth() &&
        customDate.getFullYear() === dateString.getFullYear() &&
        customDate.getDate() === dateString.getDate()
    );
}
module.exports = {
    dateCheck
}