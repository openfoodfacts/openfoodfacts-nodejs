import {Brand, Taxonomy} from "../../taxonomy/types";
import {getTaxo} from "../../taxonomy/api";


export class Brands {
    private readonly fetch;
    private readonly getTaxoEntry;

    constructor(fetch, getTaxoEntry) {
        this.fetch = fetch;
        this.getTaxoEntry = getTaxoEntry;
    }

    async getBrands (): Promise<Taxonomy<Brand>> {
        return await getTaxo('brands', this.fetch)
    }

    async getBrand (brandName: string): Promise<Object> {
        return await this.getTaxoEntry('brands', brandName)
    }
}