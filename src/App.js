import './App.css';
import OpenSeaDragonMain from './componenets/openseadragonMain';


function App() {

return (
  <div className="app">

      <OpenSeaDragonMain
        image="https://kaapimachines.com/wp-content/uploads/2019/08/espresso-shot-and-coffee-beans-2021-08-27-19-35-18-utc.webp"
        id='ocd-viewer'
        type='legacy-image-pyramid'
        />
  </div>
);
}

export default App;
