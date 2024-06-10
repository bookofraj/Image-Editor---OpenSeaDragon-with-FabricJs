import React from 'react'

function AnnotList(props) {
  console.log("******* Rendering AnnotList *******");

  let canvasObj, canvasObjArr;

  if(props.showAnnotList){
    canvasObj = JSON.parse(props.canvasData);
    canvasObjArr = canvasObj.objects;
  }

    // console.log("canvasObjArr = ",canvasObjArr);

    const emptyList = (
        <span>No Annotations Drawn!</span>
    );

    function AnnotListItem({shapeType,shape}) {
        console.log("shape :: ",shapeType);
        return (
          <div>
          <span>
            {shapeType}
          </span>
          <i className="fa fa-trash-o annot-icon" aria-hidden="true" onClick={()=>props.deleteSingleAnnot(shape)}></i>
          </div>
        )
      }
if(props.showAnnotList){
  return (
    <div className={props.showAnnotList?'annotlistShow':'annotlistHide'}>
        {canvasObjArr.length === 0 ? emptyList : null}
        <ol>
            {canvasObjArr.map((shape,index) => {
              console.log('annot shape = ',shape);
              return <li style={{width: '90%'}} key={index}><AnnotListItem shapeType={shape.type} shape={shape}/></li>
              // console.log("shape :: ",shape.type);
            })
            }
        </ol>
    </div>
  )
}
}

export default AnnotList