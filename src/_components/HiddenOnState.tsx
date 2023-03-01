import React, { useEffect, useState } from "react";

interface IHiddenOnStateProps extends React.PropsWithChildren {
    show(): boolean;
}

const HiddenOnState: React.FC<IHiddenOnStateProps> = ({ show, children }) => {
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const isShowing = show();
        setShowPreview(isShowing);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show()]);

    if (showPreview) {
        return (<>{children}</>);
    }
    return (null);
}

export default HiddenOnState;