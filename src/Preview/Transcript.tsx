import React, { useState, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { trackPromise } from "react-promise-tracker";
import { Grid, Switch, Typography } from "@mui/material";
import Translation from "./Translation";
import GoogleTranslate from "./GoogleTranslate";
import config from "../config";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import { Transcript as TranscriptModel } from "../Model/iTechRestApi/Transcript";
import { Word } from "../Model/iTechRestApi/Word";
import { useStyles } from "./Transcript.styles";

const textStyles = makeStyles(() => ({
  green: {
    color: "#00CC00",
    padding: "2px",
  },
  amber: {
    color: "#ffbf00",
    padding: "2px",
  },
  red: {
    color: "#FF0000",
    padding: "2px",
  },
  text: {
    padding: "2px",
  },
  hlghlight: {
    backgroundColor: "yellow",
  },
}));

interface IPhraseProps {
  data: Word;
  highlight: boolean;
  clickHandler(): void;
  useConfidence: boolean; // toggle colour coding for confidence
}

const Phrase = ({ clickHandler, data, highlight, useConfidence }: IPhraseProps) => {
  // i is 0 - 100 range
  const styles = textStyles();

  const getColor = (i: number | null): any => {
    if (!useConfidence) return styles.text;
    if (i === null) return styles.green;
    if (i < 33.33) return styles.red;
    if (i < 66.66) return styles.amber;
    return styles.green;
  };

  return (
    <span
      onClick={clickHandler}
      className={`${getColor(data.confidence)} ${highlight ? styles.hlghlight : ""}`}
    >
      {data.text}
    </span>
  );
};

interface ITranscriptProps {
  rowId: number;
  service(id: number): Promise<TranscriptModel>;
  seek(time: number): void;
  currentPosition(): number;
  playing: boolean;
}

const Transcript: React.FC<ITranscriptProps> = ({
  service,
  rowId,
  seek,
  currentPosition,
  playing,
}: ITranscriptProps) => {
  const classes = useStyles();
  const [words, setWords] = useState<TranscriptModel>();
  const [currentWord, setCurrentWord] = useState<number | undefined>(-1);
  const [showConfidence, setShowConfidence] = useState(false);
  const isMounted = useIsMounted();

  const calculateWordIndex = (currentPos: () => number) => {
    const pos = currentPos();

    if (words?.words === undefined) return;
    const next = words.words.findIndex((x: any) => x.timeIndex > pos);
    return next > 0 ? next - 1 : next === -1 ? words.words.length - 1 : next;
  };

  useEffect(() => {
    if (!rowId) return;

    setWords(undefined);
    setCurrentWord(-1);

    trackPromise(service(rowId))
      .then((result) => {
        if (!isMounted()) return;
        setWords(result);
        setCurrentWord(-1);
      })
      .catch((error) => {
        console.error(error);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowId]);

  useEffect(() => {
    if (!playing || !words?.words?.length) return;

    const timer = setInterval(() => {
      if (!isMounted()) return;
      setCurrentWord(calculateWordIndex(currentPosition));
    }, 100);

    return () => {
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  let prevSpeaker: string | null = null;

  type speakerContent = {
    speaker: string;
    content: indexedWord[];
  };

  type indexedWord = Word & {
    index: number;
  };

  const data: Array<speakerContent> = [];

  if (words?.words) {
    // map into an array of speaker -> text per change of speaker
    let currentSpeaker: speakerContent;
    words.words.map((x, i) => {
      const speakerChanged = prevSpeaker !== x.speaker || i == 0;
      prevSpeaker = x.speaker;
      if (speakerChanged) {
        currentSpeaker = { speaker: x.speaker, content: [] };
        data.push(currentSpeaker);
      }
      currentSpeaker.content.push({ ...x, index: i });
    });
  }

  // asummption is that speaker value is always S<number>
  const speakerName = (name: string) => name?.replace("S", "Speaker ");
  function handleSwitchChange() {
    setShowConfidence((prev) => !prev);
  }

  const hasWords = words?.text || (words?.words?.length ?? 0) > 0;

  return (
    <>
      {hasWords && (
        <>
          {config.sdlTranslateEnabled && <Translation rowId={rowId} />}
          {config.googleTranslateEnabled && <GoogleTranslate rowId={rowId} />}
          <Typography component="label" variant="body2" style={{ marginLeft: 20 }}>
            Display Confidence
          </Typography>
          <Switch checked={showConfidence} onChange={handleSwitchChange} color="primary" />
        </>
      )}

      {/* <FormControlLabel
        control={
          <Switch
            checked={showConfidence}
            onChange={handleSwitchChange}
            color="primary"
          />
        }
        label="Show Confidence"
      /> */}

      <div className={words?.words ? classes.root : classes.plainText}>
        {data &&
          data.map((x, ind) => (
            <Grid container item key={ind} className={classes.speakerContainer}>
              <div className={classes.speakerText}>{speakerName(x.speaker)}</div>
              {x.content?.map((w) => (
                <Phrase
                  key={w.index}
                  data={w}
                  highlight={currentWord === w.index}
                  useConfidence={showConfidence}
                  clickHandler={() => {
                    seek(w.timeIndex);
                    setCurrentWord(w.index);
                  }}
                />
              ))}
            </Grid>
          ))}

        {words?.text && <span>{words.text}</span>}
      </div>
    </>
  );
};

export default Transcript;
