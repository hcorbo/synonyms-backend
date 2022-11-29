import { Response, Request, RequestHandler } from "express";
import { data } from "../app";

const wordsUtils = require("../utils/utils");

const getWords = async (req: Request, res: Response): Promise<Response> => {
    try {
        const words = Object.keys(data);

        const search = req.query?.search as string;

        if (search) {
            const preparedSearch = search.trim().toLowerCase();
            const filteredWords = words.filter(word => word.toLowerCase().includes(preparedSearch));

            return res.status(200).json(filteredWords);
        }

        return res.status(200).json(words);
    } catch (error) {
        throw error;
    }
};

const getSynonymsForWord = async (req: Request, res: Response): Promise<void> => {
    try {
        const requestedWord = req.params.word;

        if (data[requestedWord]) {
            const synonyms = [...data[requestedWord]];
            const transitiveSynonyms: string[] = [];

            synonyms.forEach(synonym => data[synonym].forEach(transitiveSynonym => {
                // dont add if synonym is request word
                if (transitiveSynonym !== requestedWord) {
                    if (synonyms.indexOf(transitiveSynonym) === -1) {
                        transitiveSynonyms.push(transitiveSynonym);
                    }
                }
            }));
            //remove duplicates
            const uniqueTransitiveSynonym = new Set(transitiveSynonyms);

            res.status(200).json({
                synonyms: [...synonyms, ...uniqueTransitiveSynonym],
                lengthOfNotTransitiveSynonyms: synonyms.length,
            });
        } else {
            res.status(404).json({
                message: "Not found",
            });
        }


    } catch (error) {
        throw error;
    }
};

const deleteSynonym = async (req: Request, res: Response): Promise<Response> => {
    try {
        const requestedWord = req.params.word;
        const requestedSynonym = req.params.synonym;

        //if word doesnt exist return 404
        if (data[requestedWord]) {
            const indexOfSynonym = data[requestedWord].findIndex(word => word === requestedSynonym);

            //if synonym doesnt exist return 404
            if (indexOfSynonym === -1) {
                return res.status(404).json({
                    message: "Not found",
                });
            } else {
                data[requestedWord].splice(indexOfSynonym, 1);
            }
        } else {
            return res.status(404).json({
                message: "Not found",
            });
        }

        if (data[requestedSynonym]) {
            data[requestedSynonym] = data[requestedSynonym].filter(word => word !== requestedWord);
        }

        return res.status(204).json(null);
    } catch (error) {
        throw error;
    }
};


const deleteWord = async (req: Request, res: Response): Promise<Response> => {
    try {
        const requestedWord = req.params.word;

        if (data[requestedWord]) {
            data[requestedWord].forEach(word => data[word] = data[word].filter(synonym => synonym !== requestedWord));
        } else {
            return res.status(404).json({
                message: "Not found",
            });
        }

        delete data[requestedWord];

        return res.status(204).json(null);
    } catch (error) {
        throw error;
    }
};

const getWordsWithSynonyms = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json(data);
    } catch (error) {
        throw error;
    }
};

const addSynonyms: RequestHandler = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newWord = {
            text: req.body.text.trim(),
            synonym: req.body.synonym.trim(),
        };

        if (!newWord.text) {
            return res.status(400).json({ message: "You need to pass word." });
        }

        if (!newWord.synonym) {
            return res.status(400).json({ message: "You need to pass synonym." });
        }

        //The user should be able to ask for synonyms for a word and lookup should work in both directions.
        wordsUtils.addWordInRecord(newWord.text, newWord.synonym);
        wordsUtils.addWordInRecord(newWord.synonym, newWord.text);

        return res.status(201).json({ message: "Synonyms added", newSynonym: newWord });
    } catch (error) {
        throw error;
    }
};

export { getWordsWithSynonyms, addSynonyms, getWords, getSynonymsForWord, deleteSynonym, deleteWord };
