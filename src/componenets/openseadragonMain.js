import { useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import OpenSeaDragon from 'openseadragon';
import { initOSDFabricJS } from 'openseadragon-fabric';
import { fabric } from 'fabric';
import h337 from 'heatmap.js';

// import AnnotList from './AnnotList';

// import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";


function OpenSeaDragonMain(props) {
    console.log("******* Rendering OpenSeaDragonMain *******");

    // const [showAnnotList,setShowAnnotList] = useState(false);
    
    const [canData,setCanData] = useState("");
    let shape;
    let canvas;
    let tempFabricAnnots = {};

    let slideCount = props.titledSourceArr.length;
    for(let i = 0;i < slideCount;i++){
        tempFabricAnnots[`fabricCanvas-${i}`] = "";
    }
    console.log("tempFabricAnnots = ",tempFabricAnnots);

    function generateRandomId() {
        let randomId = Math.floor(Math.random()*10000);
        console.log("Random Id generated = ",randomId);
        return randomId;
    }

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

        canvas.isDrawingMode = false;
        console.log("DrawingMode: ", fabricOverlay.fabricCanvas().isDrawingMode);

        drawShape(event);
    }

    const onAddRectangle = (event) => {
        console.log("at onAddRectangle()");
        shape = 'rect';
        console.log("shape= ", shape);
        // viewer.setMouseNavEnabled(false);
        // viewer.mouseNavEnabled = false
        console.log("MouseNav: ", viewer.mouseNavEnabled);
        canvas.isDrawingMode = false;
        console.log("DrawingMode: ", canvas.isDrawingMode);
        // console.log("fabric-> ", fabric);

        drawShape(event);
    };

    function onAddPolygon(event){
        console.log("-----at onAddPolygon-----");
        shape = 'poly';
        console.log("shape= ",shape);

        viewer.mouseNavEnabled = false;
        console.log("mouseNavEnabled: ",viewer.mouseNavEnabled);
        canvas.isDrawingMode = false;
        console.log("isDrawingMode: ",canvas.isDrawingMode);

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

    const initSeadragon = () => {
            // console.log("props: ", props);
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
    };

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

            // applyHeatmap();
        })
    }
