import { Grid } from '@material-ui/core';
import React from 'react';
import { useConversations } from '../hooks/useConversations';
import { ConversationCard } from './ConversationCard';
import PageSection from './PageSection';
import PageTitle from './PageTitle';
import Loader from './Loader';
import Error500 from '../pages/Error500';

export function ConversationsList() {
  const { conversations, isLoading, isError } = useConversations();

  if (isError) return <Error500 />;

  return (
    <>
      <PageTitle>Conversations</PageTitle>

      <Grid
        container
        direction="column"
        // justifyContent="space-between"
        alignItems="center"
        style={{ width: '100%', maxWidth: '640px' }}
        spacing={3}
      >
        {isLoading && <Loader />}
        {conversations?.map((conversation) => (
          <Grid
            item
            style={{ width: '100%' }}
            key={conversation.conversationId}
          >
            <ConversationCard conversation={conversation} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ConversationsList;
