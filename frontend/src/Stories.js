import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ClipboardIcon from "@material-ui/icons/Assignment";
import { useStyles } from "./useStyles";
import { useStateWithLocalStorage } from "./useStateWithLocalStorage";
import clsx from "clsx";
import * as clipboard from "clipboard-polyfill/dist/clipboard-polyfill.promise";
import dateFormat from "dateformat";
import StoryForm from "./StoryForm";

export default function Stories() {
  const classes = useStyles();
  const [stories, setStories] = useStateWithLocalStorage(
    "stories",
    [],
    story => !story.isGenerating
  );

  const handleCopy = id => () => {
    const toCopy = stories.filter(s => s.id === id)[0];
    clipboard.writeText(toCopy.prompt + toCopy.story);
  };

  const handleDelete = id => () => {
    setStories(stories.filter(s => s.id !== id));
  };

  return (
    <div className={classes.content}>
      <StoryForm stories={stories} setStories={setStories} />
      {stories
        .slice(0)
        .reverse()
        .map(({ id, prompt, story, isGenerating }) => (
          <Card key={id} className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography
                component="p"
                className={clsx({
                  [classes.storyContainerGenerating]: isGenerating
                })}
              >
                <span className={classes.story}>
                  {prompt}
                  {isGenerating && " ..."}
                </span>
                {isGenerating ? (
                  <span>
                    <br />
                    <i>{"(composing. This will take a minute or two)"}</i>
                  </span>
                ) : (
                  <span className={classes.story}>{story}</span>
                )}
              </Typography>{" "}
              {isGenerating && <CircularProgress color="secondary" />}
            </CardContent>
            {!isGenerating && (
              <CardActions className={classes.cardActions}>
                <Typography
                  variant="caption"
                  className={clsx(
                    classes.cardActionElem,
                    classes.cardActionText
                  )}
                >
                  {"Generated at " + dateFormat(id)}
                </Typography>
                {[
                  {
                    label: "Copy story to clipboard",
                    onClick: handleCopy,
                    icon: <ClipboardIcon />
                  },
                  {
                    label: "Delete story",
                    onClick: handleDelete,
                    icon: <DeleteIcon />
                  }
                ].map(({ label, onClick, icon }) => (
                  <Tooltip key={label} title={label}>
                    <IconButton
                      className={classes.cardActionElem}
                      aria-label={label}
                      onClick={onClick(id)}
                    >
                      {icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </CardActions>
            )}
          </Card>
        ))}
    </div>
  );
}
