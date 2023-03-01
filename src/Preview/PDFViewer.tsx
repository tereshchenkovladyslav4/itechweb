import React, { ReactElement, useEffect, useState } from 'react';
import * as pdfObject from 'pdfobject';
import _uniqueId from 'lodash/uniqueId';

// export type PageMode = 'bookmarks' | 'thumbs' | 'none';

// export type ViewMode =
//   | 'Fit'
//   | 'FitH'
//   | 'FitH,top'
//   | 'FitV'
//   | 'FitV,left'
//   | 'FitB'
//   | 'FitBH'
//   | 'FitBH,top'
//   | 'FitBV'
//   | 'FitBV,left';

// export type ZoomMode = 'scale' | 'scale,left,top';

// // https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf
// export interface OpenParams {
//   page?: number;
//   zoom?: ZoomMode;
//   nameddest?: string;
//   pagemode?: PageMode;
//   view?: ViewMode;
// }

export interface PDFProps extends pdfObject.Options {
  url: string;
  containerId?: string;
  containerProps?: React.HTMLProps<HTMLDivElement>;
}

const defaultProps:PDFProps = {
  url:'',
  width: '100%',
  height: '100%',
  containerId: 'pdfobjectId',
  forcePDFJS: false,
  assumptionMode: true,
};

export const PDFViewer: React.FC<PDFProps> = ({
    url,
    containerId,
    containerProps,
    ...options
  }) : ReactElement =>{

  const [uniqueContainerId] = useState(_uniqueId(containerId));

  const embed = () => {
    if (pdfObject) {
      pdfObject.embed(url, `#${uniqueContainerId}`, options);
    }
  };
  
  useEffect(() => {
    embed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (<div {...containerProps} id={uniqueContainerId} style={{width:'100%', height:'100%'}}/>);
}

PDFViewer.defaultProps = defaultProps;