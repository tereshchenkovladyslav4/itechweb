import React, { Component, ErrorInfo, ReactNode } from "react";
import withStore from "./_context/withStore";
import SystemError from "./_components/Error/SystemError";
import { showErrorDialogAction } from "./_context/actions/HandleErrorActions";
import { StoreContextState } from "./_context/types/StoreContextState";

interface IErrorBoundaryProps {
  children: ReactNode;
  dispatch: React.Dispatch<any>;
  state: StoreContextState;
}

class ErrorBoundary extends Component<IErrorBoundaryProps> {
  state={
    isError:false,
  };

  static getDerivedStateFromError(error: Error) {
    return { isError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.dispatch(showErrorDialogAction(undefined, error, errorInfo));
    console.log(error);
  }

  render() {
    const showDialog = this.state.isError && this.props.state.errorData?.showDialog;
    if (showDialog) {
      return <SystemError />; 
    }
    return this.props.children;
  }
}

export default withStore(ErrorBoundary);
