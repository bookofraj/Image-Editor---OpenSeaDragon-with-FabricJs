import { useCallback, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import OpenSeaDragon from 'openseadragon';
import { initOSDFabricJS } from 'openseadragon-fabric';
import { fabric } from 'fabric';


function OpenSeaDragonMain(props) {

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            var img = document.createElement('img')
            img.addEventListener('load', function () { resolve(img) })
            img.addEventListener('error', function (err) { reject(404) })
            img.src = src;
            console.log("checkpoint2 src: ", src);
        });
    }

    let viewer = null;
    let toggleDraw = false;
    let fabricOverlay;

    const initSeadragon = useCallback(() => {
        console.log("props: ", props);
        let { id, image, type } = props;
        console.log("checkpoint1 id: ", id, ", image: ", image, ", type: ", type);
        loadImage(image).then(data => {
            console.log("checkpoint3 data: ", data, data.naturalHeight, data.naturalWidth);
            viewer = OpenSeaDragon({
                id: id,
                visibilityRatio: 1.0,
                constrainDuringPan: false,
                defaultZoomLevel: 1,
                minZoomLevel: 1,
                maxZoomLevel: 10,
                zoomInButton: 'zoom-in',
                zoomOutButton: 'zoom-out',
                homeButton: 'reset',
                fullPageButton: 'full-page',
                nextButton: 'next',
                previousButton: 'previous',
                showNavigator: true,
                navigatorId: 'navigator',
                tileSources: {
                    type: type,
                    levels: [{ url: image, height: data.naturalHeight, width: data.naturalWidth }]
                }
            });

            console.log("viewer: ", viewer);
            fabricOverlay = viewer.fabricOverlay({
                fabricCanvasOptions: { selection: false },
            });

            viewer.setMouseNavEnabled(true)
            fabricOverlay.fabricCanvas().freeDrawingBrush = new fabric.PencilBrush(fabricOverlay.fabricCanvas());
            fabricOverlay.fabricCanvas().freeDrawingBrush.width = 5;
            fabricOverlay.fabricCanvas().freeDrawingBrush.color = "red";
            fabricOverlay.fabricCanvas().isDrawingMode = false;
        });
    }, [props]);

    useEffect(() => {
        console.log("I'm in child, viewer: ", viewer);

        if (viewer === null) {
            initOSDFabricJS();

            initSeadragon();
        }
    }, [initSeadragon, props]);

    function handleToggleDraw(){
        toggleDraw = !toggleDraw;
        viewer.setMouseNavEnabled(!toggleDraw);
        fabricOverlay.fabricCanvas().isDrawingMode = toggleDraw;
        console.log("tD: ",toggleDraw);
    }

    return (
        <div className="ocd-div">
            <div className="navigator-wrapper c-shadow">
                <div id="navigator"></div>
            </div>
            <div className="openseadragon" id={props.id}></div>
            <ul className="ocd-toolbar">
                <li><a id="zoom-in"><i className="fa fa-plus"></i></a></li>
                <li><a id="zoom-out"><i className="fa fa-minus"></i></a></li>
                <li><a id="reset"><i className="fa fa-refresh"></i></a></li>
                <li><a id="full-page"><i className="fa fa-arrows-alt"></i></a></li>
                <li><a id="toggle-draw"><i className="fa fa-paint-brush" onClick={handleToggleDraw}>
               
                </i></a></li>
            </ul>
        </div>
    );
}

export default OpenSeaDragonMain;
