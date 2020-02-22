import React from 'react';
import PropTypes from 'prop-types';

export default class ExampleReactComponent extends React.Component {
  static propTypes = {
    data: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string
    })
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps.user && this.props.user) {
      return nextProps.user.name !== this.props.user.name;
    }
    return false;
  }

  render() {
    const data = JSON.parse(this.props.data);
    const {user} = data;

    return (
      <h2 id="example-react" className="example-react">
        { `COMPONENT : ${user.name}` }
      </h2>
    );
  }
}
