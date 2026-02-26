// export default App;
import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout";
//import Download from "./components/DownloadAadhaarSuccess"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    {/*<Download/>*/}
       <Layout /> 
    </BrowserRouter>
  );
}

export default App;
