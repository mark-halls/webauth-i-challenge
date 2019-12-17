const express = require(`express`);
const bcrypt = require(`bcryptjs`);

const db = require(`./users-model`);

const router = express.Router();
router.use(express.json());

router.post(`/register`, (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const passwordHash = bcrypt.hashSync(password, 8);
    db.register({ username, password: passwordHash })
      .then(user => {
        if (user) {
          res
            .status(201)
            .json({ msg: `Successfully created ${user.username}` });
        } else {
          res.status(500).json({ errorMsg: `Error creating user` });
        }
      })
      .catch(err => res.status(500).json(err));
  }
});

router.post(`/login`, (req, res) => {
  const { username, password } = req.body;

  db.find(username)
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ msg: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ msg: `Invalid Credentials` });
      }
    })
    .catch(error => res.status(500).json(error));
});

router.get(`/users`, (req, res) => {
  const { username, password } = req.headers;
  db.find(username)
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        db.find()
          .then(users => res.status(200).json(users))
          .catch(err => res.status(500).json(err));
      } else {
        res.status(401).json({ msg: `Invalid Credentials` });
      }
    });
});

module.exports = router;
