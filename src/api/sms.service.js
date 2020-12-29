const User = require("./user.model");

require("./mongo").connect();

function getUser(req, res) {
  const docquery = User.find({});
  docquery
    .exec()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).send(error);
      return;
    });
}

module.exports = {
  getUser,
};
