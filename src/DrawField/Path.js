import styled from "styled-components";

const PathEl = styled.path`

`;

export default function Path(props){
    return(
        <path
        d={props.path}
        strokeWidth={props.strokeWidth}
        stroke={props.stroke}
        fillOpacity={props.fillOpacity}
        fill={props.fill}
        strokeOpacity={props.strokeOpacity}

        />
    );
}