import { rest } from 'msw';
import { MYTH_RESPONSE } from './responseBodies/mythsResponse';
import { PERSONAL_VALUES_RESPONSE } from './responseBodies/personalValuesResopnse';
import { CONVERSATIONS_RESPONSE } from './responseBodies/conversationsResponse';
import { QUESTIONS_RESPONSE } from './responseBodies/questions';
import { GET_SINGLE_CONVERSATION_RESPONSE } from './responseBodies/getSingleConversationResponse';
import { POST_ALIGNMENT_RESPONSE } from './responseBodies/postAlignment';
import { GET_ALIGNMENT_RESPONSE } from './responseBodies/getAlignment';
import { SHARED_IMPACTS_RESPONSE } from './responseBodies/getSharedImpactsResponse';

export const handlers = [
  // Capture a GET /user/:userId request,
  // 00ad4670-24df-42ca-bfa2-0ce1e2bebafb
  rest.get(/personal_values/, (req, res, ctx) => {
    // ...and respond with this mocked response.
    console.log('MOCKED GET personal_values');
    ctx.status(200);
    return res(ctx.json(PERSONAL_VALUES_RESPONSE));
  }),

  rest.get('http://localhost:5000/questions', (req, res, ctx) => {
    console.log('MOCKED GET questions');
    ctx.status(200);
    return res(ctx.json(QUESTIONS_RESPONSE));
  }),

  rest.get('http://localhost:5000/myths', (req, res, ctx) => {
    console.log('MOCKED GET myths');
    ctx.status(200);
    return res(ctx.json(MYTH_RESPONSE));
  }),

  // POST Scores
  rest.post('http://localhost:5000/scores', (req, res, ctx) => {
    return res(
      ctx.json({
        sessionId: '52a95263-a95c-4dd1-85ab-6cd8013dce0d',
      })
    );
  }),
  rest.get('http://localhost:5000/conversations', (req, res, ctx) => {
    ctx.status(200);
    return res(ctx.json(CONVERSATIONS_RESPONSE));
  }),

  // *** USER B JOURNEY***

  // GET Single Conversaionion
  rest.get(
    /http:\/\/localhost:5000\/conversation\/[\w-]+/i,
    (req, res, ctx) => {
      console.log('MOCKED GET signle conversation');
      ctx.status(200);
      return res(ctx.json(GET_SINGLE_CONVERSATION_RESPONSE));
    }
  ),
  // POST Alignmeent
  rest.post(/http:\/\/localhost:5000\/alignment/, (req, res, ctx) => {
    console.log('MOCKED POST Alignment');
    ctx.status(200);
    return res(ctx.json(POST_ALIGNMENT_RESPONSE));
  }),
  rest.get(/http:\/\/localhost:5000\/alignment\/$/, (req, res, ctx) => {
    console.log('MOCKED POST Alignment');
    ctx.status(200);
    return res(ctx.json(GET_ALIGNMENT_RESPONSE));
  }),

  // GET Shared Impacts
  // rest.get(/http:\/\/localhost:5000\/alignment\/[\w-]+/i, (req, res, ctx) => {
  rest.get(
    'http://localhost:5000/alignment/:alignmentScoresId/shared-impacts',
    (req, res, ctx) => {
      const perspective = req.url.searchParams.get('perspective');
      console.log('MOCKED GET Shared Impacts with perspective: ', perspective);
      ctx.status(200);
      return res(ctx.json(SHARED_IMPACTS_RESPONSE));
    }
  ),
];
