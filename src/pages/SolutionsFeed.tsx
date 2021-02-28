import React from 'react';
import { useQuery } from 'react-query';
import { getSolutions } from '../api/getSolutions';
import { COLORS } from '../common/styles/CMTheme';
import { Typography, Grid, makeStyles, Box } from '@material-ui/core';
import Loader from '../components/Loader';
import Card from '../components/Card';
import CardHeader from '../components/CardHeader';
import Error500 from './Error500';
import Wrapper from '../components/Wrapper';
import SolutionOverlay from '../components/SolutionOverlay';
import ScrollToTopOnMount from '../components/ScrollToTopOnMount';

const styles = makeStyles({
  root: {
    flexGrow: 1,
    minHeight: '100vh',
    paddingBottom: 16,
  },
  feedContainer: {
    padding: 0,
  },
  callToActionSection: {
    minHeight: '100vh',
  },
  typography: {
    textAlign: 'center',
  },
  cardContent: {
    fontFamily: 'Bilo',
    fontSize: 16,
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: '22pt',
  },
  spacing: {
    marginTop: '-20px',
    marginBottom: '20px',
  },
});

const SolutionsFeed: React.FC = () => {
  const classes = styles();

  const { data, status } = useQuery('solutions', getSolutions);

  if (status === 'loading') {
    return (
      <Wrapper bgColor={COLORS.ACCENT2}>
        <Loader />
      </Wrapper>
    );
  }

  if (data) {
    return (
      <Grid
        container
        className={classes.root}
        data-testid="ClimateFeed"
        justify="space-around"
      >
        <Wrapper bgColor={COLORS.ACCENT2} fullHeight>
          <Grid item sm={false} lg={4}>
            {/* left gutter */}
          </Grid>

          <ScrollToTopOnMount />

          <Grid
            item
            xs={12}
            sm={10}
            md={8}
            lg={6}
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Box my={3} px={1} data-testid="next-box">
              <Typography variant="h4">Ready to take action?</Typography>
            </Box>

            <Grid item sm={12} lg={12} className={classes.feedContainer}>
              {React.Children.toArray(
                data.solutions.map((solution, i) => (
                  <div data-testid={`ActionCard-${solution.iri}`}>
                    <Card
                      header={
                        <CardHeader
                          title={solution.solutionTitle}
                          preTitle={`${solution.solutionType} action`}
                        />
                      }
                      key={`value-${i}`}
                      index={i}
                      imageUrl={solution.imageUrl}
                      footer={<SolutionOverlay solution={solution} />}
                    >
                      <Typography variant="body1">
                        {solution.shortDescription}
                      </Typography>
                    </Card>
                  </div>
                ))
              )}
            </Grid>
          </Grid>
          <Grid item sm={false} lg={4}>
            {/* right gutter */}
          </Grid>
        </Wrapper>
      </Grid>
    );
  }
  // All else fails return an error
  return <Error500 />;
};

export default SolutionsFeed;
