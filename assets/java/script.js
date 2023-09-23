$(document).ready(function() {
    // Display the current date at the top of the page
    var currentDay = dayjs().format("(MM/DD/YYYY)");
    $("#currentDay").text(currentDay);
});