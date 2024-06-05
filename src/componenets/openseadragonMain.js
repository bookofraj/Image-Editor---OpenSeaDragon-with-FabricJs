import { useCallback, useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import OpenSeaDragon from 'openseadragon';
import { initOSDFabricJS } from 'openseadragon-fabric';
import { fabric } from 'fabric';
import AnnotList from './AnnotList';

// import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";


function OpenSeaDragonMain(props) {

    const [showAnnotList,setShowAnnotList] = useState(false);
    const [canData,setCanData] = useState("");
    let shape;
    let canvas;
    let lastPage;
    let tempFabricAnnots = {};

    let slideCount = props.titledSourceArr.length;
    for(let i = 0;i < slideCount;i++){
        tempFabricAnnots[`fabricCanvas-${i}`] = "";
    }
    console.log("tempFabricAnnots = ",tempFabricAnnots);


    function applyTempFabAnnots(page){
        console.log("--applying tempFabricAnnots if available--");
        if(tempFabricAnnots[`fabricCanvas-${page}`]){
            console.log("tempFabricAnnots found for this page !");
            let tempJSON = JSON.parse(tempFabricAnnots[`fabricCanvas-${page}`])
            canvas.loadFromJSON(tempJSON);
            console.log("tempFabricAnnots applied");
        }else{
            console.log("No tempFabricAnnots found for this page !");
        }
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
        drawShape(event);
    };


    const onAddLine = (event) => {
        console.log("-----at onAddLine------");
        shape = 'line';
        console.log("shape= ", shape);

        drawShape(event);
    }

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


    // function loadImage(src) {
    //     return new Promise((resolve, reject) => {
    //         var img = document.createElement('img')
    //         img.addEventListener('load', function () { resolve(img) })
    //         img.addEventListener('error', function (err) { reject(404) })
    //         img.src = src;
    //         // console.log("checkpoint2 src: ", src);
    //     });
    // }

    let viewer = null;
    var fabricOverlay;

    // const initSeadragon = useCallback(() => {
    //     // console.log("props: ", props);
    //     let { id, image, type } = props;
    //     // console.log("checkpoint1 id: ", id, ", image: ", image, ", type: ", type);
    //     loadImage(image).then(data => {
    //         // console.log("checkpoint3 data: ", data, data.naturalHeight, data.naturalWidth);
    //         // eslint-disable-next-line
    //         viewer = OpenSeaDragon({
    //             id: id,
    //             visibilityRatio: 1.0,
    //             constrainDuringPan: false,
    //             defaultZoomLevel: 1,
    //             minZoomLevel: 1,
    //             maxZoomLevel: 10,
    //             zoomInButton: 'zoom-in',
    //             zoomOutButton: 'zoom-out',
    //             homeButton: 'reset',
    //             fullPageButton: 'full-page',
    //             nextButton: 'next',
    //             previousButton: 'previous',
    //             showNavigator: true,
    //             // navigatorAutoResize: true,
    //             // navigatorPosition: 'TOP_RIGHT',
    //             navigatorId: 'navigator',
    //             tileSources: {
    //                 type: type,
    //                 levels: [{ url: image, height: 490, width: 800 }]
    //             }
    //         });

    //         // console.log("viewer: ", viewer);
    //         // eslint-disable-next-line
    //         fabricOverlay = viewer.fabricOverlay({
    //             fabricCanvasOptions: { 
    //                 selection: false 
    //             },
    //         });

    //         viewer.setMouseNavEnabled(true);
    //         // fabricOverlay.fabricCanvas().freeDrawingBrush = new fabric.PencilBrush(fabricOverlay.fabricCanvas());
    //         // fabricOverlay.fabricCanvas().freeDrawingBrush.width = 2;
    //         // fabricOverlay.fabricCanvas().freeDrawingBrush.color = "red";
    //         fabricOverlay.fabricCanvas().isDrawingMode = false;


    //     });
    // }, [props]);

    const initSeadragon = useCallback(() => {
            console.log("props: ", props);
        // eslint-disable-next-line
        viewer = OpenSeaDragon({
                        id: props.id,
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
                        // navigatorPosition: 'TOP_RIGHT',
                        navigatorId: 'navigator',
                        sequenceMode: true,
                        tileSources: props.titledSourceArr
                    });
    },[props]);

    useEffect(() => {
        // console.log("I'm in child, viewer: ", viewer);

        if (viewer === null) {
            initOSDFabricJS();

            initSeadragon();
            
            // eslint-disable-next-line
            fabricOverlay = viewer.fabricOverlay({
                fabricCanvasOptions: { 
                    selection: false,
                    width: window.innerWidth,
                    height: window.innerHeight
                },
            });

            initateOpenHandler();
        }
        
        // eslint-disable-next-line
    }, [initSeadragon, props]);
    
    let sequenceIndex;
    const initateOpenHandler = (event) => {
        viewer.addHandler('open',function whenNewImageOpens(event){
            console.log("----at whenNewImageOpens(): open handle----");
            
            canvas = fabricOverlay.fabricCanvas();      
            
            // sequenceIndex = event.eventSource._sequenceIndex;
            // console.log("opening image ",sequenceIndex);
            console.log("viewer.currentPage() = ",viewer.currentPage());
            let currentPage = viewer.currentPage();

            applyTempFabAnnots(currentPage);
        })
    }
useEffect(()=>{
    console.log("trying to save annots temporarily");
    tempFabricAnnots[`fabricCanvas-${sequenceIndex}`] = JSON.stringify(canvas);
    console.log("tempFabricAnnots = ",tempFabricAnnots);
    // eslint-disable-next-line
},[canvas,sequenceIndex])

    
    useEffect((showAnnotList)=>{
        console.log("showAnnotList = ",showAnnotList);
    },[showAnnotList]);


    setTimeout(() => {
        // viewer.goToNextPage();
        console.log("lastPage = ",lastPage);
    }, 2000);

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

    function toDeleteAll(){
        console.log("=====Canvas Cleared=====canvas.clear().renderAll()=====");
        canvas.clear().renderAll();
    }

    // using JSON Seralization to save annotations locally in the project!
    function toSaveAnnotations(){

        console.log("======Saving Annotations Locally====(Serialisation)===");
        
        console.log("JSON.stringify(canvas) = ",JSON.stringify(fabricOverlay.fabricCanvas()));
        var annotsToSave = JSON.stringify(fabricOverlay.fabricCanvas());
        
        localStorage.setItem('savedAnnots', JSON.stringify(annotsToSave));
        
        console.log("======Annotations Saved Locally====(Serialisation)====");
    }
    
    function toApplyAnnotation(){
        console.log("======Applying Saved Locally Annotations====(Serialisation)====");
        
        var AvailableAnnots = JSON.parse(localStorage.getItem('savedAnnots'));
        
        if(AvailableAnnots){
        console.log("Annots Saved Locally = ",AvailableAnnots);
        }else{
            console.log("====No Saved Annotations Found===");
        }
        
        fabricOverlay.fabricCanvas().loadFromJSON((AvailableAnnots));

        console.log("======Applied Saved Locally Annotations====(Serialisation)====");
    }

    function drawShape(event) {
        fabricOverlay.fabricCanvas().selection = false
        // let shape;
        
        //just creating an instance to avoid long typing.
        canvas = fabricOverlay.fabricCanvas();      

        //disabling mouse nav & pan so as to draw annotation without moving image.
        viewer.panHorizontal = false;               
        viewer.panVertical = false;
        viewer.setMouseNavEnabled(false);
        console.log("PAN: ", viewer.panHorizontal, viewer.panVertical);

        console.log("----at drawShape----");
        let origX, origY;
        let rect, ellipse, text;

        // //used for shape = 'text'
        // let temp = 0;
        // let startx = [];
        // let starty = [];
        // let endx = [];
        // let endy = [];

        //used for shape = 'poly'
        var roofPoints = [];
        let x, y;
        let lineCounter = 0;
        let points, lines = [];

        class Point{
            constructor(x,y){
                this.x = x;
                this.y = y;
            }
        }
    
        //will use this for the purpose of drawing shapes.
        let isDown = false;                             

        // console.log("event: ", event);
        // console.log("event.nativeEvent.layerX: ", event.nativeEvent.layerX);
        // console.log("event.nativeEvent.layerY: ", event.nativeEvent.layerY);

        console.log("viewer: ", viewer);
        console.log("canvas: ", canvas);
        // let viewer = event.eventSource;
        // let options = {
        //     scale: viewer.tileSources.levels[0].width
        // };

        if (isDown === false) {
            canvas.on('mouse:down', function listeningMouseDown(event) {
                isDown = true;
                console.log("----at mouse:down-----");

                //event at mouse:down has different JSON structure. Hence, refered as Event Co-ord here!
                let eventCoord = event;
                // console.log("isDown: ", isDown);

                // console.log("eventCoord: ", eventCoord);
                // console.log("PointerX: ", eventCoord.pointer.x);
                // console.log("PointerY: ", eventCoord.pointer.y);

                let viewportPoint, imagePoint;
                viewportPoint = viewer.viewport.pointFromPixel(new OpenSeaDragon.Point(eventCoord.pointer.x, eventCoord.pointer.y));
                imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

                //similar to case : rect
                setTimeout(() => {

                    // console.log("imagePoint: ",imagePoint);
                    // console.log('at mouse:down imagePoint.x:', imagePoint.x, " imagePoint.y:", imagePoint.y);
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
                            origX = imagePoint.x;      //OrigX likewise
                            origY = imagePoint.y;      //OrigY likewise
                            text = new fabric.Text('Add Text', {
                                left: origX,
                                top: origY,
                                fontSize: 30,
                                strokeWidth: 1,
                                // lockMovementX: true,
                                // lockMovementY: true,
                                // hasControls: false,
                                stroke: 'red',
                                fill: 'red',
                                editable: true 
                            });
                            canvas.add(text);

                            canvas.setActiveObject(text);
                            break;
                        case 'poly':
                            if (!isDown) {
                                return;
                            }
                            // let newPoint = new Point(imagePoint.x,imagePoint.y);
                            // roofPoints.push(newPoint);

                            // line = new fabric.Line([newPoint.x,newPoint.y,newPoint.x,newPoint.y],{
                            //     stroke: 'red',
                            //     strokeWidth: 3
                            // });
                            // canvas.add(line);

                            // console.log("roofPoints = ",roofPoints);
                            
                            deActiveAnnotation(viewer, canvas);
                            canvas.selection = false;
                            
                            console.log("-------Viewer at mouse:down Poly------");
                            console.log("Viewer = ",viewer);
                            console.log("-------CAnvas at mouse:down Poly------");
                            console.log("Canvas = ",canvas);

                            let x = imagePoint.x;
                            let y = imagePoint.y;

                            roofPoints.push(new Point(x, y));
                            console.log("roofPoints = ",roofPoints);

                            points = [x, y, x, y];
                            lines.push(new fabric.Line(points, {
                                strokeWidth: 7,
                                selectable: false,
                                stroke: 'green',
                                left: x,
                                top: y
                            }));


                            canvas.add(lines[lineCounter]);
                            lineCounter++;
                            break;
                        case 'line':

                            break;
                    }
                }, 100);
            });
        }

        canvas.on('mouse:move', function (event) {

            // viewer.setMouseNavEnabled(!isDown);

            let eventCoord = event;
            console.log("----at mouse:move-----");

            // console.log("isDown is still: ", isDown);
            // console.log("at mouse:move eventCoord: ",eventCoord);

            let viewportPoint, imagePoint;
            setTimeout(() => {
                viewportPoint = viewer.viewport.pointFromPixel(new OpenSeaDragon.Point(eventCoord.pointer.x, eventCoord.pointer.y));
                imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

                // console.log('at mouse:move Click- x:', imagePoint.x," y:", imagePoint.y);
                // console.log('at mouse:move Width: ', Math.abs(origX - imagePoint.x), " Height: ", Math.abs(origY - imagePoint.y));

                // eslint-disable-next-line
                switch (shape) {
                    case 'rect':

                        if (!isDown) {
                            return;
                        }

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

                        if (!isDown) {
                            return;
                        }

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
                    case 'poly':
                        if (!isDown) {
                            return;
                        }
                        // if(roofPoints[0] !== undefined){
                        //     line.set({
                        //         x2: imagePoint.x,
                        //         y2: imagePoint.y
                        //     });
                        // } 
                        if(lines[0] !== undefined && lines[0] !== null){
                            x = imagePoint.x;
                            y = imagePoint.y;

                            lines[lineCounter - 1].set({
                                x2: x,
                                y2: y
                            });
                            canvas.renderAll();
                        }
                        break;
                }
            }, 100);
        });

        // canvas.on('mouse:up', function (event) {
        //     isDown = false;
        //     // rect = ellipse = undefined;
        //     console.log('-----at mouse:up------');
        //     console.log("isDown is now: ", isDown);
        //     console.log('event: ', event);
        // });
      
        canvas.on('mouse:dblclick', function(event) {

            isDown = false;

            canvas.off('mouse:down');
            canvas.off('mouse:move');

            console.log("============DBL CLICK===========");

            if (lines.length > 0) {
                lines.forEach(function (value, index, ar) {
                    canvas.remove(value);
                });}

            let polygon = new fabric.Polygon(roofPoints,{
                stroke: 'red',
                strokeWidth: 7,
                fill: false
            });

            canvas.add(polygon);
            canvas.renderAll();

            roofPoints = [];
            lines = [];


        canvas.selection = false;
        canvas.setActiveObject(polygon);
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

    function handleAnnotList(){

        // if(!fabricOverlay.fabricCanvas()) return;

        // console.log("=X=X=X=- ERROR: NO ANNOTATION IS DRAWN -=X=X=X=");

        setShowAnnotList(!showAnnotList);
        if(showAnnotList) return;
        let canvasData = JSON.stringify(fabricOverlay.fabricCanvas());
        setCanData(canvasData);
        console.log("canData = ",canData);
        console.log("showAnnotList = ",showAnnotList);
    }

    function deActiveAnnotation(viewer, canvas) {
        if (shape !== 'freeHand') {
            fabricOverlay.fabricCanvas().isDrawingMode = false;
            viewer.setMouseNavEnabled(false);
            viewer.outerTracker.setTracking(false);
            canvas.isDrawingMode = false;
        }
        canvas.discardActiveObject();
        canvas.renderAll();
    }


    function enableMove() {
        console.log("===at enableMove===");
        shape = '';
        console.log("Shape = ",shape);
        fabricOverlay.fabricCanvas().selection = true;
        viewer.panHorizontal = true;
        viewer.panVertical = true;

        viewer.setMouseNavEnabled(true);
    }

    function saveAnnotsTemporarily(page){
        tempFabricAnnots[`fabricCanvas-${page}`] = JSON.stringify(canvas);
        console.log("---tempFabricAnnots saved---> ",tempFabricAnnots);
    }
    function goToNextImage(){
        let currentPage = viewer.currentPage();

        console.log("--saving fabric objects temporarily--");
        saveAnnotsTemporarily(currentPage);
        console.log('--clearing fabric canvas--');
        canvas.clear().renderAll();
        
        console.log('---going to ' + (currentPage + 1) + ' page from ' + currentPage + ' page---');
        viewer.goToPage(currentPage + 1);

        //after switching to new image will apply the temp annots from 
        //viewer.addHandle('open',[function]); if an temp annots available
    }
    function goToPreviousImage(){
        let currentPage = viewer.currentPage();

        console.log("--saving fabric objects temporarily--");
        saveAnnotsTemporarily(currentPage);
        console.log('--clearing fabric canvas--');
        canvas.clear().renderAll();

        console.log('---going to ' + (currentPage - 1) + ' page from ' + currentPage + ' page---');
        viewer.goToPage(currentPage - 1);

        //after switching to new image will apply the temp annots from 
        //viewer.addHandle('open',[function]); if an temp annots available
    }

    return (
        <div className="ocd-div">
            <div className="navigator-wrapper c-shadow">
                <div id="navigator"></div>
            </div>
            <div className="openseadragon" id={props.id}></div>
            {showAnnotList? <AnnotList canvasData={canData} /> : null}
            <ul className="ocd-toolbar">
                <li><a href id=""><i className="fa fa-chevron-circle-right" onClick={goToNextImage}></i></a></li>
                <li><a href id=""><i className="fa fa-chevron-circle-left" onClick={goToPreviousImage}></i></a></li>
                <li><a href id="save-png"><i className="fa fa-save" onClick={toSaveAnnotations}></i></a></li>
                <li><a href id="delete-all"><i className="fa fa-trash" onClick={toDeleteAll}></i></a></li>
                <li><a href id="apply-annotations"><i className="fa fa-object-ungroup" onClick={toApplyAnnotation}></i></a></li>
                <li><a href id='annot_list'><i className="fa fa-list" onClick={handleAnnotList}></i></a></li>
                <li><a href id="zoom-in"><i className="fa fa-plus"></i></a></li>
                <li><a href id="zoom-out"><i className="fa fa-minus"></i></a></li>
                <li><a href id="reset"><i className="fa fa-refresh fa-spin"></i></a></li>
                <li><a href id="full-page"><i className="fa fa-expand"></i></a></li>
                <li><a href id="add-freehand"><i className="fa fa-pencil" onClick={onAddFreeHand}></i></a></li>
                <li><a href id='add-line'><i className="fa" onClick={onAddLine}>---</i></a></li>
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
