const unknownEndPointHandler = (req, res) => {
  res.status(404).send({ message: "Unknown endpoint." });
};

module.exports = {
  unknownEndPointHandler,
};
