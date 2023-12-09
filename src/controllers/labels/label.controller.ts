import {Language, Taxonomy} from "../../taxonomy/types";
import { getTaxo, getTaxoEntry } from "../../taxonomy/api";

export class Languages {
    private readonly fetch;

    constructor(fetch) {
        this.fetch = fetch;
    }

    async getLanguages (): Promise<Taxonomy<Language>> {
        return await getTaxo('languages', this.fetch)
    }

    async getLanguage (languageName: string): Promise<Language> {
        return await getTaxoEntry('languages', languageName)
    }
}