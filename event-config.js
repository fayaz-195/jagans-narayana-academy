/*
 * JNA automatic special-day and festival calendar.
 * Uses Asia/Kolkata local date. Add confirmed movable festival dates each year.
 * Islamic festival dates are not hard-coded because they depend on moon sighting.
 */
window.JNA_CALENDAR = {
  showWithinDays: 21,
  annual: [
    ["National Youth Day","01-12","Special Day"],["Makar Sankranti / Pongal","01-14","Festival"],
    ["Republic Day","01-26","National Day"],["Valentine's Day","02-14","Special Day"],
    ["National Science Day","02-28","Special Day"],["International Women's Day","03-08","Special Day"],
    ["World Health Day","04-07","Special Day"],["Earth Day","04-22","Special Day"],
    ["May Day","05-01","Special Day"],["World Environment Day","06-05","Special Day"],
    ["International Yoga Day","06-21","Special Day"],["Teachers' Day","09-05","Special Day"],
    ["Gandhi Jayanti","10-02","National Day"],["Children's Day","11-14","Special Day"],
    ["Constitution Day","11-26","Special Day"],["Christmas","12-25","Festival"],
    ["New Year's Day","01-01","Special Day"]
  ],
  dated: [
    ["Dhanteras","2026-11-06","Festival"],
    ["Diwali","2026-11-08","Festival"],
    ["Govardhan Puja","2026-11-10","Festival"],
    ["Bhai Dooj","2026-11-11","Festival"],
    ["Chhath Puja","2026-11-15","Festival"],
    ["Guru Nanak Jayanti","2026-11-24","Festival"],
    ["Maha Shivaratri","2027-03-06","Festival"],
    ["Ugadi","2027-04-07","Festival"],
    ["Ram Navami","2027-04-15","Festival"],
    ["Varalakshmi Vratam","2027-08-13","Festival"],
    ["Ganesh Chaturthi","2027-09-04","Festival"],
    ["Bathukamma","2027-10-01","Telangana Festival"],
    ["Dussehra","2027-10-09","Festival"],
    ["Diwali","2027-10-29","Festival"]
  ]
};
