import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';

import measure from '../src/index';

const DIV_STYLES = {
  border: '10px solid black',
  height: 100,
  marginBottom: 15,
  padding: 20
};

const SECTION_STYLES = {
  height: 100,
  overflow: 'auto',
  marginBottom: 15
};

const IMG_STYLES = {
  height: 324,
  width: 719
};

const options = {
  renderOnResize: false,
  positionProp: 'foo',
  sizeProp: 'bar'
};

@measure(options)
class Div extends Component {
  render() {
    const {
      children
    } = this.props;

    console.group('Div');
    console.log('div position', this.props.position);
    console.log('div foo', this.props.foo);
    console.log('div size', this.props.size);
    console.log('div bar', this.props.bar);
    console.groupEnd();

    return (
      <div style={DIV_STYLES}>
        {children}
      </div>
    );
  }
}

@measure('size')
class Section extends Component {
  render() {
    const {
      children
    } = this.props;

    console.group('Section');
    console.log('section position', this.props.position);
    console.log('section size', this.props.size);
    console.groupEnd();

    return (
      <section style={SECTION_STYLES}>
        {children}
      </section>
    );
  }
}

@measure('height')
class Main extends Component {
  render() {
    const {
      children
    } = this.props;

    console.group('Main');
    console.log('main position', this.props.position);
    console.log('main size', this.props.size);
    console.groupEnd();

    return (
      <main>
        {children}
      </main>
    );
  }
}

const meatureNaturalDimensions = measure(['naturalHeight', 'naturalWidth']);

const Img = meatureNaturalDimensions(({position, size}) => {
  console.group('Img');
  console.log('img position', position);
  console.log('img size', size);
  console.groupEnd();

  return (
    <img
      src="https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150"
      style={IMG_STYLES}
    />
  );
});

const measureWithSpecificKeys = measure(['left', 'offsetLeft']);

const App = measureWithSpecificKeys(({position, size}) => {
  console.group('App');
  console.log('app position', position);
  console.log('app size', size);
  console.groupEnd();

  return (
    <div>
      <Div>
        I am a DIV with stuff
      </Div>

      <Section>
        I am a SECTION that is scrollable with...

        <p>
          Lots
        </p>
        <p>
          of
        </p>
        <p>
          stuff
        </p>
        <p>
          Lots
        </p>
        <p>
          of
        </p>
        <p>
          stuff
        </p>
        <p>
          Lots
        </p>
        <p>
          of
        </p>
        <p>
          stuff
        </p>
        <p>
          Lots
        </p>
        <p>
          of
        </p>
        <p>
          stuff
        </p>
      </Section>

      <Main>
        Hello!
      </Main>

      <Img/>
    </div>
  );
});

const div = document.createElement('div');

div.id = 'app-container';

render((
  <App/>
), div);

document.body.appendChild(div);
