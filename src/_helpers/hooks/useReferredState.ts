import { useRef, useState } from "react";

// state / ref wrapper - used for state that also needs to be accessed in an eventhandler ( via the ref )
export const useReferredState = <S>(
    initialValue: S,
    // statefn:<S>(initial:S| (() => S)) => [S, Dispatch<SetStateAction<S>>] = useState // optional state func
): [S, React.MutableRefObject<S>, React.Dispatch<S>] => {
    const [state, setState] = useState<S>(initialValue);
    const reference = useRef<S>(state);

    const setReferredState = (value:S) => {
        reference.current = value;
        setState(value);
    };

    return [state, reference, setReferredState];
};