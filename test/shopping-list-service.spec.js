const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe(`Shopping List Service Object`, function() {
  let db;
  let testItems = [
    {
      id: 1,
      name: "Test Item 1",
      date_added: new Date(),
      price: "1.00",
      category: "Main"
    },
    {
      id: 2,
      name: "Test Item 2",
      date_added: new Date(),
      price: "2.00",
      category: "Snack"
    },
    {
      id: 3,
      name: "Test Item 3",
      date_added: new Date(),
      price: "3.00",
      category: "Lunch"
    },
    {
      id: 4,
      name: "Test Item 4",
      date_added: new Date(),
      price: "4.00",
      category: "Breakfast"
    }
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db("shoppinglist").truncate());

  afterEach(() => db("shoppinglist").truncate());

  after(() => db.destroy());

  context(`Given 'shoppinglist' has data`, () => {
    beforeEach(() => {
      return db.into("shoppinglist").insert(testItems);
    });

    it(`getAllItems() resolves all items from 'shoppinglist'`, () => {
      const expected = testItems.map(item => ({
        ...item,
        checked: false
      }));
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql(expected);
      });
    });

    it(`getById() resolves articles by id from 'shoppinglist'`, () => {
      const getId = 2;
      const item = testItems[getId - 1];
      return ShoppingListService.getById(db, getId).then(actual => {
        expect(actual).to.eql({
          id: getId,
          name: item.name,
          date_added: item.date_added,
          price: item.price,
          category: item.category,
          checked: false
        });
      });
    });

    it(`deleteItem() removes articles by id from 'shoppinglist'`, () => {
      const delId = 2;
      return ShoppingListService.deleteItem(db, delId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          const expected = testItems
            .filter(article => article.id !== delId)
            .map(item => ({
              ...item,
              checked: false
            }));
          expect(allItems).to.eql(expected);
        });
    });

    it(`updateItem() updates articles from 'shoppinglist'`, () => {
      const idToUpdate = 2;
      const newData = {
        name: "Updated Name",
        price: "99.99",
        date: new Date(),
        checked: true
      };
      const origItem = testItems[idToUpdate - 1];
      return ShoppingListService.updateItem(db, idToUpdate, newData)
        .then(() => ShoppingListService.getById(db, idToUpdate))
        .then(article => {
          expect(article).to.eql({
            id: idToUpdate,
            ...origItem,
            ...newData
          });
        });
    });
  });

  context(`Given 'shoppinglist' has no data`, () => {
    it(`getAllItems() resolves empty array`, () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });

    it(`insertItem() inserts article and resolves article with id`, () => {
      const newItem = {
        name: "Test Name",
        price: "88.88",
        date_added: new Date(),
        checked: true,
        category: "Lunch"
      };
      return ShoppingListService.insertItem(db, newItem).then(actual => {
        expect(actual).to.eql({
          id: 1,
          name: newItem.name,
          price: newItem.price,
          date_added: newItem.date_added,
          checked: newItem.checked,
          category: newItem.category
        });
      });
    });
  });
});
