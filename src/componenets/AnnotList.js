import React from 'react'

function AnnotList(props) {
    console.log("-----at AnnotList RFCE----");

    let canvasObj = JSON.parse(props.canvasData);
    let canvasObjArr = canvasObj.objects;

    // console.log("canvasObjArr = ",canvasObjArr);

    const emptyList = (
        <span>No Annotations Drawn!</span>
    );

    function AnnotListItem({id,shapeType}) {
        console.log("shape :: ",shapeType);
        return (
          <span>
            {shapeType}
          </span>
        )
      }

  return (
    <div className='annotlist'>
        {canvasObjArr.length === 0 ? emptyList : null}
        <ol>
            {canvasObjArr.map((shape,index) => {
                return <li key={index}><AnnotListItem shapeType={shape.type}/></li>
                // console.log("shape :: ",shape.type);
                })
            }
        </ol>
    </div>
  )
}

export default AnnotList