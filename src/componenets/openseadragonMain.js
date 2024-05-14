import { useCallback, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import OpenSeaDragon from 'openseadragon';
import { initOSDFabricJS } from 'openseadragon-fabric';
import { fabric } from 'fabric';

// import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";


function OpenSeaDragonMain(props) {

    let shape;

    function calcLineLength(x1, y1, x2, y2){
        let length = (Math.sqrt(Math.pow(x2 * 1 - x1 * 1, 2) + Math.pow(y2 * 1 - y1 * 1, 2))).toFixed(2);
        return length;
    }

    function enableMove() {
        viewer.panHorizontal = true;
        viewer.panVertical = true;

        viewer.setMouseNavEnabled(true);
    }

    const onAddText = (event) => {
        console.log("------at onAddText------");
        shape = 'text';
        console.log("shape= ", shape);
        viewer.setMouseNavEnabled(false);
        fabricOverlay.fabricCanvas().isDrawingMode = false;

        console.log("fabric-> ", fabric);

        drawShape(event);
    }

    const onAddEllipse = (event) => {
        console.log("-----at onAddEllipse------");
        shape = 'ellipse';
        console.log("shape= ", shape);
        viewer.setMouseNavEnabled(false);
        fabricOverlay.fabricCanvas().isDrawingMode = false;
        // var circle = new fabric.Circle({
        //     left: 200,
        //     top: 200,
        //     fill: false,
        //     stroke: 'green',
        //     radius: 100,
        //     strokeWidth: 4,
        // });
        // fabricOverlay.fabricCanvas().add(circle);

        drawShape(event);
    };

    const onAddRectangle = (event) => {
        console.log("at onAddRectangle()");
        shape = 'rect';
        console.log("shape= ", shape);
        // viewer.setMouseNavEnabled(false);
        viewer.mouseNavEnabled = false
        console.log("MouseNav: ", viewer.mouseNavEnabled);
        fabricOverlay.fabricCanvas().isDrawingMode = false;
        console.log("DrawingMode: ", fabricOverlay.fabricCanvas().isDrawingMode);
        console.log("fabric-> ", fabric);
        // var rect = new fabric.Rect({
        //     left: 100,
        //     top: 100,
        //     fill: false,
        //     stroke: 'red',
        //     strokeWidth: 4,
        //     width: 200,
        //     height: 200
        // });
        // fabricOverlay.fabricCanvas().add(rect);
        drawShape(event);
    };

    function onAddPolygon(event){
        console.log("-----at onAddPolygon-----");
        shape = 'poly';
        console.log("shape= ",shape);

        viewer.setMouseNavEnabled(false);
        fabricOverlay.fabricCanvas().isDrawingMode = false;
        console.log("mouseNavEnabled: ",viewer.mouseNavEnabled);
        console.log("isDrawingMode: ",fabricOverlay.fabricCanvas().isDrawingMode);

        console.log("viewer: ",viewer);
        console.log("CANVAS fabricOverlay.fabricCanvas(): ",fabricOverlay.fabricCanvas());
        console.log("fabric: ",fabric);

        drawShape(event);
    }


    function loadImage(src) {
        return new Promise((resolve, reject) => {
            var img = document.createElement('img')
            img.addEventListener('load', function () { resolve(img) })
            img.addEventListener('error', function (err) { reject(404) })
            img.src = src;
            // console.log("checkpoint2 src: ", src);
        });
    }

    let viewer = null;
    let fabricOverlay;

    const initSeadragon = useCallback(() => {
        // console.log("props: ", props);
        let { id, image, type } = props;
        // console.log("checkpoint1 id: ", id, ", image: ", image, ", type: ", type);
        loadImage(image).then(data => {
            // console.log("checkpoint3 data: ", data, data.naturalHeight, data.naturalWidth);
            // eslint-disable-next-line
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
                // navigatorAutoResize: true,
                // navigatorPosition: top,
                navigatorId: 'navigator',
                tileSources: {
                    type: type,
                    levels: [{ url: image, height: data.naturalHeight, width: data.naturalWidth }]
                }
            });


            // console.log("viewer: ", viewer);
            // eslint-disable-next-line
            fabricOverlay = viewer.fabricOverlay({
                fabricCanvasOptions: { selection: false },
            });

            viewer.setMouseNavEnabled(true);
            // fabricOverlay.fabricCanvas().freeDrawingBrush = new fabric.PencilBrush(fabricOverlay.fabricCanvas());
            // fabricOverlay.fabricCanvas().freeDrawingBrush.width = 2;
            // fabricOverlay.fabricCanvas().freeDrawingBrush.color = "red";
            fabricOverlay.fabricCanvas().isDrawingMode = false;


        });
    }, [props]);

    useEffect(() => {
        // console.log("I'm in child, viewer: ", viewer);

        if (viewer === null) {
            initOSDFabricJS();

            initSeadragon();
        }

        // eslint-disable-next-line
    }, [initSeadragon, props]);

    function onAddFreeHand(event) {
        console.log("----at onAddFreeHand-----");
        shape = 'freehand';

        viewer.setMouseNavEnabled(false);   
        viewer.mouseNavEnabled = false;
        fabricOverlay.fabricCanvas().isDrawingMode = true;

        console.log("viewer.mouseNavEnabled: ",viewer.mouseNavEnabled);


        fabricOverlay.fabricCanvas().freeDrawingBrush = new fabric.PencilBrush(fabricOverlay.fabricCanvas());
        fabricOverlay.fabricCanvas().freeDrawingBrush.width = 3;
        fabricOverlay.fabricCanvas().freeDrawingBrush.color = "red";

        // drawShape(event);
    }


    function drawShape(event) {
        // let shape;

        viewer.panHorizontal = false;               //disabling mouse nav so as to draw annotation without moving image.
        viewer.panVertical = false;                 //disabling mouse nav so as to draw annotation without moving image.
        console.log("PAN: ", viewer.panHorizontal, viewer.panVertical);

        console.log("----at drawShape----");
        let origX, origY;
        let rect, ellipse, freeHand, text, polygon;

        //used for shape = 'text'
        let temp = 0;
        let startx = [];
        let starty = [];
        let endx = [];
        let endy = [];

        //used for shape = 'poly'
        var roofPoints = [];
        function Point(x, y){
            this.x = x;
            this.y = y;
        }
        var polyPoints = [];
        var lines = [];
        var lineCounter = 0;
        
        //will use this for the purpose of drawing shapes.
        let isDown = false;                             
        
        //just creating an instance to avoid long typing.
        let canvas = fabricOverlay.fabricCanvas();      

        console.log("event: ", event);
        console.log("event.nativeEvent.layerX: ", event.nativeEvent.layerX);
        console.log("event.nativeEvent.layerY: ", event.nativeEvent.layerY);

        console.log("viewer: ", viewer);
        console.log("canvas: ", canvas);
        // let viewer = event.eventSource;
        // let options = {
        //     scale: viewer.tileSources.levels[0].width
        // };

        if (isDown === false) {
            canvas.on('mouse:down', function (event) {
                isDown = true;
                console.log("----at mouse:down-----");

                //event at mouse:down has different JSON structure.Hence, refered as Event Co-ord here!
                let eventCoord = event;
                // console.log("isDown: ", isDown);

                console.log("eventCoord: ", eventCoord);
                // console.log("PointerX: ", eventCoord.pointer.x);
                // console.log("PointerY: ", eventCoord.pointer.y);

                let viewportPoint, imagePoint;

                //similar to case : rect
                setTimeout(() => {
                    viewportPoint = viewer.viewport.pointFromPixel(new OpenSeaDragon.Point(eventCoord.pointer.x, eventCoord.pointer.y));
                    imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

                    // console.log("imagePoint: ",imagePoint);
                    console.log('at mouse:down imagePoint.x:', imagePoint.x, " imagePoint.y:", imagePoint.y);
                    //origX and origY will be treated as starting point while drawing rect.
                    origX = imagePoint.x;
                    origY = imagePoint.y;

                    // eslint-disable-next-line
                    switch (shape) {
                        case 'rect':
                            rect = new fabric.Rect({
                                left: imagePoint.x,
                                top: imagePoint.y,
                                originX: 'left',
                                originY: 'top',
                                width: 1,
                                height: 1,
                                transparentCorners: false,
                                fill: 'transparent',
                                stroke: 'yellow',
                                strokeWidth: 2,
                                objectCaching: false,
                            });

                            canvas.add(rect);

                            canvas.setActiveObject(rect);
                            break;
                        case 'ellipse':
                            ellipse = new fabric.Ellipse({
                                left: imagePoint.x,
                                top: imagePoint.y,
                                originX: 'left',
                                originY: 'top',
                                rx: 1,
                                ry: 1,
                                stroke: 'green',
                                fill: 'transparent',
                                strokeWidth: 2,
                                objectCaching: false,
                            });
                            canvas.add(ellipse);

                            canvas.setActiveObject(ellipse);

                            break;
                        // case 'freehand':
                        //     canvas.freeDrawingBrush = new fabric.PencilBrush(fabricOverlay.fabricCanvas());
                        //     canvas.freeDrawingBrush.width = 3;
                        //     canvas.freeDrawingBrush.color = "red";
                            
                        //     break;
                        case 'text':
                            startx[temp] = imagePoint.x;      //OrigX likewise
                            starty[temp] = imagePoint.y;      //OrigY likewise
                            text = new fabric.Text('Add Text', {
                                left: origX,
                                top: origY,
                                fontSize: 20,
                                strokeWidth: 1,
                                // lockMovementX: true,
                                // lockMovementY: true,
                                // hasControls: false,
                                stroke: 'red',
                                fill: 'red'
                            });
                            canvas.add(text);

                            canvas.setActiveObject(text);
                            break;
                        case 'poly':
                            viewer.immediateRender = true;
                            origX = imagePoint.x;
                            origY = imagePoint.y;

                            roofPoints.push(new Point(origX,origY));
                            console.log("No. of roofPoints:", roofPoints.length);
                            console.log("roofPoints: ",roofPoints);
                            // polyPoints = [origX, origY, origX, origY];
                            polygon = new fabric.Polygon(roofPoints,{
                                left: origX,
                                top: origY,
                                strokeWidth: 3,
                                selectable: false,
                                stroke: 'green',
                                fill: false,
                            });
                            canvas.add(polygon);
                            // lineCounter++;
                             canvas.renderAll();
                            break;
                    }
                }, 100);
            });
        }

        canvas.on('mouse:move', function (event) {

            if (!isDown) {
                return;
            }

            // viewer.setMouseNavEnabled(!isDown);

            let eventCoord = event;
            console.log("----at mouse:move-----");

            console.log("isDown is still: ", isDown);
            // console.log("at mouse:move eventCoord: ",eventCoord);

            let viewportPoint, imagePoint;
            setTimeout(() => {
                viewportPoint = viewer.viewport.pointFromPixel(new OpenSeaDragon.Point(eventCoord.pointer.x, eventCoord.pointer.y));
                imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

                // console.log('at mouse:move Click- x:', imagePoint.x," y:", imagePoint.y);
                console.log('at mouse:move Width: ', Math.abs(origX - imagePoint.x), " Height: ", Math.abs(origY - imagePoint.y));

                // eslint-disable-next-line
                switch (shape) {
                    case 'rect':

                        if (origX > imagePoint.x) {
                            rect.set({ left: (imagePoint.x) });
                        }

                        if (origY > imagePoint.y) {
                            rect.set({ top: (imagePoint.y) });
                        }
                        if (isDown) {
                            rect.set({ width: Math.abs(origX - imagePoint.x) });
                            rect.set({ height: Math.abs(origY - imagePoint.y) });
                            canvas.renderAll();
                        }
                        break;
                    case 'ellipse':

                        let rx = Math.abs(origX - imagePoint.x) / 2;
                        let ry = Math.abs(origY - imagePoint.y) / 2;

                        ellipse.set({ 
                            rx: rx, 
                            ry: ry 
                        });

                        if (origX > imagePoint.x) ellipse.set({ originX: 'right' });
                        else ellipse.set({ originX: 'left' });

                        if (origY > imagePoint.y) ellipse.set({ originY: 'bottom' });
                        else ellipse.set({ originY: 'top' });

                        canvas.renderAll();
                    
                        break;
                    case 'text':
                        endx[temp] = imagePoint.x;
                        endy[temp] = imagePoint.y;

                        let px = calcLineLength(startx[temp],starty[temp],endx[temp],endy[temp]);
                        console.log("px: ",px)
                        // let perimeter = parseFloat(px.split(' ')[0]);
                        // console.log("perimeter: ",perimeter);

                        text.set({left: endx[temp], top: endy[temp], text: ''})
                        break;
                }
            }, 100);
        });

        canvas.on('mouse:up', function (event) {
            isDown = false;
            // rect = ellipse = undefined;
            console.log('-----at mouse:up------');
            console.log("isDown is now: ", isDown);
            console.log('event: ', event);
        });

        // function canvasRelease(){
        //     console.log("-----at canvas-release------");
        // isDown = false;
        // viewer.setMouseNavEnabled(true);

        // if(rect.width === 1 && rect.height === 1){
        //     rect = undefined;
        //     console.log("rect= ",rect);
        // }
        // }
    }

    // viewer.addHandler('canvas-release', function () {
    //     console.log("-----at canvas-release------");
    //     // isDown = false;
    //     // viewer.setMouseNavEnabled(true);

    //     // if(rect.width === 1 && rect.height === 1){
    //     //     rect = undefined;
    //     //     console.log("rect= ",rect);
    //     // }
    //     // canvasRelease();
    // });

    return (
        <div className="ocd-div">
            <div className="navigator-wrapper c-shadow">
                <div id="navigator"></div>
            </div>
            <div className="openseadragon" id={props.id}></div>
            <ul className="ocd-toolbar">
                <li><a href id="zoom-in"><i className="fa fa-plus"></i></a></li>
                <li><a href id="zoom-out"><i className="fa fa-minus"></i></a></li>
                <li><a href id="reset"><i className="fa fa-refresh fa-spin"></i></a></li>
                <li><a href id="full-page"><i className="fa fa-expand"></i></a></li>
                <li><a href id="add-freehand"><i className="fa fa-pencil" onClick={onAddFreeHand}></i></a></li>
                <li><a href id='add-rect'><i className="fa fa-square-o" onClick={onAddRectangle}></i></a></li>
                <li><a href id='add-rect'><i className="fa" onClick={onAddPolygon}>Poly</i></a></li>
                <li><a href id='add-ellipse'><i className="fa fa-circle-thin" onClick={onAddEllipse}></i></a></li>
                <li><a href id='add-shape'><i className="fa fa-linux" onClick={drawShape}></i></a></li>
                <li><a href id='add-text'><i className="fa fa-font fa-3x" onClick={onAddText}></i></a></li>
                <li><a href id='earse'><i className="fa fa-arrows" onClick={enableMove}></i></a></li>
            </ul>
        </div>
    );
}

export default OpenSeaDragonMain;
