// test
import test from 'ava';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import {mount} from 'enzyme';
import toJson from 'enzyme-to-json';
import ResizeObserver from 'resize-observer-polyfill';

// src
import * as component from 'src/Measured';
import {KEY_NAMES, KEYS} from 'src/constants';

const Measured = component.default;

test('if getInitialState will get the correct initial state', (t) => {
  const result = component.getInitialState();

  t.deepEqual(
    result,
    KEY_NAMES.reduce((state, key) => {
      state[key] = null;

      return state;
    }, {})
  );
});

test('if componentWillMount will get the keys and set the render method', (t) => {
  const instance = {
    keys: [],
    props: {
      height: true
    },
    setRenderMethod: sinon.spy()
  };

  const componentWillMount = component.createComponentWillMount(instance);

  componentWillMount();

  t.deepEqual(
    instance.keys,
    KEYS.filter(({key}) => {
      return key === 'height';
    })
  );

  t.true(instance.setRenderMethod.calledOnce);
  t.true(instance.setRenderMethod.calledWith(instance.props));
});

test('if componentDidMount will set the element and resize observer', (t) => {
  const instance = {
    _isMounted: false,
    element: null,
    setResizeObserver: sinon.spy()
  };

  const findDOMNodeStub = sinon.stub(ReactDOM, 'findDOMNode').returnsArg(0);

  const componentDidMount = component.createComponentDidMount(instance);

  componentDidMount();

  t.true(instance._isMounted);

  t.true(findDOMNodeStub.calledOnce);
  t.true(findDOMNodeStub.calledWith(instance));

  findDOMNodeStub.restore();

  t.is(instance.element, instance);

  t.true(instance.setResizeObserver.calledOnce);
});

test('if componentWillReceiveProps will set the render method based on the props', (t) => {
  const instance = {
    setRenderMethod: sinon.spy()
  };

  const componentWillReceiveProps = component.createComponentWillReceiveProps(instance);

  const nextProps = {};

  componentWillReceiveProps(nextProps);

  t.true(instance.setRenderMethod.calledOnce);
  t.true(instance.setRenderMethod.calledWith(nextProps));
});

test.todo('setValues');

test('if componentDidUpdate will set the element and the resize observer if the element has changed', (t) => {
  const originalSetValuesViaDebounce = () => {};

  const instance = {
    element: null,
    keys: KEYS,
    props: {},
    resizeMethod: sinon.spy(),
    setResizeObserver: sinon.spy(),
    setValuesViaDebounce: originalSetValuesViaDebounce
  };

  const findDOMNodeStub = sinon.stub(ReactDOM, 'findDOMNode').returnsArg(0);

  const componentDidUpdate = component.createComponentDidUpdate(instance);

  const previousProps = {};

  componentDidUpdate(previousProps);

  t.true(findDOMNodeStub.calledOnce);
  t.true(findDOMNodeStub.calledWith(instance));

  findDOMNodeStub.restore();

  t.is(instance.element, instance);

  t.is(instance.setValuesViaDebounce, originalSetValuesViaDebounce);

  t.true(instance.setResizeObserver.calledOnce);

  t.true(instance.resizeMethod.calledOnce);
});

test('if componentDidUpdate will set the debounce method and the resize observer if the element has changed', (t) => {
  const originalSetValuesViaDebounce = () => {};

  const instance = {
    element: null,
    keys: KEYS,
    props: {
      debounce: 200
    },
    resizeMethod: sinon.spy(),
    setResizeObserver: sinon.spy(),
    setValuesViaDebounce: originalSetValuesViaDebounce
  };

  const findDOMNodeStub = sinon.stub(ReactDOM, 'findDOMNode').returns(null);

  const componentDidUpdate = component.createComponentDidUpdate(instance);

  const previousProps = {
    debounce: 50
  };

  componentDidUpdate(previousProps);

  t.true(findDOMNodeStub.calledOnce);
  t.true(findDOMNodeStub.calledWith(instance));

  findDOMNodeStub.restore();

  t.is(instance.element, null);

  t.not(instance.setValuesViaDebounce, originalSetValuesViaDebounce);

  t.true(instance.setResizeObserver.calledOnce);

  t.true(instance.resizeMethod.calledOnce);
});

test('if componentDidUpdate will call the resize method if keys have changed', (t) => {
  const originalSetValuesViaDebounce = () => {};

  const instance = {
    element: null,
    keys: KEYS,
    props: {
      height: true
    },
    resizeMethod: sinon.spy(),
    setResizeObserver: sinon.spy(),
    setValuesViaDebounce: originalSetValuesViaDebounce
  };

  const findDOMNodeStub = sinon.stub(ReactDOM, 'findDOMNode').returns(null);

  const componentDidUpdate = component.createComponentDidUpdate(instance);

  const previousProps = {};

  componentDidUpdate(previousProps);

  t.true(findDOMNodeStub.calledOnce);
  t.true(findDOMNodeStub.calledWith(instance));

  findDOMNodeStub.restore();

  t.is(instance.element, null);

  t.is(instance.setValuesViaDebounce, originalSetValuesViaDebounce);

  t.true(instance.setResizeObserver.notCalled);

  t.true(instance.resizeMethod.calledOnce);
});

test('if componentDidUpdate will do nothing if nothing has changed', (t) => {
  const originalSetValuesViaDebounce = () => {};

  const instance = {
    element: null,
    keys: KEYS,
    props: {},
    resizeMethod: sinon.spy(),
    setResizeObserver: sinon.spy(),
    setValuesViaDebounce: originalSetValuesViaDebounce
  };

  const findDOMNodeStub = sinon.stub(ReactDOM, 'findDOMNode').returns(null);

  const componentDidUpdate = component.createComponentDidUpdate(instance);

  const previousProps = {};

  componentDidUpdate(previousProps);

  t.true(findDOMNodeStub.calledOnce);
  t.true(findDOMNodeStub.calledWith(instance));

  findDOMNodeStub.restore();

  t.is(instance.element, null);

  t.is(instance.setValuesViaDebounce, originalSetValuesViaDebounce);

  t.true(instance.setResizeObserver.notCalled);

  t.true(instance.resizeMethod.notCalled);
});

test('if componentWillUnmount will disconnect the observer and reset the instance properties', (t) => {
  const instance = {
    _isMounted: true,
    disconnectObserver: sinon.spy(),
    element: document.createElement('div'),
    keys: KEYS,
    resizeMethod() {}
  };

  const componentWillUnmount = component.createComponentWillUnmount(instance);

  componentWillUnmount();

  t.false(instance._isMounted);
  t.true(instance.disconnectObserver.calledOnce);
  t.is(instance.element, null);
  t.deepEqual(instance.keys, []);
  t.is(instance.resizeMethod, null);
});

test('if connectObserver will assign the resize observer and connect it to the element', (t) => {
  const instance = {
    element: document.createElement('div'),
    props: {
      renderOnResize: true
    },
    resizeMethod() {},
    resizeObserver: null
  };

  const connectObserver = component.createConnectObserver(instance);

  connectObserver();

  t.deepEqual(instance.resizeObserver, new ResizeObserver(instance.resizeMethod));
});

test.todo('disconnectObserver');

test.todo('getPassedValues');

test.todo('setRef');

test.todo('setRenderMethod');

test.todo('setResizeObserver');

test('if Measured renders correctly with default props', (t) => {
  const props = {
    height: true
  };

  const wrapper = mount(
    <Measured {...props}>
      {() => {
        return <div>Child</div>;
      }}
    </Measured>
  );

  t.snapshot(toJson(wrapper));
});
