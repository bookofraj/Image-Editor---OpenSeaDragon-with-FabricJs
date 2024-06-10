import './App.css';
import OpenSeaDragonMain from './componenets/openseadragonMain';


function App() {
  const type = "legacy-image-pyramid";
  let titledSourceArr = [
    {
      type: type,
      levels: [{
        url: 'https://www.pathologyoutlines.com/imgau/imagehowtogonzalez07.jpg',
        width: 2592,
        height: 1944
      }]
    },
    { 
      type: type,
      levels: [{
        url: 'https://www.pathologyoutlines.com/imgau/imagehowtogonzalez01.jpg',
        width: 2560,
        height: 1920
      }]
    },{
      type: type,
      levels: [{
        url: 'https://www.pathologyoutlines.com/imgau/peritoneummesotheliomamubeen12.jpg',
        width: 3395,
        height: 2603
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
