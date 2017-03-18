/**
 * @example:
 *
 pluralize(['яблоко','яблока','яблок'], 0); // 0 яблок
 pluralize(['яблоко','яблока','яблок'], 1); // 1 яблоко
 pluralize(['яблоко','яблока','яблок'], 2); // 2 яблока

 //
 const age = pluralize(['год', 'года', 'лет']);
 age(0); // 0 лет
 age(1); // 1 год
 age(2); // 2 года
 age(69); // 69 лет
 *
 */
export default (function() {
    const cases = [2, 0, 1, 1, 1, 2];
    const declOfNumSubFunction = function(titles, number) {
        number = Math.abs(number);
        return number + ' ' + titles[
            ((number % 100 > 4) && (number % 100 < 20)) ? (2) : (cases[(number % 10 < 5) ? (number % 10) : (5)])
        ];
    };
    return function(_titles) {
        if (arguments.length === 1) { return (_number) => declOfNumSubFunction(_titles, _number); }
        return declOfNumSubFunction.apply(null, arguments);
    };
})();
