import {Label, Taxonomy} from "../../taxonomy/types";
import { getTaxo } from "../../taxonomy/api";

export class Labels {
    private readonly fetch;

    constructor(fetch) {
        this.fetch = fetch;
    }

    async getLabels (): Promise<Taxonomy<Label>> {
        return await getTaxo('labels', this.fetch)
    }
}