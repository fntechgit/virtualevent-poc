'use strict';

const fs = require('fs');
const path = require('path');

const file = '../content/sponsors.json';
let rawdata = fs.readFileSync(file);
let sponsors = JSON.parse(rawdata);
//console.log(sponsors);

sponsors.tierSponsors.forEach(e => {
    e.sponsors.forEach( s => {
        const fields = [
            'headerImageMobile',
            'advertiseImage',
            'logo',
            'headerImage',
            'sideImage'
        ];
        fields.forEach(f => {
            if(s.hasOwnProperty(f) && s[`${f}`] != ''){
                s[`${f}`] = {file : s[`${f}`] , alt:'' };
            }
        })
        console.log(s)
    })
})

let data = JSON.stringify(sponsors, null, 2);

fs.writeFile(file, data, (err) => {
    if (err) throw err;
    console.log('Data written to file');
});