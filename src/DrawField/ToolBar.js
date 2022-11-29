import { useState } from "react";
import styled from "styled-components";

const ToolbarEL = styled.ul`
position : absolute;
z-index: 10;
top: ${props => props.top ?? 10}px;
left: ${props => props.left ?? 10}px;
list-style-type: none;
user-select: none;
justify-content: center;
    align-items: center;
li{
    display: inline-block;
    position: relative;
    margin: 0;
    padding: 5px;
    flex: 0 1 auto;
    list-style-type: none;
    height:30px;
    justify-content: center;
    align-items: center;


    background: #fff;
    box-shadow: 2px 5px 4px #Bbbbbf;
    transition: background ease-in-out 0.2s;
}
li:hover {
    background : #cbcbcb;
    box-shadow: 1px 3px 4px #Bbbbbf;
    
}
`;


const ColorInput = styled.input`
opacity: 0;
border: none;
-webkit-appearance: none;
::-webkit-color-swatch {
	border: none;
}
::-webkit-color-swatch-wrapper {
	padding: 0;
}

`;
const ColorInputWrapper = styled.div`
background : ${props => props.color};
overflow: hidden;
width: 30px;
border: solid 0px #ddd;
border-radius: 25px;
`;

const SelectEL = styled.select`
outline: none;
appearance: none;
line-height: inherit;
border: 1px solid #EEEEEE;
border-radius: 0.25em;
padding: 0.25em 0.5em;
font-size: 1em;
cursor: pointer;
background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
display: grid;
grid-template-areas: "select";
align-items: center;

::after {
    content: "";
    width: 0.8em;
    height: 0.5em;
    background-color: #cbcbcb;
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
    grid-area: select;
    justify-self: end;
  }
`;

export default function ToolBar(props){
    //let settings = props.settings;
    const [settings, setSettings] = useState(props.settings);
    const Callback = (e, rep) => {
        let s = settings;
        switch(rep){
            case "print":
                //disabeld
                break;
            case "stroke":
                s.stroke = e.target.value; 
                break;
            case "fill":
                s.fill = e.target.value;
                break;
            case "fopacity":
                s.fillOpacity = e.target.value;
                break;
            case "mode":
                console.log(e);
                s.mode = e.target.value;
                break;
            default:       
        }
        props.callback(s);
        setSettings(s);
    }
    
    return (
        <ToolbarEL top={10} left={10}>
            <li>
                <SelectEL onChange={(e) => Callback(e, "mode")}>
                    <option value="pen">Pen</option>
                    <option value="marker">Marker</option>
                    <option value="penfill">Pen with fill</option>
                </SelectEL>
            </li>
            <li>
                <ColorInputWrapper color={props.settings.stroke}>
                    <ColorInput type="color" value={props.settings.stroke} onChange={(e) => Callback(e, "stroke")}></ColorInput>
                </ColorInputWrapper>
           </li>
           {props.settings.mode ==='penfill'&& 
           <>
            <li>
                <ColorInputWrapper color={props.settings.fill}>
                    <ColorInput type="color" value={props.settings.fill} onChange={(e) => Callback(e, "fill")}></ColorInput>
                </ColorInputWrapper>
            </li>
             
            <li>
                <input type="range" min="0" max="1" step="0.05" onChange={(e) => Callback(e, "fopacity")}></input>
            </li>
            </>
            }
         { false && 
            <li onClick={(e) => {Callback(e, "print")}}>Print</li>
         }

        </ToolbarEL>
    )

}