import { Router } from "express";
import {
    addSynonyms,
    deleteSynonym,
    deleteWord,
    getWordsWithSynonyms,
    getSynonymsForWord,
    getWords,
} from "../controllers/words";

const router: Router = Router();

router.get("/synonyms", getWordsWithSynonyms);

router.get("/words", getWords);

router.get("/synonyms/:word", getSynonymsForWord);

router.post("/add_synonyms", addSynonyms);

router.delete("/synonyms/:word/:synonym", deleteSynonym);

router.delete("/words/:word", deleteWord);

export default router;
