import { Log4Cup, Helper } from './log4cup'

describe('helper test', () => {

  it('Min call', () => {
    let w_cards = [
      ['ab', 2],
      ['fs', 1],
      ['rs', 4],
      ['rc', 12]
    ];
    let min_item = Helper.MinOnWeightItem1(w_cards);
    expect(min_item[0]).toBe('fs');
  });

});