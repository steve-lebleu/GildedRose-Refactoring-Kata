export enum ProductName {
  AGED_BRIE = 'Aged Brie',
  SULFURAS = 'Sulfuras, Hand of Ragnaros',
  BACKSTAGE_PASS = 'Backstage passes to a TAFKAL80ETC concert',
  CONJURED = 'Conjured',
}

const MIN_QUALITY = 0;
const MAX_QUALITY = 50;

const BACKSTAGE_PASS_TIER_2_THRESHOLD = 10;
const BACKSTAGE_PASS_TIER_3_THRESHOLD = 5;

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

interface UpdateStrategy {
  canHandle(item: Item): boolean;
  update(item: Item): void;
}

class SulfurasUpdate implements UpdateStrategy {
  canHandle(item: Item): boolean {
    return item.name === ProductName.SULFURAS;
  }

  update(_item: Item): void {}
}

class AgedBrieUpdate implements UpdateStrategy {
  canHandle(item: Item): boolean {
    return item.name === ProductName.AGED_BRIE;
  }

  update(item: Item): void {
    if (item.quality < MAX_QUALITY) item.quality++;
    item.sellIn--;
    if (item.sellIn < 0 && item.quality < MAX_QUALITY) item.quality++;
  }
}

class BackstagePassUpdate implements UpdateStrategy {
  canHandle(item: Item): boolean {
    return item.name === ProductName.BACKSTAGE_PASS;
  }

  update(item: Item): void {
    if (item.quality < MAX_QUALITY) item.quality++;
    if (item.sellIn <= BACKSTAGE_PASS_TIER_2_THRESHOLD && item.quality < MAX_QUALITY) item.quality++;
    if (item.sellIn <= BACKSTAGE_PASS_TIER_3_THRESHOLD && item.quality < MAX_QUALITY) item.quality++;
    item.sellIn--;
    if (item.sellIn < 0) item.quality = MIN_QUALITY;
  }
}

class ConjuredUpdate implements UpdateStrategy {
  canHandle(item: Item): boolean {
    return item.name.startsWith(ProductName.CONJURED);
  }

  update(item: Item): void {
    item.sellIn--;
    const decrease = item.sellIn < 0 ? 4 : 2;
    item.quality = Math.max(MIN_QUALITY, item.quality - decrease);
  }
}

class DefaultUpdate implements UpdateStrategy {
  canHandle(_item: Item): boolean {
    return true;
  }

  update(item: Item): void {
    if (item.quality > MIN_QUALITY) item.quality--;
    item.sellIn--;
    if (item.sellIn < 0 && item.quality > MIN_QUALITY) item.quality--;
  }
}

export class GildedRose {
  items: Array<Item>;

  private strategies: UpdateStrategy[] = [
    new SulfurasUpdate(),
    new AgedBrieUpdate(),
    new BackstagePassUpdate(),
    new ConjuredUpdate(),
    new DefaultUpdate(),
  ];

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      this.strategies.find((strategy: UpdateStrategy) => strategy.canHandle(item))!.update(item);
    }

    return this.items;
  }
}
