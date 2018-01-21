import React, {Component, PureComponent} from 'react';

import {measure} from '../src';

@measure
class NoParams extends PureComponent {
  render() {
    const {children, ...measurements} = this.props;

    console.group('no params');
    console.log('measurements in props', measurements);
    console.groupEnd();

    return <div>{children}</div>;
  }
}

@measure.width({debounce: 200})
class WidthOnly extends PureComponent {
  render() {
    const {children, ...measurements} = this.props;

    console.group('width only');
    console.log('measurements in props', measurements);
    console.groupEnd();

    return <div>{children}</div>;
  }
}

@measure(['bottom', 'left', 'right', 'top'], {namespace: 'position'})
class PositionOnly extends PureComponent {
  render() {
    const {children, position} = this.props;

    console.group('position only');
    console.log('position', position);
    console.groupEnd();

    return <div>{children}</div>;
  }
}

@measure(['height', 'width', 'top', 'left'], {namespace: 'measurements'})
class SpecificProperties extends PureComponent {
  render() {
    const {children, measurements} = this.props;

    console.group('specific properties with namespace');
    console.log('measurements', measurements);
    console.groupEnd();

    return <div>{children}</div>;
  }
}

@measure({namespace: 'foo'})
class CustomCategories extends PureComponent {
  render() {
    const {children, foo} = this.props;

    console.group('custom namespace');
    console.log('foo', foo);
    console.groupEnd();

    return <div>{children}</div>;
  }
}

@measure({namespace: 'foo', inheritedMethods: ['getFoo']})
class InheritedMethods extends PureComponent {
  getFoo() {
    return this.props.foo;
  }

  render() {
    const {children, foo} = this.props;

    console.group('custom namespace with inherited methods');
    console.log('foo', foo);
    console.groupEnd();

    return <div>{children}</div>;
  }
}

@measure(['height', 'width', 'top', 'left'], {namespace: 'foo'})
class CustomCategoriesWithSpecificProperties extends PureComponent {
  render() {
    const {bar, children, foo} = this.props;

    console.group('custom namespace with specific properties');
    console.log('foo', foo);
    console.groupEnd();

    return <div>{children}</div>;
  }
}

const StatelessComponent = measure({namespace: 'measurements'})(({children, measurements}) => {
  console.group('stateless component');
  console.log('measurements', measurements);
  console.groupEnd();

  return <div>{children}</div>;
});

const ConditionalComponent = measure({namespace: 'measurements'})(({children, isShown, measurements}) => {
  console.group('conditional component');
  console.log('measurements', measurements);
  console.groupEnd();

  if (!isShown) {
    return null;
  }

  return <div>{children}</div>;
});

const FlatComponent = measure(['height', 'width'])((props) => {
  console.group('height and width');
  console.log(props);
  console.groupEnd();

  return <div>width: {props.width}</div>;
});

class App extends Component {
  state = {
    isConditionalElementShown: true
  };

  componentDidMount() {
    // console.log('--------- GETTING FOO ------------');
    // console.log(this.inheritedRef.getFoo());
  }

  onClickToggleConditionalElement = () => {
    const {isConditionalElementShown} = this.state;

    this.setState({
      isConditionalElementShown: !isConditionalElementShown
    });
  };

  setInheritedRef = (component) => {
    this.inheritedRef = component;
  };

  render() {
    const {isConditionalElementShown} = this.state;

    return (
      <div>
        <h1>App</h1>

        <NoParams>I don't have any parameters passed to the decorators.</NoParams>

        <PositionOnly>I only have the position property.</PositionOnly>

        <WidthOnly>I only have the width property, and will not rerender on resize.</WidthOnly>

        <SpecificProperties>
          I only have the height and width properties in size, and top and left properties in position.
        </SpecificProperties>

        <CustomCategories>I have custom position property (foo) and size property (bar).</CustomCategories>

        <InheritedMethods ref={this.setInheritedRef}>
          I have an instance method (getFoo) that is inherited by the HOC.
        </InheritedMethods>

        <CustomCategoriesWithSpecificProperties>
          I only have the height and width properties in size (under the prop bar), and top and left properties in
          position (under the prop foo).
        </CustomCategoriesWithSpecificProperties>

        <StatelessComponent>I am a stateless component with the same props available.</StatelessComponent>

        <div>
          <button
            onClick={this.onClickToggleConditionalElement}
            type="button"
          >
            Toggle conditional element
          </button>
        </div>

        <ConditionalComponent isShown={isConditionalElementShown}>
          I am a measured element that is shown conditionally.
        </ConditionalComponent>

        {isConditionalElementShown && (
          <StatelessComponent>I am a stateless component that will be mounted and unmounted.</StatelessComponent>
        )}

        <FlatComponent />
      </div>
    );
  }
}

export default App;
