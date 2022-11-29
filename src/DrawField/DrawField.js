import { createRef, useEffect, useState } from "react";
import styled from "styled-components";
import Path from "./Path";
import ToolBar from "./ToolBar";
import JsPDF from 'jspdf';

const DF = styled.svg`
max-height: 100vh;
max-width: 100vw;
height: 100%;
width: 100%;
margin: 0;
touch-action: none; 
`;  

const defaultSettings = {
    mode: "pen",
    stroke: "#4b4b4c",
    strokeOpacity: 1,
    fill: "#4b4b4c",
    fillOpacity: 0,
    strokeLinecap: "round",
    strokeDasharray:"5,5"
}

export default function DrawField(props){

    const [objects, setObjects] = useState([]);
    const [settings, setSettings] = useState(defaultSettings)
    const [editing, setEditing] = useState(-1);
    let fieldref = createRef();

    const generatePDF = () => {
        const report = new JsPDF('landscape','pt','a4');
        report.html(document.querySelector('svg')).then(() => {
            report.save('report.pdf');
        });
    }

    const toolbarCallback = (parameters) => {
        if(parameters==="print"){
            generatePDF();
        }
        setSettings(parameters);
    }


    const getLineWidth = (e) => {
        console.log(e.pressure, e.pointerType);
        switch (e.pointerType) {
          case 'touch': {
            if (e.width < 10 && e.height < 10) {
              return (e.width + e.height) + 10;
            } else {
              return (e.width + e.height - 40) / 2;
            }
          }
          case 'pen': return settings.mode ==='marker' ? e.pressure * 50 : e.pressure * 8;
          default: return (e.pressure) ? e.pressure * 8 : 4;
        }
    }

    const penDown = (e) => {
        e.preventDefault();
        //fieldref.current.setPointerCapture(e.pointerId);
        let lw = getLineWidth(e) ?? 25;
        let element = {
            type: "path",
            id : objects.length,
            properties: {
                path: "M " + e.clientX +  " " + e.clientY + " ",
                stroke: settings.stroke,
                strokeWidth: lw,
                fillOpacity: settings.mode === 'penfill' ? settings.fillOpacity : 0,
                fill: settings.fill,
                strokeOpacity: settings.mode === 'marker' ? 0.3 : 1
            }
        }
        console.log(element.properties);
        setEditing(objects.length); 
        setObjects([...objects, element]);
        
    }

    const penUp = (e) => {
        //fieldref.current.releasePointerCapture(e.pointerId); 
        setEditing(-1);
    }

    const penMove = (e) => {
        if(editing<0){return}
        let copy = [...objects];
        copy.map((element, index) => 
        {
            if(element.id === editing) {
                element.properties.path += "L " + e.clientX + " " + e.clientY + " ";
            }
            return element;
        });
        setObjects(copy);
        //setEditing(editing);
    }   
    useEffect(()=>{
        //console.log(settings);
    })

    const _getWidthHeight = () => {
        let body = document.body, html = document.documentElement;
        let height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
        let width = body.clientWidth;
        return {width, height}
    }
    const _getViewBox = () => {
        let ratio = _getWidthHeight()
        return `0 0 ${ratio.width} ${ratio.height}`;
    }
    return(
        <>
        <DF id="svg" viewBox={_getViewBox()} ref={fieldref}>
        {objects.map((element, index) => {
        return(
        <Path
        key={index}
        path={element.properties.path}
        stroke={element.properties.stroke}
        strokeWidth={element.properties.strokeWidth}
        fillOpacity={element.properties.fillOpacity}
        fill={element.properties.fill}
        strokeOpacity={element.properties.strokeOpacity}
        />
        );    
        })}
        <rect x="0" y="0" width={_getWidthHeight().width} height={_getWidthHeight().height} fillOpacity={0} strokeOpacity={0}
         onPointerDown={(e) => penDown(e)}
         onPointerUp={(e) => penUp(e)}
         onPointerLeave={(e) => penUp(e)}
         onPointerOut={(e) => penUp(e)}
         onPointerCancel={(e) => penUp(e)}
         onPointerMove={(e) => penMove(e)}/>
        </DF>
        <ToolBar settings={settings} callback={toolbarCallback}/>
        </>
    )
}