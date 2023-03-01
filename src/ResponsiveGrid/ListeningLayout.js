import React from "react";

export default function makeLayout(Layout) {
  
  const minW = 4, maxW = 100, minH = 4, maxH = 100;
  // Basic layout that mirrors the internals of its child layout by listening to `onLayoutChange`.
  // It does not pass any other props to the Layout.
  class ListeningLayout extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        layout: [],
        parent: this.props.parent,
      };
    }
    
    componentDidMount() {
      this.props.service.tab(this.state.parent.rowId).then(c =>
      {
        this.setState({ layout: c.map(function(item) {
          return {
            ...item,
            minW,
            maxW,
            minH,
            maxH,
            i: item.rowId.toString(),
          };
        })});
      });
    }

    onAdd = component => {
      component.iTechDataWebTabRowId = this.state.parent.rowId;
      this.props.service.add(component).then(c => {
        let layout = [...this.state.layout];
        layout.concat(c);
        this.setState({ layout: layout });
      })
    };

    onChange = layout => {
      if(layout.length === 0) return;

      layout.forEach(el => {
        el.rowId = el.rowId ? el.rowId : el.i;
      });

      this.props.service.update(layout).then(c => {
        this.setState({ layout: layout });
      })
    };

    render() {
      return (
        <>
          <Layout onAdd={this.onAdd} onLayoutChange={this.onChange} layout={this.state.layout} />
        </>
      );
    }
  }

  return ListeningLayout;
}