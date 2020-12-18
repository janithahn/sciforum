import { createSelector } from 'reselect';

const selectItems = (state) => state.Answers;

const selectItemById = createSelector(
  [selectItems, (_, id) => id],
  (items, id) => items.find((item) => item.id === id)
);

const createSelectItemAsJSON = (id) =>
  createSelector(
    [(state) => selectItemById(state, id)],
    //return the item as primitive (string)
    (item) => JSON.stringify(item)
);

export const createSelectItemById = (id) =>
  createSelector(
    [createSelectItemAsJSON(id)],
    //return the json item as object
    (item) => JSON.parse(item)
);