import { data } from "../app";

function addWordInRecord (text: string, synonym: string ) {
    if (data[text]) {
        if (!data[text].includes(synonym)) {
            data[text] = [...data[text], synonym];
        }
    } else {
        data[text] = [synonym];
    }
}

module.exports = {
    addWordInRecord
}
