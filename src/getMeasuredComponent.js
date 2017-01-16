// external dependencies
import React, {
  Component
} from 'react';

// utils
import {
  createComponentDidMount,
  createComponentDidUpdate,
  createGetDOMElement,
  createGetScopedValues,
  createUpdateValuesIfChanged,
  getKeysWithSourceAndType,
  reduceStateToMatchingKeys
} from './utils';

const getMeasuredComponent = (keys, options) => {
  const selectedKeys = getKeysWithSourceAndType(keys, options);

  return (PassedComponent) => {
    class MeasuredComponent extends Component {
      state = {
        ...reduceStateToMatchingKeys(selectedKeys)
      };

      // lifecycle methods
      componentDidMount = createComponentDidMount(this, options);
      componentDidUpdate = createComponentDidUpdate(this, selectedKeys, options);

      // instance variables
      element = null;
      hasResize = false;

      // instance methods
      getDOMElement = createGetDOMElement(this);
      getScopedValues = createGetScopedValues();
      updateValuesIfChanged = createUpdateValuesIfChanged(this, selectedKeys);

      render() {
        const values = this.getScopedValues(selectedKeys, this.state, options);

        return (
          <PassedComponent
            {...this.props}
            {...values}
          />
        );
      }
    }

    return MeasuredComponent;
  };
};

export default getMeasuredComponent;
