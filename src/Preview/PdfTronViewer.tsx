import React, { useRef, useEffect, useState, ReactElement } from "react";
import WebViewer, { Core, WebViewerInstance } from "@pdftron/webviewer";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { CropFree, Download, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { termService } from "../_services/termService";
import { ITechDataTerm } from "../Model/iTechRestApi/ITechDataTerm";
import { iTechDataFilterEnum } from "../Model/iTechRestApi/iTechDataFilterEnum";
import { iTechDataTermEnum } from "../Model/iTechRestApi/iTechDataTermEnum";
import { authHeader } from "../_helpers/authHeader";
import { RefreshTableEvent, trigger } from "../_helpers/events";
import { RedactionType } from "../_services/fsiService";
import { off, on, RefreshPreviewEvent } from "../_helpers/events";
import { DocumentTerm } from "../Model/iTechRestApi/DocumentTerm";
import { Alert, ToggleButton } from "@mui/material";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import ColorDropdown from "../_components/ColorDropdown";
import { blue, brown, green, grey, orange, purple, red, teal, yellow } from "@mui/material/colors";
import { useReferredState } from "../_helpers/hooks/useReferredState";
// import { useDarkMode } from "../_helpers/hooks/useDarkMode";
import LabelSelect from "../_components/LabelSelect";

interface PdfTronViewerProps {
  urlBuilder: (
    fileType: string,
    fsiGuid: string,
    simRowId: number,
    redactionType: RedactionType
  ) => string;
  fileType: string;
  fsiGuid: string;
  redactionType: RedactionType;
  containerProps?: React.HTMLProps<HTMLDivElement>;
  termsService: typeof termService;
  allowRedactions?: boolean;
  showRedactionToggle?: boolean;
  simRowId?: number;
  downloadLink?: string;
  loadComplete?(): void;
  header?: ReactElement<any>;
}

enum Scope {
  currentCase = 1,
  allCases = 2,
  currentDocument = 3,
}

type TermResult = {
  term: string;
  ambient: string;
  start: number;
  end: number;
  pageNo: number;
  searchResult: any; // the pdftron serch result for jump to on click
  pageOccurrence: number; // added as repeat the search to do the highlighting
  color?: string;
};

type ResultsMap = { [name: string]: TermResult[] };

const redactionColors = [
  grey[900], // black
  red[500],
  blue[500],
  purple[500],
  green[500],
  teal[500],
  yellow[500],
  grey[500],
  orange[500],
  brown[500],
];

const createScript = (func: string) => {
  const frame: any = document.querySelector("iframe[id^='webviewer-']");

  // add once
  if (frame && frame.contentDocument.querySelector(".terms-panel-js") === null) {
    const scriptElm = document.createElement("script");
    scriptElm.setAttribute("class", "terms-panel-js");
    const inlineCode = document.createTextNode(func);
    scriptElm.appendChild(inlineCode);
    frame.contentDocument.body.appendChild(scriptElm);
  }
};

const createResultsDisplay = (
  data: DocumentTerm[],
  results: ResultsMap,
  viewer: WebViewerInstance,
  simRowId?: number
): string => {
  let content = "";

  // script as a string ( js ) as obfuscated in build otherwise and name won't match
  const scriptSrc = `
  
  function unredactTerm(id, simRowId) {
    // raise another event so we can get back in our ui code ( and use modules etc)
    const e = new CustomEvent("unredact", { detail: { id, simRowId } });

    document.dispatchEvent(e);
  };

  async function clickHandler(mode, term) {
    const docViewer = window.parent.documentViewer;
    docViewer.clearSearchResults();
    // scroll to the term and highlight it

    await new Promise((resolve) => {
      let foundCount = 0;
      const searchOptions = {
        fullSearch: true,
        startPage: term.pageNo,
        endPage: term.pageNo,
        // The callback function that is called when the search returns a result.
        onResult: (result) => {
          foundCount++;
          if (foundCount === term.pageOccurrence) {
            docViewer.displaySearchResult(result);
          }
        },
        onDocumentEnd: () => {
          resolve(true);
        },
      };

      docViewer.textSearchInit(term.term, mode, searchOptions);
    });
  }
`;

  createScript(scriptSrc);

  data.forEach((x) => {
    const bgColor = x.unredacted ? "background-color:#ffcdd2;" : "";
    const unredacted = x.unredacted ? " <strong>(unredacted)</strong>" : "";

    content += `<div style="${bgColor};padding-bottom:1px;margin-bottom:20px;">`;
    content += `<div><strong>${x.term}</strong>: ${x.count} result${
      x.count > 1 ? "s" : ""
    } found ${unredacted}<div style="float:right;margin-right:3px;"><button style="border:none;background-color:transparent" onClick="unredactTerm(${
      x.termId
    }, ${simRowId})">x</button></div></div>`;
    let terms = "";

    const result = results[x.term];

    if (result) {
      let pageNo = 0;
      result.forEach((r) => {
        if (pageNo != r.pageNo) {
          terms += `<div style="margin-top:10px;">Page ${r.pageNo}</div>`;
        }

        terms += `<div style="margin: 5px 0px;"><button class="SearchResult" onClick="clickHandler(${getSearchMode(
          x,
          viewer
        )},${JSON.stringify(r).replaceAll('"', "'")})">${r.ambient.slice(
          0,
          r.start
        )}<span class="search-value">${r.term}</span>${r.ambient.slice(r.end)}</button></div>`;

        pageNo = r.pageNo;
      });
      content += terms;
    }
    content += "</div>";
  });
  return content;
};

const getSearchMode = (term: DocumentTerm, instance: WebViewerInstance) => {
  let mode =
    instance.Core.Search.Mode.HIGHLIGHT | // Needs to have this option otherwise does not return the quads in result
    instance.Core.Search.Mode.AMBIENT_STRING; // Need this to get the ambient string and start and end pos of term within it
  mode |=
    term.matchType === 1
      ? instance.Core.Search.Mode.CASE_SENSITIVE | instance.Core.Search.Mode.WHOLE_WORD
      : term.matchType === 3
      ? instance.Core.Search.Mode.REGEX
      : 0;

  return mode;
};

// search text as promise...
const searchTermPromise = (
  term: DocumentTerm,
  instance: WebViewerInstance
): Promise<ResultsMap> => {
  // reset any previous count
  term.count = 0;

  return new Promise((resolve) => {
    const mode = getSearchMode(term, instance);

    const results: ResultsMap = {};
    let currPage = 0;
    let pageOccurrence = 0;
    const searchOptions = {
      // search of the entire document will be performed.
      fullSearch: true,
      startPage: 1,
      // The callback function that is called when the search returns a result.
      onResult: (result: any) => {
        if (result) {
          if (!results[term.term]) {
            results[term.term] = [];
          }
          if (currPage != result.pageNum) {
            pageOccurrence = 0;
            currPage = result.pageNum;
          }
          pageOccurrence++;
          results[term.term].push({
            term: result.resultStr,
            ambient: result.ambientStr,
            start: result.resultStrStart,
            end: result.resultStrEnd,
            pageNo: result.pageNum,
            searchResult: result,
            pageOccurrence: pageOccurrence,
          });
        }
        term.count++;
      },
      onDocumentEnd: () => {
        // add an entry if no results for this term so we know we've searched for it
        if (!results[term.term]) {
          results[term.term] = [];
        }
        resolve(results);
      },
    };

    instance.Core.documentViewer.textSearchInit(term.term, mode, searchOptions);
  });
};

type Pt = {
  x: number;
  y: number;
};

const PdfTronViewer: React.FC<PdfTronViewerProps> = ({
  urlBuilder,
  fileType,
  fsiGuid,
  redactionType,
  containerProps,
  termsService,
  simRowId,
  allowRedactions = false,
  showRedactionToggle = false,
  downloadLink,
  loadComplete = undefined,
  header,         // optional component to render above the document - used for email properties
}: PdfTronViewerProps) => {
  // TEST ONLY
  // allowRedactions = true;
  // showRedactionToggle = true;
  // redactionType = RedactionType.strikeout;
  // END TEST

  const viewerDiv = useRef<HTMLDivElement>(null);
  const viewer = useRef<Core.DocumentViewer | null>(null);
  const viewInstance = useRef<WebViewerInstance>();
  const [selectedText, setSelectedText] = useState<string>();
  const [matchType, setMatchType] = useState<number>(iTechDataFilterEnum.exact);
  const [scope, setScope] = useState<number>(1);
  const [viewRedactionType, setViewRedactionType] = useState<RedactionType>(redactionType);
  const [documentTerms, documentTermsRef, setDocumentTerms] = useReferredState<DocumentTerm[]>([]);
  const [searchResults, setSearchResults] = useState<ResultsMap>({});
  const [url, setUrl] = useState<string>(
    urlBuilder(fileType, fsiGuid, simRowId || 0, redactionType)
  );
  const [error, setError] = useState<string>("");
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [color, colorRef, setColor] = useReferredState(grey[900] as string);
  const [mouseDown, setMouseDown] = useState<Pt>();
  const [mouseUp, setMouseUp] = useState<Pt>();
  const [areaSelectMode, areaSelectModeRef, setAreaSelectMode] = useReferredState(false); // ref value for use in eventhandlers
  const simRowIdRef = useRef(simRowId);
  // const [theme] = useDarkMode();

  const [instances, setInstances] = useState<number | undefined>(); // count of search results
  const [currentInstance, setCurrentInstance] = useState<number>(1);

  // set to current each render
  simRowIdRef.current = simRowId;

  const matchTypes = [
    {
      rowId: iTechDataFilterEnum.exact,
      description: "Exact Match",
      toolTip: "Matches only at whole word(s) boundaries, case sensitive",
    },
    {
      rowId: iTechDataFilterEnum.pattern,
      description: "Pattern Match",
      toolTip: "Matches within words, ignores case",
    },
    {
      rowId: iTechDataFilterEnum.regex,
      description: "Regex",
      toolTip: "Matches regular expression",
    },
  ];

  const redactionScope = [
    { rowId: Scope.currentCase, description: "Current Case" },
    { rowId: Scope.allCases, description: "All Cases" },
    { rowId: Scope.currentDocument, description: "Current Document" },
  ];

  const _handleRefresh = () => {
    setToggleUpdate((prev) => !prev);
  };

  // API call for document terms.. this should address delay issue in getting initial count of terms too..
  // uses ref as called from event handler
  const getTerms = () => {
    if (simRowIdRef.current !== undefined && !documentTermsRef.current?.length) {
      termService.getDocumentTerms(simRowIdRef.current).then((terms) => setDocumentTerms(terms));
    }
  };

  useEffect(() => {
    if (documentTerms && documentTerms.length && viewInstance?.current) {
      (async () => {
        await countTerms(documentTerms, viewInstance?.current);
      })();
    }
  }, [documentTerms]);

  useEffect(() => {
    if (viewInstance?.current) {
      replaceTermsPanelContent();
    }
  }, [searchResults]);

  useEffect(() => {
    // clear the instance count for search term & highlighting of terms as text changed OR preview type changed
    if (instances) {
      setInstances(undefined);
      setCurrentInstance(1);
      viewer.current?.clearSearchResults();
    }
  }, [selectedText, viewRedactionType, matchType]);

  useEffect(() => {
    const instance = viewInstance.current;
    if (
      instance &&
      areaSelectMode &&
      mouseDown &&
      mouseUp &&
      mouseUp.x != mouseDown.x &&
      mouseUp.y != mouseDown.y
    ) {
      const { Annotations, annotationManager } = instance.Core;
      const zoom = 1; // instance.docViewer.getZoom();

      const opacity = viewRedactionType === RedactionType.strikeout ? 0.4 : 1;
      const color = getColor() || new Annotations.Color(0, 0, 0);

      const displayMode = instance.Core.documentViewer.getDisplayModeManager().getDisplayMode();
      // takes a start and end point but we just want to see where a single point is located
      const page = displayMode.getSelectedPages(mouseDown, mouseDown);
      const clickedPage =
        page.first !== null ? page.first : instance.Core.documentViewer.getCurrentPage() - 1;

      // convert to deal with click and drag from any corner / direction
      const rectDown = { x: Math.min(mouseDown.x, mouseUp.x), y: Math.min(mouseDown.y, mouseUp.y) };
      const rectUp = { x: Math.max(mouseDown.x, mouseUp.x), y: Math.max(mouseDown.y, mouseUp.y) };

      const down = displayMode.windowToPage(rectDown, clickedPage);
      const up = displayMode.windowToPage(rectUp, clickedPage);

      const rectangleAnnot = new Annotations.RectangleAnnotation();
      rectangleAnnot.PageNumber = clickedPage;
      // values are in page coordinates with (0, 0) in the top left
      rectangleAnnot.X = down.x * zoom;
      rectangleAnnot.Y = down.y * zoom;
      rectangleAnnot.Width = Math.abs(down.x - up.x) * zoom;
      rectangleAnnot.Height = Math.abs(down.y - up.y) * zoom;
      rectangleAnnot.StrokeColor = color;
      rectangleAnnot.Opacity = opacity;
      rectangleAnnot.FillColor = color;

      // disable these until hook up the change event / api update
      // rectangleAnnot.NoMove = true;
      // rectangleAnnot.NoResize = true;

      // persist this area to API
      // N.B. will have to store an Id in the rect to tie the item back to api storage so can process delete / move / resize

      termService
        .addArea(
          {
            rowId: 0,
            x: rectangleAnnot.X,
            y: rectangleAnnot.Y,
            height: rectangleAnnot.Height,
            width: rectangleAnnot.Width,
            pageNumber: rectangleAnnot.PageNumber,
            color: "",
          },
          simRowId,
          { color: color.toHexString().toLowerCase() }
        )
        .then((rsp) => {
          // prefix as in the API so can determine the areas easily from all annotations
          rectangleAnnot.Id = "area:" + rsp.rowId;

          annotationManager.addAnnotation(rectangleAnnot);
          // need to draw the annotation otherwise it won't show up until the page is refreshed
          annotationManager.redrawAnnotation(rectangleAnnot);
        })
        .catch((error) => {
          setError(error.message || error);
        });

      setAreaSelectMode(false);
    }
  }, [mouseUp]);

  useEffect(() => {
    const instance = viewInstance.current;
    if (instance) {
      const Feature = instance.UI.Feature.TextSelection;

      areaSelectMode
        ? instance.UI.disableFeatures([Feature])
        : instance.UI.enableFeatures([Feature]);
    }
  }, [areaSelectMode]);

  const onColorChange = (col: string) => {
    setColor(col);
    const instance = viewInstance.current;
    if (instance) {
      const { annotationManager, Annotations } = instance.Core;
      const selectedAnnots = annotationManager.getSelectedAnnotations();
      selectedAnnots.forEach((a: any) => {
        const newColor = getColor(col) || new Annotations.Color(0, 0, 0);
        a.FillColor = newColor;
        a.StrokeColor = newColor;
        annotationManager.redrawAnnotation(a);

        // persist change to api
        updateArea(a);
      });
    }
  };

  const load = () => {
    if (viewInstance.current) {
      // clear previous doc terms / results
      setDocumentTerms([]);
      setSearchResults({});

      viewInstance.current.UI.loadDocument(url, {
        extension: "pdf",
        // useDownloader: false,
        customHeaders: authHeader(),
      });
     
    }
  };

  const deleteArea = (areaId: number) => {
    if (simRowId) {
      return termsService.deleteArea(areaId, simRowId);
    }
    return Promise.reject();
  };

  const updateArea = (area: any) => {
    const instance = viewInstance.current;
    if (instance) {
      termService.updateArea(
        {
          rowId: Number(area.Id.split(":")[1]),
          x: area.X,
          y: area.Y,
          height: area.Height,
          width: area.Width,
          pageNumber: area.PageNumber,
          color: "",
        },
        simRowId,
        { color: colorRef.current } // ref as event based
      );
    }
  };

  const handleAnnotationChange = (action: string, annot: any) => {
    switch (action) {
      case "add":
        break;
      case "delete":
        {
          // only process for areas:
          const parts = annot.Id.split(":");
          if (parts.length === 2 && parts[0] === "area") {
            deleteArea(Number(parts[1]));
          }
        }
        break;
      case "modify":
        updateArea(annot);
        break;
    }
  };

  // Left hand terms panel shows where each term is in document + number of instances
  const countTerms = async (terms: DocumentTerm[], instance?: WebViewerInstance) => {
    if (!instance) return;
    let results: ResultsMap = {};

    // wrap each term search in a promise... can only perform one at a time.
    const unCountedTerms = terms.filter((t) => searchResults[t.term] === undefined);
    // console.log("uncounted terms: " + unCountedTerms.length);
    for (let i = 0; i < unCountedTerms.length; i++) {
      const search = await searchTermPromise(unCountedTerms[i], instance);
      results = { ...results, ...search };
    }

    // Object.entries(results).forEach(([key, value]) => {
    //   if (value.length > 0) console.log(key + " count: " + value.length);
    // });

    // store new results combined with existing.
    setSearchResults((prev) => ({ ...prev, ...results }));
  };

  const termsPanel = {
    tab: {
      dataElement: "termsPanelTab",
      title: "Terms",
      img: "ic_annotation_freetext_black_24px", // can be a url or name of an svg in webviewer
    },
    panel: {
      dataElement: "termsPanel",
      render: function () {
        // this function is called once on creation of pdf viewer.
        // we manually re-call it when terms change
        const div = document.createElement("div");
        div.style.marginLeft = "16px";

        const displayTerms = documentTerms
          .filter((x) => x.count > 0)
          .sort((x, y) => (x.count > y.count ? -1 : 1));

        if (displayTerms.length && viewInstance.current) {
          const str = createResultsDisplay(
            displayTerms,
            searchResults,
            viewInstance.current,
            simRowId
          );
          div.innerHTML = str;
        } else {
          div.innerHTML = "<div>No terms found</div>";
        }
        return div;
      },
    },
  };

  const replaceTermsPanelContent = () => {
    const frame: any = document.querySelector("iframe[id^='webviewer-']");
    if (frame) {
      const content = termsPanel.panel.render();
      const el = frame.contentDocument.querySelector("[data-element='termsPanel']");

      if (el) el.innerHTML = content.outerHTML;
    }
  };

  // id is the term id
  async function handleUnredactTerm(id: number, simRowId: number) {
    const term = await termService.unredactTerm(id, simRowId);

    const updateTerm = documentTermsRef.current.find((x) => x.termId === term.iTechLinkedRowId);
    if (updateTerm) {
      updateTerm.unredacted = !updateTerm?.unredacted;
      if (updateTerm.unredacted) {
        removeTermAnnotation(updateTerm.termId);
      } else {
        // add it back in
        readdTermAnnotation(updateTerm);
      }
      setDocumentTerms([...documentTermsRef.current]);
      // setDocumentTerms((prev) => [...documentTermsRef.current]);
    }
    return term;
  }

  function handleTermClick(e: CustomEvent) {
    handleUnredactTerm(e.detail.id, e.detail.simRowId);
  }

  useEffect(() => {
    on(RefreshPreviewEvent, _handleRefresh);
    if (!viewer.current) {
      WebViewer(
        {
          path: "/pdftron",
          // initialDoc: url,
          useDownloader: false,
          extension: "pdf",
          enableAnnotations: true,
          enableRedaction: false,
          fullAPI: true,

          // TODO licenseKey:
        },
        viewerDiv.current as HTMLDivElement
      ).then((instance) => {
        const { documentViewer, Tools, annotationManager } = instance.Core;
        // const { setTheme } = instance.UI;
        const tool = new Tools.Tool(documentViewer);
        viewInstance.current = instance;
        viewer.current = documentViewer;

        // if (theme === "dark") {
        //   setTheme("dark");
        // }

        instance.UI.setCustomPanel(termsPanel);
        const win: any = window;
        win.documentViewer = documentViewer;

        annotationManager.disableFreeformRotation();

        // implementation for change pos / size of rectangle annotations or delete
        annotationManager.addEventListener(
          "annotationChanged",
          (annotations, action, { imported }) => {
            if (!imported) {
              annotations.forEach((a: any) => handleAnnotationChange(action, a));
            }
          }
        );

        // set the color dropdown to that of the selected item
        annotationManager.addEventListener("annotationSelected", (annotations, action) => {
          if (action === "selected") {
            const annot = annotations[0] as any;
            if (annot.Color) {
              const col = annot.Color.toHexString().toLowerCase();
              setColor(col);
            }
          }
        });

        // handle the unredact click through a custom event as can then use the webpacked js modules
        const frame: any = document.querySelector("iframe[id^='webviewer-']");
        if (frame) {
          frame.contentDocument.addEventListener("unredact", handleTermClick, false);
        }
        documentViewer.addEventListener("mouseLeftDown", (e) => {
          if (areaSelectModeRef.current) {
            const c = tool.getMouseLocation(e);
            setMouseDown(c);
          }
        });

        documentViewer.addEventListener("mouseLeftUp", (e) => {
          if (areaSelectModeRef.current) {
            const c = tool.getMouseLocation(e);
            setMouseUp({ ...c });
          }
        });

        // using this rather than documentLoaded as get incomplete search results for the terms
        // this event fired after documentLoaded... and it seems the document is then complete
        documentViewer.addEventListener("annotationsLoaded", () => {
          // console.log("annotationsLoaded event");
          getTerms();
        });
        documentViewer.addEventListener("documentLoaded", () => {
          if (loadComplete) {
            loadComplete();
          }
        });

        instance.UI.disableElements(["ribbons"]);
        instance.UI.disableElements(["toolbarGroup-Shapes"]);
        instance.UI.disableElements(["toolbarGroup-Edit"]);
        instance.UI.disableElements(["toolbarGroup-Insert"]);
        instance.UI.disableElements(["toolbarGroup-Comments"]);
        instance.UI.setToolbarGroup("toolbarGroup-View", false);
        //instance.disableElements(["leftPanel", "leftPanelButton"]);
        // buttons in the leftpanel toolbar
        // instance.disableElements(['thumbnailsPanelButton']);
        instance.UI.disableElements(["outlinesPanelButton", "signaturePanelButton"]);

        instance.UI.disableElements(["selectToolButton"]);
        instance.UI.disableElements([
          "panToolButton",
          "menuButton",
          "toolsButton",
          "miscToolGroupButton",
        ]);
        instance.UI.disableElements([
          "copyTextButton",
          "textHighlightToolButton",
          "textUnderlineToolButton",
          "textSquigglyToolButton",
          "linkButton",
          "textStrikeoutToolButton",
        ]);

        instance.UI.disableElements([
          //   "annotationPopup",
          "annotationStylePopup",
          "toolStylePopup",
          "stylePopup",
          "contextMenuPopup",
          "textPopup",
        ]);
        instance.UI.setAnnotationContentOverlayHandler(() => {
          return false;
        });

        // disable options to edit / use on viewer
        const Feature = instance.UI.Feature;
        instance.UI.disableFeatures([Feature.Download, Feature.FilePicker, Feature.NotesPanel]);

        // for new version - disable the left panel / right hand search button
        // instance.UI.disableElements(["leftPanel", "leftPanelButton", "searchButton"]);
        instance.UI.disableElements(["searchButton"]);

        documentViewer
          .getTool("TextSelect")
          .addEventListener("selectionComplete", (/*startQuad, allQuads*/) => {
            // the startQuad and allQuads have the X and Y values
            if (!areaSelectMode) {
              showSelectedText();
            }
          });

        load();
      });
    }

    return () => {
      off(RefreshPreviewEvent, _handleRefresh);
      const frame: any = document.querySelector("iframe[id^='webviewer-']");
      if (frame) {
        frame.contentDocument.removeEventListener("unredact", handleTermClick);
      }
      if (viewer.current) {
        viewer.current.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (viewer.current) {
      load();
    }
  }, [url, toggleUpdate]);

  useEffect(() => {
    setViewRedactionType(redactionType);
  }, [redactionType]);

  useEffect(() => {
    setUrl(urlBuilder(fileType, fsiGuid, simRowId || 0, viewRedactionType));
  }, [fileType, fsiGuid, simRowId, viewRedactionType, urlBuilder]);

  const getColor = (col: string = color) => {
    const val = col?.length ? col.replace("#", "") : color.replace("#", "");
    const instance = viewInstance.current;

    if (instance)
      return new instance.Core.Annotations.Color(
        Number("0x" + val.substring(0, 2)),
        Number("0x" + val.substring(2, 4)),
        Number("0x" + val.substring(4, 6))
      );
  };

  const removeTermAnnotation = (id: number) => {
    const t = viewInstance.current?.Core.Annotations.TextStrikeoutAnnotation;
    const instance = viewInstance.current;
    if (!t || !instance) return;

    const redactionList = instance.Core.annotationManager
      .getAnnotationsList()
      .filter((a) => a instanceof t && a.getCustomData("term") === id.toString());

    instance.Core.annotationManager.deleteAnnotations(redactionList);
  };

  const readdTermAnnotation = (term: DocumentTerm) => {
    const instance = viewInstance.current;
    if (!instance) return;
    const mode = getSearchMode(
      {
        term: term.term,
        matchType: term.matchType,
        count: 0,
        termId: term.termId,
        unredacted: false,
        color: "",
      },
      instance
    );

    let count = 0;
    const results: ResultsMap = {};
    let currPage = 0;
    let pageOccurrence = 0;
    const searchOptions = {
      // search of the entire document will be performed.
      fullSearch: true,
      // The callback function that is called when the search returns a result.
      onResult: (result: any) => {
        if (result?.quads?.length) {
          const strikeout = new instance.Core.Annotations.TextStrikeoutAnnotation();
          strikeout.Quads = result.quads.map((q: { getPoints: () => Core.Math.Quad[] }) =>
            q.getPoints()
          );
          strikeout.PageNumber = result.pageNum;
          // use term color
          const selectedColor = getColor(term.color);
          if (selectedColor) {
            strikeout.StrokeColor = selectedColor;
          }
          strikeout.setCustomData("term", term.termId.toString());

          const annotManager = instance.Core.annotationManager;
          if (annotManager) {
            annotManager.addAnnotation(strikeout);
          }
        }
        count++;
        if (!results[term.term]) {
          results[term.term] = [];
        }
        if (currPage != result.pageNum) {
          pageOccurrence = 0;
          currPage = result.pageNum;
        }
        pageOccurrence++;
        results[term.term].push({
          term: result.resultStr,
          ambient: result.ambientStr,
          start: result.resultStrStart,
          end: result.resultStrEnd,
          pageNo: result.pageNum,
          searchResult: result,
          pageOccurrence: pageOccurrence,
          color: color,
        });
      },
      onDocumentEnd: () => {
        // if the term was found..
        if (count !== 0) {
          // display the strikeouts once complete
          const t = viewInstance.current?.Core.Annotations.TextStrikeoutAnnotation;
          if (!t || !viewInstance?.current) return;

          const redactionList = instance.Core.annotationManager
            .getAnnotationsList()
            .filter((a) => a instanceof t);

          instance.Core.annotationManager.showAnnotations(redactionList);

          // store / replace results for this term
          setSearchResults((prev) => ({ ...prev, ...results }));
        }
      },
    };

    instance.Core.documentViewer.textSearchInit(term.term, mode, searchOptions);
  };

  // apply term as strikeout to loaded pdf + add term to iTechDataTerm & iTechDataTermToTableReference in DB
  const applyTermRedaction = () => {
    if (!selectedText) return;

    setError("");
    const term = new ITechDataTerm();
    term.term = selectedText;
    term.iTechDataFilterTypeRowId = matchType;
    term.iTechDataTermTypeRowId = iTechDataTermEnum.adHoc;
    term.addToAllCases = scope === Scope.allCases;

    let rowId: number | undefined = undefined;
    if (scope === Scope.currentDocument) {
      // only pass in the simRowId to terms.add when link for a single doc
      rowId = simRowId;
    }

    termsService
      .add(term, rowId, { color: color })
      .then((newTerm) => {
        term.rowId = newTerm.rowId;
        // would be better if could differentiate if it was a new added term by the result.

        // only process redaction in browser now successfully added to terms

        // perform search & strikeout the term.
        const instance = viewInstance.current;

        if (instance) {
          const mode = getSearchMode(
            {
              term: term.term,
              matchType: matchType,
              count: 0,
              termId: term.rowId,
              unredacted: false,
              color: "",
            },
            instance
          );

          let count = 0;
          const results: ResultsMap = {};
          let currPage = 0;
          let pageOccurrence = 0;
          const searchOptions = {
            // search of the entire document will be performed.
            fullSearch: true,
            // The callback function that is called when the search returns a result.
            onResult: (result: any) => {
              if (result?.quads?.length) {
                const strikeout = new instance.Core.Annotations.TextStrikeoutAnnotation();
                strikeout.Quads = result.quads.map((q: { getPoints: () => Core.Math.Quad[] }) =>
                  q.getPoints()
                );
                strikeout.PageNumber = result.pageNum;
                // use selected color
                const selectedColor = getColor();
                if (selectedColor) {
                  strikeout.StrokeColor = selectedColor;
                }
                strikeout.setCustomData("term", term.rowId.toString());

                const annotManager = instance.Core.annotationManager;
                if (annotManager) {
                  annotManager.addAnnotation(strikeout);
                }
              }
              count++;
              if (!results[term.term]) {
                results[term.term] = [];
              }
              if (currPage != result.pageNum) {
                pageOccurrence = 0;
                currPage = result.pageNum;
              }
              pageOccurrence++;
              results[term.term].push({
                term: result.resultStr,
                ambient: result.ambientStr,
                start: result.resultStrStart,
                end: result.resultStrEnd,
                pageNo: result.pageNum,
                searchResult: result,
                pageOccurrence: pageOccurrence,
                color: color,
              });
            },
            onDocumentEnd: () => {
              // if the term was found..
              if (count !== 0) {
                // display the strikeouts once complete
                const t = viewInstance.current?.Core.Annotations.TextStrikeoutAnnotation;
                if (!t || !viewInstance?.current) return;

                const redactionList = instance.Core.annotationManager
                  .getAnnotationsList()
                  .filter((a) => a instanceof t);

                instance.Core.annotationManager.showAnnotations(redactionList);

                // store / replace results for this term
                setSearchResults((prev) => ({ ...prev, ...results }));

                // Add the new term if not already present
                if (!documentTerms.some((t) => t.term === selectedText)) {
                  setDocumentTerms([
                    ...documentTerms,
                    {
                      term: selectedText,
                      matchType: matchType,
                      count: count,
                      termId: term.rowId,
                      unredacted: false,
                      color: color.toLowerCase(),
                    },
                  ]);
                  // setDocumentTerms((prev) => [
                  //   ...prev,
                  //   {
                  //     term: selectedText,
                  //     matchType: matchType,
                  //     count: count,
                  //     termId: term.rowId,
                  //     unredacted: false,
                  //   },
                  // ]);
                }
              }
            },
          };

          instance.Core.documentViewer.textSearchInit(selectedText, mode, searchOptions);
        }

        // refersh terms grid if displayed
        trigger(RefreshTableEvent, { dataSource: TableEnum[TableEnum.iTechWebTerm] });
      })
      .catch((err) => {
        if (typeof err === "object") {
          // we only have a Term field currently.
          setError(err.Term || err.message);
        } else setError(err);
      });
  };

  const selectMatchType = (e: any) => {
    setMatchType(e.target.value);
  };

  const selectScope = (e: any) => {
    setScope(e.target.value);
  };

  const showSelectedText = () => {
    if (!viewer.current) return;
    const page = viewer.current.getCurrentPage();
    const text = viewer.current.getSelectedText(page);
    if (text && text.length) {
      setSelectedText(text.replaceAll("\n", " "));
    }
  };

  const viewOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setViewRedactionType(event.target.checked ? RedactionType.redact : RedactionType.strikeout);
  };

  const heightAdjust = allowRedactions || showRedactionToggle ? 66 : 30; // 30 for download button, 66 for button + redaction menu bar

  const DoSearch = () => {
    setInstances(undefined);
    setCurrentInstance(1);
    viewer.current?.clearSearchResults();
    if (selectedText && viewInstance.current) {
      const term = { term: selectedText, count: 0, matchType: matchType } as DocumentTerm;
      searchTermPromise(term, viewInstance.current).then((res) => {
        setInstances(res[term.term].length); // may not need this,,
        // setSearchResults(res);
        setSearchResults((prev) => ({ ...prev, ...res }));

        if (res[term.term]) {
          // get the result objects & highlight them
          const arr = res[term.term].map((x) => x.searchResult);
          viewer.current?.displayAdditionalSearchResults(arr);

          // set first result as active
          viewer.current?.setActiveSearchResult(arr[0]);
        }
      });
    }
  };

  const highlightTerm = (pos: number) => {
    let index = 0;
    // this is relying on selectedText not being changed
    const results = searchResults[selectedText || ""];
    setCurrentInstance((prev) => {
      index = prev + pos;
      if (results) {
        if (index > results.length) index = 1;
        if (index <= 0) index = results.length;
        return index;
      }
      index = prev;
      return prev;
    });

    viewer.current?.setActiveSearchResult(results[index - 1].searchResult);
  };

  return (
    <>
      {(allowRedactions || showRedactionToggle || downloadLink) && (
        <div
          style={{
            marginRight: 4,
            marginLeft: 10,
            marginTop: 4,
          }}
        >
          <Grid container alignItems="center" spacing={1}>

            {(showRedactionToggle || downloadLink) && (
              <>
                <Grid container alignItems="center" justifyContent="flex-end" item xs={12}>
                  <Grid item xs={4}></Grid>
                  <Grid container item xs={6} flexDirection={"column"} alignItems="center">
                    {showRedactionToggle && (
                      <>
                    <Typography variant="body2">Preview redactions as</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>Strikeout</Typography>
                      <Switch
                        checked={viewRedactionType === RedactionType.redact}
                        onChange={viewOptionChange}
                        color="primary"
                      />
                      <Typography>Redacted</Typography>
                    </Stack>
                    </>
                    )}
                  </Grid>
                  <Grid container item xs={2} justifyContent="flex-end">
                    {downloadLink && (
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<Download />}
                        href={downloadLink}
                        style={{ backgroundColor: "#F6F6F6" }}
                      >
                        Download
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </div>
      )}
      <Grid container alignItems="center" style={{ marginTop: 5 }}>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
      </Grid>

      <div
        {...containerProps}
        style={{
          height: `calc(100% - ${heightAdjust}px)`,
          clear: "both",
          display: "flex",
          flexFlow: "row",
        }}
      >
        {allowRedactions && (
          <div style={{ width: "20%", marginLeft: 8, minWidth: 202 }}>
            <Typography variant="h5">Actions</Typography>
            <Grid item xs={9}>
              <TextField
                name="redactText"
                InputLabelProps={{ shrink: true }}
                label="Search"
                value={selectedText || ""}
                style={{ marginRight: 15, marginTop: 14 }}
                onChange={(e: any) => setSelectedText(e.target.value)}
              />
              <Button size="small" style={{ marginTop: 15 }} onClick={DoSearch}>
                Search
              </Button>
              <FormControl style={{ minWidth: 120, marginRight: 20, marginTop: 14 }}>
                <LabelSelect label="Match Type" onChange={selectMatchType} value={matchType || ""}>
                  {matchTypes?.map((type) => (
                    <MenuItem key={type.rowId} value={type.rowId}>
                      <Tooltip title={type.toolTip ?? ""} placement="right-end">
                        <span>{type.description}</span>
                      </Tooltip>
                    </MenuItem>
                  ))}
                </LabelSelect>
              </FormControl>

              <div
                style={{ justifyContent: "center", display: "flex", marginTop: 5, marginBottom: 5 }}
              >
                {instances ? (
                  <>
                    <IconButton size="small" onClick={() => highlightTerm(-1)}>
                      <KeyboardArrowLeft />
                    </IconButton>
                    <Typography variant="body1" style={{ margin: 5 }} >
                      {`${currentInstance} of ${instances} instances`}
                    </Typography>
                    <IconButton size="small" onClick={() => highlightTerm(1)}>
                      <KeyboardArrowRight />
                    </IconButton>
                  </>
                ) : (
                  <div style={{ height: 37.4, width: "100%" }}></div>
                )}
              </div>

              <Grid container>
                <FormControl
                  style={{ minWidth: 165, marginRight: 8, marginTop: 14, marginBottom: 10 }}
                >
                  <LabelSelect label="Apply To" onChange={selectScope} value={scope || ""}>
                    {redactionScope?.map((type) => (
                      <MenuItem key={type.rowId} value={type.rowId}>
                        {type.description}
                      </MenuItem>
                    ))}
                  </LabelSelect>
                </FormControl>
              </Grid>
              <Grid container>
              <Tooltip title="redaction / strikeout colour" placement="right-end">
                <FormControl style={{ minWidth: 50, marginRight: 8 }}>
                  <InputLabel shrink>Colour</InputLabel>
                    <ColorDropdown
                      items={redactionColors}
                      value={color}
                      onChange={(e) => onColorChange(e.target.value as string)}
                    />
                </FormControl>
                </Tooltip>
                 <FormControl style={{ minWidth: 40, marginRight: 20 }}>
                  <InputLabel shrink>Area</InputLabel>
                  <Tooltip title="switch to area selection mode" placement="right-end">
                    <ToggleButton
                      selected={areaSelectMode}
                      size="small"
                      value={true}
                      disabled={!simRowId}
                      onChange={() => {
                        setAreaSelectMode(!areaSelectMode);
                      }}
                      style={{ marginTop: 14 }}
                    >
                      <CropFree />
                    </ToggleButton>
                  </Tooltip>
                </FormControl>
                <Grid xs={6} container item justifyContent="flex-end">
                  <Tooltip title="Apply Redaction" placement="right-end">
                    <Button
                      onClick={applyTermRedaction}
                      size="small"
                      style={{ marginTop: 15, marginRight: 4 }}
                    >
                      Redact
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </div>
        )}
        <Grid container item flexDirection="column">
          {header !== undefined && <div>{header}</div>}
          <div
            className="webviewer"
            ref={viewerDiv}
            style={{ height: "100vh", maxHeight: "100%" }}
          ></div>
        </Grid>
      </div>
    </>
  );
};

export default PdfTronViewer;
