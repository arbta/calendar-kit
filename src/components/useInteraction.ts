import {useCallback, useRef} from "react";

export const useInteraction = ()=>{
    const interactionRef = useRef(false);
    const interactionHandler = useCallback(()=>{interactionRef.current = true}, [])

    return {
        interactionHandler,
        interactionRef
    }
}