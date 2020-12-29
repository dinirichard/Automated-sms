const User = require("./user.model");

require("./mongo").connect();

function getUsers(req, res) {
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

function postUser(req, res) {
  const existingUser = getUser(req, res);

  if (!existingUser) {
    const originalUser = {
      uid: req.body.uid,
      email: req.body.email,
      name: req.body.name,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      photoUrl: req.body.photoUrl,
    };
    const hero = new User(originalUser);
    hero.save((error) => {
      if (checkServerError(res, error)) return;
      res.status(201).json(hero);
      console.log("User created successfully!");
    });
  } else {
    console.log("User is already registered!");
  }
}

function putUser(req, res) {
  const originalHero = {
    uid: parseInt(req.params.uid, 10),
    name: req.body.name,
    saying: req.body.saying,
  };
  Hero.findOne({ uid: originalHero.uid }, (error, hero) => {
    if (checkServerError(res, error)) return;
    if (!checkFound(res, hero)) return;

    hero.name = originalHero.name;
    hero.saying = originalHero.saying;
    hero.save((error) => {
      if (checkServerError(res, error)) return;
      res.status(200).json(hero);
      console.log("Hero updated successfully!");
    });
  });
}

function deleteUser(req, res) {
  const uid = parseInt(req.params.uid, 10);
  Hero.findOneAndRemove({ uid: uid })
    .then((hero) => {
      if (!checkFound(res, hero)) return;
      res.status(200).json(hero);
      console.log("Hero deleted successfully!");
    })
    .catch((error) => {
      if (checkServerError(res, error)) return;
    });
}

function getUser(req, res) {
  const docquery = User.findOne({ email: req.body.email });

  docquery
    .exec()
    .then((user) => {
      return user;
    })
    .catch((error) => {
      res.status(500).send(error);
      return;
    });
}

function checkServerError(res, error) {
  if (error) {
    res.status(500).send(error);
    return error;
  }
}

function checkFound(res, hero) {
  if (!hero) {
    res.status(404).send("Hero not found.");
    return;
  }
  return hero;
}

module.exports = {
  getUsers,
  postUser,
  deleteUser,
  putUser,
};
