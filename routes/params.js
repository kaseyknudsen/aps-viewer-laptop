const express = require("express");
let router = express.Router();
const formidable = require("express-formidable");
router.use(express.json());

const models = [
  {
    id: 0,
    name: "Bike Frame",
  },
  {
    id: 1,
    name: "Wrench",
  },
  {
    id: 2,
    name: "Wheel",
  },
];

router.get("/updateParameters", formidable(), (req, res) => {
  console.log("updateParameters endpoint was hit!");
  console.log(req);
  res.send(models); //returns array of model objects
});

router.get("/updateParameters/:id", (req, res) => {
  //res.send(req.params.id);
  //res.send("Endpoint was accessed!");
  //req.params.id returns a string, so we need to parseInt
  const model = models.find((model) => model.id === parseInt(req.params.id));
  return !model
    ? res.status(404).send("The model with given ID was not found")
    : res.send(model);
});

router.get("/updateParameters/:year/:month", (req, res) => {
  res.send(req.params);
  //   res.send(req.query); //query string parameters for anything that is optional: ?sortBy=name
});

router.post("/updateParameters", (req, res) => {
  let newModel = {
    id: models.length + 1,
    //we need to enable parsing of JSON objects in the body of the request
    name: req.body.name,
  };
  models.push(newModel);
  //we need to return this object in the body of the response
  res.send(newModel);
});

module.exports = router;
