export default interface FrontendError {
  date: string;
  path: string;
  component: string;
  error: string;
  errorInfo: string;
  stack: string;
}
