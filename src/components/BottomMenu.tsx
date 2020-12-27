import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Grid, Box, Theme } from '@material-ui/core';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import HomeIcon from '@material-ui/icons/Home';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import BookmarksIcon from '@material-ui/icons/Bookmarks';


import CardIcon from './CardIcon';
import { COLORS } from '../common/styles/CMTheme';
import { useHistory } from 'react-router-dom';

interface BottomButton {
  label: string,
  value: string,
  index: number
}

export interface BottomMenuProps {
  links: BottomButton[];
}

const BottomMenu: React.FC<BottomMenuProps> = ({links}: BottomMenuProps) => {

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        // padding: '1em 0',
        // width: '100%',
        // backgroundColor: bgColor ? bgColor : 'inherit',
        // '&$selected': {
        //   border: '1px solid black',
        //   backgroundColor: 'black',
        // },
      },
      actionItem: {
        // These styles are applied to the root element when
        // when selected. This changes the color of both the
        // icon and label text.
        "&$selected": {
          color: COLORS.DK_TEXT,
          borderTop: '2px solid'
        }
      },
      // NOTE: You need to include a `.selected` class in your
      // styles rules for the "&$selected" selector to work.
      selected: {}
      // stickToBottom: {
      //   border: '1px solid red',
      // },
    })
  );

  const getIcon = (type: any) => {
    switch (type) {
      case 'climate-feed':
        return (
          <HomeIcon data-testid="BottomMenuIconsFeed"/>
        );
      case 'myths':
        return (
          <AnnouncementIcon data-testid="BottomMenuIconsMyths"/>
        );
      case 'solutions':
        return (
          <EmojiObjectsIcon data-testid="BottomMenuIconsSolutions"/>
        ); 
      case 'saved':
        return (
          <BookmarksIcon data-testid="BottomMenuIconsSaved"/>
        );
      default:
        return null;
    }
  };

  const classes = useStyles();
  const [value, setValue] = useState('climate-feed');
  const history = useHistory();

  const handleChange = (event: any, newValue: React.SetStateAction<string>) => {
    // history.push(`/${newValue}`);
    setValue(newValue);
  };
  
  return (
    <div className={classes.root} data-testid="BottomMenu">
      <BottomNavigation value={value} onChange={handleChange} showLabels className={classes.root}>
        {links.map((item) => 
          <BottomNavigationAction 
            key={item.index}
            label={item.label} 
            value={item.value}
            classes={{
              root: classes.actionItem,
              selected: classes.selected
            }}
            icon={getIcon(item.value)} 
          />
        )}
        {/* <BottomNavigationAction 
          label="Recents" 
          value="climate-feed" 
          classes={{
            root: classes.actionItem,
            selected: classes.selected
          }}
          icon={<RestoreIcon />} />
        <BottomNavigationAction 
          label="Favorites" 
          value="myths" 
          classes={{
            root: classes.actionItem,
            selected: classes.selected
          }}
          icon={<FavoriteIcon />} />
        <BottomNavigationAction 
          label="Nearby" 
          classes={{
            root: classes.actionItem,
            selected: classes.selected
          }}
          value={links[2].value} 
          icon={<LocationOnIcon />} />
        <BottomNavigationAction 
          label="Folder" 
          classes={{
            root: classes.actionItem,
            selected: classes.selected
          }}
          value="folder" 
          icon={<FolderIcon />} /> */}
      </BottomNavigation>
    </div>
  );
};

export default BottomMenu;
