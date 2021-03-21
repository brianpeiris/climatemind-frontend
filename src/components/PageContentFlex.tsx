import { Grid, useMediaQuery } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import theme from '../common/styles/CMTheme';

const PageContent: React.FC = ({ children }) => {
  const useStyles = makeStyles((theme) =>
    createStyles({
      root: {
        maxWidth: '640px',
        height: `calc(100vh - 65px )`,
      },
      spacer: theme.mixins.toolbar,
      grid: {
        height: '100%',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        [theme.breakpoints.up('xs')]: {
          gap: theme.spacing(8),
        },
      },
    })
  );

  const classes = useStyles(theme);
  const isXS = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <>
      {/* Spacer for app bar */}
      <div className={classes.spacer} />
      <main className={classes.root}>
        <Grid
          container
          className={classes.grid}
          direction="column"
          justify={isXS ? 'space-between' : 'flex-start'}
          alignItems="center"
        >
          {children}
        </Grid>
      </main>
    </>
  );
};

export default PageContent;