useEffect(()=>{
    console.log("trying to save annots temporarily");
    tempFabricAnnots[`fabricCanvas-${sequenceIndex}`] = JSON.stringify(canvas);
    console.log("tempFabricAnnots = ",tempFabricAnnots);
    // eslint-disable-next-line
},[canvas,sequenceIndex])

    
    // useEffect((showAnnotList)=>{
    //     console.log("showAnnotList = ",showAnnotList);
    // },[showAnnotList]);


    function onAddFreeHand(event) {
        console.log("----at onAddFreeHand-----");
        shape = 'freehand';

        viewer.setMouseNavEnabled(false);   
        viewer.mouseNavEnabled = false;
        fabricOverlay.fabricCanvas().isDrawingMode = true;

        console.log("viewer.mouseNavEnabled: ",viewer.mouseNavEnabled);


        fabricOverlay.fabricCanvas().freeDrawingBrush = new fabric.PencilBrush(fabricOverlay.fabricCanvas());
        fabricOverlay.fabricCanvas().freeDrawingBrush.width = 5;
        fabricOverlay.fabricCanvas().freeDrawingBrush.color = "yellow";

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
        // setTimeout(() => {
        //     console.log("canvas.getObjects() = ",canvas.getObjects());
        // }, 1000);
        
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
        //just creating an instance to avoid long typing.
        canvas = fabricOverlay.fabricCanvas();      
        
        // canvas.selection = false
        // let shape;

        // disabling mouse nav & pan so as to draw annotation without moving image.
        viewer.panHorizontal = false;               
        viewer.panVertical = false;
        viewer.setMouseNavEnabled(false);
        console.log("PAN: ", viewer.panHorizontal, viewer.panVertical);

        console.log("----at drawShape----");
        let origX, origY;
        let rect, ellipse, text, line;

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
        let polyLines = [];

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
        console.log("viewer.setMouseNavEnabled: ",viewer.setMouseNavEnabled);
        console.log("canvas: ", canvas);
        // let viewer = event.eventSource;
        // let options = {
        //     scale: viewer.tileSources.levels[0].width
        // };


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


                    // console.log("imagePoint: ",imagePoint);
                    // console.log('at mouse:down imagePoint.x:', imagePoint.x, " imagePoint.y:", imagePoint.y);
                    //origX and origY will be treated as starting point while drawing rect.
                    origX = imagePoint.x;
                    origY = imagePoint.y;

                    // eslint-disable-next-line
                    switch (shape) {
                        case 'rect':
                            rect = new fabric.Rect({
                                id: generateRandomId(),
                                left: imagePoint.x,
                                top: imagePoint.y,
                                originX: 'left',
                                originY: 'top',
                                width: 1,
                                height: 1,
                                transparentCorners: false,
                                fill: 'transparent',
                                stroke: 'yellow',
                                strokeWidth: 7,
                                // objectCaching: false,
                            });
                            canvas.setActiveObject(rect);
                            canvas.add(rect);
                            console.log('added ',{rect});
                            break;
                        case 'ellipse':
                            ellipse = new fabric.Ellipse({
                                id: generateRandomId(),
                                left: imagePoint.x,
                                top: imagePoint.y,
                                originX: 'left',
                                originY: 'top',
                                rx: 1,
                                ry: 1,
                                stroke: 'yellow',
                                fill: 'transparent',
                                strokeWidth: 7,
                                objectCaching: false,
                            });
                            canvas.add(ellipse);
                            console.log('added ',{ellipse});

                            canvas.setActiveObject(ellipse);

                            break;
                        case 'text':
                            text = new fabric.IText('Add Text', {
                                id: generateRandomId(),
                                left: origX,
                                top: origY,
                                fontSize: 60,
                                strokeWidth: 1,
                                stroke: 'yellow',
                                fill: 'yellow',
                                editable: true
                            });
                            canvas.add(text);
                            console.log('added ',{text});
                            text.enterEditing();
                            console.log("Explore itext methods: ",text);

                            // canvas.setActiveObject(text);
                            break;
                        case 'poly':
                            if (!isDown) {
                                return;
                            }
                            
                            // deActiveAnnotation(viewer, canvas);
                            canvas.selection = false;
                            
                            console.log("-------Viewer at mouse:down Poly------");
                                console.log("Viewer = ",viewer);
                            console.log("-------CAnvas at mouse:down Poly------");
                                console.log("Canvas = ",canvas);

                            let x = imagePoint.x;
                            let y = imagePoint.y;

                            roofPoints.push(new Point(x, y));
                            console.log("roofPoints = ",roofPoints);

                            polyLines.push(new fabric.Line([x,y,x,y], {
                                strokeWidth: 7,
                                selectable: false,
                                stroke: 'yellow',
                                left: x,
                                top: y
                            }));


                            canvas.add(polyLines[lineCounter]);
                            lineCounter++;
                            break;
                        case 'line':
                            line = new fabric.Line([imagePoint.x, imagePoint.y, imagePoint.x, imagePoint.y],{
                                id: generateRandomId(),
                                stroke: 'yellow',
                                strokeWidth: 7
                            });

                            canvas.add(line);
                            console.log('added ',{line});
                            canvas.renderAll();
                            break;
                    }

            });


        canvas.on('mouse:move', function (event) {

            // viewer.setMouseNavEnabled(!isDown);

            let eventCoord = event;
            console.log("----at mouse:move----- isDown:",isDown);

            // console.log("isDown is still: ", isDown);
            // console.log("at mouse:move eventCoord: ",eventCoord);

            let viewportPoint, imagePoint;

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
                        console.log("== hi I am inside mouse:move poly ==");

                        if(polyLines[0] !== undefined && polyLines[0] !== null){
                            x = imagePoint.x;
                            y = imagePoint.y;

                            polyLines[lineCounter - 1].set({
                                x2: x,
                                y2: y
                            });
                            canvas.renderAll();
                        }
                        break;
                    case 'line':
                        if(isDown === true){
                            line.set({
                                x2: imagePoint.x,
                                y2: imagePoint.y
                            });

                            canvas.renderAll();
                        }
                }

        });

        canvas.on('mouse:up', function (event) {
            if(shape !== 'poly'){
                isDown = false;
                viewer.setMouseNavEnabled(true);

                // canvas.off('mouse:down');
                // canvas.off('mouse:move');
                console.log('-----at mouse:up------');
                console.log("isDown is now: ", isDown);
                console.log('event: ', event);

                // switch (shape) {
                //     case 'rect':
                //         break;
                //     default:
                //         break;
                // }
                // canvas.renderAll();
            }
        });
      
        canvas.on('mouse:dblclick', function(event) {

            isDown = false;

            canvas.off('mouse:down');
            canvas.off('mouse:move');

            console.log("============DBL CLICK===========");

            if (polyLines.length > 0) {
                polyLines.forEach(function (value, index, ar) {
                    canvas.remove(value);
                });
            }

            let polygon = new fabric.Polygon(roofPoints,{
                id: generateRandomId(),
                stroke: 'yellow',
                strokeWidth: 7,
                fill: false
            });

            canvas.add(polygon);
            console.log('added ',{polygon});
            canvas.renderAll();

            roofPoints = [];
            polyLines = [];


        // canvas.selection = false;
        // canvas.setActiveObject(polygon);
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

    // eslint-disable-next-line
    function handleAnnotList(){

        // setShowAnnotList(!showAnnotList);
        // if(showAnnotList) return;
        setCanData(JSON.stringify(canvas));
        console.log("canData = ",canData);
        // console.log("showAnnotList = ",showAnnotList);
    }

    // function deActiveAnnotation(viewer, canvas) {
    //     // if (shape !== 'freeHand') {
    //         canvas.isDrawingMode = false;
    //         viewer.setMouseNavEnabled(false);
    //         viewer.outerTracker.setTracking(false);
    //         canvas.isDrawingMode = false;
    //     // }
    //     canvas.discardActiveObject();
    //     canvas.renderAll();
    // }


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
        //viewer.addHandle('open',[function]); if any temp annots are available
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

    function deleteSingleAnnot(annotId){
        console.log("deleting Single Annot ",{annotId});
        let presentCanvasObjArr = JSON.parse(JSON.stringify(canvas)).objects;
        let updatedCanvasObjArr = presentCanvasObjArr.filter((element, index)=> index !== annotId )
        console.log("convasObjects Array after deletion: ",updatedCanvasObjArr);

        let updatedCanvas = JSON.parse(JSON.stringify(canvas));
        updatedCanvas.objects = updatedCanvasObjArr;
        console.log("updated canvas after deletion: ",updatedCanvas);
        
        canvas.loadFromJSON(updatedCanvas);
        canvas.renderAll();

        populateAnnotList();
    }
    function hideSingleAnnot(annotId){
        console.log("hiding Single Annot ",{annotId});

        let tempCanvasObj = JSON.parse(JSON.stringify(canvas));
        tempCanvasObj.objects[annotId].visible = !tempCanvasObj.objects[annotId].visible;
        console.log(`tempCanvasObj.objects[${annotId}].visible = `,tempCanvasObj.objects[annotId].visible);

        canvas.loadFromJSON(tempCanvasObj);
        canvas.renderAll();

        populateAnnotList();
    }
    
    let showAnnotList = false;
    let canvasObjArr;

    function populateAnnotList(){
        canvasObjArr = JSON.parse(JSON.stringify(canvas)).objects;
        console.log("-- at populateAnnotList: canvasObjArr = ",canvasObjArr);

        if(canvas !== undefined || canvasObjArr !== undefined){
            let list = document.getElementById('dynamicList');

            //clearing prevoiusly populated annot list
            list.innerHTML = '';
            
            for(let i = 0; i < canvasObjArr.length;i++){
                //setting shape name in list item
                let li = document.createElement('li');
                li.innerText = canvasObjArr[i].type.toUpperCase();

                //giving list item an id
                li.setAttribute("id",`Annot-${i}`);
                
                //setting hide icon
                let hideButton = document.createElement('i');
                hideButton.setAttribute('id',`hideAnnot-${i}`);
                if(canvasObjArr[i].visible === true){
                    hideButton.setAttribute('class','fa fa-eye annot-icon');
                }else{
                    hideButton.setAttribute('class','fa fa-eye-slash annot-icon');
                }

                //setting delete icon
                let deleteButton = document.createElement('i');
                deleteButton.setAttribute('id',`deleteAnnot-${i}`);
                deleteButton.setAttribute('class','fa fa-trash-o annot-icon');
                
                li.appendChild(deleteButton);
                li.appendChild(hideButton);
                
                list.appendChild(li);
            }

            for(let i = 0; i < canvasObjArr.length;i++){
                // adding event listeners to delete buttons
                let deleteButton = document.getElementById(`deleteAnnot-${i}`);
                deleteButton.addEventListener('click',() => {
                    deleteSingleAnnot(i);
                })

                // adding event listeners to delete buttons
                let hideButton = document.getElementById(`hideAnnot-${i}`);
                hideButton.addEventListener('click',() => {
                    hideSingleAnnot(i);
                })
            }

        }
    }

    function toggleAnnotList(){
        showAnnotList = !showAnnotList;
        // console.log("@ toggleAnnotList: showAnnotList = ",showAnnotList);
        if(showAnnotList === true){
            document.getElementById('annotlist2').classList.remove('annotlist2hide');
            document.getElementById('annotlist2').classList.add('annotlist2');
        }else{
            document.getElementById('annotlist2').classList.remove('annotlist2');
            document.getElementById('annotlist2').classList.add('annotlist2hide');
        }
        if(canvas !== undefined){
            
            populateAnnotList();
            }
    }
    useEffect(()=>{
        document.getElementById('annotlist2').classList.remove('annotlist2');
        document.getElementById('annotlist2').classList.add('annotlist2hide');
    },[]);

    function applyHeatmap() {
        console.log("HEATMAP- viewe: ",viewer);
        let heatmap = new HeatmapOverlay(viewer,
                        {
                        backgroundColor: 'rgba(0,0,0,0)',
                        // the maximum opacity (the value with the highest intensity will have it)
                        maxOpacity: 0.5,
                        // minimum opacity. any value > 0 will produce no transparent gradient transition
                        minOpacity: 0.05
                        }
                        );
                        // now generate some random data
                        var points = [];
                        var max = 0;
                        var width = viewer.tileSources[viewer.currentPage()].levels[0].width;
                        var height = viewer.tileSources[viewer.currentPage()].levels[0].height;
                        var len = 300;

                        while (len--) {
                            var val = Math.floor(Math.random()*100);
                            // now also with custom radius
                            var radius = Math.floor(Math.random()*70);

                            max = Math.max(max, val);
                            var point = {
                            x: Math.floor(Math.random()*width),
                            y: Math.floor(Math.random()*height),
                            value: val,
                            // radius configuration on point basis
                            radius: radius
                            };
                            points.push(point);
                        }
                        // heatmap data format
                        var data = {
                            max: max,
                            data: points
                        };
                    heatmap.setData(data);

    }

//########################################################################################
/*
* heatmap.js openseadragon overlay
*
* Dual-licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and the Beerware (http://en.wikipedia.org/wiki/Beerware) license.
*/

function HeatmapOverlay(viewer, cfg) {
    // eslint-disable-next-line
    var self = this;
    this._viewer = viewer;
    this.initialize(cfg || {});
};

// HeatmapOverlay.CSS_TRANSFORM = (function () {
//     var div = document.createElement('div');
//     var props = [
//         'transform',
//         'WebkitTransform',
//         'MozTransform',
//         'OTransform',
//         'msTransform'
//     ];

//     for (var i = 0; i < props.length; i++) {
//         var prop = props[i];
//         if (div.style[prop] !== undefined) {
//             return prop;
//         }
//     }
//     return props[0];
// })();

HeatmapOverlay.prototype.initialize = function (cfg) {
    this.cfg = cfg;

    //var map = this.map = this.getMap();
    
    var container = this.container = document.createElement('div');
    var width = this.width = this._viewer.container.clientWidth;
    var height = this.height = this._viewer.container.clientHeight;

    container.style.cssText = 'width:' + width + 'px;height:' + height + 'px;';

    this.data = [];
    this.max = 1;

    cfg.container = container;

    this.onAdd();
};

HeatmapOverlay.prototype.setData = function (data) {
    this.max = data.max;

    // transform data to latlngs
    // eslint-disable-next-line
    var data = data.data;
    var len = data.length;
    var d = [];

    while (len--) {
        var entry = data[len];
        var dataObj = {};
        dataObj.value = entry.value;
        dataObj.x = entry.x;
        dataObj.y = entry.y;
        if (entry.radius) {
            dataObj.radius = entry.radius;
        }
        d.push(dataObj);
    }
    this.data = d;
    this.update();
};

HeatmapOverlay.prototype.update = function () {
    var zoom = this._viewer.viewport.getZoom(true);

    if (this.data.length === 0) {
        return;
    }

    var generatedData = { max: this.max };
    var points = [];
    // iterate through data 
    var len = this.data.length;
    var localMax = 0;
    // eslint-disable-next-line
    var valueField = this.cfg.valueField;


    while (len--) {
        var entry = this.data[len];
        var value = entry.value;

        if (value > localMax) {
            localMax = value;
        }
       
        var viewportPoint  = this._viewer.viewport.imageToViewportCoordinates(entry.x, entry.y);
        var imagePoint = this._viewer.viewport.pixelFromPoint(viewportPoint , true);
		
		//ignore outter point
        if (imagePoint.x <= 0 || imagePoint.y <= 0 || imagePoint.x >= viewer.viewport.getContainerSize().x || imagePoint.y >= viewer.viewport.getContainerSize().y)
            continue;

        var point = { x: Math.round(imagePoint.x), y: Math.round(imagePoint.y), value : value };
        
        var radius;

        if (entry.radius) {
            radius = entry.radius * zoom;
        } else {
            radius = (this.cfg.radius || 20) * zoom;
        }
        point.radius = radius;
        points.push(point);
    }
    if (this.cfg.useLocalExtrema) {
        generatedData.max = localMax;
    }

    generatedData.data = points;

    this.heatmap.setData(generatedData);

};

HeatmapOverlay.prototype.onAdd = function () {

    this._viewer.canvas.appendChild(this.container);

    this.changeHandler = this._viewer.addHandler('update-viewport', function (arg) {
        arg.userData.draw.call(arg.userData);
    }, this);

    
    if (!this.heatmap) {
        this.heatmap = h337.create(this.cfg);
    }
    this.draw();
};

HeatmapOverlay.prototype.draw = function () {
    if (!this._viewer) { return; }

    this.update();
};
//########################################################################################

    return (
        <div className="ocd-div">
            <div className="navigator-wrapper c-shadow">
                <div id="navigator"></div>
            </div>
            <div className="openseadragon" id={props.id}></div>
            <div className='annotlist2' id='annotlist2'>
                <strong><i className="fa fa-list-ul"></i> Annotations <i className="fa fa-refresh" id='refresh-annotList' onClick={populateAnnotList}></i></strong>
                <hr></hr>
                <div><ol id='dynamicList'></ol></div>
            </div>
            <ul className="ocd-toolbar">
                {/* NEXT IMAGE BUTTON */}
                <li><a href id=""><i className="fa fa-chevron-circle-right" onClick={goToNextImage}></i></a></li>
                {/* PREVIOUS IMAGE BUTTON */}
                <li><a href id=""><i className="fa fa-chevron-circle-left" onClick={goToPreviousImage}></i></a></li>
                {/* SAVE LOCALLY BUTTON */}
                <li><a href id="save-png"><i className="fa fa-save" onClick={toSaveAnnotations}></i></a></li>
                {/* DELETE ALL BUTTONS */}
                <li><a href id="delete-all"><i className="fa fa-trash" onClick={toDeleteAll}></i></a></li>
                {/* APPLY LOCALLY SAVED ANNOTS BUTTON */}
                <li><a href id="apply-annotations"><i className="fa fa-object-ungroup" onClick={toApplyAnnotation}></i></a></li>
                {/* ANNOTATION LIST BUTTON */}
                {/* <li><a href id='annot_list'><i className="fa fa-list" onClick={handleAnnotList}></i></a></li> */}
                <li><a href id='annot_list'><i className="fa fa-list" onClick={toggleAnnotList}></i></a></li>
                {/* ZOOM IN BUTTON */}
                <li><a href id="zoom-in"><i className="fa fa-plus"></i></a></li>
                {/* ZOOM OUT BUTTON */}
                <li><a href id="zoom-out"><i className="fa fa-minus"></i></a></li>
                {/* ZOOM RESET BUTTON */}
                <li><a href id="reset"><i className='fa'><span className="material-symbols-outlined">recenter</span></i></a></li>
                {/* FULL SCREEN BUTTON */}
                <li><a href id="full-page"><i className="fa fa-expand"></i></a></li>
                {/* DRAW PATH BUTTON */}
                <li><a href id="add-freehand"><i className="fa fa-pencil" onClick={onAddFreeHand}></i></a></li>
                {/* DRAW LINE BUTTON */}
                <li><a href id='add-line'><i className="fa" onClick={onAddLine}>---</i></a></li>
                {/* DRAW RECTANGLE BUTTON */}
                <li><a href id='add-rect'><i className="fa fa-square-o" onClick={onAddRectangle}></i></a></li>
                {/* DRAW POLYGON BUTTON */}
                <li><a href id='add-poly'><i className="fa" onClick={onAddPolygon}>Poly</i></a></li>
                {/* DRAW CIRCLE BUTTON */}
                <li><a href id='add-ellipse'><i className="fa fa-circle-thin" onClick={onAddEllipse}></i></a></li>
                {/* APPLY HEATMAP BUTTON */}
                <li><a href id='add-shape'><i className="fa fa-map" onClick={applyHeatmap}></i></a></li>
                {/* ADD TEXT BUTTON */}
                <li><a href id='add-text'><i className="fa fa-font fa-3x" onClick={onAddText}></i></a></li>
                {/* enable move BUTTON */}
                <li><a href id='enablemove'><i className="fa fa-arrows" onClick={enableMove}></i></a></li>
            </ul>
        </div>
    );
}

export default OpenSeaDragonMain;
