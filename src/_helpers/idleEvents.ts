
export function resetIdleTimer(){
    doDispatch("soteria.userIdle.timeoutReset");
}

export function pauseIdleTimer(){
    doDispatch("soteria.userIdle.timeoutPause");
}

export function resumeIdleTimer(){
    doDispatch("soteria.userIdle.timeoutResume");
}

function doDispatch(eventName:string){
    window.dispatchEvent(new Event(eventName));
}