const Users = require(`../db-config`);

const add = async userData => {
  try {
    // return await Users(`users`).insert(userData);

    const [id] = await Users(`users`).insert(userData);
    return await Users(`users`)
      .where({ id })
      .first();
  } catch (e) {
    console.error(e);
  }
};

const find = (username = undefined) => {
  return Users(`users`).modify(queryBuilder => {
    if (username) {
      queryBuilder.where({ username });
    }
  });
};

module.exports = {
  add,
  find
};
