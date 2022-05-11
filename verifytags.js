const tags = require("./tags.json");
const polls = require("./polls.json");

function main() {
  const errored = [];
  polls.forEach((poll) => {
    poll.tags.forEach((tagId) => {
      const tag = tags.find((t) => t.id === tagId);
      if (!tag) {
        console.log(tagId, "not found for poll ", poll.pollId);
        errored.push(poll.pollId);
      }
    });
  });

  console.log("Total errors: ", errored.length);
}

main();
