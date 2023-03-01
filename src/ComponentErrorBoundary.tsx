import React, { Component, ErrorInfo, ReactNode } from "react";
import withStore from "./_context/withStore";
import SystemError from "./_components/Error/SystemError";
import { showErrorDialogAction } from "./_context/actions/HandleErrorActions";
import { StoreContextState } from "./_context/types/StoreContextState";
import ComponentError from "./_helpers/ComponentError";
import ErrorDetails from "./_components/ErrorDetails";

interface IComponentErrorBoundaryProps {
  rowId?: number;
  onRemove?(rowId: number): Promise<void>;
  componentName?: string;
  children: ReactNode;
  dispatch: React.Dispatch<any>;
  state: StoreContextState;
}

class ComponentErrorBoundary extends Component<IComponentErrorBoundaryProps> {
  state = {
    rowId: undefined,
    error: Error(),
    hasError: false,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  // Only goes through here where its an error in component constructor / render etc.. i.e not async or eventhandler
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo, rowId: this.props.rowId });
    let name = undefined;
    if (error instanceof ComponentError) {
      name = error.componentName;
    }
    this.props.dispatch(showErrorDialogAction(name || this.props.componentName, error, errorInfo));
}

  
  render() {
    const showDialog = this.state.hasError && this.props.state.errorData?.showDialog;

    if (this.state.hasError) {
      let showRemove = true;
      // dont show remove option if a fixed tab
      const currentMenu = this.props.state.menuList.find(m => m.selected);
      if(currentMenu){
        const currentTab = currentMenu.iTechDataWebTabs.find(t => t.selected);
        if(currentTab){
          showRemove = !currentTab.fixed;
        }
      }
      const onRemove = showRemove ? this.props.onRemove : undefined;
      const rowId = this.props.rowId;

      const doOnRemove = () => showRemove && onRemove && rowId ?  () => onRemove(rowId) : undefined;

      return (
        <>
          {showDialog && <SystemError componentId={this.props.rowId} onRemove={onRemove} />}
          <ErrorDetails error={this.state.error} onRemove={doOnRemove()} onClear={() => this.setState({ hasError: false })} />
        </>
      )
    }
    return this.props.children;
  }
}

export default withStore(ComponentErrorBoundary);
