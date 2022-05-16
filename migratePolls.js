const fs = require('fs');
const allTags = require('./tags.json');
const matter = require('gray-matter')
const levenshtein = require('fast-levenshtein');

const mappedTags = {
    'governance': 'Misc Governance',
    'risk variable': 'Risk '
}

function readAllPolls() {
    const rawData = fs.readdirSync('./polls/old');
    const polls = rawData.filter(p => p.indexOf('.md') !== -1);

    polls.forEach(poll => {
        const name = poll.replace('.md', '');

        // Read tags file
        const document = fs.readFileSync(`./polls/old/${poll}`);
        const { data: pollMeta, content } = matter(document);
        const categories = pollMeta.categories || [];

        // Now we need to map them to the right categories
        const mappedCategories = categories.map(c => c.toLowerCase()).map(category => {
            // Map some of the categories
            const mappedCategory = mappedTags[category] ? mappedTags[category] : category;

            // Find the new tag on the list of tags
            const foundItem = allTags.find(i => {
                return levenshtein.get(i.longname.toLowerCase() || i.id, mappedCategory) <= 2
            })

            if (!foundItem) {
                console.log('Not found category', mappedCategory)
            }

            return foundItem
        }).filter(c => !!c);


        // create tags file with the new tags
        fs.mkdirSync(`./polls/new/${name}`);

        // Copy poll file
        fs.writeFileSync(`./polls/new/${name}/poll.md` , document);

        // Create the tags file
        const tagsContent = `
---
tags:
  ${mappedCategories.map(c => `- ${c.id}`).join('\n')}

---
        `

        fs.writeFileSync(`./polls/new/${name}/tags.md`, tagsContent)
        
    })

}


function main() {
    readAllPolls()
}

main()