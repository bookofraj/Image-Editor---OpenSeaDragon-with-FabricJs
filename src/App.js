import './App.css';
import OpenSeaDragonMain from './componenets/openseadragonMain';


function App() {
  const type = "legacy-image-pyramid";
  let titledSourceArr = [
    {
      type: type,
      levels: [{
        url: 'https://images.pexels.com/photos/5361284/pexels-photo-5361284.jpeg',
        width: 6178,
        height: 4943
      }]
    },
    { 
      type: type,
      levels: [{
        url: "https://kaapimachines.com/wp-content/uploads/2019/08/espresso-shot-and-coffee-beans-2021-08-27-19-35-18-utc.webp",
        width: 800,
        height: 490
      }]
    },{
      type: type,
      levels: [{
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Fronalpstock_big.jpg/2560px-Fronalpstock_big.jpg",
        width: 2560,
        height: 1150
      }]
    }
  ];

return (
  <div className="app">
      <OpenSeaDragonMain
        titledSourceArr = {titledSourceArr}
        image="https://kaapimachines.com/wp-content/uploads/2019/08/espresso-shot-and-coffee-beans-2021-08-27-19-35-18-utc.webp"
        id='ocd-viewer'
        type='legacy-image-pyramid'
        // navigator='true'
        />
  </div>
);
}

export default App;
