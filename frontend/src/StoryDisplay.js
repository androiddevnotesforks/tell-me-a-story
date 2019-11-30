import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardActions,
  Typography,
  IconButton,
  Tooltip
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ClipboardIcon from "@material-ui/icons/Assignment";
import clsx from "clsx";
import * as clipboard from "clipboard-polyfill/dist/clipboard-polyfill.promise";
import dateFormat from "dateformat";
import { useStyles } from "./useStyles";
import StoryContent from "./StoryContent";

export default function StoryDisplay({ stories, setStories }) {
  const classes = useStyles();

  const handleCopy = id => () => {
    const toCopy = stories.filter(s => s.id === id)[0];
    clipboard.writeText(toCopy.prompt + toCopy.story);
  };

  const handleDelete = id => () => {
    setStories(stories.filter(s => s.id !== id));
  };

  return (
    <React.Fragment>
      {stories
        .slice(0)
        .reverse()
        .map(({ id, prompt, story, isGenerating }) => (
          <Card key={id} className={classes.card}>
            <StoryContent
              prompt={prompt}
              story={story}
              isGenerating={isGenerating}
            />
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
    </React.Fragment>
  );
}

StoryDisplay.propTypes = {
  stories: PropTypes.array.isRequired,
  setStories: PropTypes.func.isRequired
};
