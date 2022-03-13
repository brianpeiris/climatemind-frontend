import {
  Box,
  Button,
  Checkbox,
  createStyles,
  FormControlLabel,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { postSharedImpacts } from '../../../api/postSharedImpacts';
import { COLORS } from '../../../common/styles/CMTheme';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/CardHeader';
import CardOverlay from '../../../components/CardOverlay';
import { FooterAppBar } from '../../../components/FooterAppBar/FooterAppBar';
import Loader from '../../../components/Loader';
import PageSection from '../../../components/PageSection';
import PageTitle from '../../../components/PageTitle';
import Paragraphs from '../../../components/Paragraphs';
import { Pil } from '../../../components/Pil';
import SourcesList from '../../../components/SourcesList';
import TabbedContent from '../../../components/TabbedContent';
import Wrapper from '../../../components/Wrapper';
import { useAlignment } from '../../../hooks/useAlignment';
import { useSharedImpacts } from '../../../hooks/useSharedImpacts';
import Error500 from '../../Error500';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minHeight: '100vh',
    },
    typography: {
      textAlign: 'center',
    },
    upper: {
      textTransform: 'uppercase',
      letterSpacing: '1pt',
      fontSize: '10px',
      fontWeight: 500,
    },
  })
);

interface SharedImpactsOverlayProps {
  imageUrl: string;
  description: string;
  sources: string[];
  selectAction: React.ReactNode;
}

const SharedImpactsOverlay: React.FC<SharedImpactsOverlayProps> = ({
  imageUrl,
  description,
  sources,
  selectAction,
}) => {
  return (
    <div style={{ marginTop: '-20px' }}>
      <CardOverlay
        iri="1"
        title="Overlay Title"
        imageUrl={imageUrl}
        selectAction={selectAction}
      >
        <TabbedContent
          details={
            <Box p={3}>
              <Paragraphs text={description} />
            </Box>
          }
          sources={<SourcesList sources={sources} />}
        />
      </CardOverlay>
    </div>
  );
};

const SharedImpacts: React.FC = () => {
  const classes = useStyles();
  const { push } = useHistory();
  const { impacts, userAName, isError, isLoading } = useSharedImpacts();
  const { alignmentScoresId } = useAlignment();

  const [effectId, setEffectId] = useState('');

  const mutateChooseSharedImpacts = useMutation(
    (data: { effectId: string; alignmentScoresId: string }) =>
      postSharedImpacts({ effectId, alignmentScoresId }),
      {
        onSuccess: (response: { message: string}) => {
          if(process.env.NODE_ENV === 'development'){
            console.log(response.message);
          }
          push('/shared-solutions');
        },
        onError: (error: any) => {
          showToast({
            message: 'Failed to save Shared impacts to the db: ' + error.response?.data?.error,
            type: 'error',
          });
        },
      }
  );

  const handleNextSolutions = () => {
    mutateChooseSharedImpacts.mutate({effectId, alignmentScoresId}); // should be triggered when "next" clicked?
    //if success ->
    // push('/shared-solutions');
  };

  const handleSelectImpact = (e: React.ChangeEvent<HTMLInputElement>, effectId: string) => { //effectId: string React.ChangeEvent<HTMLInputElement>
    console.log('topic selected checked', e.target.checked);
    console.log('topic selected effectId', effectId);
    if(e.target.checked) {
      setEffectId(effectId);
    } else {
      setEffectId('');
    }
    // mutateChooseSharedImpacts.mutate({effectId, alignmentScoresId}); // should be triggered when "next" clicked?
  };

  const isCheckboxDisabled = (currentEffectId: string) => {
    if(effectId === '') {
      return false; // nothing selected
    } else if (effectId.length > 0 && (currentEffectId === effectId) ){ //only selected checkbox can be clicked again 
      return false;
    }
    return true;
  }

  const numberOfSelected = !!effectId ? '1' : '0';

  const labelStyles = {
    fontSize: '10px',
    fontFamily: 'Bilo',
    fontWeight: 500,
    lineHeight: '10px',
    maxWidth: '40px',
  };

  const actionStyles = {
    marginBottom: '-0.5em',
  };

  if (isError) return <Error500 />;

  return (
    <main>
      <Grid
        container
        className={classes.root}
        data-testid="PersonalValues"
        justify="space-around"
      >
        {/* --- */}

        <Wrapper bgColor={COLORS.SECTION3}>
          <PageSection>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <PageTitle>Climate impacts you and {userAName} share</PageTitle>

                <Box textAlign="center">
                  <Typography variant="subtitle2">
                    Select one impact of climate change you’d be interested in
                    talking to {userAName} about.
                  </Typography>
                </Box>

                <Box textAlign="center" pt={4} pb={4}>
                  <Typography variant="h6">
                    These topics already align with your shared core values, so
                    it’ll be easy to start having meaningful conversations.
                  </Typography>
                </Box>

                {impacts?.map((impact, index) => (
                  <div
                    data-testid={`SharedImpactCard-${impact.effectId}-testid`}
                    key={index}
                  >
                    <Card
                      header={<CardHeader title={impact.effectTitle} />}
                      index={index}
                      imageUrl={impact.imageUrl}
                      border={ !isCheckboxDisabled(impact.effectId) && !(effectId === '') }
                      disabled={isCheckboxDisabled(impact.effectId)}
                      footer={
                        <SharedImpactsOverlay
                          imageUrl={impact.imageUrl}
                          description={impact.effectDescription}
                          sources={impact.effectSources}
                          selectAction={
                            <FormControlLabel
                              value="Select"
                              control={
                                <Checkbox 
                                  onChange={(e) => handleSelectImpact(e, impact.effectId)} 
                                  disabled={isCheckboxDisabled(impact.effectId)}
                                />
                              }
                              label={
                                <>
                                  <Typography style={labelStyles}>
                                    SELECT
                                  </Typography>
                                  <Typography style={labelStyles} align="right">
                                    TOPIC
                                  </Typography>
                                </>
                              }
                              labelPlacement="start"
                              style={actionStyles}
                            />
                          }
                        />
                      }
                    >
                      <div style={{ marginBottom: '16px' }}>
                        <Typography variant="body1">
                          {impact.effectShortDescription}
                        </Typography>
                      </div>
                      {impact.relatedPersonalValues.map(
                        (relPersonalVal, ind) => (
                          <>
                            <Pil
                              text={relPersonalVal}
                              key={ind}
                            ></Pil>
                          </>
                        )
                      )}
                    </Card>
                  </div>
                ))}

                <FooterAppBar bgColor={COLORS.ACCENT10}>
                  <Typography variant="button">Selected {numberOfSelected} of 1</Typography>
                  <Button
                    variant="contained"
                    data-testid="next-solutions-button"
                    color="primary"
                    disableElevation
                    disabled={!effectId}
                    style={{ border: '1px solid #a347ff', marginLeft: '8px' }}
                    onClick={handleNextSolutions}
                  >
                    Next: Solutions
                  </Button>
                </FooterAppBar>
              </>
            )}
          </PageSection>
        </Wrapper>
      </Grid>
    </main>
  );
};

export default SharedImpacts;

function showToast(arg0: { message: string; type: string; }) {
  throw new Error('Function not implemented.');
}
