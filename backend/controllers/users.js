const { User } = require("../models");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
// const openAI = require("../config/openAI-connection")

// console.log(User);

module.exports = {
  create,
  index,
  show,
  update,
  delete: destroy,
  checkToken,
  login
};

async function create(req, res) {
  try {
    console.log("creating user in controller")
    const user = await User.create(req.body);
    const token = createJWT(user)
    res.json(token)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function index(req, res) {
  try {
    res.status(200).json(await User.find());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function show(req, res) {
  try {
    res.status(200).json(await User.findById(req.params.userId));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    res
    .status(200)
    .json(
      await User.findByIdAndUpdate(req.params.userId, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function destroy(req, res) {
  try {
    res
    .status(200)
    .json(
      await User.findOneAndDelete({_id: req.params.userId})
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

function checkToken(req, res) {

  // console.log("req.user", req.user);
  res.json(req.exp);

}

async function login(req, res) {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
      throw new Error();
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    console.log("match", match)
    if (!match) {
      throw new Error();
    }
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    res.status(400).json('Bad Credentials');
  }
}

// HELPER FUNCTIONS 
function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: "2h" }
  )
}