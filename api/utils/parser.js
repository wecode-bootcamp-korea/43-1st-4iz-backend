const parseQuotes = (...args) => {
  const result = [];

  for (const arg of args) {
    result.push(arg.replaceAll('"', ""));
  }

  return result;
};

module.exports = {
  parseQuotes,
};
