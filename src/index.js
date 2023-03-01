import React from "react";
import App from "./App";
import "./index.css";
import { StoreProvider } from "./_context/Store";
import "typeface-source-code-pro";
import "./fonts/HelveticaNeueLTPro-Th.otf";
//import registerServiceWorker from './registerServiceWorker';
import { createRoot } from 'react-dom/client';
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
import "fontsource-roboto";

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
<StoreProvider>
  <App />
</StoreProvider>
);


//registerServiceWorker();
