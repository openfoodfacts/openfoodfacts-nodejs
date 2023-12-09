import { Robotoff } from './robotoff'
import { Additives, Brands, Labels, Languages, Categories, Countries, Ingredients, Products, Packagings, States, Stores } from './controllers'

import { OffOptions } from './taxonomy/types'

export * as TaxoTypes from './taxonomy/types'
export * as Types from './types'

/** Wrapper of OFF API */
export class OpenFoodFacts {
  private readonly baseUrl: string
  readonly robotoff: Robotoff

  readonly additives: Additives
  readonly brands: Brands
  readonly categories: Categories
  readonly countries: Countries
  readonly ingredients: Ingredients
  readonly labels: Labels
  readonly languages: Languages
  readonly packagings: Packagings
  readonly products: Products
  readonly states: States
  readonly stores: Stores

  /**
   * Create OFF object
   * @param options - Options for the OFF Object
   */
  constructor (
    options: OffOptions
  ) {
    this.baseUrl = `https://${options?.country ?? 'world'}.openfoodfacts.org`
    this.robotoff = new Robotoff('https://robotoff.openfoodfacts.org')

    this.additives = new Additives()
    this.brands = new Brands(this.baseUrl)
    this.categories = new Categories()
    this.countries = new Countries()
    this.ingredients = new Ingredients()
    this.labels = new Labels()
    this.languages = new Languages(this.baseUrl)
    this.packagings = new Packagings()
    this.products = new Products(this.baseUrl)
    this.states = new States()
    this.stores = new Stores()
  }
}
