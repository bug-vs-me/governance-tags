
const fs = require('fs');

const xlsx = require('node-xlsx');


function main() {
    const workSheetsFromFile = xlsx.parse(`./tags.xlsx`);
    const tags = []

    workSheetsFromFile[0].data.forEach((row, index) => {
        if (index !== 0) {
            tags.push({
                id: row[0],
                shortname: row[1],
                longname: row[2],
                recommend_ui: row[3],
                description: row[4],
                related_link: row[5]
            })
        }
    })

    fs.writeFileSync('./tags.json', JSON.stringify(tags, null, 2))
}

main()