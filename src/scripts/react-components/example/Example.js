module.exports = class ExampleReactComponent extends React.Component {
  render() {
    const data = JSON.parse(this.props.data);
    const {name} = data;
    
    return (
      <h2 id="example-react" className="example-react">
        { `COMPONENT : ${name}` }
      </h2>
    );
  }
}
