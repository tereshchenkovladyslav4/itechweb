import React, { useState, KeyboardEvent, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { IconButton, Input, ListItemIcon, ListSubheader } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { getCanvasFont, getTextWidth } from "../_helpers/measureText";
import { lexiconService } from "../_services/lexiconService";
import { ICaretPos, ILexicon, ISelectedText } from "./types";
import { trackPromise } from "react-promise-tracker";
import { useStyles } from "./Intellisense.style";

interface IAlternativePhraseProps {
  caretPos?: ICaretPos;
  selectedText?: ISelectedText;
  setSelectedText: React.Dispatch<React.SetStateAction<ISelectedText | undefined>>;
  autocompleteService: typeof lexiconService;
  onMouseLeave?():void;
}

const AlternativePhrase: React.FC<IAlternativePhraseProps> = ({
  caretPos,
  selectedText,
  setSelectedText,
  autocompleteService,
  onMouseLeave,
}) => {
  // display if have a selection and caretposition set and no autocomplete showing
  if (selectedText === undefined || !(caretPos || selectedText?.caretPos) || document.getElementById("autocomplete") ) {
    // console.log("renderAlternatives null caretPos, selectedText ", caretPos, selectedText);
    return null;
  }

  //   console.log("renderalternatives ", caretPos, selectedText);

  const classes = useStyles();
  const _queryId = "query";
  const [options, setOptions] = useState([...(selectedText.part.alternatives || [])]);
  //   const [options, setOptions] = useState(selectedText.part.alternatives || []);
  const [addAlternativeName, setAddAlternativeName] = useState<string>("");

  const query = document.getElementById(_queryId);
  const textWidth =
    selectedText && query ? getTextWidth(selectedText.text, getCanvasFont(query)) : 0;

  if (textWidth === 0) return null;

  // the currently selected rowids
  const selections = options?.filter((x) => x.selected).map((x) => x.rowId);

  const width = 100;

  useEffect(() => {
    setOptions([...(selectedText.part.alternatives || [])]);
    // setOptions(selectedText.part.alternatives || []);
  }, [selectedText]);

  const handleChange = (selectedVals: number[]) => {
    // console.log("handlechange");

    // update local state
    setOptions((prev) => {
      prev.map((x) => (x.selected = selectedVals.includes(x.rowId)));
      return [...prev];
    });

    setSelectedText((prev) => {
      if (prev) {
        const val = prev;
        // const val = { ...prev } as ISelectedText;
        if (val.part.alternatives) {
          val.part.alternatives.length = 0; // clear array - but keep instance
          for (let index = 0; index < options.length; index++) {
            const element = options[index];
            val.part.alternatives.push(element);
          }
          //   val.part.alternatives = options;
          return { ...prev } as ISelectedText;
        }
      }
    });
  };

  const handleClose = () => {
    setSelectedText(undefined);
  };

  const addAlternative = () => {
    if (selectedText?.text && addAlternativeName) {
      // call add api & refresh the alternatives from response.
      trackPromise(autocompleteService.addAlternative(selectedText.text, addAlternativeName)).then(
        (result) => {
          const alternatives = result.results as ILexicon[];
          const newItem = alternatives.find((x) => x.phrase === addAlternativeName);
          if (newItem) {
            newItem.selected = true;
            // todo - could be other new items ?
            setOptions((prev) => [...prev, newItem]);
          }
          // if(selectedText.part.alternatives){
          //   const newItems = alternatives.filter(x => !selectedText.part.alternatives?.includes)
          // }
          setSelectedText(prev => {
            if(prev){
                const additions = alternatives.filter(x => !prev.part.alternatives?.find(i => i.rowId === x.rowId));
                additions.forEach(a => prev.part.alternatives?.push(a));
            // prev.part.alternatives = [
            //     // ...new Set([...(prev.part.alternatives || []), ...additions]),
            //     ...(prev.part.alternatives || []), ...additions,
            //   ];
            return {...prev};
            }
          });
          // selectedText.part.alternatives = [...alternatives, ...(selectedText.part.alternatives || [])];
          // setAlternatives((result.results as ILexicon[]) ?? []);

          // setSelectedText((prev) => ({..prev}));
          setAddAlternativeName("");
        }
      );
    }
  };

  const onAddAlternativeChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    // console.log("add alternative change");
    setAddAlternativeName(e.target.value);
  };

  const ignoreOrAddOnEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      addAlternative();
    }
    // stop the event propagating to the select control ( would just select the item starting with the typed letter )
    e.stopPropagation();
  };

  const getPosition = (selectedText?:ISelectedText, caretPos?:ICaretPos) => {
    if(selectedText?.caretPos) return selectedText.caretPos;

    if(caretPos){
        const pos ={...caretPos};
        pos.left -= textWidth;
        return pos;
    }
  }
  const pos = getPosition(selectedText, caretPos);
  return (
    <List
      component="nav"
      dense={true}
      className={classes.autocomplete}
      style={{ top: pos?.top, left: pos?.left }}
      onMouseLeave={onMouseLeave}
      id="alternativePhrases"
    >
      <ListSubheader disableGutters={true} className={classes.autoItem}>
        <ListItem button className={classes.autoItem} onClick={handleClose} autoFocus>
          <ListItemIcon>
            <Close fontSize="small" style={{ marginLeft: width }} />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <Input
            style={{ width: width - 24 }}
            onChange={onAddAlternativeChange}
            value={addAlternativeName}
            onKeyDown={ignoreOrAddOnEnter}
          />
          <IconButton size="small" onClick={addAlternative}>
            <Add fontSize="small" />
          </IconButton>
        </ListItem>
      </ListSubheader>
      {options
        .sort((a, b) => a.phrase.localeCompare(b.phrase))
        .map((t, i) => (
          <ListItem
            button
            selected={t.selected}
            onClick={() => {
              let sel = selections;
              if (t.selected) {
                sel = sel.filter((x) => x !== t.rowId);
              } else {
                sel.push(t.rowId);
              }
              handleChange(sel);
            }}
            key={i}
            className={classes.autoItem}
          >
            <ListItemText primary={t.phrase} />
          </ListItem>
        ))}
    </List>
  );
};

export default AlternativePhrase;
