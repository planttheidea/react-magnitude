// external dependencies
import PropTypes from 'prop-types';
import React, {Component, PureComponent} from 'react';

// classes
import Measured from './Measured';

// constants
import {KEY_NAMES} from './constants';

// utils
import {getComponentName, getMeasureKeys, setInheritedMethods} from './utils';

export const createSetOriginalRef = (instance) => {
  /**
   * @private
   *
   * @function setOriginalRef
   *
   * @description
   * set the reference to the original component instance to the instance of the HOC
   *
   * @param {HTMLElement|ReactComponent} component the component instance to assign
   */
  return (component) => {
    instance.originalComponent = component;
  };
};

/**
 * @private
 *
 * @function getMeasuredComponent
 *
 * @description
 * get a higher-order component that renders the component passed, injecting the measurements in as props
 *
 * @param {Array<string>} keys the keys to listen for changes to
 * @param {Object} options the options passed
 * @returns {function(ReactComponent): ReactComponent} the decorator that receives the component
 */
export const getMeasuredComponent = (keys, options) => {
  const {
    children: childrenOptionIgnored,
    inheritedMethods = [],
    render: renderOptionIgnored,
    ...restOfOptions
  } = options;

  return (RenderedComponent) => {
    const componentPrototype = Object.getPrototypeOf(RenderedComponent);
    const shouldApplyRef = componentPrototype === Component || componentPrototype === PureComponent;

    const RenderMethod = ({_measureChildren, ...props}) => {
      return (
        /* eslint-disable prettier */
        <RenderedComponent
          children={_measureChildren}
          {...props}
        />
        /* eslint-enable */
      );
    };

    RenderMethod.propTypes = {
      _measureChildren: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
    };

    return class MeasuredComponent extends Component {
      static displayName = `Measured(${getComponentName(RenderedComponent)})`;

      static propTypes = {
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
        render: PropTypes.func
      };

      constructor(props) {
        super(props);

        if (inheritedMethods.length) {
          setInheritedMethods(this, inheritedMethods);
        }
      }

      // instance values
      originalComponent = null;

      // instance methods
      setOriginalRef = createSetOriginalRef(this);

      render() {
        const {children, render: renderIgnored, ...props} = this.props;

        return (
          /* eslint-disable prettier */
          <Measured
            {...props}
            {...restOfOptions}
            _measureChildren={children}
            component={RenderMethod} // eslint-disable-line react/jsx-no-bind
            keys={keys}
            ref={shouldApplyRef ? this.setOriginalRef : null}
          />
          /* eslint-enable */
        );
      }
    };
  };
};

/**
 * @private
 *
 * @function measure
 *
 * @description
 * based on the keys and options passed, get the measured HOC
 *
 * @param {Array<string>|function|Object|string} passedKeys the keys to listen to, or options, or the component itself
 * @param {Object} [passedOptions={}] the options when creating the measured component
 * @returns {function} the HOC that will render the component passed with measurements injected
 */
const measure = (passedKeys, passedOptions = {}) => {
  return typeof passedKeys === 'function'
    ? getMeasuredComponent(KEY_NAMES, passedOptions)(passedKeys)
    : getMeasuredComponent(
      getMeasureKeys(passedKeys),
      passedKeys && passedKeys.constructor === Object ? passedKeys : passedOptions
    );
};

KEY_NAMES.forEach((key) => {
  measure[key] = (options) => {
    return measure([key], options);
  };
});

export {measure};
