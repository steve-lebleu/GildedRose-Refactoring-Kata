import { describe, it, expect } from 'vitest';
import { Item, GildedRose, ProductName } from '@/gilded-rose';

describe('Gilded Rose - Characterization tests to don\'t burn the house on fire', () => {
  describe('Default items', () => {
    it.each([
      ['should decrease quality and sellIn by 1 each day',          10, 20, 9, 19],
      ['should decrease quality twice as fast after the sell date', 0, 20, -1, 18],
      ['should never decrease quality below 0',                     5, 0, 4, 0],
      ['should never decrease quality below 0 when expired',        0,  0, -1,  0],
    ])('%s', (_desc, sellIn, quality, expectedSellIn, expectedQuality) => {
      const item = new Item('Default Item', sellIn, quality);
      const gildedRose = new GildedRose([item]);

      gildedRose.updateQuality();
  
      expect(item.sellIn).toBe(expectedSellIn);
      expect(item.quality).toBe(expectedQuality);
    });
  });

  describe(ProductName.AGED_BRIE, () => {
    it.each([
      ['should increase quality by 1 normally',       10, 20, 9, 21],
      ['should not exceed 50 quality',                10, 49, 9, 50],
      ['should stay at 50 when already at cap',       10, 50, 9, 50],
      ['should increase quality by 2 when expired',   0, 20, -1, 22],
      ['should not exceed 50 when expired',           -1, 49, -2, 50],
    ])('%s', (_desc, sellIn, quality, expectedSellIn, expectedQuality) => {
      const item = new Item(ProductName.AGED_BRIE, sellIn, quality);
      new GildedRose([item]).updateQuality();

      expect(item.quality).toBe(expectedQuality);
      expect(item.sellIn).toBe(expectedSellIn);
    });
  });

  describe(ProductName.BACKSTAGE_PASS, () => {
    it.each([
      ['should increase by 1 when there are more than 10 days left',     15, 20, 14, 21],
      ['should increase by 1 when there are exactly 11 days left',       11, 20, 10, 21],
      ['should increase by 2 when there are between 6 and 10 days left', 10, 20, 9, 22],
      ['should not exceed 50 with 10 days left',                         10, 49, 9, 50],
      ['should increase by 2 when there are exactly 6 days left',         6, 20, 5, 22],
      ['should not exceed 50 with 6 days left',                           6, 49, 5, 50],
      ['should increase by 3 when there are between 1 and 5 days left',   5, 20, 4, 23],
      ['should not exceed 50 with 5 days left',                           5, 48, 4, 50],
      ['should drop to 0 after the concert',                              0, 20, -1,  0],
    ])('%s', (_desc, sellIn, quality, expectedSellIn, expectedQuality) => {
      const item = new Item(ProductName.BACKSTAGE_PASS, sellIn, quality);
      new GildedRose([item]).updateQuality();

      expect(item.quality).toBe(expectedQuality);
      expect(item.sellIn).toBe(expectedSellIn);
    });
  });

  describe(ProductName.SULFURAS, () => {
    it('should never change quality or sellIn', () => {
      const item = new Item(ProductName.SULFURAS, 10, 80);
      const gildedRose = new GildedRose([item]);

      gildedRose.updateQuality();

      expect(item.sellIn).toBe(10);
      expect(item.quality).toBe(80);
    });
  });

  describe(ProductName.CONJURED, () => {
    it.each([
      ['should decrease quality by 2 normally',               10, 20, 9, 18],
      ['should decrease quality by 4 when expired',           0, 20, -1, 16],
      ['should never decrease quality below 0',               5, 0, 4, 0],
      ['should never decrease quality below 0 when expired',  0,  0, -1,  0],
    ])('%s', (_desc, sellIn, quality, expectedSellIn, expectedQuality) => {
      const item = new Item(ProductName.CONJURED, sellIn, quality);
      new GildedRose([item]).updateQuality();

      expect(item.quality).toBe(expectedQuality);
      expect(item.sellIn).toBe(expectedSellIn);
    });
  });
});