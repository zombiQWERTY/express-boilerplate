/**
 * Unshift selected object by field in provided array.
 *
 * @param {Array} array
 * @param {Object} needfulItem
 * @param {Object} field
 * @returns {Array}
 */
export default (array, needfulItem, field) => {
    const index = array.findIndex(el => el[field.array] === needfulItem[field.item]);
    array.unshift(...array.splice(index, Number(index >= 0)));

    return array;
};
