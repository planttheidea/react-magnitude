import test from 'ava';

import _ from 'lodash';

import {
  createIsKeyType,
  getKeyType,
  getKeysSubsetWithType,
  getNaturalDimensionValue,
  getRequestAnimationFrame,
  getScopedValues,
  getValidKeys,
  haveValuesChanged,
  isElementVoidTag,
  isPositionKey,
  isSizeKey,
  reduceStateToMatchingKeys
} from '../src/utils';

import {
  ALL_POSITION_KEYS,
  ALL_SIZE_KEYS
} from '../src/constants';

const sleep = (ms = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

test('if createIsKeyType creates a function', (t) => {
  const result = createIsKeyType(['foo']);

  t.true(_.isFunction(result));
});

test.todo('getKeyType');
test.todo('getKeysSubsetWithType');

test('if getNaturalDimensionValue gets the correct value based on key', (t) => {
  const objectWithoutNaturalValue = {
    scrollHeight: 200
  };
  const objectWithNaturalValue = {
    ...objectWithoutNaturalValue,
    naturalHeight: 100
  };

  t.is(getNaturalDimensionValue(objectWithoutNaturalValue, 'naturalHeight'), objectWithNaturalValue.scrollHeight);
  t.is(getNaturalDimensionValue(objectWithNaturalValue, 'naturalHeight'), objectWithNaturalValue.naturalHeight);
});

test('if getRequestAnimationFrame gets requestAnimationFrame from the global object', async (t) => {
  const result = getRequestAnimationFrame();

  t.true(_.isFunction(result));

  let hasRun = false;

  result(() => {
    hasRun = true;
  });

  t.false(hasRun);

  await sleep(1000 / 60);

  t.true(hasRun);
});

test('if getScopedValues returns an object with size or position or both with the correct values', (t) => {
  const sizeKeys = [
    {
      key: 'height',
      source: 'clientRect',
      type: 'size'
    }, {
      key: 'offsetHeight',
      source: 'element',
      type: 'size'
    }
  ];
  const positionKeys = [
    {
      key: 'left',
      source: 'clientRect',
      type: 'position'
    }, {
      key: 'offsetLeft',
      source: 'clientRect',
      type: 'position'
    }];
  const allKeys = [
    ...sizeKeys,
    ...positionKeys
  ];
  const currentState = {
    height: 100,
    left: 50,
    offsetHeight: 90,
    offsetLeft: 10
  };
  const sizeResult = {
    size: {
      height: 100,
      offsetHeight: 90
    }
  };
  const positionResult = {
    position: {
      left: 50,
      offsetLeft: 10
    }
  };
  const allResult = {
    ...sizeResult,
    ...positionResult
  };

  const sizeValues = getScopedValues(sizeKeys, currentState, false);
  const positionValues = getScopedValues(positionKeys, currentState, false);
  const allValues = getScopedValues(allKeys, currentState, false);

  t.deepEqual(sizeValues, sizeResult);
  t.deepEqual(positionValues, positionResult);
  t.deepEqual(allValues, allResult);
});

test('if getValidKeys correctly limits the keys returned', (t) => {
  const keys = ['foo', 'bar', 'baz'];
  const keysToTestAgainst = ['foo', 'baz', 'blah', 'dee'];
  const validKeys = getValidKeys(keys, keysToTestAgainst);

  t.deepEqual(validKeys, ['foo', 'baz']);
});

test('if haveValuesChanged checks for changes between the two objects', (t) => {
  const keys = [{
    key: 'foo'
  }];
  const values = {
    foo: 'bar'
  };
  const sameValues = {
    foo: 'bar'
  };
  const changedValues = {
    foo: 'baz'
  };

  t.false(haveValuesChanged(keys, values, sameValues));
  t.true(haveValuesChanged(keys, values, changedValues));
});

test.todo('isElementVoidTag');

test('if isPositionKey determines if the key is a position property', (t) => {
  ALL_POSITION_KEYS.forEach((key) => {
    t.true(isPositionKey(key));
  });

  ALL_SIZE_KEYS.forEach((key) => {
    t.false(isPositionKey(key));
  });
});

test('if isSizeKey determines if the key is a size property', (t) => {
  ALL_POSITION_KEYS.forEach((key) => {
    t.false(isSizeKey(key));
  });

  ALL_SIZE_KEYS.forEach((key) => {
    t.true(isSizeKey(key));
  });
});
test.todo('reduceStateToMatchingKeys');
