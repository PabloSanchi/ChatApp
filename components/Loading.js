import React from 'react';
import { Circle } from 'better-react-spinkit';

function Loading() {
  return (
    <center style={{display: "grid", placeItems: "center", height: "100vh"}}>
        <div>
            <img src="https://cdn-icons-png.flaticon.com/512/159/159778.png" alt=""
            height={200}
            style={{marginBottom: 10}}
            />
            <Circle color="black" size={60}/>
        </div>

    </center>
  );
}

export default Loading;