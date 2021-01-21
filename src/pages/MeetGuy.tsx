import React from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Grid, makeStyles, Box } from '@material-ui/core';
import { ReactComponent as Logo } from '../assets/cm-logo.svg';
import PageWrapper from '../components/PageWrapper';
import ROUTES from '../components/Router/RouteConfig';
import Button from '../components/Button';
import useSessionRedirect from '../hooks/useSessionRedirect';

const styles = makeStyles({
  greeting: {
    marginTop: '48px',
  },
  typography: {
    textAlign: 'center',
  },
});

const MeetGuy: React.FC<{}> = () => {
  const classes = styles();
  const history = useHistory();

  useSessionRedirect();

  return (
    <PageWrapper bgColor="#FF9439">
      <Grid item className={classes.greeting}>
        <Box>
          <Typography variant="h4">Hello there!</Typography>
        </Box>
      </Grid>

      <Grid item>
        <Typography variant="h6">Welcome to Climate Mind.</Typography>
      </Grid>

      <Grid item>
        <Box>
          <Logo data-testid="climate-mind-logo" />
        </Box>
      </Grid>

      <Grid item>
        <Box px={5}>
          <Typography className={classes.typography}>
            I’ll help you uncover your personal values to understand what you care about most. Then we'll explore how climate change is affecting your core values and the attractive solutions available to address it.
          </Typography>
        </Box>
      </Grid>

      <Grid item>
        <Box>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => history.push(ROUTES.ROUTE_PERSONALITY)}
          >
            Let's Go!
          </Button>
        </Box>
      </Grid>
    </PageWrapper>
  );
};

export default MeetGuy;
